import { createServerFn } from "@tanstack/react-start";

import { createHistoryCache } from "./history-data.ts";
import { parseReferenceRequest } from "./history-request.ts";
import { yahooHistoryProvider } from "./history-yahoo.ts";
import {
  historyStart,
  referenceClose,
  type LookbackPeriod,
  type ReferenceClose,
} from "./periods.ts";

// One cache per server instance, shared by every user: a symbol's history is
// fetched once per session and every period is derived from it. This is the
// only line that names a provider; #5 swaps it for a licensed one.
const histories = createHistoryCache(yahooHistoryProvider);

/**
 * Reference closes for a lookback period. Returns only the one close per
 * symbol the client needs, never raw provider data. A symbol with no close on
 * the reference date comes back as close: null; one the provider couldn't
 * fetch right now is listed in `unavailable` instead, so it can be retried.
 */
export const fetchReferenceCloses = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseReferenceRequest(input))
  .handler(
    async ({
      data,
    }): Promise<{
      period: LookbackPeriod;
      anchor: string;
      references: Record<string, ReferenceClose>;
      unavailable: string[];
    }> => {
      const { bars, unavailable } = await histories.get(
        data.symbols,
        historyStart(data.anchor),
        data.anchor,
      );
      const references: Record<string, ReferenceClose> = {};
      for (const [symbol, history] of bars) {
        references[symbol] = referenceClose(history, data.period, data.anchor);
      }
      return { period: data.period, anchor: data.anchor, references, unavailable };
    },
  );
