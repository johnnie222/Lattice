import { todayNY } from "@/lib/format";
import type { Quote } from "@/lib/quote-core";
import type { Book, Position } from "@/store/books";

export type Holding = {
  position: Position;
  symbol: string;
  price: number | null;
  /** Dollar value, when it can be known. */
  value: number | null;
  /** Relative size, used for the map and for weighting returns. */
  weight: number;
  /** Fraction of the whole portfolio now, 0–1. */
  share: number;
};

export type Valuation = {
  holdings: Holding[];
  /** Total in dollars, or null for a percent portfolio. */
  total: number | null;
  /** Holds both share and percent positions (only possible in older data). */
  mixed: boolean;
  /** Mixed, and the percent positions add up to 100% or more. */
  overflow: boolean;
};

/** How far a percent position's price has moved since it was added. */
function drift(p: Position, price: number | null): number {
  return p.anchor && price ? price / p.anchor : 1;
}

/**
 * Share positions are worth shares × price (cost until a quote arrives).
 * A percent position starts at its percentage and then moves with its price,
 * like a real holding: 25% of AAPL that rises 20% while the rest is flat
 * becomes ~28.6% of the portfolio.
 */
export function valueBook(book: Book, quotes: Record<string, Quote>): Valuation {
  const hasShares = book.positions.some((p) => p.kind === "shares");
  const hasPercent = book.positions.some((p) => p.kind === "percent");
  const mixed = hasShares && hasPercent;

  let dollars = 0;
  let percent = 0;
  for (const p of book.positions) {
    const price = quotes[p.symbol]?.price ?? null;
    if (p.kind === "shares") {
      const unit = price ?? p.entry ?? p.anchor;
      if (unit) dollars += p.shares * unit;
    } else {
      percent += p.percent * drift(p, price);
    }
  }
  // Older mixed portfolios: percent positions are a share of the total.
  const overflow = mixed && percent >= 100;
  const total = dollars > 0 ? (mixed && !overflow ? dollars / (1 - percent / 100) : dollars) : null;

  const holdings = book.positions.map((p): Holding => {
    const price = quotes[p.symbol]?.price ?? null;
    if (p.kind === "shares") {
      const unit = price ?? p.entry ?? p.anchor;
      const value = unit ? p.shares * unit : null;
      return { position: p, symbol: p.symbol, price, value, weight: value ?? 0, share: 0 };
    }
    const weight = p.percent * drift(p, price);
    const value = mixed && total != null && !overflow ? (weight / 100) * total : null;
    return { position: p, symbol: p.symbol, price, value, weight: value ?? weight, share: 0 };
  });
  const sum = holdings.reduce((acc, h) => acc + h.weight, 0);
  for (const h of holdings) h.share = sum > 0 ? h.weight / sum : 0;
  holdings.sort((a, b) => b.weight - a.weight);
  return { holdings, total, mixed, overflow };
}

export type PortfolioPeriod = "1d" | "1w" | "1m" | "ytd" | "1y" | "5y" | "all";

export type Change = {
  pct: number | null;
  dollars: number | null;
  /** True when the position was bought inside the window, so it counts from purchase. */
  sincePurchase?: boolean;
};

/** First day of a window, as a New York date. */
export function windowStart(period: Exclude<PortfolioPeriod, "all">, today = todayNY()): string {
  const [y, m, d] = today.split("-").map(Number) as [number, number, number];
  const at = (yy: number, mm: number, dd: number) => {
    const date = new Date(Date.UTC(yy, mm - 1, dd));
    return date.toISOString().slice(0, 10);
  };
  switch (period) {
    case "1d":
      return today;
    case "1w":
      return at(y, m, d - 7);
    case "1m":
      return at(y, m - 1, d);
    case "ytd":
      return at(y, 1, 1);
    case "1y":
      return at(y - 1, m, d);
    case "5y":
      return at(y - 5, m, d);
  }
}

/** The price a position's own return counts from, when known. */
function basePrice(p: Position): number | null {
  if (p.kind === "shares") return p.entry ?? p.anchor;
  return p.anchor;
}

/**
 * Change per holding and for the whole portfolio over a period.
 *
 * - "all" is since purchase (average cost, or the price when added).
 * - For a window, a share position with a purchase date inside the window
 *   counts from its purchase price; everything else uses the market's move
 *   over the window, i.e. it assumes the holding was there the whole time.
 */
export function periodChange(
  valuation: Valuation,
  quotes: Record<string, Quote>,
  period: PortfolioPeriod,
  today = todayNY(),
): { total: Change; rows: Map<string, Change> } {
  const rows = new Map<string, Change>();
  const start = period === "all" ? null : windowStart(period, today);
  let now = 0;
  let then = 0;
  let money = 0;
  let anyMoney = false;

  for (const h of valuation.holdings) {
    const p = h.position;
    const base = basePrice(p);
    let r: number | null = null;
    let sincePurchase = false;

    if (period === "all") {
      if (base && h.price) r = h.price / base - 1;
    } else {
      const bought = p.kind === "shares" ? p.since : null;
      const insideWindow = bought != null && start != null && (period === "1d" ? bought >= start : bought > start);
      if (insideWindow && base && h.price) {
        r = h.price / base - 1;
        sincePurchase = true;
      } else {
        const q = quotes[h.symbol];
        if (q) r = q.changePercent / 100;
      }
    }

    if (r == null || h.weight <= 0) {
      rows.set(h.symbol, { pct: null, dollars: null });
      continue;
    }
    const size = h.value ?? h.weight;
    const before = size / (1 + r);
    const dollars = h.value != null ? h.value - before : null;
    rows.set(h.symbol, { pct: r * 100, dollars, sincePurchase });
    now += size;
    then += before;
    if (dollars != null) {
      money += dollars;
      anyMoney = true;
    }
  }

  return {
    total: { pct: then > 0 ? (now / then - 1) * 100 : null, dollars: anyMoney ? money : null },
    rows,
  };
}
