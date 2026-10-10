export type PortfolioLine = {
  symbol: string;
  weight: number;
};

export type PortfolioMove = {
  changePercent: number;
};

export type PortfolioSector = string;

export type PortfolioPositionAnalysis = {
  symbol: string;
  rawWeight: number;
  normalizedWeight: number;
  changePercent: number;
  contributionPercent: number;
  dollarContribution: number | null;
  sector: PortfolioSector;
};

export type PortfolioSectorAnalysis = {
  sector: PortfolioSector;
  normalizedWeight: number;
  contributionPercent: number;
  dollarContribution: number | null;
  positions: number;
};

export type PortfolioBreadth = {
  quoted: number;
  up: number;
  down: number;
  flat: number;
  upRatio: number | null;
};

export type PortfolioAnalysis = {
  returnPercent: number | null;
  dollarChange: number | null;
  benchmarkReturnPercent: number | null;
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
  notional?: number | null;
  flatThresholdPercent?: number;
};

function finitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function finiteMove(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function cleanSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

function moneyFromPercent(notional: number | null, percent: number): number | null {
  if (notional == null || !finitePositive(notional)) return null;
  return (notional * percent) / 100;
}

/**
 * Analyze a user portfolio from weights + daily moves.
 *
 * Weight semantics intentionally match the current Lattice map:
 * - positive user weights define the book
 * - quoted positions are normalized against the quoted weight
 * - a partially quoted book still produces an answer, while coverageRatio
 *   makes the missing-data condition explicit to callers
 *
 * Contribution values are percentage-point contributions to portfolio return.
 * Their sum equals returnPercent (apart from floating-point rounding).
 *
 * Dollar values are different: notional is the whole book, so each holding's
 * dollars come from its share of the whole book (rawWeight / totalWeight),
 * not its share of the quoted part. With partial coverage, dollarChange is
 * the move of the quoted holdings only; unquoted holdings add nothing rather
 * than being assumed to move like the rest.
 */
export function analyzePortfolio({
  lines,
  quotes,
  benchmarkReturnPercent = null,
  sectorBySymbol = {},
  notional = null,
  flatThresholdPercent = 0.05,
}: AnalyzePortfolioInput): PortfolioAnalysis {
  const validLines = lines
    .map((line) => ({
      symbol: cleanSymbol(line.symbol),
      weight: line.weight,
    }))
    .filter((line) => line.symbol && finitePositive(line.weight));

  const totalWeight = validLines.reduce((sum, line) => sum + line.weight, 0);

  const quotedLines = validLines.flatMap((line) => {
    const quote = quotes[line.symbol];
    if (!quote || !finiteMove(quote.changePercent)) return [];
    return [{ ...line, changePercent: quote.changePercent }];
  });

  const quotedWeight = quotedLines.reduce((sum, line) => sum + line.weight, 0);
  const coverageRatio = totalWeight > 0 ? quotedWeight / totalWeight : null;

  const usableNotional = finitePositive(notional ?? NaN) ? (notional as number) : null;

  const positions: PortfolioPositionAnalysis[] =
    quotedWeight > 0
      ? quotedLines.map((line) => {
          const normalizedWeight = line.weight / quotedWeight;
          const contributionPercent = normalizedWeight * line.changePercent;
          return {
            symbol: line.symbol,
            rawWeight: line.weight,
            normalizedWeight,
            changePercent: line.changePercent,
            contributionPercent,
            dollarContribution: moneyFromPercent(
              usableNotional,
              (line.weight / totalWeight) * line.changePercent,
            ),
            sector: sectorBySymbol[line.symbol] ?? "other",
          };
        })
      : [];

  const returnPercent =
    positions.length > 0
      ? positions.reduce((sum, position) => sum + position.contributionPercent, 0)
      : null;

  const validBenchmark = finiteMove(benchmarkReturnPercent) ? benchmarkReturnPercent : null;
  const relativeReturnPercent =
    returnPercent != null && validBenchmark != null ? returnPercent - validBenchmark : null;

  const threshold =
    Number.isFinite(flatThresholdPercent) && flatThresholdPercent >= 0
      ? flatThresholdPercent
      : 0.05;

  let up = 0;
  let down = 0;
  let flat = 0;
  for (const position of positions) {
    if (position.changePercent > threshold) up += 1;
    else if (position.changePercent < -threshold) down += 1;
    else flat += 1;
  }

  const breadth: PortfolioBreadth = {
    quoted: positions.length,
    up,
    down,
    flat,
    upRatio: positions.length ? up / positions.length : null,
  };

  const contributors = [...positions]
    .filter((position) => position.contributionPercent > 0)
    .sort((a, b) => b.contributionPercent - a.contributionPercent);

  const detractors = [...positions]
    .filter((position) => position.contributionPercent < 0)
    .sort((a, b) => a.contributionPercent - b.contributionPercent);

  const sectorMap = new Map<
    PortfolioSector,
    {
      normalizedWeight: number;
      contributionPercent: number;
      dollarContribution: number | null;
      positions: number;
    }
  >();

  for (const position of positions) {
    const current = sectorMap.get(position.sector) ?? {
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

  const sectors: PortfolioSectorAnalysis[] = [...sectorMap.entries()]
    .map(([sector, values]) => ({ sector, ...values }))
    .sort((a, b) => b.contributionPercent - a.contributionPercent);

  return {
    returnPercent,
    dollarChange:
      returnPercent == null || usableNotional == null
        ? null
        : positions.reduce((sum, position) => sum + (position.dollarContribution ?? 0), 0),
    benchmarkReturnPercent: validBenchmark,
    relativeReturnPercent,
    totalWeight,
    quotedWeight,
    coverageRatio,
    breadth,
    positions,
    contributors,
    detractors,
    sectors,
    topContributor: contributors[0] ?? null,
    topDetractor: detractors[0] ?? null,
  };
}
