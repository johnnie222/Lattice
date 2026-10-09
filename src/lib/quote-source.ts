// Web: quotes come through the app's server function.
// The Android build swaps this module for quote-source.native.ts.
import { fetchQuotes } from "@/lib/quotes";
import type { Period, QuoteResult } from "@/lib/quote-core";

export function loadQuotes(symbols: string[], fresh: boolean, period: Period): Promise<QuoteResult> {
  return fetchQuotes({ data: { symbols, fresh, period } });
}
