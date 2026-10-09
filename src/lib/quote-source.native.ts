// Android: no server, so the phone calls Yahoo itself through Capacitor's
// native HTTP client, which is not subject to browser CORS.
import { CapacitorHttp } from "@capacitor/core";
import { getQuotes, parseSymbols, type HttpGet, type Period, type QuoteResult } from "@/lib/quote-core";

const nativeGet: HttpGet = async (url, headers) => {
  const res = await CapacitorHttp.get({ url, headers, connectTimeout: 12_000, readTimeout: 12_000 });
  return { status: res.status, data: res.data };
};

export function loadQuotes(symbols: string[], fresh: boolean, period: Period): Promise<QuoteResult> {
  const parsed = parseSymbols({ symbols, fresh, period });
  return getQuotes(nativeGet, parsed.symbols, parsed.fresh, parsed.period);
}
