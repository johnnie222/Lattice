/**
 * Development history provider backed by Yahoo's spark endpoint. This is the
 * only file that knows Yahoo's payload shapes; it returns Lattice DailyBars.
 * Replace it with the licensed provider in #5 (Yahoo must not back the paid
 * product). The web app runs it on the server; the Android app, which has no
 * server, runs it on the phone with native HTTP.
 */
import type { DailyBar, DailyHistory, HistoryBatch, HistoryProvider } from "./history-data.ts";
import { fetchGet, jsonBody, type HttpGet } from "./http-get.ts";
import { newYorkDate } from "./market-calendar.ts";

const CHUNK = 20;

function bars(timestamps: unknown, closes: unknown): DailyBar[] {
  if (!Array.isArray(timestamps) || !Array.isArray(closes)) return [];
  const out: DailyBar[] = [];
  timestamps.forEach((ts, i) => {
    const close = closes[i];
    if (typeof ts !== "number" || !Number.isFinite(ts)) return;
    if (typeof close !== "number" || !Number.isFinite(close) || close <= 0) return;
    out.push({ date: newYorkDate(new Date(ts * 1000)), close });
  });
  return out;
}

/**
 * Parse a spark payload into DailyHistories. Yahoo answers either with a map
 * keyed by symbol ({ AAPL: { timestamp, close } }) or with the older
 * { spark: { result: [{ symbol, response: [{ timestamp, indicators }] }] } }.
 */
export function parseSparkHistory(payload: unknown, symbols: readonly string[]): DailyHistory[] {
  if (!payload || typeof payload !== "object") return [];
  const data = payload as Record<string, unknown>;
  const spark = data.spark as { result?: unknown[] } | undefined;
  if (spark && Array.isArray(spark.result)) {
    return spark.result.flatMap((item) => {
      const entry = item as { symbol?: unknown; response?: Record<string, unknown>[] };
      const response = entry.response?.[0];
      if (typeof entry.symbol !== "string" || !symbols.includes(entry.symbol) || !response)
        return [];
      const indicators = response.indicators as { quote?: { close?: unknown }[] } | undefined;
      return [
        { symbol: entry.symbol, bars: bars(response.timestamp, indicators?.quote?.[0]?.close) },
      ];
    });
  }
  return symbols.flatMap((symbol) => {
    const row = data[symbol] as Record<string, unknown> | undefined;
    return row && typeof row === "object" ? [{ symbol, bars: bars(row.timestamp, row.close) }] : [];
  });
}

/** A 200 error/malformed response is an outage, not cached missing history. */
export function checkedSparkHistory(payload: unknown, symbols: readonly string[]): DailyHistory[] {
  if (!payload || typeof payload !== "object") throw new Error("Invalid history response");
  const data = payload as Record<string, unknown>;
  const spark = data.spark as { result?: unknown; error?: unknown } | undefined;
  if (spark) {
    if (spark.error || !Array.isArray(spark.result)) throw new Error("History upstream error");
    for (const item of spark.result) {
      const row = item as {
        response?: { timestamp?: unknown; indicators?: { quote?: { close?: unknown }[] } }[];
      } | null;
      const response = row?.response?.[0];
      if (
        !Array.isArray(response?.timestamp) ||
        !Array.isArray(response?.indicators?.quote?.[0]?.close)
      )
        throw new Error("Invalid history row");
    }
  } else {
    const rows = symbols.filter((symbol) => data[symbol] != null);
    if (!rows.length) throw new Error("Invalid history response");
    for (const symbol of rows) {
      const row = data[symbol] as { timestamp?: unknown; close?: unknown; error?: unknown };
      if (row.error || !Array.isArray(row.timestamp) || !Array.isArray(row.close))
        throw new Error("Invalid history row");
    }
  }
  return parseSparkHistory(payload, symbols);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Smallest spark range reaching back to `from`. */
function rangeFor(from: string, now = new Date()): string {
  const days = (now.getTime() - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
  return days <= 360 ? "1y" : "2y";
}

async function fetchChunk(get: HttpGet, symbols: string[], from: string): Promise<DailyHistory[]> {
  const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols
    .map(encodeURIComponent)
    .join(",")}&range=${rangeFor(from)}&interval=1d`;
  let last = "history failed";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await get(url, { "User-Agent": "Mozilla/5.0", Accept: "application/json" });
    if (res.status === 429 || res.status >= 500) {
      last = `upstream ${res.status}`;
      await sleep(400 * (attempt + 1));
      continue;
    }
    if (res.status < 200 || res.status >= 300) throw new Error(`upstream ${res.status}`);
    return checkedSparkHistory(jsonBody(res.data), symbols);
  }
  throw new Error(last);
}

export function createYahooHistoryProvider(get: HttpGet): HistoryProvider {
  return {
    name: "yahoo-dev",
    dailyCloses: (symbols, from) => dailyCloses(get, symbols, from),
  };
}

export const yahooHistoryProvider = createYahooHistoryProvider(fetchGet(15_000));

async function dailyCloses(
  get: HttpGet,
  symbols: readonly string[],
  from: string,
): Promise<HistoryBatch> {
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += CHUNK) chunks.push(symbols.slice(i, i + CHUNK));
  const out: HistoryBatch = { histories: [], unavailable: [] };
  for (let i = 0; i < chunks.length; i += 2) {
    const results = await Promise.all(
      chunks.slice(i, i + 2).map((chunk) =>
        fetchChunk(get, chunk, from).then(
          (histories): HistoryBatch => ({ histories, unavailable: [] }),
          (): HistoryBatch => ({ histories: [], unavailable: chunk }),
        ),
      ),
    );
    for (const batch of results) {
      out.histories.push(...batch.histories);
      out.unavailable.push(...batch.unavailable);
    }
    if (i + 2 < chunks.length) await sleep(80);
  }
  return out;
}
