import { nyseCalendar } from "./market-calendar.ts";

export function formatPrice(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `$${n.toFixed(2)}`;
}

export function formatPct(n: number | null, digits = 2): string {
  if (n == null || !Number.isFinite(n)) return "—";
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

/**
 * Heat colour for a move. `scale` stretches the bands for longer periods so a
 * normal month isn't painted like an extreme day (1 for 1D).
 */
export function heatClass(rawPct: number | null, scale = 1): string {
  if (rawPct == null || Number.isNaN(rawPct)) return "heat-wait";
  const pct = rawPct / scale;
  if (pct >= 4) return "heat-up5";
  if (pct >= 2.5) return "heat-up4";
  if (pct >= 1.25) return "heat-up3";
  if (pct >= 0.4) return "heat-up2";
  if (pct > 0.05) return "heat-up1";
  if (pct >= -0.05) return "heat-flat";
  if (pct > -0.4) return "heat-dn1";
  if (pct > -1.25) return "heat-dn2";
  if (pct > -2.5) return "heat-dn3";
  if (pct > -4) return "heat-dn4";
  return "heat-dn5";
}

/** 1234.5 → "$1,234.50"; signed adds +/−. */
export function formatMoney(n: number, signed = false): string {
  if (!Number.isFinite(n)) return "—";
  const body = Math.abs(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
  if (signed) return `${n > 0 ? "+" : n < 0 ? "−" : ""}${body}`;
  return n < 0 ? `−${body}` : body;
}

/** Keep small fractional holdings visible instead of rounding them to zero. */
export function formatShares(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumSignificantDigits: 12 });
}

/** Percentage-point difference: +0.80 pts. */
export function formatPoints(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(2)} pts`;
}

/** 7807.13 → "7,807.13" */
export function formatLevel(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Today's date in New York as YYYY-MM-DD (the market's calendar day). */
export function todayNY(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(now);
}

/** "2026-10-03" → "Oct 3" (adds the year when it isn't this year). */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  const sameYear = iso.slice(0, 4) === todayNY().slice(0, 4);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}
