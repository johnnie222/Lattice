import { createServerFn } from "@tanstack/react-start";
import { fetchGet } from "@/lib/http-get";
import { getQuotes, parseSymbols, type QuoteResult } from "@/lib/quote-core";

export type { Quote } from "@/lib/quote-core";

export const fetchQuotes = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseSymbols(input))
  .handler(async ({ data }): Promise<QuoteResult> => getQuotes(fetchGet(12_000), data.symbols, data.fresh));
