/** Validation for reference-close requests (pure, shared by server and tests). */
import { isCalendarDate, isTradingDay, periodAnchorDate } from "./market-calendar.ts";
import type { LookbackPeriod } from "./periods.ts";

export type ReferenceRequest = { symbols: string[]; period: LookbackPeriod; anchor: string };

/**
 * Symbols as the quote path accepts them; the period must be a lookback; the
 * anchor is the client's latest session (calendar date for YTD), accepted
 * only if it is valid and no later than the server's anchor (else the server's).
 */
export function parseReferenceRequest(input: unknown, now = new Date()): ReferenceRequest {
  const obj = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const symbols = Array.from(
    new Set(
      (Array.isArray(obj.symbols) ? obj.symbols : [])
        .map((s) => String(s).trim().toUpperCase().replace(/\./g, "-"))
        .filter((s) => /^\^?[A-Z0-9-]{1,10}$/.test(s)),
    ),
  ).slice(0, 600);
  const period: LookbackPeriod = obj.period === "1m" || obj.period === "ytd" ? obj.period : "1w";
  const serverAnchor = periodAnchorDate(now, period);
  const anchor =
    typeof obj.anchor === "string" &&
    isCalendarDate(obj.anchor) &&
    (period === "ytd" || isTradingDay(obj.anchor)) &&
    obj.anchor <= serverAnchor
      ? obj.anchor
      : serverAnchor;
  return { symbols, period, anchor };
}
