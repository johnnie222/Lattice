/**
 * The HTTP client market-data adapters are given: plain fetch on the server,
 * native HTTP on the phone (Yahoo does not allow browser cross-origin
 * requests). `data` is parsed JSON, or the raw text when the client didn't
 * parse it.
 */
export type HttpGet = (
  url: string,
  headers: Record<string, string>,
) => Promise<{ status: number; data: unknown }>;

export function jsonBody(data: unknown): unknown {
  return typeof data === "string" ? JSON.parse(data) : data;
}

/** Server-side fetch with a timeout. */
export function fetchGet(timeoutMs: number): HttpGet {
  return async (url, headers) => {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeoutMs) });
    return { status: res.status, data: res.ok ? await res.json() : null };
  };
}
