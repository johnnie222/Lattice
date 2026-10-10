import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, it } from "node:test";
import { createHistoryCache, normalizeBars, type HistoryBatch } from "./history-data.ts";
import {
  isTradingDay,
  latestSessionDate,
  periodAnchorDate,
  oneMonthEarlier,
  tradingDaysBefore,
} from "./market-calendar.ts";
import {
  historyStart,
  periodMove,
  periodQuotes,
  referenceClose,
  referenceDate,
} from "./periods.ts";
import type { Quote } from "./quote-data.ts";

describe("market calendar", () => {
  it("knows weekends and NYSE holidays", () => {
    assert.equal(isTradingDay("2026-10-07"), true); // Wed
    assert.equal(isTradingDay("2026-10-10"), false); // Sat
    assert.equal(isTradingDay("2026-09-07"), false); // Labor Day
    assert.equal(isTradingDay("2026-04-03"), false); // Good Friday
    assert.equal(isTradingDay("2027-12-31"), true); // Jan 1 2028 is a Saturday: not observed on Friday
  });

  it("finds the session the latest price belongs to", () => {
    assert.equal(latestSessionDate(new Date("2026-10-07T14:00:00Z")), "2026-10-07"); // Wed 10:00 ET
    assert.equal(latestSessionDate(new Date("2026-10-07T13:00:00Z")), "2026-10-07"); // Wed 09:00 ET, pre-market
    assert.equal(latestSessionDate(new Date("2026-10-07T23:00:00Z")), "2026-10-07"); // after the close
    assert.equal(latestSessionDate(new Date("2026-10-10T16:00:00Z")), "2026-10-09"); // Saturday
    assert.equal(latestSessionDate(new Date("2026-09-07T16:00:00Z")), "2026-09-04"); // Labor Day
  });

  it("clamps one month earlier to the month's end", () => {
    assert.equal(oneMonthEarlier("2026-10-07"), "2026-09-07");
    assert.equal(oneMonthEarlier("2026-03-31"), "2026-02-28");
    assert.equal(oneMonthEarlier("2028-03-30"), "2028-02-29");
    assert.equal(oneMonthEarlier("2026-01-15"), "2025-12-15");
  });

  it("counts trading sessions back across weekends and holidays", () => {
    assert.equal(tradingDaysBefore("2026-10-07", 5), "2026-09-30");
    // Christmas and New Year's Day fall inside the week.
    assert.equal(tradingDaysBefore("2026-01-05", 5), "2025-12-26");
    // Good Friday is skipped.
    assert.equal(tradingDaysBefore("2026-04-10", 5), "2026-04-02");
  });
});

describe("period reference dates", () => {
  it("1W is the close five sessions back", () => {
    assert.equal(referenceDate("1w", "2026-10-07"), "2026-09-30");
  });

  it("1M is the close on, or the trading day before, one calendar month earlier", () => {
    assert.equal(referenceDate("1m", "2026-10-14"), "2026-09-14"); // a plain Monday
    assert.equal(referenceDate("1m", "2026-10-07"), "2026-09-04"); // Sep 7 is Labor Day
    assert.equal(referenceDate("1m", "2026-03-31"), "2026-02-27"); // Feb 28 is a Saturday
    assert.equal(referenceDate("1m", "2028-03-30"), "2028-02-29"); // leap day, a Tuesday
  });

  it("YTD is the previous year's last regular session", () => {
    assert.equal(referenceDate("ytd", "2026-10-07"), "2025-12-31");
    assert.equal(referenceDate("ytd", "2024-01-10"), "2023-12-29"); // Dec 31 2023 is a Sunday
    assert.equal(referenceDate("ytd", "2028-03-01"), "2027-12-31");
  });

  it("covers every lookback from historyStart", () => {
    assert.equal(historyStart("2026-10-07"), "2025-12-31");
    assert.equal(historyStart("2026-01-05"), "2025-12-05"); // 1M reaches further back than YTD
  });
});

describe("reference closes", () => {
  const bars = normalizeBars([
    { date: "2025-12-31", close: 80 },
    { date: "2026-09-04", close: 95 },
    { date: "2026-09-29", close: 98 },
    { date: "2026-10-01", close: 99 },
  ]);

  it("uses the bar for exactly the reference date", () => {
    assert.deepEqual(referenceClose(bars, "ytd", "2026-10-07"), { date: "2025-12-31", close: 80 });
    assert.deepEqual(referenceClose(bars, "1m", "2026-10-07"), { date: "2026-09-04", close: 95 });
  });

  it("reports a missing bar instead of borrowing a neighbouring day", () => {
    // Sep 30 is missing; Sep 29 and Oct 1 exist but must not be used.
    assert.deepEqual(referenceClose(bars, "1w", "2026-10-07"), { date: "2026-09-30", close: null });
    assert.deepEqual(referenceClose([], "ytd", "2026-10-07"), { date: "2025-12-31", close: null });
  });
});

describe("periodQuotes", () => {
  const q = (symbol: string, price: number, previousClose: number | null): Quote => ({
    symbol,
    price,
    previousClose,
    change: previousClose != null ? price - previousClose : null,
    changePercent: previousClose != null ? (price / previousClose - 1) * 100 : null,
  });
  const quotes = { AAA: q("AAA", 110, 108), BBB: q("BBB", 50, 49) };

  it("passes 1D quotes through untouched", () => {
    assert.equal(periodQuotes(quotes, "1d", {}), quotes);
  });

  it("measures lookbacks against the reference close", () => {
    const out = periodQuotes(quotes, "ytd", { AAA: { date: "2025-12-31", close: 88 } });
    assert.equal(out.AAA!.changePercent, 25);
    assert.equal(out.AAA!.change, 22);
    assert.equal(out.AAA!.price, 110);
  });

  it("never turns a missing reference into a 0% move", () => {
    const out = periodQuotes(quotes, "1w", {
      AAA: { date: "2026-09-30", close: null },
    });
    assert.equal(out.AAA!.changePercent, null);
    assert.equal(out.AAA!.change, null);
    assert.equal(out.BBB!.changePercent, null); // no reference loaded yet
  });
});

describe("periodMove", () => {
  const quotes = (refs: Record<string, number | null>, prices: Record<string, number>) =>
    periodQuotes(
      Object.fromEntries(
        Object.entries(prices).map(([symbol, price]) => [
          symbol,
          { symbol, price, change: 0, changePercent: 0, previousClose: price } satisfies Quote,
        ]),
      ),
      "1w",
      Object.fromEntries(
        Object.entries(refs).map(([symbol, close]) => [symbol, { date: "2026-09-30", close }]),
      ),
    );
  const live = quotes({ A: 100, B: 50, C: null }, { A: 110, B: 45, C: 70 });

  it("price-weighted boards get a constituent basket move from reference closes", () => {
    const nodes = [
      { symbol: "A", weight: 1 },
      { symbol: "B", weight: 1 },
      { symbol: "C", weight: 1 },
    ];
    const move = periodMove(nodes, live, true);
    // (110 − 100 + 45 − 50) / (100 + 50)
    assert.ok(Math.abs(move.percent! - (5 / 150) * 100) < 1e-9);
    assert.deepEqual([move.covered, move.total], [2, 3]);
  });

  it("cap-weighted boards average the covered names and report coverage", () => {
    const nodes = [
      { symbol: "A", weight: 3 },
      { symbol: "B", weight: 1 },
      { symbol: "C", weight: 6 },
      { symbol: "D", weight: 0 },
    ];
    const move = periodMove(nodes, live, false);
    assert.ok(Math.abs(move.percent! - 5) < 1e-9);
    assert.deepEqual([move.covered, move.total], [2, 3]);
  });

  it("no references means no move, not 0%", () => {
    assert.deepEqual(periodMove([{ symbol: "C", weight: 1 }], live, false), {
      percent: null,
      covered: 0,
      total: 1,
    });
  });
});

describe("history data", () => {
  it("normalizes provider bars: valid, positive, sorted, one per date", () => {
    assert.deepEqual(
      normalizeBars([
        { date: "2026-10-02", close: 10 },
        { date: "2026-10-01", close: 9 },
        { date: "2026-10-02", close: 10.5 },
        { date: "2026-10-05", close: 0 },
        { date: "2026-10-06", close: Number.NaN },
        { date: "10/07/2026", close: 11 },
        { date: "2026-10-08", close: null },
      ]),
      [
        { date: "2026-10-01", close: 9 },
        { date: "2026-10-02", close: 10.5 },
      ],
    );
  });

  it("serves repeat requests for the same session from the shared cache", async () => {
    const calls: string[][] = [];
    const provider = {
      name: "fixture",
      async dailyCloses(symbols: readonly string[]): Promise<HistoryBatch> {
        calls.push([...symbols]);
        return {
          histories: symbols.map((symbol) => ({
            symbol,
            bars: [{ date: "2025-12-31", close: 1 }],
          })),
          unavailable: [],
        };
      },
    };
    const cache = createHistoryCache(provider);
    await cache.get(["AAA", "BBB"], "2025-12-31", "2026-10-07", 0);
    await cache.get(["AAA", "BBB", "CCC"], "2025-12-31", "2026-10-07", 1000);
    assert.deepEqual(calls, [["AAA", "BBB"], ["CCC"]]);
    // A new session, or an earlier start date, refetches.
    await cache.get(["AAA"], "2025-12-31", "2026-10-08", 2000);
    await cache.get(["BBB"], "2025-11-01", "2026-10-07", 3000);
    assert.deepEqual(calls.slice(2), [["AAA"], ["BBB"]]);
  });

  it("shares one upstream call between concurrent requests", async () => {
    let calls = 0;
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const cache = createHistoryCache({
      name: "fixture",
      async dailyCloses(symbols) {
        calls++;
        await gate;
        return { histories: symbols.map((symbol) => ({ symbol, bars: [] })), unavailable: [] };
      },
    });
    const a = cache.get(["AAA"], "2025-12-31", "2026-10-07", 0);
    const b = cache.get(["AAA"], "2025-12-31", "2026-10-07", 0);
    release();
    const [ra, rb] = await Promise.all([a, b]);
    assert.equal(calls, 1);
    assert.deepEqual(ra.bars.get("AAA"), []);
    assert.deepEqual(rb.bars.get("AAA"), []);
  });

  it("keeps outages apart from missing history and retries them later", async () => {
    const calls: string[][] = [];
    let down = true;
    const cache = createHistoryCache(
      {
        name: "fixture",
        async dailyCloses(symbols) {
          calls.push([...symbols]);
          if (down) throw new Error("upstream 503");
          // The provider answers but has nothing for ZZZ.
          return {
            histories: symbols
              .filter((symbol) => symbol !== "ZZZ")
              .map((symbol) => ({ symbol, bars: [{ date: "2025-12-31", close: 2 }] })),
            unavailable: [],
          };
        },
      },
      6 * 60 * 60 * 1000,
      60_000,
    );
    const first = await cache.get(["AAA", "ZZZ"], "2025-12-31", "2026-10-07", 0);
    assert.deepEqual(first.unavailable, ["AAA", "ZZZ"]);
    assert.equal(first.bars.size, 0);
    // Inside the retry window nothing goes upstream.
    down = false;
    await cache.get(["AAA"], "2025-12-31", "2026-10-07", 30_000);
    assert.equal(calls.length, 1);
    const later = await cache.get(["AAA", "ZZZ"], "2025-12-31", "2026-10-07", 61_000);
    assert.deepEqual(later.unavailable, []);
    assert.deepEqual(later.bars.get("AAA"), [{ date: "2025-12-31", close: 2 }]);
    // No history at all is cached as empty: a missing reference, not an outage.
    assert.deepEqual(later.bars.get("ZZZ"), []);
    await cache.get(["ZZZ"], "2025-12-31", "2026-10-07", 62_000);
    assert.equal(calls.length, 2);
  });
});

describe("lookback boundaries", () => {
  it("uses today's anchor for premarket current prices, including first session of a year", () => {
    const anchor = latestSessionDate(new Date("2026-01-02T13:00:00Z"));
    assert.equal(anchor, "2026-01-02");
    assert.equal(referenceDate("ytd", anchor), "2025-12-31");
    assert.equal(referenceDate("1w", anchor), "2025-12-24");
    assert.equal(referenceDate("1m", anchor), "2025-12-02");
  });
  it("YTD uses the current calendar year on New Year holidays and weekends", () => {
    for (const instant of [
      "2026-01-01T16:00:00Z",
      "2028-01-01T16:00:00Z",
      "2028-01-02T16:00:00Z",
    ]) {
      const anchor = periodAnchorDate(new Date(instant), "ytd");
      assert.equal(
        referenceDate("ytd", anchor),
        instant.startsWith("2026") ? "2025-12-31" : "2027-12-31",
      );
    }
  });
  it("skips the announced 2025 national day of mourning", () => {
    assert.equal(isTradingDay("2025-01-09"), false);
    assert.equal(referenceDate("1w", "2025-01-16"), "2025-01-08");
  });
  it("has identical anchors and references in different host timezones", () => {
    const cases = [
      ["2026-10-07T07:59:59Z", "2026-10-06", "2026-09-29"],
      ["2026-10-07T08:00:00Z", "2026-10-07", "2026-09-30"],
      ["2026-03-09T07:59:59Z", "2026-03-06", "2026-02-27"],
      ["2026-03-09T08:00:00Z", "2026-03-09", "2026-03-02"],
      ["2026-11-02T08:59:59Z", "2026-10-30", "2026-10-23"],
      ["2026-11-02T09:00:00Z", "2026-11-02", "2026-10-26"],
      ["2026-03-06T14:29:59Z", "2026-03-06", "2026-02-27"],
      ["2026-03-09T13:29:59Z", "2026-03-09", "2026-03-02"],
      ["2026-03-09T13:30:00Z", "2026-03-09", "2026-03-02"],
      ["2026-11-02T14:29:59Z", "2026-11-02", "2026-10-26"],
      ["2026-11-27T18:00:00Z", "2026-11-27", "2026-11-19"],
      ["2026-03-31T23:00:00Z", "2026-03-31", "2026-03-24"],
      ["2026-04-01T02:00:00Z", "2026-03-31", "2026-03-24"],
      ["2026-04-03T16:00:00Z", "2026-04-02", "2026-03-26"],
      ["2026-10-11T16:00:00Z", "2026-10-09", "2026-10-02"],
    ];
    const code = `import assert from 'node:assert/strict';
      import {latestSessionDate} from './src/lib/market-calendar.ts';
      import {referenceDate} from './src/lib/periods.ts';
      for (const [instant, expected, ref] of ${JSON.stringify(cases)}) {
        const anchor = latestSessionDate(new Date(instant));
        assert.equal(anchor, expected, instant);
        assert.equal(referenceDate('1w', anchor), ref, instant);
      }`;
    for (const TZ of ["UTC", "Asia/Jerusalem", "America/Los_Angeles"])
      execFileSync(
        process.execPath,
        ["--experimental-strip-types", "--input-type=module", "-e", code],
        { env: { ...process.env, TZ } },
      );
  });
});
