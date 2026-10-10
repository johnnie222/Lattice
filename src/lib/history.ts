import { createServerFn } from "@tanstack/react-start";

import { createHistoryCache } from "./history-data.ts";
import { parseReferenceRequest } from "./history-request.ts";
import { answerReferenceRequest, type ReferenceAnswer } from "./history-service.ts";
import { yahooHistoryProvider } from "./history-yahoo.ts";

// One cache per server instance, shared by every user: a symbol's history is
// fetched once per session and every period is derived from it. This is the
// only line that names a provider; #5 swaps it for a licensed one.
const histories = createHistoryCache(yahooHistoryProvider);

/** Reference closes for a lookback period (see answerReferenceRequest). */
export const fetchReferenceCloses = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseReferenceRequest(input))
  .handler(async ({ data }): Promise<ReferenceAnswer> => answerReferenceRequest(histories, data));
