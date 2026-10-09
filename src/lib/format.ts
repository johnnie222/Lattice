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

export type Session = "pre" | "open" | "post" | "closed";

export function marketClock(now = new Date()): { label: string; session: Session } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
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
  const mins = hour * 60 + minute;
  const weekend = weekday === "Sat" || weekday === "Sun";
  let session: Session = "closed";
  if (!weekend) {
    if (mins >= 4 * 60 && mins < 9 * 60 + 30) session = "pre";
    else if (mins >= 9 * 60 + 30 && mins < 16 * 60) session = "open";
    else if (mins >= 16 * 60 && mins < 20 * 60) session = "post";
  }
  return { label: `${hh}:${mm}:${second}`, session };
}

export function sessionLabel(session: Session): string {
  if (session === "open") return "Open";
  if (session === "pre") return "Pre";
  if (session === "post") return "After";
  return "Closed";
}

export function heatClass(pct: number | null): string {
  if (pct == null || Number.isNaN(pct)) return "bg-heat-wait";
  if (pct >= 4) return "bg-heat-up5";
  if (pct >= 2.5) return "bg-heat-up4";
  if (pct >= 1.25) return "bg-heat-up3";
  if (pct >= 0.4) return "bg-heat-up2";
  if (pct > 0.05) return "bg-heat-up1";
  if (pct >= -0.05) return "bg-heat-flat";
  if (pct > -0.4) return "bg-heat-dn1";
  if (pct > -1.25) return "bg-heat-dn2";
  if (pct > -2.5) return "bg-heat-dn3";
  if (pct > -4) return "bg-heat-dn4";
  return "bg-heat-dn5";
}
