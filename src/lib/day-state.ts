/**
 * Which trading day the portfolio's day section describes, from the NYSE
 * calendar and the clock (pure, so it is unit-tested):
 * - "today": the regular session is open.
 * - "close": today's regular session has ended (4pm, 1pm on early closes).
 * - "last-close": the latest regular session was not today: before the
 *   open, on weekends and on holidays. Labelled with that session's weekday.
 */
import {
  isTradingDay,
  newYorkDate,
  nyseCalendar,
  tradingDayOnOrBefore,
} from "./market-calendar.ts";

export type DayKind = "today" | "close" | "last-close";

export type DayState = {
  kind: DayKind;
  /** The regular session the figures belong to (New York date). */
  session: string;
  /** "Today", "Close", or "Last close · Fri". */
  label: string;
};

const OPEN_MINUTES = 9 * 60 + 30;

function newYorkMinutes(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

function weekday(date: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "short" }).format(
    new Date(`${date}T12:00:00Z`),
  );
}

function dayBefore(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function dayState(now: Date): DayState {
  const today = newYorkDate(now);
  const minutes = newYorkMinutes(now);
  if (isTradingDay(today) && minutes >= OPEN_MINUTES) {
    const close = nyseCalendar(Number(today.slice(0, 4))).earlyCloses.has(today)
      ? 13 * 60
      : 16 * 60;
    return minutes < close
      ? { kind: "today", session: today, label: "Today" }
      : { kind: "close", session: today, label: "Close" };
  }
  const session = tradingDayOnOrBefore(dayBefore(today));
  return { kind: "last-close", session, label: `Last close · ${weekday(session)}` };
}
