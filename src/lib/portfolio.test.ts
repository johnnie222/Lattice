import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Book, Position } from "./book-model.ts";
import { periodQuotes } from "./periods.ts";
import {
  analyzeBook,
  bookTileWeights,
  holdingsLookback,
  sinceEntryRows,
  sizeBook,
} from "./portfolio.ts";
import type { Quote } from "./quote-data.ts";

const quote = (symbol: string, previousClose: number, price: number): Quote => ({
  symbol,
  price,
  previousClose,
  change: price - previousClose,
  changePercent: (price / previousClose - 1) * 100,
});

const shares = (symbol: string, n: number, entry: number | null = null): Position => ({
  symbol,
  kind: "shares",
  shares: n,
  entry,
  since: null,
  added: "2026-09-01",
  anchor: null,
});

const percent = (symbol: string, pct: number, anchor: number | null): Position => ({
  symbol,
  kind: "percent",
  percent: pct,
  added: "2026-09-01",
  anchor,
});

const book = (positions: Position[]): Book => ({ id: "main", name: "Main", positions });

const close = (a: number | null | undefined, b: number) =>
  assert.ok(a != null && Math.abs(a - b) < 1e-9, `${a} ≈ ${b}`);

const QUOTES: Record<string, Quote> = {
  AAPL: quote("AAPL", 100, 110),
  XOM: quote("XOM", 200, 180),
  JPM: quote("JPM", 200, 202),
  "^GSPC": quote("^GSPC", 4000, 4040),
};

describe("share books go through analyzeHoldings", () => {
  const holdings = book([shares("AAPL", 2.5, 80), shares("XOM", 0.75, 150), shares("JPM", 1)]);

  it("daily P&L, return and vs S&P 500 when every holding is priced", () => {
    const result = analyzeBook(holdings, QUOTES);
    assert.equal(result.kind, "holdings");
    if (result.kind !== "holdings") return;
    close(result.analysis.dayChange, 25 - 15 + 2);
    close(result.analysis.returnPercent, (12 / 600) * 100);
    close(result.analysis.relativeReturnPercent, 2 - 1);
  });

  it("partial coverage keeps known dollars but no return", () => {
    const { JPM: _missing, ...rest } = QUOTES;
    const result = analyzeBook(holdings, rest);
    if (result.kind !== "holdings") return assert.fail();
    assert.equal(result.analysis.complete, false);
    close(result.analysis.dayChange, 10);
    assert.equal(result.analysis.returnPercent, null);
    assert.equal(result.analysis.relativeReturnPercent, null);
    assert.deepEqual(result.analysis.coverage.missing, ["JPM"]);
  });
});

describe("percent books go through analyzePortfolio at previous-close weights", () => {
  // 60% of AAPL added at $100 and 40% of MSFT added at $200.
  const pct = book([percent("AAPL", 60, 100), percent("MSFT", 40, 200)]);
  const quotes = { AAPL: quote("AAPL", 110, 121), MSFT: quote("MSFT", 180, 180) };

  it("today's return equals the same book held as units", () => {
    const result = analyzeBook(pct, quotes);
    assert.equal(result.kind, "weights");
    if (result.kind !== "weights") return;
    // 0.6 AAPL units and 0.2 MSFT units: (0.6 × 11) / (0.6 × 110 + 0.2 × 180).
    close(result.analysis.returnPercent, (6.6 / 102) * 100);
    assert.equal(result.analysis.dollarChange, null);
    assert.equal(result.mixed, false);
  });

  it("a missing quote means no full return", () => {
    const result = analyzeBook(pct, { AAPL: quotes.AAPL });
    if (result.kind !== "weights") return assert.fail();
    assert.equal(result.analysis.complete, false);
    assert.equal(result.analysis.returnPercent, null);
    assert.ok(result.analysis.knownContributionPercent != null);
  });

  it("a position not yet anchored starts at its percentage", () => {
    const result = analyzeBook(
      book([percent("AAPL", 50, null), percent("MSFT", 50, null)]),
      quotes,
    );
    if (result.kind !== "weights") return assert.fail();
    close(result.analysis.returnPercent, 0.5 * 10 + 0.5 * 0);
  });
});

describe("mixed books (older APK data)", () => {
  it("read percent positions as a share of the total, and never complete without every price", () => {
    const mixed = book([shares("AAPL", 10), percent("MSFT", 50, 200)]);
    const sized = sizeBook(mixed, (s) => ({ AAPL: 100, MSFT: 200 })[s] ?? null);
    assert.equal(sized.mixed, true);
    // $1,000 of AAPL is the other 50%.
    assert.deepEqual(
      sized.rows.map((row) => [row.symbol, row.share]),
      [
        ["AAPL", 0.5],
        ["MSFT", 0.5],
      ],
    );
    const unpriced = analyzeBook(book([shares("ZZZ", 1), percent("MSFT", 50, 200)]), {
      MSFT: quote("MSFT", 200, 210),
    });
    if (unpriced.kind !== "weights") return assert.fail();
    assert.equal(unpriced.analysis.complete, false);
    assert.equal(unpriced.analysis.returnPercent, null);
  });
});

describe("tile sizes", () => {
  it("priced value, else cost, else the median priced value", () => {
    const holdings = book([
      shares("AAPL", 2, 50),
      shares("XOM", 1),
      shares("NEW", 4, 10),
      shares("ODD", 1),
    ]);
    const quotes = { AAPL: QUOTES.AAPL!, XOM: QUOTES.XOM! };
    const weights = bookTileWeights(holdings, analyzeBook(holdings, quotes), quotes);
    assert.equal(weights.get("AAPL"), 220);
    assert.equal(weights.get("XOM"), 180);
    assert.equal(weights.get("NEW"), 40);
    assert.equal(weights.get("ODD"), 220);
  });
});

describe("current-holdings lookback", () => {
  const references = {
    AAPL: { date: "2026-09-30", close: 105 },
    XOM: { date: "2026-09-30", close: 200 },
    JPM: { date: "2026-09-30", close: null },
  };

  it("weights each holding by quantity × reference close", () => {
    const holdings = book([shares("AAPL", 2.5), shares("XOM", 0.75)]);
    const display = periodQuotes(QUOTES, "1w", references);
    const move = holdingsLookback(holdings, display);
    // (2.5 × (110 − 105) + 0.75 × (180 − 200)) / (2.5 × 105 + 0.75 × 200)
    close(move!.percent, ((12.5 - 15) / (262.5 + 150)) * 100);
    assert.deepEqual([move!.covered, move!.total], [2, 2]);
  });

  it("a holding without a reference close leaves it partial", () => {
    const move = holdingsLookback(
      book([shares("AAPL", 2.5), shares("JPM", 1)]),
      periodQuotes(QUOTES, "1w", references),
    );
    assert.deepEqual([move!.covered, move!.total], [1, 2]);
  });

  it("percent positions count as percent / anchor units; unanchored ones can't be sized", () => {
    const display = periodQuotes(QUOTES, "1w", references);
    const anchored = holdingsLookback(
      book([percent("AAPL", 50, 100), percent("XOM", 50, 200)]),
      display,
    );
    // 0.5 AAPL units and 0.25 XOM units.
    close(anchored!.percent, ((0.5 * 5 + 0.25 * -20) / (0.5 * 105 + 0.25 * 200)) * 100);
    const unanchored = holdingsLookback(
      book([percent("AAPL", 50, null), percent("XOM", 50, 200)]),
      display,
    );
    assert.deepEqual([unanchored!.covered, unanchored!.total], [1, 2]);
    assert.equal(
      holdingsLookback(book([shares("AAPL", 1), percent("XOM", 50, 200)]), display),
      null,
    );
  });
});

describe("since entry", () => {
  it("from average cost for shares, from the price when added for percent positions", () => {
    const rows = sinceEntryRows(
      book([shares("AAPL", 2, 80), shares("JPM", 1), percent("XOM", 10, 160)]),
      QUOTES,
    );
    assert.deepEqual(rows.get("AAPL"), { percent: 37.5, change: 60, basis: "cost" });
    assert.equal(rows.has("JPM"), false);
    assert.deepEqual(rows.get("XOM"), { percent: 12.5, change: null, basis: "added" });
  });
});
