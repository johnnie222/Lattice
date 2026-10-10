/**
 * Lattice Close: structured end-of-day facts for one book, plus a short
 * templated summary. Every portfolio number is taken as-is from the shared
 * portfolio intelligence engine (analyzeHoldings); every market number from
 * market-facts. Nothing is recomputed here, so the close always agrees with
 * My Portfolio Today. An AI brief can later consume `LatticeCloseFacts`
 * unchanged.
 *
 * Completeness follows #17/#22: a full return and the S&P 500 comparison
 * exist only when the engine reports the book as complete. A partial book
 * yields known dollar P&L only, flagged as partial.
 */
import { formatMoney, formatPct } from "./format.ts";
import type { MarketFacts } from "./market-facts.ts";
import type {
  HoldingAnalysis,
  HoldingsAnalysis,
  HoldingsCoverage,
  HoldingsSectorAnalysis,
  PortfolioBreadth,
} from "./portfolio-intelligence.ts";

const DRIVERS = 3;

export type CloseMover = Pick<
  HoldingAnalysis,
  "symbol" | "dayChange" | "changePercent" | "contributionPercent"
>;

export type CloseSector = Pick<
  HoldingsSectorAnalysis,
  "sector" | "dayChange" | "contributionPercent"
>;

export type PortfolioCloseFacts = {
  /** Every holding priced (the engine's rule). */
  complete: boolean;
  coverage: HoldingsCoverage;
  /** Known dollar P&L; partial when !complete. */
  dayChange: number | null;
  /** Null unless complete. */
  returnPercent: number | null;
  benchmarkReturnPercent: number | null;
  /** Null unless complete and the benchmark is priced. */
  relativeReturnPercent: number | null;
  /** Up to three of each, in the engine's order (largest dollar impact first). */
  contributors: CloseMover[];
  detractors: CloseMover[];
  breadth: PortfolioBreadth;
  /** Overall engine sectors by dollar contribution; null unless complete and spanning ≥2 sectors. */
  strongestSector: CloseSector | null;
  weakestSector: CloseSector | null;
};

export type LatticeCloseFacts = {
  /** Null when the book has no holdings. */
  portfolio: PortfolioCloseFacts | null;
  market: MarketFacts;
  /** One or two plain sentences, each derived only from the facts above. */
  summary: string[];
};

function mover(row: HoldingAnalysis): CloseMover {
  return {
    symbol: row.symbol,
    dayChange: row.dayChange,
    changePercent: row.changePercent,
    contributionPercent: row.contributionPercent,
  };
}

function sector(row: HoldingsSectorAnalysis): CloseSector {
  return {
    sector: row.sector,
    dayChange: row.dayChange,
    contributionPercent: row.contributionPercent,
  };
}

export function portfolioCloseFacts(analysis: HoldingsAnalysis): PortfolioCloseFacts | null {
  if (!analysis.coverage.holdings) return null;
  const sectors = analysis.sectors;
  return {
    complete: analysis.complete,
    coverage: analysis.coverage,
    dayChange: analysis.dayChange,
    returnPercent: analysis.returnPercent,
    benchmarkReturnPercent: analysis.benchmarkReturnPercent,
    relativeReturnPercent: analysis.relativeReturnPercent,
    contributors: analysis.contributors.slice(0, DRIVERS).map(mover),
    detractors: analysis.detractors.slice(0, DRIVERS).map(mover),
    breadth: analysis.breadth,
    // The engine already orders sectors by dollar contribution, best first.
    strongestSector: analysis.complete && sectors.length >= 2 ? sector(sectors[0]!) : null,
    weakestSector:
      analysis.complete && sectors.length >= 2 ? sector(sectors[sectors.length - 1]!) : null,
  };
}

function relativeClause(relative: number | null): string {
  if (relative == null) return "";
  const pts = Math.abs(relative);
  if (pts < 0.005) return ", in line with the S&P 500";
  return `, ${pts.toFixed(2)} pts ${relative > 0 ? "ahead of" : "behind"} the S&P 500`;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Templated sentences. Each clause appears only when its fact exists. */
export function closeSummary(portfolio: PortfolioCloseFacts | null, market: MarketFacts): string[] {
  const sentences: string[] = [];

  if (portfolio && portfolio.dayChange != null) {
    if (portfolio.complete && portfolio.returnPercent != null) {
      sentences.push(
        `Your portfolio returned ${formatPct(portfolio.returnPercent)}${relativeClause(portfolio.relativeReturnPercent)}.`,
      );
    } else {
      sentences.push(
        `Partial close: ${formatMoney(portfolio.dayChange, true)} from ${portfolio.coverage.priced} of ${plural(portfolio.coverage.holdings, "holding")} with prices.`,
      );
    }
    const drivers: string[] = [];
    const lead = portfolio.contributors[0] ?? portfolio.detractors[0];
    if (lead) {
      drivers.push(
        `${lead.symbol} was the largest ${portfolio.complete ? "" : "known "}${portfolio.contributors[0] ? "contributor" : "detractor"}`,
      );
    }
    if (portfolio.breadth.quoted) {
      drivers.push(
        `${portfolio.breadth.up} up · ${portfolio.breadth.down} down · ${portfolio.breadth.flat} flat among ${plural(portfolio.breadth.quoted, "priced holding")}`,
      );
    }
    if (drivers.length) {
      const text = drivers.join("; ");
      sentences.push(`${text[0]!.toUpperCase()}${text.slice(1)}.`);
    }
    return sentences;
  }

  // No priced holdings: the market alone.
  if (market.benchmarkChangePercent != null) {
    const breadth =
      market.dayType === "broad-advance"
        ? " in a broad advance"
        : market.dayType === "broad-decline"
          ? " in a broad decline"
          : market.dayType === "mixed"
            ? " on a mixed day"
            : "";
    sentences.push(`The S&P 500 moved ${formatPct(market.benchmarkChangePercent)}${breadth}.`);
  }
  return sentences;
}

export function buildCloseFacts(
  analysis: HoldingsAnalysis | null,
  market: MarketFacts,
): LatticeCloseFacts {
  const portfolio = analysis ? portfolioCloseFacts(analysis) : null;
  return { portfolio, market, summary: closeSummary(portfolio, market) };
}
