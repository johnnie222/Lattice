/**
 * Glue between saved books, live quotes and the portfolio intelligence
 * engine. No portfolio math lives here; it only shapes inputs.
 */
import { isLegacyBook, type Book } from "@/lib/book-model";
import { findListing } from "@/lib/market";
import {
  analyzeHoldings,
  analyzePortfolio,
  type HoldingQuote,
  type HoldingsAnalysis,
  type PortfolioAnalysis,
} from "@/lib/portfolio-intelligence";
import type { Quote } from "@/lib/quotes";

/** S&P 500 index, the benchmark for "vs S&P 500". */
export const BENCHMARK_SYMBOL = "^GSPC";

export type BookAnalysis =
  | { kind: "holdings"; analysis: HoldingsAnalysis }
  | { kind: "legacy"; analysis: PortfolioAnalysis; notional: number | null };

function sectorsFor(symbols: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const symbol of symbols) {
    const sector = findListing(symbol)?.sector;
    if (sector) out[symbol] = sector;
  }
  return out;
}

/** Today's S&P 500 move, from its price and previous close; null if unknown. */
export function benchmarkReturn(
  quotes: Readonly<Record<string, Quote | undefined>>,
): number | null {
  const quote = quotes[BENCHMARK_SYMBOL];
  if (!quote || quote.previousClose == null || !Number.isFinite(quote.previousClose) || quote.previousClose <= 0 || !Number.isFinite(quote.price) || quote.price <= 0) return null;
  return (quote.price / quote.previousClose - 1) * 100;
}

export function bookSymbols(book: Book): string[] {
  return isLegacyBook(book)
    ? book.lines.filter((line) => line.weight > 0).map((line) => line.symbol)
    : book.holdings.map((holding) => holding.symbol);
}

export function analyzeBook(
  book: Book,
  quotes: Readonly<Record<string, Quote | undefined>>,
): BookAnalysis {
  const benchmarkReturnPercent = benchmarkReturn(quotes);
  const sectorBySymbol = sectorsFor(bookSymbols(book));
  if (isLegacyBook(book)) {
    return {
      kind: "legacy",
      notional: book.notional,
      analysis: analyzePortfolio({
        lines: book.lines,
        quotes,
        notional: book.notional,
        benchmarkReturnPercent,
        sectorBySymbol,
      }),
    };
  }
  const holdingQuotes: Record<string, HoldingQuote> = {};
  for (const holding of book.holdings) {
    const quote = quotes[holding.symbol];
    if (quote)
      holdingQuotes[holding.symbol] = { price: quote.price, previousClose: quote.previousClose };
  }
  return {
    kind: "holdings",
    analysis: analyzeHoldings({
      holdings: book.holdings,
      quotes: holdingQuotes,
      benchmarkReturnPercent,
      sectorBySymbol,
    }),
  };
}

/**
 * Relative tile sizes for the portfolio map. Priced holdings use their
 * value (quantity × price). Until a quote arrives a holding is sized by its
 * cost basis, or else the median priced value, so the map doesn't jump around
 * while loading. Legacy books use their weights.
 */
export function bookTileWeights(book: Book, result: BookAnalysis): Map<string, number> {
  const weights = new Map<string, number>();
  if (result.kind === "legacy") {
    for (const line of book.lines) if (line.weight > 0) weights.set(line.symbol, line.weight);
    return weights;
  }
  const values = result.analysis.positions.map((row) => row.value).sort((a, b) => a - b);
  const median = values.length ? values[Math.floor(values.length / 2)]! : 1;
  for (const holding of book.holdings) {
    const priced = result.analysis.positions.find((row) => row.symbol === holding.symbol);
    const fallback = holding.averageCost ? holding.quantity * holding.averageCost : median;
    weights.set(holding.symbol, priced ? priced.value : fallback);
  }
  return weights;
}
