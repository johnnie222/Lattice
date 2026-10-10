// Android: no server, so the phone fetches daily history itself through
// Capacitor's native HTTP client (not subject to browser CORS) and keeps its
// own cache for the app's lifetime. Same validation and answers as the web.
import { CapacitorHttp } from "@capacitor/core";
import { createHistoryCache } from "@/lib/history-data";
import { parseReferenceRequest } from "@/lib/history-request";
import { answerReferenceRequest, type ReferenceAnswer } from "@/lib/history-service";
import { createYahooHistoryProvider } from "@/lib/history-yahoo";
import type { HttpGet } from "@/lib/http-get";
import type { LookbackPeriod } from "@/lib/periods";

const nativeGet: HttpGet = async (url, headers) => {
  const res = await CapacitorHttp.get({
    url,
    headers,
    connectTimeout: 15_000,
    readTimeout: 15_000,
  });
  return { status: res.status, data: res.data };
};

const histories = createHistoryCache(createYahooHistoryProvider(nativeGet));

export function loadReferenceCloses(request: {
  symbols: string[];
  period: LookbackPeriod;
  anchor: string;
}): Promise<ReferenceAnswer> {
  return answerReferenceRequest(histories, parseReferenceRequest(request));
}
