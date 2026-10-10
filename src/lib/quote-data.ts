/** Public market data only. Missing numbers must never become a zero move. */
export type Quote = {
  symbol: string;
  price: number;
  change: number | null;
  changePercent: number | null;
  previousClose: number | null;
};

function numberOrNull(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function parseQuote(symbol: string, raw: unknown): Quote | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const price = numberOrNull(row.fulldayPrice);
  if (price == null || price <= 0) return null;
  const change = numberOrNull(row.fulldayChange);
  const reportedClose = [row.chartPreviousClose, row.previousClose]
    .map(numberOrNull)
    .find((value) => value != null && value > 0);
  const close = reportedClose ?? (change != null ? price - change : null);
  const previousClose = close != null && close > 0 ? close : null;
  // All daily figures use the same denominator, including legacy books/maps.
  return {
    symbol,
    price,
    previousClose,
    change: previousClose != null ? price - previousClose : null,
    changePercent: previousClose != null ? (price / previousClose - 1) * 100 : null,
  };
}

/** Replace a requested batch, including omissions; old quotes aren't fresh coverage. */
export function replaceQuoteBatch(
  previous: Readonly<Record<string, Quote>>,
  symbols: readonly string[],
  received: readonly Quote[],
): Record<string, Quote> {
  const next = { ...previous };
  for (const symbol of symbols) delete next[symbol];
  const requested = new Set(symbols);
  for (const quote of received) if (requested.has(quote.symbol)) next[quote.symbol] = quote;
  return next;
}
