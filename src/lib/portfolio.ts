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
  /** Fraction of the whole portfolio, 0–1. */
  share: number;
};

export type Valuation = {
  holdings: Holding[];
  /** Total in dollars, or null for a percent-only portfolio. */
  total: number | null;
  /** Percent positions add up to 100% or more alongside share positions. */
  overflow: boolean;
};

/**
 * Share positions are worth shares × price (entry price until a quote
 * arrives). Percent positions are a share of the whole, so with $D in shares
 * and P% in percent positions the total is D / (1 − P/100).
 */
export function valueBook(book: Book, quotes: Record<string, Quote>): Valuation {
  let dollars = 0;
  let percent = 0;
  for (const p of book.positions) {
    if (p.kind === "shares") {
      const price = quotes[p.symbol]?.price ?? p.entry;
      if (price) dollars += p.shares * price;
    } else {
      percent += p.percent;
    }
  }
  const overflow = dollars > 0 && percent >= 100;
  const total = dollars > 0 ? (overflow ? dollars : dollars / (1 - percent / 100)) : null;

  const holdings = book.positions.map((p): Holding => {
    const price = quotes[p.symbol]?.price ?? null;
    if (p.kind === "shares") {
      const unit = price ?? p.entry;
      const value = unit ? p.shares * unit : null;
      return { position: p, symbol: p.symbol, price, value, weight: value ?? 0, share: 0 };
    }
    const value = total != null && !overflow ? (p.percent / 100) * total : null;
    return { position: p, symbol: p.symbol, price, value, weight: value ?? p.percent, share: 0 };
  });
  const sum = holdings.reduce((acc, h) => acc + h.weight, 0);
  for (const h of holdings) h.share = sum > 0 ? h.weight / sum : 0;
  holdings.sort((a, b) => b.weight - a.weight);
  return { holdings, total, overflow };
}

export type PortfolioPeriod = "1d" | "1w" | "1m" | "ytd" | "1y" | "5y" | "all";

export type Change = { pct: number | null; dollars: number | null };

/**
 * Change per holding and for the whole portfolio over a period.
 * "all" is since purchase and needs an entry price; other periods assume the
 * holdings were the same through the whole window.
 */
export function periodChange(
  valuation: Valuation,
  quotes: Record<string, Quote>,
  period: PortfolioPeriod,
): { total: Change; rows: Map<string, Change> } {
  const rows = new Map<string, Change>();
  let now = 0;
  let then = 0;
  let money = 0;
  let anyMoney = false;

  for (const h of valuation.holdings) {
    if (period === "all") {
      const p = h.position;
      if (p.kind !== "shares" || p.entry == null || h.price == null) {
        rows.set(h.symbol, { pct: null, dollars: null });
        continue;
      }
      const cost = p.shares * p.entry;
      const gain = p.shares * h.price - cost;
      rows.set(h.symbol, { pct: (gain / cost) * 100, dollars: gain });
      now += cost + gain;
      then += cost;
      money += gain;
      anyMoney = true;
      continue;
    }
    const q = quotes[h.symbol];
    if (!q || h.weight <= 0) {
      rows.set(h.symbol, { pct: null, dollars: null });
      continue;
    }
    const base = h.value ?? h.weight;
    const before = base / (1 + q.changePercent / 100);
    const dollars = h.value != null ? h.value - before : null;
    rows.set(h.symbol, { pct: q.changePercent, dollars });
    now += base;
    then += before;
    if (dollars != null) {
      money += dollars;
      anyMoney = true;
    }
  }

  return {
    total: {
      pct: then > 0 ? (now / then - 1) * 100 : null,
      dollars: anyMoney && valuation.total != null ? money : period === "all" && anyMoney ? money : null,
    },
    rows,
  };
}
