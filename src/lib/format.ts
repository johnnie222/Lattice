export function formatPrice(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `$${n.toFixed(2)}`;
}

export function formatPct(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}%`;
}

export function formatCap(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
}

export type Session = "pre" | "open" | "post" | "closed" | "holiday";

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
function nyseCalendar(y: number): YearCalendar {
  const hit = calendars.get(y);
  if (hit) return hit;
  const holidays = new Set<string>();
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

export function marketClock(now = new Date()): { label: string; session: Session } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday");
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const second = get("second");
  const hh = get("hour");
  const mm = get("minute");
  const year = Number(get("year"));
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const mins = hour * 60 + minute;
  const weekend = weekday === "Sat" || weekday === "Sun";
  const cal = nyseCalendar(year);
  const close = cal.earlyCloses.has(date) ? 13 * 60 : 16 * 60;
  const postEnd = cal.earlyCloses.has(date) ? 17 * 60 : 20 * 60;
  let session: Session = "closed";
  if (!weekend && cal.holidays.has(date)) session = "holiday";
  else if (!weekend) {
    if (mins >= 4 * 60 && mins < 9 * 60 + 30) session = "pre";
    else if (mins >= 9 * 60 + 30 && mins < close) session = "open";
    else if (mins >= close && mins < postEnd) session = "post";
  }
  return { label: `${hh}:${mm}:${second}`, session };
}

export function sessionLabel(session: Session): string {
  if (session === "open") return "Open";
  if (session === "pre") return "Pre";
  if (session === "post") return "After";
  if (session === "holiday") return "Holiday";
  return "Closed";
}

/** "10:08" in New York time, or "Oct 9 16:00" when not today. */
export function formatAsOf(at: number, now = Date.now()): string {
  const tz = "America/New_York";
  const day = (t: number) => new Intl.DateTimeFormat("en-US", { timeZone: tz, dateStyle: "short" }).format(t);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(at);
  if (day(at) === day(now)) return time;
  const date = new Intl.DateTimeFormat("en-US", { timeZone: tz, month: "short", day: "numeric" }).format(at);
  return `${date} ${time}`;
}

// A month moves far more than a day; stretch the scale so 1W/1M aren't all
// fully saturated. Roughly sqrt(trading days), rounded.
const HEAT_SCALE = { "1d": 1, "1w": 2, "1m": 4, ytd: 7, "1y": 8, "5y": 16 } as const;

export function heatClass(pct: number | null, period: keyof typeof HEAT_SCALE = "1d"): string {
  if (pct == null || Number.isNaN(pct)) return "heat-wait";
  const k = HEAT_SCALE[period];
  const v = pct / k;
  if (v >= 4) return "heat-up5";
  if (v >= 2.5) return "heat-up4";
  if (v >= 1.25) return "heat-up3";
  if (v >= 0.4) return "heat-up2";
  if (v > 0.05) return "heat-up1";
  if (v >= -0.05) return "heat-flat";
  if (v > -0.4) return "heat-dn1";
  if (v > -1.25) return "heat-dn2";
  if (v > -2.5) return "heat-dn3";
  if (v > -4) return "heat-dn4";
  return "heat-dn5";
}

/** 7807.13 → "7,807.13" */
export function formatLevel(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** 1234.5 → "$1,234.50"; signed adds +/−. */
export function formatMoney(n: number, signed = false): string {
  if (!Number.isFinite(n)) return "—";
  const body = Math.abs(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
  if (!signed) return n < 0 ? `-${body}` : body;
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${body}`;
}
