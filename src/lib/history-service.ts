/**
 * Answers a reference-close request from a history cache: one close per
 * symbol for the period's reference date, never raw provider data. A symbol
 * with no close on that date comes back as close: null; one the provider
 * couldn't fetch right now is listed in `unavailable`, so it can be retried.
 * The web server function and the Android app both answer through here.
 */
import type { createHistoryCache } from "./history-data.ts";
import type { ReferenceRequest } from "./history-request.ts";
import {
  historyStart,
  referenceClose,
  type LookbackPeriod,
  type ReferenceClose,
} from "./periods.ts";

export type ReferenceAnswer = {
  period: LookbackPeriod;
  anchor: string;
  references: Record<string, ReferenceClose>;
  unavailable: string[];
};

export async function answerReferenceRequest(
  histories: ReturnType<typeof createHistoryCache>,
  request: ReferenceRequest,
): Promise<ReferenceAnswer> {
  const { bars, unavailable } = await histories.get(
    request.symbols,
    historyStart(request.anchor),
    request.anchor,
  );
  const references: Record<string, ReferenceClose> = {};
  for (const [symbol, history] of bars) {
    references[symbol] = referenceClose(history, request.period, request.anchor);
  }
  return { period: request.period, anchor: request.anchor, references, unavailable };
}
