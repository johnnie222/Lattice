// Live Yahoo quotes, shared by the web server function and the Android app.
// The caller supplies the HTTP client: plain fetch on the server, native HTTP
// on the phone. Quotes are today's only (price vs previous close); lookback
// periods come from the history layer (periods.ts / history-*.ts).
import { jsonBody, type HttpGet } from "./http-get.ts";
import { parseQuote, type Quote } from "./quote-data.ts";

export type { Quote } from "./quote-data.ts";
export type { HttpGet } from "./http-get.ts";

export type QuoteResult = { quotes: Quote[]; asOf: number };

type CacheEntry = { at: number; q: Quote };

const cache = new Map<string, CacheEntry>();
const TTL_MS = 20_000;
const CHUNK = 20;

export function parseSymbols(input: unknown): { symbols: string[]; fresh: boolean } {
  const obj = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const raw = Array.isArray(obj.symbols) ? obj.symbols : [];
  const symbols = Array.from(
    new Set(
      raw
        .map((s) => String(s).trim().toUpperCase().replace(/\./g, "-"))
        // A leading ^ marks an index (^GSPC, ^NDX, ^DJI).
        .filter((s) => /^\^?[A-Z0-9-]{1,10}$/.test(s)),
    ),
  ).slice(0, 600);
  return { symbols, fresh: obj.fresh === true };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchChunk(get: HttpGet, symbols: string[]): Promise<Quote[]> {
  const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols.map(encodeURIComponent).join(",")}&range=1d&interval=1d`;
  let last = "quote failed";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await get(url, {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    });
    if (res.status === 429 || res.status >= 500) {
      last = `upstream ${res.status}`;
      await sleep(350 * (attempt + 1));
      continue;
    }
    if (res.status < 200 || res.status >= 300) throw new Error(`upstream ${res.status}`);
    const data = jsonBody(res.data) as Record<string, unknown> | null;
    if (!data || typeof data !== "object" || "spark" in data) {
      throw new Error("unexpected quote payload");
    }
    const out: Quote[] = [];
    for (const symbol of symbols) {
      const quote = parseQuote(symbol, data[symbol]);
      if (quote) out.push(quote);
    }
    return out;
  }
  throw new Error(last);
}

export async function getQuotes(get: HttpGet, symbols: string[], fresh: boolean): Promise<QuoteResult> {
  const now = Date.now();
  const quotes: Quote[] = [];
  const need: string[] = [];
  for (const symbol of symbols) {
    const hit = cache.get(symbol);
    if (!fresh && hit && now - hit.at < TTL_MS) quotes.push(hit.q);
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
          return await fetchChunk(get, chunk);
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
}
