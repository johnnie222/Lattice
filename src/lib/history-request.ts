/** Validation for reference-close requests (pure, shared by server and tests). */
import { isTradingDay, latestSessionDate } from "./market-calendar.ts";
import type { LookbackPeriod } from "./periods.ts";

export type ReferenceRequest = { symbols: string[]; period: LookbackPeriod; anchor: string };

/**
 * Symbols as the quote path accepts them; the period must be a lookback; the
 * anchor is the client's latest session, accepted only if it is a trading
 * day no later than the server's own latest session (else the server's).
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
  const serverAnchor = latestSessionDate(now);
  const anchor =
    typeof obj.anchor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(obj.anchor) &&
    isTradingDay(obj.anchor) &&
    obj.anchor <= serverAnchor
      ? obj.anchor
      : serverAnchor;
  return { symbols, period, anchor };
}
