import { useEffect, useMemo, useState } from "react";
import { latestSessionDate, newYorkDate, periodAnchorDate } from "@/lib/market-calendar";
import { isLookback, periodQuotes, type Period } from "@/lib/periods";
import type { Quote } from "@/lib/quote-core";
import { useReferenceCloses } from "@/lib/use-reference-closes";

/** Segmented-control options for the market map and the sector ranking. */
export const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "ytd", label: "YTD" },
];

/**
 * Caption words for a period. 1D is "today" only when the latest session
 * is today; before the open, on weekends and holidays it is the last
 * completed session. Without a clock yet (server render) it reads "today".
 */
export function periodWords(period: Period, now: Date | null): string {
  if (period === "1w") return "past week";
  if (period === "1m") return "past month";
  if (period === "ytd") return "this year";
  return now == null || latestSessionDate(now) === newYorkDate(now) ? "today" : "last session";
}

/** periodWords on the browser's clock, so server and client renders agree. */
export function usePeriodWords(period: Period): string {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = window.setInterval(tick, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return periodWords(period, now);
}

/**
 * Display quotes for a period. 1D passes the live quotes through. A lookback
 * compares each live price with its reference close from the history layer;
 * without one the move is null (shown as "—"), never 0%. Sizes, Today and
 * Close keep using the live quotes.
 */
export function usePeriodQuotes(
  symbols: readonly string[],
  quotes: Record<string, Quote>,
  period: Period,
  refreshToken: number,
) {
  const anchor = periodAnchorDate(new Date(), period);
  const references = useReferenceCloses(symbols, period, anchor, refreshToken);
  const display = useMemo(
    () => periodQuotes(quotes, period, references.references),
    [quotes, period, references.references],
  );
  return { display, status: references.status, lookback: isLookback(period) };
}
