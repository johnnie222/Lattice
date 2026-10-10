/**
 * Portfolio intelligence: the one place Lattice computes portfolio returns,
 * contributions, breadth and benchmark comparisons. UI components consume
 * these results and never redo the math.
 *
 * Two inputs are supported:
 * - `analyzeHoldings`: real holdings (quantity × price), the primary model.
 * - `analyzePortfolio`: legacy weight books from before holdings existed.
 *
 * Both follow the same rule for incomplete data (#17): a full portfolio
 * return, and anything compared with a benchmark, is only reported when
 * every holding has a usable quote. Partial results are exposed under
 * separate, explicitly partial fields together with coverage.
 */

export type PortfolioSector = string;

export type PortfolioBreadth = {
  quoted: number;
  up: number;
  down: number;
  flat: number;
  upRatio: number | null;
};

const DEFAULT_FLAT_BAND = 0.05;

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function finiteMove(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function cleanSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function flatBand(threshold: number | undefined): number {
  return typeof threshold === "number" && Number.isFinite(threshold) && threshold >= 0
    ? threshold
    : DEFAULT_FLAT_BAND;
}

/** Up / down / flat counts, using the same ±band as the market map. */
function breadthOf(changes: readonly number[], threshold: number): PortfolioBreadth {
  let up = 0;
  let down = 0;
  let flat = 0;
  for (const change of changes) {
    if (change > threshold) up += 1;
    else if (change < -threshold) down += 1;
    else flat += 1;
  }
  return {
    quoted: changes.length,
    up,
    down,
    flat,
    upRatio: changes.length ? up / changes.length : null,
  };
}

/** Positive impacts best-first, negative impacts worst-first. */
function rankByImpact<T>(rows: readonly T[], impact: (row: T) => number) {
  const contributors = rows.filter((row) => impact(row) > 0).sort((a, b) => impact(b) - impact(a));
  const detractors = rows.filter((row) => impact(row) < 0).sort((a, b) => impact(a) - impact(b));
  return { contributors, detractors };
}

// ---------------------------------------------------------------------------
// Real holdings: quantity × price
// ---------------------------------------------------------------------------

export type Holding = {
  symbol: string;
  /** Number of shares; fractional quantities are allowed. */
  quantity: number;
  /** Average cost per share. Optional; only used for since-entry P&L. */
  averageCost?: number | null;
};

export type HoldingQuote = {
  price: number;
  previousClose: number | null | undefined;
};

export type HoldingAnalysis = {
  symbol: string;
  quantity: number;
  averageCost: number | null;
  sector: PortfolioSector;
  price: number;
  previousClose: number;
  /** quantity × price */
  value: number;
  /** quantity × previous close */
  previousValue: number;
  /** quantity × (price − previous close) */
  dayChange: number;
  /** The holding's own move today, in percent. */
  changePercent: number;
  /** Share of the portfolio's current value. Null unless every holding is priced. */
  weight: number | null;
  /** Percentage points this holding added to the portfolio's daily return. Null unless complete. */
  contributionPercent: number | null;
  /** quantity × average cost, when an average cost is known. */
  costBasis: number | null;
  sinceEntryChange: number | null;
  sinceEntryPercent: number | null;
};

export type HoldingsSectorAnalysis = {
  sector: PortfolioSector;
  positions: number;
  /** Known dollar change from this sector's priced holdings. */
  dayChange: number;
  /** Percentage points of portfolio daily return. Null unless complete. */
  contributionPercent: number | null;
};

export type HoldingsCoverage = {
  holdings: number;
  priced: number;
  ratio: number | null;
  /** Holdings without a usable quote (missing, or invalid price/previous close). */
  missing: string[];
};

export type SinceEntry = {
  costBasis: number;
  value: number;
  change: number;
  percent: number;
  /** Holdings included (priced and with an average cost). */
  holdings: number;
  /** True when every holding has both an average cost and a price. */
  complete: boolean;
};

export type HoldingsAnalysis = {
  /** Every holding has a valid price and previous close. */
  complete: boolean;
  coverage: HoldingsCoverage;
  /** Current portfolio value. Null unless complete. */
  value: number | null;
  /** Previous-close portfolio value. Null unless complete. */
  previousValue: number | null;
  /** Current value of the holdings that are priced (partial when !complete). */
  pricedValue: number;
  /** Known dollar P&L today from priced holdings; partial when !complete. Null if nothing is priced. */
  dayChange: number | null;
  /** Total daily P&L / previous-close value. Null unless complete. */
  returnPercent: number | null;
  benchmarkReturnPercent: number | null;
  /** returnPercent − benchmark, in percentage points. Null unless complete. */
  relativeReturnPercent: number | null;
  breadth: PortfolioBreadth;
  /** Priced holdings, largest value first. */
  positions: HoldingAnalysis[];
  contributors: HoldingAnalysis[];
  detractors: HoldingAnalysis[];
  topContributor: HoldingAnalysis | null;
  topDetractor: HoldingAnalysis | null;
  sectors: HoldingsSectorAnalysis[];
  sinceEntry: SinceEntry | null;
};

export type AnalyzeHoldingsInput = {
  holdings: readonly Holding[];
  quotes: Readonly<Record<string, HoldingQuote | undefined>>;
  benchmarkReturnPercent?: number | null;
  sectorBySymbol?: Readonly<Record<string, PortfolioSector | undefined>>;
  flatThresholdPercent?: number;
};

/**
 * Merge duplicate symbols and drop unusable rows. A merged average cost is
 * quantity-weighted, and unknown if any part of the position lacks one.
 */
export function cleanHoldings(
  holdings: readonly Holding[],
): { symbol: string; quantity: number; averageCost: number | null }[] {
  const bySymbol = new Map<string, { quantity: number; cost: number | null }>();
  for (const holding of holdings) {
    const symbol = cleanSymbol(holding.symbol ?? "");
    if (!symbol || !finitePositive(holding.quantity)) continue;
    const cost = finitePositive(holding.averageCost)
      ? holding.averageCost * holding.quantity
      : null;
    const current = bySymbol.get(symbol);
    if (!current) {
      bySymbol.set(symbol, { quantity: holding.quantity, cost });
    } else {
      current.quantity += holding.quantity;
      current.cost = current.cost != null && cost != null ? current.cost + cost : null;
    }
  }
  return [...bySymbol.entries()].map(([symbol, { quantity, cost }]) => ({
    symbol,
    quantity,
    averageCost: cost != null ? cost / quantity : null,
  }));
}

/**
 * Daily portfolio math from real holdings:
 * - value = quantity × price; previous value = quantity × previous close
 * - daily P&L = quantity × (price − previous close)
 * - daily return = total P&L / total previous-close value, only when every
 *   holding is priced. Average cost never enters the daily math.
 */
export function analyzeHoldings({
  holdings,
  quotes,
  benchmarkReturnPercent = null,
  sectorBySymbol = {},
  flatThresholdPercent,
}: AnalyzeHoldingsInput): HoldingsAnalysis {
  const valid = cleanHoldings(holdings);
  const missing: string[] = [];
  const priced: HoldingAnalysis[] = [];

  for (const holding of valid) {
    const quote = quotes[holding.symbol];
    if (!quote || !finitePositive(quote.price) || !finitePositive(quote.previousClose)) {
      missing.push(holding.symbol);
      continue;
    }
    const { quantity, averageCost } = holding;
    const value = quantity * quote.price;
    const previousValue = quantity * quote.previousClose;
    const costBasis = averageCost != null ? quantity * averageCost : null;
    priced.push({
      symbol: holding.symbol,
      quantity,
      averageCost,
      sector: sectorBySymbol[holding.symbol] ?? "other",
      price: quote.price,
      previousClose: quote.previousClose,
      value,
      previousValue,
      dayChange: quantity * (quote.price - quote.previousClose),
      changePercent: (quote.price / quote.previousClose - 1) * 100,
      weight: null,
      contributionPercent: null,
      costBasis,
      sinceEntryChange: costBasis != null ? value - costBasis : null,
      sinceEntryPercent: costBasis != null ? (value / costBasis - 1) * 100 : null,
    });
  }

  const complete = valid.length > 0 && missing.length === 0;
  const pricedValue = priced.reduce((sum, row) => sum + row.value, 0);
  const pricedPrevious = priced.reduce((sum, row) => sum + row.previousValue, 0);
  const dayChange = priced.length ? priced.reduce((sum, row) => sum + row.dayChange, 0) : null;

  if (complete) {
    for (const row of priced) {
      row.weight = row.value / pricedValue;
      row.contributionPercent = (row.dayChange / pricedPrevious) * 100;
    }
  }
  const returnPercent = complete && dayChange != null ? (dayChange / pricedPrevious) * 100 : null;
  const benchmark = finiteMove(benchmarkReturnPercent) ? benchmarkReturnPercent : null;

  const positions = [...priced].sort((a, b) => b.value - a.value);
  const { contributors, detractors } = rankByImpact(positions, (row) => row.dayChange);

  const sectorMap = new Map<PortfolioSector, HoldingsSectorAnalysis>();
  for (const row of positions) {
    const current = sectorMap.get(row.sector) ?? {
      sector: row.sector,
      positions: 0,
      dayChange: 0,
      contributionPercent: complete ? 0 : null,
    };
    current.positions += 1;
    current.dayChange += row.dayChange;
    if (current.contributionPercent != null && row.contributionPercent != null) {
      current.contributionPercent += row.contributionPercent;
    }
    sectorMap.set(row.sector, current);
  }
  const sectors = [...sectorMap.values()].sort((a, b) => b.dayChange - a.dayChange);

  const withCost = positions.filter((row) => row.costBasis != null);
  const costBasis = withCost.reduce((sum, row) => sum + (row.costBasis ?? 0), 0);
  const costValue = withCost.reduce((sum, row) => sum + row.value, 0);
  const sinceEntry: SinceEntry | null =
    withCost.length && costBasis > 0
      ? {
          costBasis,
          value: costValue,
          change: costValue - costBasis,
          percent: (costValue / costBasis - 1) * 100,
          holdings: withCost.length,
          complete: complete && withCost.length === valid.length,
        }
      : null;

  return {
    complete,
    coverage: {
      holdings: valid.length,
      priced: priced.length,
      ratio: valid.length ? priced.length / valid.length : null,
      missing,
    },
    value: complete ? pricedValue : null,
    previousValue: complete ? pricedPrevious : null,
    pricedValue,
    dayChange,
    returnPercent,
    benchmarkReturnPercent: benchmark,
    relativeReturnPercent:
      returnPercent != null && benchmark != null ? returnPercent - benchmark : null,
    breadth: breadthOf(
      positions.map((row) => row.changePercent),
      flatBand(flatThresholdPercent),
    ),
    positions,
    contributors,
    detractors,
    topContributor: contributors[0] ?? null,
    topDetractor: detractors[0] ?? null,
    sectors,
    sinceEntry,
  };
}

// ---------------------------------------------------------------------------
// Legacy weight books
// ---------------------------------------------------------------------------

export type PortfolioLine = {
  symbol: string;
  weight: number;
};

export type PortfolioMove = {
  changePercent: number | null;
};

export type PortfolioPositionAnalysis = {
  symbol: string;
  rawWeight: number;
  /** Share of the whole book (rawWeight / totalWeight), quoted or not. */
  normalizedWeight: number;
  changePercent: number;
  /** Percentage points contributed to the whole book's return. */
  contributionPercent: number;
  dollarContribution: number | null;
  sector: PortfolioSector;
};

export type PortfolioSectorAnalysis = {
  sector: PortfolioSector;
  /** Share of the whole book held by this sector's quoted positions. */
  normalizedWeight: number;
  contributionPercent: number;
  dollarContribution: number | null;
  positions: number;
};

export type PortfolioAnalysis = {
  /** Every positive-weight line has a usable quote. */
  complete: boolean;
  /** Whole-book return. Null unless complete. */
  returnPercent: number | null;
  /**
   * Known contribution to the whole book's return from quoted lines only
   * (unquoted lines contribute nothing). Partial when !complete.
   */
  knownContributionPercent: number | null;
  /**
   * Average move of the quoted lines alone, re-normalized to their own weight.
   * This is NOT the portfolio's return when coverage is partial.
   */
  quotedReturnPercent: number | null;
  /** Known dollar change from quoted lines; partial when !complete. */
  dollarChange: number | null;
  benchmarkReturnPercent: number | null;
  /** Null unless complete: a partial book is never compared with a full benchmark. */
  relativeReturnPercent: number | null;
  totalWeight: number;
  quotedWeight: number;
  coverageRatio: number | null;
  breadth: PortfolioBreadth;
  positions: PortfolioPositionAnalysis[];
  contributors: PortfolioPositionAnalysis[];
  detractors: PortfolioPositionAnalysis[];
  sectors: PortfolioSectorAnalysis[];
  topContributor: PortfolioPositionAnalysis | null;
  topDetractor: PortfolioPositionAnalysis | null;
};

export type AnalyzePortfolioInput = {
  lines: readonly PortfolioLine[];
  quotes: Readonly<Record<string, PortfolioMove | undefined>>;
  benchmarkReturnPercent?: number | null;
  sectorBySymbol?: Readonly<Record<string, PortfolioSector | undefined>>;
  /** Whole-book dollar size, if the user gave one. */
  notional?: number | null;
  flatThresholdPercent?: number;
};

/**
 * Analyze a legacy weight book. Weights are relative; every figure is
 * expressed against the whole book. Quoted lines contribute their share of
 * the whole book; unquoted lines contribute nothing and are reported via
 * coverage, so a partial book never produces a full return (#17).
 */
export function analyzePortfolio({
  lines,
  quotes,
  benchmarkReturnPercent = null,
  sectorBySymbol = {},
  notional = null,
  flatThresholdPercent,
}: AnalyzePortfolioInput): PortfolioAnalysis {
  const validLines = lines
    .map((line) => ({ symbol: cleanSymbol(line.symbol), weight: line.weight }))
    .filter((line) => line.symbol && finitePositive(line.weight));

  const totalWeight = validLines.reduce((sum, line) => sum + line.weight, 0);

  const quotedLines = validLines.flatMap((line) => {
    const quote = quotes[line.symbol];
    if (!quote || !finiteMove(quote.changePercent)) return [];
    return [{ ...line, changePercent: quote.changePercent }];
  });

  const quotedWeight = quotedLines.reduce((sum, line) => sum + line.weight, 0);
  const coverageRatio = totalWeight > 0 ? quotedWeight / totalWeight : null;
  const complete = validLines.length > 0 && quotedLines.length === validLines.length;
  const usableNotional = finitePositive(notional) ? notional : null;

  const positions: PortfolioPositionAnalysis[] = quotedLines.map((line) => {
    const normalizedWeight = line.weight / totalWeight;
    const contributionPercent = normalizedWeight * line.changePercent;
    return {
      symbol: line.symbol,
      rawWeight: line.weight,
      normalizedWeight,
      changePercent: line.changePercent,
      contributionPercent,
      dollarContribution:
        usableNotional != null ? (usableNotional * contributionPercent) / 100 : null,
      sector: sectorBySymbol[line.symbol] ?? "other",
    };
  });

  const knownContributionPercent = positions.length
    ? positions.reduce((sum, position) => sum + position.contributionPercent, 0)
    : null;
  const quotedReturnPercent =
    knownContributionPercent != null && coverageRatio
      ? knownContributionPercent / coverageRatio
      : null;
  const returnPercent = complete ? knownContributionPercent : null;

  const benchmark = finiteMove(benchmarkReturnPercent) ? benchmarkReturnPercent : null;
  const relativeReturnPercent =
    returnPercent != null && benchmark != null ? returnPercent - benchmark : null;

  const { contributors, detractors } = rankByImpact(positions, (row) => row.contributionPercent);

  const sectorMap = new Map<PortfolioSector, PortfolioSectorAnalysis>();
  for (const position of positions) {
    const current = sectorMap.get(position.sector) ?? {
      sector: position.sector,
      normalizedWeight: 0,
      contributionPercent: 0,
      dollarContribution: usableNotional == null ? null : 0,
      positions: 0,
    };
    current.normalizedWeight += position.normalizedWeight;
    current.contributionPercent += position.contributionPercent;
    if (current.dollarContribution != null && position.dollarContribution != null) {
      current.dollarContribution += position.dollarContribution;
    }
    current.positions += 1;
    sectorMap.set(position.sector, current);
  }
  const sectors = [...sectorMap.values()].sort(
    (a, b) => b.contributionPercent - a.contributionPercent,
  );

  return {
    complete,
    returnPercent,
    knownContributionPercent,
    quotedReturnPercent,
    dollarChange:
      usableNotional != null && positions.length
        ? positions.reduce((sum, position) => sum + (position.dollarContribution ?? 0), 0)
        : null,
    benchmarkReturnPercent: benchmark,
    relativeReturnPercent,
    totalWeight,
    quotedWeight,
    coverageRatio,
    breadth: breadthOf(
      positions.map((row) => row.changePercent),
      flatBand(flatThresholdPercent),
    ),
    positions,
    contributors,
    detractors,
    sectors,
    topContributor: contributors[0] ?? null,
    topDetractor: detractors[0] ?? null,
  };
}
