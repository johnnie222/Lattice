/**
 * NYSE trading calendar: rule-based full holidays and early closes, plus the
 * trading-session arithmetic the period lookbacks need. Pure, no imports.
 *
 * Unscheduled closures (e.g. national days of mourning) aren't predictable by
 * rule. Lookups that land on one find no close in the price history and are
 * reported as missing rather than silently moved to another day.
 */

const DAY_MS = 86_400_000;

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function utc(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m, d));
}

// nth weekday (0 = Sun) of a month; n = -1 for the last one.
function nthWeekday(y: number, m: number, weekday: number, n: number): Date {
  if (n < 0) {
    const last = utc(y, m + 1, 0);
    return utc(y, m, last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7));
  }
  const first = utc(y, m, 1);
  return utc(y, m, 1 + ((weekday - first.getUTCDay() + 7) % 7) + (n - 1) * 7);
}

// Anonymous Gregorian algorithm.
function easter(y: number): Date {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return utc(y, month - 1, day);
}

// Saturday holidays move to Friday, Sunday ones to Monday.
function observed(d: Date): Date {
  const wd = d.getUTCDay();
  if (wd === 6) return new Date(d.getTime() - DAY_MS);
  if (wd === 0) return new Date(d.getTime() + DAY_MS);
  return d;
}

type YearCalendar = { holidays: Set<string>; earlyCloses: Set<string> };
const calendars = new Map<number, YearCalendar>();

/** NYSE full holidays and 1pm early closes for a year. */
export function nyseCalendar(y: number): YearCalendar {
  const hit = calendars.get(y);
  if (hit) return hit;
  const holidays = new Set<string>();
  if (y === 2025) holidays.add("2025-01-09"); // Carter national day of mourning
  // NYSE does not observe New Year's on the prior Friday when Jan 1 is a Saturday.
  const newYear = utc(y, 0, 1);
  if (newYear.getUTCDay() !== 6) holidays.add(ymd(observed(newYear)));
  holidays.add(ymd(nthWeekday(y, 0, 1, 3))); // MLK Day
  holidays.add(ymd(nthWeekday(y, 1, 1, 3))); // Presidents Day
  holidays.add(ymd(new Date(easter(y).getTime() - 2 * DAY_MS))); // Good Friday
  holidays.add(ymd(nthWeekday(y, 4, 1, -1))); // Memorial Day
  if (y >= 2022) holidays.add(ymd(observed(utc(y, 5, 19)))); // Juneteenth
  holidays.add(ymd(observed(utc(y, 6, 4)))); // Independence Day
  holidays.add(ymd(nthWeekday(y, 8, 1, 1))); // Labor Day
  const thanksgiving = nthWeekday(y, 10, 4, 4);
  holidays.add(ymd(thanksgiving));
  holidays.add(ymd(observed(utc(y, 11, 25)))); // Christmas

  const earlyCloses = new Set<string>();
  const july3 = utc(y, 6, 3);
  if (july3.getUTCDay() >= 1 && july3.getUTCDay() <= 4) earlyCloses.add(ymd(july3));
  earlyCloses.add(ymd(new Date(thanksgiving.getTime() + DAY_MS)));
  const xmasEve = utc(y, 11, 24);
  if (xmasEve.getUTCDay() >= 1 && xmasEve.getUTCDay() <= 4) earlyCloses.add(ymd(xmasEve));

  const cal = { holidays, earlyCloses };
  calendars.set(y, cal);
  return cal;
}

/** "2026-10-07" → Date at 00:00 UTC. */
function parse(date: string): Date {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return utc(y, m - 1, d);
}

function addDays(date: string, days: number): string {
  return ymd(new Date(parse(date).getTime() + days * DAY_MS));
}

/** A weekday that isn't a full NYSE holiday. */
export function isTradingDay(date: string): boolean {
  const wd = parse(date).getUTCDay();
  if (wd === 0 || wd === 6) return false;
  return !nyseCalendar(Number(date.slice(0, 4))).holidays.has(date);
}

/** The trading day on, or the closest one before, `date`. */
export function tradingDayOnOrBefore(date: string): string {
  let day = date;
  while (!isTradingDay(day)) day = addDays(day, -1);
  return day;
}

/** The trading day `sessions` sessions before `date` (date itself excluded). */
export function tradingDaysBefore(date: string, sessions: number): string {
  let day = date;
  for (let i = 0; i < sessions; i++) day = tradingDayOnOrBefore(addDays(day, -1));
  return day;
}

/**
 * Same day one calendar month earlier, clamped to the month's end
 * (Mar 31 → Feb 28/29).
 */
export function oneMonthEarlier(date: string): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const lastDay = new Date(Date.UTC(y, m - 1, 0)).getUTCDate();
  return ymd(utc(y, m - 2, Math.min(d, lastDay)));
}

/** New York calendar date of an instant: "YYYY-MM-DD". */
export function newYorkDate(at: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(at);
}

/**
 * Lookback session anchor for latest prices, including premarket prices.
 * Premarket starts at 4am ET. Before then, the latest price belongs to the
 * previous session; weekends and holidays also use the most recent session.
 */
export function latestSessionDate(now: Date): string {
  const date = newYorkDate(now);
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );
  return tradingDayOnOrBefore(hour >= 4 ? date : addDays(date, -1));
}

/** YTD follows the calendar year even during a New Year market closure. */
export function periodAnchorDate(now: Date, period: string): string {
  return period === "ytd" ? newYorkDate(now) : latestSessionDate(now);
}

/** Reject impossible dates before using calendar arithmetic. */
export function isCalendarDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const value = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === date;
}
