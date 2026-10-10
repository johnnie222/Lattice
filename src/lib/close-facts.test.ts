import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCloseFacts } from "./close-facts.ts";
import { SECTOR_FUNDS, marketFacts } from "./market-facts.ts";
import { analyzeHoldings, type HoldingQuote } from "./portfolio-intelligence.ts";

const q = (price: number, previousClose: number | null): HoldingQuote => ({ price, previousClose });
const sectors = { AAPL: "tech", NVDA: "tech", MSFT: "tech", JPM: "financials", XOM: "energy" };
const holdings = [
  { symbol: "AAPL", quantity: 25 },
  { symbol: "NVDA", quantity: 40.5 },
  { symbol: "MSFT", quantity: 10 },
  { symbol: "JPM", quantity: 15 },
  { symbol: "XOM", quantity: 20 },
];
const fullQuotes = {
  AAPL: q(200, 198), // +$50
  NVDA: q(130, 127), // +$121.50
  MSFT: q(450, 455), // −$50
  JPM: q(250, 248), // +$30
  XOM: q(110, 111), // −$20
};
// S&P 500 +0.54%; every sector fund up except energy (10 of 11: a broad advance).
const market = marketFacts({
  "^GSPC": { changePercent: 0.54 },
  ...Object.fromEntries(
    SECTOR_FUNDS.map((fund) => [
      fund.symbol,
      { changePercent: fund.sector === "energy" ? -0.9 : 0.6 },
    ]),
  ),
});

function close(actual: number | null | undefined, expected: number) {
  assert.ok(actual != null && Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
}

describe("buildCloseFacts", () => {
  it("summarises a fully priced book from the engine's own figures", () => {
    const analysis = analyzeHoldings({
      holdings,
      quotes: fullQuotes,
      sectorBySymbol: sectors,
      benchmarkReturnPercent: 0.54,
    });
    const facts = buildCloseFacts(analysis, market);
    const p = facts.portfolio!;

    assert.equal(p.complete, true);
    close(p.dayChange, 131.5);
    close(p.returnPercent, analysis.returnPercent!);
    close(p.relativeReturnPercent, analysis.relativeReturnPercent!);
    // Drivers are the engine's lists, truncated to three, in the same order.
    assert.deepEqual(
      p.contributors.map((m) => m.symbol),
      analysis.contributors.slice(0, 3).map((m) => m.symbol),
    );
    assert.deepEqual(
      p.detractors.map((m) => m.symbol),
      ["MSFT", "XOM"],
    );
    for (const m of [...p.contributors, ...p.detractors]) {
      const row = analysis.positions.find((r) => r.symbol === m.symbol)!;
      assert.equal(m.dayChange, row.dayChange);
      assert.equal(m.contributionPercent, row.contributionPercent);
    }
    // Strongest/weakest are the engine's first/last sector; their totals match it.
    assert.equal(p.strongestSector?.sector, "tech");
    close(p.strongestSector?.dayChange, 121.5);
    assert.equal(p.weakestSector?.sector, "energy");
    close(p.weakestSector?.dayChange, -20);
    assert.deepEqual(p.breadth, analysis.breadth);
    assert.deepEqual(facts.summary, [
      "Your portfolio returned +0.64%, 0.10 pts ahead of the S&P 500.",
      "NVDA was the largest contributor; 3 up · 2 down · 0 flat among 5 priced holdings.",
    ]);
    assert.equal(facts.market.dayType, "broad-advance");
  });

  it("shows only known dollar P&L when a holding is unpriced, and never a return or benchmark", () => {
    const { XOM: _missing, ...partialQuotes } = fullQuotes;
    const analysis = analyzeHoldings({
      holdings,
      quotes: partialQuotes,
      sectorBySymbol: sectors,
      benchmarkReturnPercent: 0.54,
    });
    const facts = buildCloseFacts(analysis, market);
    const p = facts.portfolio!;

    assert.equal(p.complete, false);
    close(p.dayChange, 151.5);
    assert.equal(p.returnPercent, null);
    assert.equal(p.relativeReturnPercent, null);
    assert.deepEqual(p.coverage.missing, ["XOM"]);
    assert.deepEqual(facts.summary, [
      "Partial close: +$151.50 from 4 of 5 holdings with prices.",
      "NVDA was the largest known contributor; 3 up · 1 down · 0 flat among 4 priced holdings.",
    ]);
    assert.doesNotMatch(facts.summary.join(" "), /%|S&P/);
  });

  it("omits the benchmark clause when the S&P 500 isn't priced", () => {
    const analysis = analyzeHoldings({ holdings, quotes: fullQuotes, sectorBySymbol: sectors });
    const facts = buildCloseFacts(analysis, market);
    assert.equal(facts.portfolio?.relativeReturnPercent, null);
    assert.equal(facts.summary[0], "Your portfolio returned +0.64%.");
  });

  it("says behind / in line, and names the largest detractor when nothing rose", () => {
    const down = analyzeHoldings({
      holdings: [{ symbol: "MSFT", quantity: 10 }],
      quotes: { MSFT: q(450, 455) },
      benchmarkReturnPercent: 0.5,
    });
    assert.deepEqual(buildCloseFacts(down, market).summary, [
      "Your portfolio returned -1.10%, 1.60 pts behind the S&P 500.",
      "MSFT was the largest detractor; 0 up · 1 down · 0 flat among 1 priced holding.",
    ]);
    const level = analyzeHoldings({
      holdings: [{ symbol: "AAA", quantity: 1 }],
      quotes: { AAA: q(100.5, 100) },
      benchmarkReturnPercent: 0.5,
    });
    assert.match(buildCloseFacts(level, market).summary[0]!, /in line with the S&P 500\.$/);
  });

  it("leaves strongest/weakest sector empty for a single-sector book", () => {
    const one = analyzeHoldings({
      holdings: [
        { symbol: "AAPL", quantity: 1 },
        { symbol: "NVDA", quantity: 1 },
      ],
      quotes: fullQuotes,
      sectorBySymbol: sectors,
    });
    const p = buildCloseFacts(one, market).portfolio!;
    assert.equal(p.strongestSector, null);
    assert.equal(p.weakestSector, null);
  });

  it("falls back to the market when the book is empty or entirely unpriced", () => {
    assert.equal(buildCloseFacts(null, market).portfolio, null);
    assert.deepEqual(buildCloseFacts(null, market).summary, [
      "The S&P 500 moved +0.54% in a broad advance.",
    ]);
    const mixed = marketFacts({
      "^GSPC": { changePercent: -0.12 },
      ...Object.fromEntries(
        SECTOR_FUNDS.map((fund, i) => [fund.symbol, { changePercent: i % 2 ? 0.3 : -0.3 }]),
      ),
    });
    assert.deepEqual(buildCloseFacts(null, mixed).summary, [
      "The S&P 500 moved -0.12% on a mixed day.",
    ]);
    // Without every sector priced there is no day call, just the move.
    assert.deepEqual(
      buildCloseFacts(null, marketFacts({ "^GSPC": { changePercent: 0.2 } })).summary,
      ["The S&P 500 moved +0.20%."],
    );
    const unpriced = analyzeHoldings({ holdings, quotes: {} });
    const facts = buildCloseFacts(unpriced, marketFacts({}));
    assert.equal(facts.portfolio?.dayChange, null);
    assert.deepEqual(facts.summary, []);
  });
});

describe("close claims are bounded by their structured facts", () => {
  it("does not claim a flat-band holding closed higher or lower", () => {
    const analysis = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 1 },
        { symbol: "BBB", quantity: 1 },
      ],
      quotes: { AAA: q(100.04, 100), BBB: q(99.96, 100) },
    });
    const facts = buildCloseFacts(analysis, market);
    assert.deepEqual(facts.portfolio!.breadth, { quoted: 2, up: 0, down: 0, flat: 2, upRatio: 0 });
    assert.match(facts.summary.join(" "), /0 up · 0 down · 2 flat/);
    assert.doesNotMatch(facts.summary.join(" "), /closed higher|closed lower/);
  });

  it("qualifies partial drivers and avoids whole-portfolio sector extrema", () => {
    const analysis = analyzeHoldings({
      holdings,
      quotes: { AAPL: fullQuotes.AAPL, XOM: fullQuotes.XOM },
      sectorBySymbol: sectors,
    });
    const facts = buildCloseFacts(analysis, market);
    assert.equal(facts.portfolio!.strongestSector, null);
    assert.equal(facts.portfolio!.weakestSector, null);
    assert.match(facts.summary.join(" "), /largest known contributor/);
  });
});
