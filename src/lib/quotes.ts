import { createServerFn } from "@tanstack/react-start";
import { getQuotes, parseSymbols, type HttpGet, type QuoteResult } from "@/lib/quote-core";

export type { Quote } from "@/lib/quote-core";

const serverGet: HttpGet = async (url, headers) => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(12_000) });
  return { status: res.status, data: res.ok ? await res.json() : null };
};

export const fetchQuotes = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseSymbols(input))
  .handler(async ({ data }): Promise<QuoteResult> => getQuotes(serverGet, data.symbols, data.fresh));
