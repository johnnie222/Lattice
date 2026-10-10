/**
 * Deterministic lookback periods for the heatmap: which past close a period
 * compares against, and the resulting move. Pure; no provider or UI code.
 *
 * - 1D: latest price vs previous regular-session close (the live quote path).
 * - 1W: vs the close 5 trading sessions before the latest session.
 * - 1M: vs the close on, or the trading day immediately before, the same
 *   date one calendar month earlier (clamped to month end).
 * - YTD: vs the last regular-session close of the previous calendar year.
 *
 * The reference date comes from the NYSE calendar. If the history has no bar
 * for exactly that date, the reference is missing: we never fall back to a
 * neighbouring day's close, and a missing reference never reads as 0%.
 */
import type { DailyBar } from "./history-data.ts";
import { oneMonthEarlier, tradingDayOnOrBefore, tradingDaysBefore } from "./market-calendar.ts";
import type { Quote } from "./quote-data.ts";

export type Period = "1d" | "1w" | "1m" | "ytd";
export type LookbackPeriod = Exclude<Period, "1d">;

export const PERIODS: readonly Period[] = ["1d", "1w", "1m", "ytd"];
export const PERIOD_LABEL: Record<Period, string> = {
  "1d": "1D",
  "1w": "1W",
  "1m": "1M",
  ytd: "YTD",
};

/** Colour-band stretch per period, roughly the square root of its length in sessions. */
export const HEAT_SCALE: Record<Period, number> = { "1d": 1, "1w": 2, "1m": 4, ytd: 8 };

export function parsePeriod(raw: unknown): Period {
  return raw === "1w" || raw === "1m" || raw === "ytd" ? raw : "1d";
}

export function isLookback(period: Period): period is LookbackPeriod {
  return period !== "1d";
}

/** The trading date whose close a lookback compares against. */
export function referenceDate(period: LookbackPeriod, anchor: string): string {
  if (period === "1w") return tradingDaysBefore(anchor, 5);
  if (period === "1m") return tradingDayOnOrBefore(oneMonthEarlier(anchor));
  return tradingDayOnOrBefore(`${Number(anchor.slice(0, 4)) - 1}-12-31`);
}

/** Earliest date a provider must cover for every lookback from `anchor`. */
export function historyStart(anchor: string): string {
  const dates = (["1w", "1m", "ytd"] as const).map((period) => referenceDate(period, anchor));
  return dates.sort()[0]!;
}

export type ReferenceClose = { date: string; close: number | null };

/** Exact-date lookup. A gap in the history is reported, not papered over. */
export function referenceClose(
  bars: readonly DailyBar[],
  period: LookbackPeriod,
  anchor: string,
): ReferenceClose {
  const date = referenceDate(period, anchor);
  const bar = bars.find((b) => b.date === date);
  return { date, close: bar ? bar.close : null };
}

/** Move from a reference close to the latest price; null if either is unusable. */
export function periodChangePercent(
  price: number | null | undefined,
  reference: number | null | undefined,
): number | null {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) return null;
  if (typeof reference !== "number" || !Number.isFinite(reference) || reference <= 0) return null;
  return (price / reference - 1) * 100;
}

/**
 * Quotes as the heatmap should colour them for a period. 1D passes the live
 * quotes through untouched. For a lookback, each quote's change becomes
 * price vs reference close; a missing reference makes the change null
 * (shown as waiting), never zero.
 */
export function periodQuotes(
  quotes: Readonly<Record<string, Quote>>,
  period: Period,
  references: Readonly<Record<string, ReferenceClose | undefined>>,
): Record<string, Quote> {
  if (!isLookback(period)) return quotes as Record<string, Quote>;
  const out: Record<string, Quote> = {};
  for (const [symbol, quote] of Object.entries(quotes)) {
    const reference = references[symbol]?.close ?? null;
    const changePercent = periodChangePercent(quote.price, reference);
    out[symbol] = {
      ...quote,
      previousClose: changePercent != null ? reference : null,
      change: changePercent != null ? quote.price - reference! : null,
      changePercent,
    };
  }
  return out;
}

export type PeriodMove = { percent: number | null; covered: number; total: number };

/**
 * The header move for a lookback: a weighted average over the names that have
 * a reference close, with coverage so a partial figure can be labelled as one.
 * Price-weighted boards weight by the reference close, which makes the result
 * sum(price − ref) / sum(ref), the index's own lookback move.
 */
export function periodMove(
  nodes: readonly { symbol: string; weight: number }[],
  quotes: Readonly<Record<string, Quote | undefined>>,
  priceWeighted: boolean,
): PeriodMove {
  let acc = 0;
  let weight = 0;
  let covered = 0;
  let total = 0;
  for (const node of nodes) {
    if (node.weight <= 0) continue;
    total++;
    const quote = quotes[node.symbol];
    if (quote?.changePercent == null || !Number.isFinite(quote.changePercent)) continue;
    const w = priceWeighted ? (quote.previousClose ?? 0) : node.weight;
    if (!(w > 0)) continue;
    covered++;
    acc += w * quote.changePercent;
    weight += w;
  }
  return { percent: weight > 0 ? acc / weight : null, covered, total };
}
