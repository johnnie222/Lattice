import { createServerFn } from "@tanstack/react-start";

export type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  /**
   * Last session's close, or null when the feed didn't provide enough to know
   * it. Portfolio math needs this; it must not be guessed from a missing change.
   */
  previousClose: number | null;
};

type CacheEntry = { at: number; q: Quote };

const cache = new Map<string, CacheEntry>();
const TTL_MS = 20_000;
const CHUNK = 20;

function parseSymbols(input: unknown): { symbols: string[]; fresh: boolean } {
  const obj = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const raw = Array.isArray(obj.symbols) ? obj.symbols : [];
  const symbols = Array.from(
    new Set(
      raw
        .map((s) => String(s).trim().toUpperCase().replace(/\./g, "-"))
        // A leading ^ marks an index, e.g. ^GSPC for the S&P 500 benchmark.
        .filter((s) => /^\^?[A-Z0-9-]{1,10}$/.test(s)),
    ),
  ).slice(0, 600);
  return { symbols, fresh: obj.fresh === true };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchChunk(symbols: string[]): Promise<Quote[]> {
  const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols.map(encodeURIComponent).join(",")}&range=1d&interval=1d`;
  let last = "quote failed";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (res.status === 429 || res.status >= 500) {
      last = `upstream ${res.status}`;
      await sleep(350 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = (await res.json()) as Record<string, unknown>;
    if (!data || typeof data !== "object" || "spark" in data) {
      throw new Error("unexpected quote payload");
    }
    const out: Quote[] = [];
    for (const symbol of symbols) {
      const row = data[symbol];
      if (!row || typeof row !== "object") continue;
      const rec = row as Record<string, unknown>;
      const price = Number(rec.fulldayPrice);
      const change = Number(rec.fulldayChange);
      const changePercent = Number(rec.fulldayChangePercent);
      if (!Number.isFinite(price)) continue;
      const reportedClose = Number(rec.chartPreviousClose ?? rec.previousClose);
      const previousClose = Number.isFinite(change)
        ? price - change
        : Number.isFinite(reportedClose) && reportedClose > 0
          ? reportedClose
          : null;
      out.push({
        symbol,
        price,
        change: Number.isFinite(change) ? change : 0,
        changePercent: Number.isFinite(changePercent) ? changePercent : 0,
        previousClose: previousClose != null && previousClose > 0 ? previousClose : null,
      });
    }
    return out;
  }
  throw new Error(last);
}

export const fetchQuotes = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseSymbols(input))
  .handler(async ({ data }): Promise<{ quotes: Quote[]; asOf: number }> => {
    const now = Date.now();
    const quotes: Quote[] = [];
    const need: string[] = [];
    for (const symbol of data.symbols) {
      const hit = cache.get(symbol);
      if (!data.fresh && hit && now - hit.at < TTL_MS) quotes.push(hit.q);
      else need.push(symbol);
    }

    const chunks: string[][] = [];
    for (let i = 0; i < need.length; i += CHUNK) chunks.push(need.slice(i, i + CHUNK));

    let failures = 0;
    for (let i = 0; i < chunks.length; i += 2) {
      const pair = chunks.slice(i, i + 2);
      const results = await Promise.all(
        pair.map(async (chunk) => {
          try {
            return await fetchChunk(chunk);
          } catch {
            failures += 1;
            return [] as Quote[];
          }
        }),
      );
      const stamped = Date.now();
      for (const batch of results) {
        for (const q of batch) {
          cache.set(q.symbol, { at: stamped, q });
          quotes.push(q);
        }
      }
      if (i + 2 < chunks.length) await sleep(80);
    }

    if (!quotes.length && failures) throw new Error("Quotes are delayed. Try again in a moment.");
    return { quotes, asOf: Date.now() };
  });
