/**
 * Glue between saved books, live quotes and the portfolio intelligence
 * engine. Every portfolio return, contribution, breadth and benchmark figure
 * comes from the engine; this file only shapes its inputs (and sizes tiles).
 *
 * - Share books are real holdings: `analyzeHoldings` (quantity × price,
 *   daily P&L from the previous close, full return only when complete).
 * - Percent books are weights: `analyzePortfolio`, with each position's
 *   weight taken at the previous close. A percent position moves with its
 *   price from when it was added, so its weight at the previous close is
 *   percent × previousClose / anchor, which makes the daily return exact.
 *   No dollar figures exist for these books.
 * - Mixed books (older APK data) are weights too: share positions by value,
 *   percent positions as a share of the total, as those builds read them.
 */
import { isMixedBook, type Book, type Position } from "./book-model.ts";
import {
  analyzeHoldings,
  analyzePortfolio,
  type HoldingQuote,
  type HoldingsAnalysis,
  type PortfolioAnalysis,
} from "./portfolio-intelligence.ts";
import { periodMove, type PeriodMove } from "./periods.ts";
import type { Quote } from "./quote-data.ts";

/** S&P 500 index, the benchmark for "vs S&P 500". */
export const BENCHMARK_SYMBOL = "^GSPC";

type Quotes = Readonly<Record<string, Quote | undefined>>;
type Sectors = Readonly<Record<string, string | undefined>>;

export type BookAnalysis =
  | { kind: "holdings"; analysis: HoldingsAnalysis }
  | { kind: "weights"; analysis: PortfolioAnalysis; mixed: boolean; overflow: boolean };

export function bookSymbols(book: Book): string[] {
  return book.positions.map((p) => p.symbol);
}

/** Today's S&P 500 move, from its price and previous close; null if unknown. */
export function benchmarkReturn(quotes: Quotes): number | null {
  const quote = quotes[BENCHMARK_SYMBOL];
  if (
    !quote ||
    quote.previousClose == null ||
    !Number.isFinite(quote.previousClose) ||
    quote.previousClose <= 0 ||
    !Number.isFinite(quote.price) ||
    quote.price <= 0
  )
    return null;
  return (quote.price / quote.previousClose - 1) * 100;
}

export type Sized = {
  position: Position;
  symbol: string;
  /** Dollar value at the given prices, when it can be known. */
  value: number | null;
  /** Relative size. */
  weight: number;
  /** Fraction of the whole book, 0–1. */
  share: number;
};

export type Sizing = {
  rows: Sized[];
  /** Holds both share and percent positions (only possible in older data). */
  mixed: boolean;
  /** Mixed, and the percent positions add up to 100% or more. */
  overflow: boolean;
};

function drift(p: Position, price: number | null): number {
  return p.anchor && price ? price / p.anchor : 1;
}

/**
 * Relative sizes at a set of prices. Share positions are worth shares ×
 * price (average cost, then the price when added, until a price arrives). A
 * percent position starts at its percentage and then moves with its price:
 * 25% of AAPL that rises 20% while the rest is flat becomes ~28.6%.
 */
export function sizeBook(book: Book, priceOf: (symbol: string) => number | null): Sizing {
  const mixed = isMixedBook(book);
  let dollars = 0;
  let percent = 0;
  for (const p of book.positions) {
    const price = priceOf(p.symbol);
    if (p.kind === "shares") {
      const unit = price ?? p.entry ?? p.anchor;
      if (unit) dollars += p.shares * unit;
    } else {
      percent += p.percent * drift(p, price);
    }
  }
  // Older mixed books: percent positions are a share of the total.
  const overflow = mixed && percent >= 100;
  const total = dollars > 0 && mixed && !overflow ? dollars / (1 - percent / 100) : null;

  const rows = book.positions.map((p): Sized => {
    const price = priceOf(p.symbol);
    if (p.kind === "shares") {
      const unit = price ?? p.entry ?? p.anchor;
      const value = unit ? p.shares * unit : null;
      return { position: p, symbol: p.symbol, value, weight: value ?? 0, share: 0 };
    }
    const weight = p.percent * drift(p, price);
    const value = total != null ? (weight / 100) * total : null;
    return { position: p, symbol: p.symbol, value: null, weight: value ?? weight, share: 0 };
  });
  const sum = rows.reduce((acc, row) => acc + row.weight, 0);
  for (const row of rows) row.share = sum > 0 ? row.weight / sum : 0;
  return { rows, mixed, overflow };
}

export function analyzeBook(
  book: Book,
  quotes: Quotes,
  sectorBySymbol: Sectors = {},
): BookAnalysis {
  const benchmarkReturnPercent = benchmarkReturn(quotes);
  if (!book.positions.some((p) => p.kind === "percent")) {
    const holdingQuotes: Record<string, HoldingQuote> = {};
    for (const p of book.positions) {
      const quote = quotes[p.symbol];
      if (quote)
        holdingQuotes[p.symbol] = { price: quote.price, previousClose: quote.previousClose };
    }
    return {
      kind: "holdings",
      analysis: analyzeHoldings({
        holdings: book.positions.map((p) => ({
          symbol: p.symbol,
          quantity: p.kind === "shares" ? p.shares : 0,
          averageCost: p.kind === "shares" ? p.entry : null,
        })),
        quotes: holdingQuotes,
        benchmarkReturnPercent,
        sectorBySymbol,
      }),
    };
  }
  // Weights at the previous close, so today's return is each position's
  // move weighted by where it started the day.
  const atClose = sizeBook(book, (symbol) => quotes[symbol]?.previousClose ?? null);
  return {
    kind: "weights",
    mixed: atClose.mixed,
    overflow: atClose.overflow,
    analysis: analyzePortfolio({
      // A share position that can't be valued yet still counts, unpriced,
      // so coverage never reads complete without it.
      lines: atClose.rows.map((row) => ({ symbol: row.symbol, weight: row.weight || 1e-9 })),
      quotes,
      benchmarkReturnPercent,
      sectorBySymbol,
    }),
  };
}

/**
 * Relative tile sizes for the portfolio map. Priced holdings use their
 * value (quantity × price); until a quote arrives a holding is sized by its
 * cost basis, or else the median priced value, so the map doesn't jump.
 * Percent books use each position's current share.
 */
export function bookTileWeights(
  book: Book,
  result: BookAnalysis,
  quotes: Quotes,
): Map<string, number> {
  const weights = new Map<string, number>();
  if (result.kind === "weights") {
    for (const row of sizeBook(book, (symbol) => quotes[symbol]?.price ?? null).rows)
      weights.set(row.symbol, row.weight > 0 ? row.weight : 0);
    return weights;
  }
  const values = result.analysis.positions.map((row) => row.value).sort((a, b) => a - b);
  const median = values.length ? values[Math.floor(values.length / 2)]! : 1;
  for (const p of book.positions) {
    if (p.kind !== "shares") continue;
    const priced = result.analysis.positions.find((row) => row.symbol === p.symbol);
    weights.set(p.symbol, priced ? priced.value : p.entry ? p.shares * p.entry : median);
  }
  return weights;
}

/**
 * Current-holdings lookback: what the positions held now would have done
 * over a lookback, from each one's reference close (`display` comes from
 * periodQuotes, so previousClose there is the reference close). It is not
 * the account's historical return, and it is only a full figure when every
 * position has a reference close (covered === total). Null for mixed books.
 */
export function holdingsLookback(book: Book, display: Quotes): PeriodMove | null {
  if (!book.positions.length || isMixedBook(book)) return null;
  const usable: Record<string, Quote | undefined> = {};
  const nodes = book.positions.map((p) => {
    const quote = display[p.symbol];
    const ref = quote?.previousClose ?? null;
    // Shares are real units; a percent position is percent / anchor units.
    const units = p.kind === "shares" ? p.shares : p.anchor ? p.percent / p.anchor : null;
    if (units != null) usable[p.symbol] = quote;
    return { symbol: p.symbol, weight: units != null && ref != null ? units * ref : 1 };
  });
  return periodMove(nodes, usable, false);
}

export type SinceEntryRow = {
  percent: number;
  /** Dollar gain; null for percent positions. */
  change: number | null;
  /** From the average cost, or (percent positions) the price when added. */
  basis: "cost" | "added";
};

/**
 * Each position's move from its average cost (share positions with one) or,
 * for percent positions, from the price when it was added to Lattice.
 * Per position only: no historical quantities are inferred.
 */
export function sinceEntryRows(book: Book, quotes: Quotes): Map<string, SinceEntryRow> {
  const rows = new Map<string, SinceEntryRow>();
  for (const p of book.positions) {
    const price = quotes[p.symbol]?.price;
    if (price == null || !Number.isFinite(price) || price <= 0) continue;
    if (p.kind === "shares" && p.entry) {
      rows.set(p.symbol, {
        percent: (price / p.entry - 1) * 100,
        change: p.shares * (price - p.entry),
        basis: "cost",
      });
    } else if (p.kind === "percent" && p.anchor) {
      rows.set(p.symbol, { percent: (price / p.anchor - 1) * 100, change: null, basis: "added" });
    }
  }
  return rows;
}
