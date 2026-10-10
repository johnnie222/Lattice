/**
 * Lattice-owned historical price types and the provider contract.
 *
 * Everything above this layer (period rules, server function, UI) only sees
 * these types, so the data provider can be swapped (#5) by writing another
 * `HistoryProvider`. No provider payload shapes leave the adapters.
 */

/** One regular-session daily close. `date` is the New York trading date. */
export type DailyBar = { date: string; close: number };

/** Daily closes for one symbol, oldest first, one bar per date. */
export type DailyHistory = { symbol: string; bars: DailyBar[] };

/**
 * One provider answer. A symbol in `unavailable` couldn't be fetched this time
 * (an outage, a rate limit) and is worth retrying; any other requested symbol
 * missing from `histories` is one the provider has no history for.
 */
export type HistoryBatch = { histories: DailyHistory[]; unavailable: string[] };

export interface HistoryProvider {
  readonly name: string;
  /**
   * Daily regular-session closes covering at least `from` (YYYY-MM-DD)
   * through the latest session, for each requested symbol.
   */
  dailyCloses(symbols: readonly string[], from: string): Promise<HistoryBatch>;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Enforce the DailyBar contract on provider output: valid dates, positive
 * finite closes, ascending order, one bar per date (the later one wins).
 */
export function normalizeBars(bars: readonly { date: unknown; close: unknown }[]): DailyBar[] {
  const byDate = new Map<string, number>();
  for (const bar of bars) {
    if (typeof bar.date !== "string" || !DATE.test(bar.date)) continue;
    const close = typeof bar.close === "number" ? bar.close : Number.NaN;
    if (!Number.isFinite(close) || close <= 0) continue;
    byDate.set(bar.date, close);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, close]) => ({ date, close }));
}

/**
 * Process-wide cache of daily histories, shared by every request (and so
 * every user) served by this instance. Reference closes change at most once
 * per trading day, so an entry stays valid for the anchor session it was
 * fetched for. A shared cache in front of the licensed provider (#5) can
 * replace this without touching callers.
 */
export type HistoryLookup = { bars: Map<string, DailyBar[]>; unavailable: string[] };

/**
 * A per-server-instance cache shared by every user. Each symbol's history is
 * fetched once per session anchor; concurrent requests for the same symbol
 * share one upstream call, and a failed symbol isn't retried for `retryMs`.
 * Symbols the provider has no history for are cached as empty, so they read
 * as missing rather than unavailable.
 */
export function createHistoryCache(
  provider: HistoryProvider,
  ttlMs = 6 * 60 * 60 * 1000,
  retryMs = 60 * 1000,
) {
  const entries = new Map<string, { at: number; anchor: string; from: string; bars: DailyBar[] }>();
  const failures = new Map<string, number>();
  const inflight = new Map<string, Promise<DailyBar[] | null>>();

  return {
    async get(
      symbols: readonly string[],
      from: string,
      anchor: string,
      now = Date.now(),
    ): Promise<HistoryLookup> {
      const bars = new Map<string, DailyBar[]>();
      const unavailable: string[] = [];
      const pending: [string, Promise<DailyBar[] | null>][] = [];
      const need: string[] = [];
      for (const symbol of symbols) {
        const hit = entries.get(symbol);
        const key = `${symbol}|${anchor}|${from}`;
        const failed = failures.get(key);
        const task = inflight.get(key);
        if (hit && hit.anchor === anchor && hit.from <= from && now - hit.at < ttlMs)
          bars.set(symbol, hit.bars);
        else if (failed != null && now - failed < retryMs) unavailable.push(symbol);
        else if (task) pending.push([symbol, task]);
        else need.push(symbol);
      }
      if (need.length) {
        const batch = provider.dailyCloses(need, from).then(
          (result) => ({
            found: new Map(result.histories.map((history) => [history.symbol, history.bars])),
            down: new Set(result.unavailable),
          }),
          () => ({ found: new Map<string, DailyBar[]>(), down: new Set(need) }),
        );
        for (const symbol of need) {
          const key = `${symbol}|${anchor}|${from}`;
          const task = batch
            .then(({ found, down }) => {
              if (down.has(symbol)) {
                failures.set(key, now);
                return null;
              }
              const normalized = normalizeBars(found.get(symbol) ?? []);
              entries.set(symbol, { at: now, anchor, from, bars: normalized });
              failures.delete(key);
              return normalized;
            })
            .finally(() => inflight.delete(key));
          inflight.set(key, task);
          pending.push([symbol, task]);
        }
      }
      for (const [symbol, task] of pending) {
        const result = await task;
        if (result) bars.set(symbol, result);
        else unavailable.push(symbol);
      }
      return { bars, unavailable };
    },
    size: () => entries.size,
  };
}
