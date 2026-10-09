// Yahoo quote fetching shared by the web server function and the Android app.
// The caller supplies the HTTP client: plain fetch on the server, native HTTP
// on the phone (Yahoo does not allow browser cross-origin requests).

export type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

export type QuoteResult = { quotes: Quote[]; asOf: number };

/** The window a quote's change covers. */
export type Period = "1d" | "1w" | "1m" | "ytd" | "1y" | "5y";
/** The windows the map and sector ranking offer. */
export const PERIODS: Period[] = ["1d", "1w", "1m"];
const ALL_PERIODS = new Set<string>(["1d", "1w", "1m", "ytd", "1y", "5y"]);

export function parsePeriod(raw: unknown): Period {
  return typeof raw === "string" && ALL_PERIODS.has(raw) ? (raw as Period) : "1d";
}

// Yahoo range + bar size per window. Only the last close and the close
// before the range matter, so long windows use coarse bars.
const RANGE: Record<Period, { range: string; interval: string }> = {
  "1d": { range: "1d", interval: "1d" },
  "1w": { range: "1mo", interval: "1d" },
  "1m": { range: "1mo", interval: "1d" },
  ytd: { range: "ytd", interval: "1d" },
  "1y": { range: "1y", interval: "1wk" },
  "5y": { range: "5y", interval: "1mo" },
};

export type HttpGet = (url: string, headers: Record<string, string>) => Promise<{ status: number; data: unknown }>;

type CacheEntry = { at: number; q: Quote };

const cache = new Map<string, CacheEntry>();
// Week/month changes only move with today's price, so they can be cached longer.
const TTL_MS: Record<Period, number> = {
  "1d": 20_000,
  "1w": 60_000,
  "1m": 60_000,
  ytd: 120_000,
  "1y": 120_000,
  "5y": 300_000,
};
const CHUNK = 20;

export function parseSymbols(input: unknown): { symbols: string[]; fresh: boolean; period: Period } {
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
  return { symbols, fresh: obj.fresh === true, period: parsePeriod(obj.period) };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function finite(values: unknown): number[] {
  return Array.isArray(values) ? values.map(Number).filter((v) => Number.isFinite(v) && v > 0) : [];
}

/**
 * Change over a window from closes. The last close is today's live price.
 * 1W compares with the close five sessions back; longer windows with the
 * close just before the range starts (Yahoo's chartPreviousClose).
 */
function windowQuote(symbol: string, closes: number[], previousClose: number, period: Period): Quote | null {
  const price = closes[closes.length - 1];
  if (price == null) return null;
  const ref =
    period === "1w"
      ? (closes[closes.length - 6] ?? closes[0])
      : Number.isFinite(previousClose) && previousClose > 0
        ? previousClose
        : closes[0];
  if (ref == null || ref <= 0) return null;
  const change = price - ref;
  return { symbol, price, change, changePercent: (change / ref) * 100 };
}

// Yahoo answers in one of two shapes: a map keyed by symbol (v8), or the
// older { spark: { result: [...] } } envelope. Read both.
function readRows(data: Record<string, unknown>, symbols: string[]) {
  const rows = new Map<string, { rec: Record<string, unknown>; closes: number[]; previousClose: number }>();
  const spark = data.spark as { result?: unknown[] } | undefined;
  if (spark && Array.isArray(spark.result)) {
    for (const item of spark.result) {
      const entry = item as { symbol?: string; response?: Record<string, unknown>[] };
      const response = entry.response?.[0];
      if (!entry.symbol || !response) continue;
      const meta = (response.meta ?? {}) as Record<string, unknown>;
      const indicators = response.indicators as { quote?: { close?: unknown }[] } | undefined;
      rows.set(entry.symbol, {
        rec: meta,
        closes: finite(indicators?.quote?.[0]?.close),
        previousClose: Number(meta.chartPreviousClose ?? meta.previousClose),
      });
    }
    return rows;
  }
  for (const symbol of symbols) {
    const row = data[symbol];
    if (!row || typeof row !== "object") continue;
    const rec = row as Record<string, unknown>;
    rows.set(symbol, {
      rec,
      closes: finite(rec.close),
      previousClose: Number(rec.chartPreviousClose ?? rec.previousClose),
    });
  }
  return rows;
}

async function fetchChunk(get: HttpGet, symbols: string[], period: Period): Promise<Quote[]> {
  const { range, interval } = RANGE[period];
  const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols.map(encodeURIComponent).join(",")}&range=${range}&interval=${interval}`;
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
    const data = (typeof res.data === "string" ? JSON.parse(res.data) : res.data) as Record<string, unknown>;
    if (!data || typeof data !== "object") throw new Error("unexpected quote payload");
    const rows = readRows(data, symbols);
    const out: Quote[] = [];
    for (const symbol of symbols) {
      const row = rows.get(symbol);
      if (!row) continue;
      if (period !== "1d") {
        const quote = windowQuote(symbol, row.closes, row.previousClose, period);
        if (quote) out.push(quote);
        continue;
      }
      const price = Number(row.rec.fulldayPrice ?? row.rec.regularMarketPrice ?? row.closes[row.closes.length - 1]);
      if (!Number.isFinite(price)) continue;
      let change = Number(row.rec.fulldayChange);
      let changePercent = Number(row.rec.fulldayChangePercent);
      if (!Number.isFinite(change) && Number.isFinite(row.previousClose) && row.previousClose > 0) {
        change = price - row.previousClose;
        changePercent = (change / row.previousClose) * 100;
      }
      out.push({
        symbol,
        price,
        change: Number.isFinite(change) ? change : 0,
        changePercent: Number.isFinite(changePercent) ? changePercent : 0,
      });
    }
    return out;
  }
  throw new Error(last);
}

export async function getQuotes(
  get: HttpGet,
  symbols: string[],
  fresh: boolean,
  period: Period = "1d",
): Promise<QuoteResult> {
  const now = Date.now();
  const quotes: Quote[] = [];
  const need: string[] = [];
  for (const symbol of symbols) {
    const hit = cache.get(`${period}:${symbol}`);
    if (!fresh && hit && now - hit.at < TTL_MS[period]) quotes.push(hit.q);
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
          return await fetchChunk(get, chunk, period);
        } catch {
          failures += 1;
          return [] as Quote[];
        }
      }),
    );
    const stamped = Date.now();
    for (const batch of results) {
      for (const q of batch) {
        cache.set(`${period}:${q.symbol}`, { at: stamped, q });
        quotes.push(q);
      }
    }
    if (i + 2 < chunks.length) await sleep(80);
  }

  if (!quotes.length && failures) throw new Error("Quotes are delayed. Try again in a moment.");
  return { quotes, asOf: Date.now() };
}
