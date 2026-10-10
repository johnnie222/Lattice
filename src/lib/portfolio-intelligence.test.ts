import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeHoldings, analyzePortfolio, cleanHoldings } from "./portfolio-intelligence.ts";

function close(actual: number | null, expected: number, epsilon = 1e-10) {
  assert.notEqual(actual, null);
  assert.ok(Math.abs((actual as number) - expected) <= epsilon, `${actual} != ${expected}`);
}

describe("analyzePortfolio", () => {
  it("normalizes arbitrary book weights and returns contribution by holding", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 30 },
        { symbol: "BBB", weight: 20 },
      ],
      quotes: {
        AAA: { changePercent: 10 },
        BBB: { changePercent: -5 },
      },
    });

    close(result.returnPercent, 4);
    close(result.positions[0]!.normalizedWeight, 0.6);
    close(result.positions[0]!.contributionPercent, 6);
    close(result.positions[1]!.normalizedWeight, 0.4);
    close(result.positions[1]!.contributionPercent, -2);
    close(
      result.positions.reduce((sum, row) => sum + row.contributionPercent, 0),
      4,
    );
    close(result.coverageRatio, 1);
    assert.equal(result.complete, true);
    close(result.knownContributionPercent, 4);
  });

  it("never presents a quoted-only return as the portfolio return (#17)", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 50 },
        { symbol: "BBB", weight: 30 },
        { symbol: "CCC", weight: 20 },
      ],
      quotes: {
        AAA: { changePercent: 2 },
        CCC: { changePercent: -1 },
      },
    });

    assert.equal(result.totalWeight, 100);
    assert.equal(result.quotedWeight, 70);
    close(result.coverageRatio, 0.7);
    assert.equal(result.complete, false);
    // The whole-book return is unknown while BBB is unpriced.
    assert.equal(result.returnPercent, null);
    // Known contribution to the whole book: 50% × 2% + 20% × −1% = +0.8%.
    close(result.knownContributionPercent, 0.8);
    // The quoted-only average (~1.14%) is still available, but under its own name.
    close(result.quotedReturnPercent, (50 / 70) * 2 + (20 / 70) * -1);
    close(result.positions[0]!.normalizedWeight, 0.5);
    close(result.positions[0]!.contributionPercent, 1);
    close(result.positions[1]!.contributionPercent, -0.2);
    assert.deepEqual(
      result.positions.map((row) => row.symbol),
      ["AAA", "CCC"],
    );
  });

  it("does not compare a partial book with a full benchmark (#17)", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 50 },
        { symbol: "BBB", weight: 50 },
      ],
      quotes: { AAA: { changePercent: 3 } },
      benchmarkReturnPercent: 1,
    });

    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    close(result.benchmarkReturnPercent, 1);
    close(result.knownContributionPercent, 1.5);
  });

  it("treats an invalid quote like a missing one (#17)", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 50 },
        { symbol: "BBB", weight: 50 },
      ],
      quotes: { AAA: { changePercent: 2 }, BBB: { changePercent: Number.POSITIVE_INFINITY } },
      benchmarkReturnPercent: 0.5,
    });

    assert.equal(result.complete, false);
    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    close(result.coverageRatio, 0.5);
  });

  it("calculates benchmark-relative return", () => {
    const result = analyzePortfolio({
      lines: [{ symbol: "AAA", weight: 100 }],
      quotes: { AAA: { changePercent: 1.4 } },
      benchmarkReturnPercent: 0.6,
    });

    close(result.returnPercent, 1.4);
    close(result.benchmarkReturnPercent, 0.6);
    close(result.relativeReturnPercent, 0.8);
  });

  it("aggregates contribution by sector", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 50 },
        { symbol: "BBB", weight: 25 },
        { symbol: "CCC", weight: 25 },
      ],
      quotes: {
        AAA: { changePercent: 2 },
        BBB: { changePercent: 4 },
        CCC: { changePercent: -2 },
      },
      sectorBySymbol: {
        AAA: "tech",
        BBB: "tech",
        CCC: "energy",
      },
    });

    const tech = result.sectors.find((row) => row.sector === "tech");
    const energy = result.sectors.find((row) => row.sector === "energy");
    assert.ok(tech);
    assert.ok(energy);
    close(tech.normalizedWeight, 0.75);
    close(tech.contributionPercent, 2);
    assert.equal(tech.positions, 2);
    close(energy.contributionPercent, -0.5);
  });

  it("tracks breadth using the same 0.05% flat band as the current map", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "UP", weight: 25 },
        { symbol: "DOWN", weight: 25 },
        { symbol: "FLAT1", weight: 25 },
        { symbol: "FLAT2", weight: 25 },
      ],
      quotes: {
        UP: { changePercent: 0.051 },
        DOWN: { changePercent: -0.051 },
        FLAT1: { changePercent: 0.05 },
        FLAT2: { changePercent: -0.05 },
      },
    });

    assert.deepEqual(result.breadth, {
      quoted: 4,
      up: 1,
      down: 1,
      flat: 2,
      upRatio: 0.25,
    });
  });

  it("sorts contributors and detractors by portfolio impact, not raw move", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "BIG", weight: 80 },
        { symbol: "SMALL", weight: 20 },
        { symbol: "LOSS", weight: 50 },
      ],
      quotes: {
        BIG: { changePercent: 1 },
        SMALL: { changePercent: 3 },
        LOSS: { changePercent: -2 },
      },
    });

    assert.equal(result.topContributor?.symbol, "BIG");
    assert.equal(result.topDetractor?.symbol, "LOSS");
  });

  it("optionally converts contribution into dollars without changing percent math", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 60 },
        { symbol: "BBB", weight: 40 },
      ],
      quotes: {
        AAA: { changePercent: 2 },
        BBB: { changePercent: -1 },
      },
      notional: 10_000,
    });

    close(result.returnPercent, 0.8);
    close(result.dollarChange, 80);
    close(result.positions[0]!.dollarContribution, 120);
    close(result.positions[1]!.dollarContribution, -40);
  });

  it("sizes dollar contribution by the whole book when some quotes are missing", () => {
    // $10k book: AAA is $5k, CCC is $2k, BBB ($3k) has no quote yet.
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 50 },
        { symbol: "BBB", weight: 30 },
        { symbol: "CCC", weight: 20 },
      ],
      quotes: {
        AAA: { changePercent: 2 },
        CCC: { changePercent: -1 },
      },
      sectorBySymbol: { AAA: "tech", CCC: "energy" },
      notional: 10_000,
    });

    assert.equal(result.returnPercent, null);
    close(result.knownContributionPercent, 0.8);
    close(result.positions[0]!.dollarContribution, 100);
    close(result.positions[1]!.dollarContribution, -20);
    close(result.dollarChange, 80);
    close(result.sectors.find((row) => row.sector === "tech")!.dollarContribution, 100);
    close(result.sectors.find((row) => row.sector === "energy")!.dollarContribution, -20);
  });

  it("returns a safe empty analysis when no positive-weight positions have valid quotes", () => {
    const result = analyzePortfolio({
      lines: [
        { symbol: "AAA", weight: 0 },
        { symbol: "BBB", weight: -10 },
        { symbol: "CCC", weight: 20 },
      ],
      quotes: {
        CCC: { changePercent: Number.NaN },
      },
      benchmarkReturnPercent: Number.NaN,
    });

    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    assert.equal(result.benchmarkReturnPercent, null);
    assert.equal(result.quotedWeight, 0);
    assert.equal(result.coverageRatio, 0);
    assert.deepEqual(result.positions, []);
    assert.deepEqual(result.contributors, []);
    assert.deepEqual(result.detractors, []);
    assert.deepEqual(result.sectors, []);
  });
});

describe("analyzeHoldings", () => {
  const q = (price: number, previousClose: number | null) => ({ price, previousClose });

  it("derives value, previous value, daily P&L and return from quantity × price", () => {
    const result = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 10 },
        { symbol: "BBB", quantity: 4 },
      ],
      quotes: { AAA: q(110, 100), BBB: q(240, 250) },
    });

    assert.equal(result.complete, true);
    close(result.value, 10 * 110 + 4 * 240);
    close(result.previousValue, 10 * 100 + 4 * 250);
    // P&L: AAA +100, BBB −40 → +60 on a $2,000 previous-close book = +3%.
    close(result.dayChange, 60);
    close(result.returnPercent, 3);
    const aaa = result.positions.find((row) => row.symbol === "AAA")!;
    close(aaa.dayChange, 100);
    close(aaa.changePercent, 10);
    close(aaa.contributionPercent, 5);
    close(aaa.weight, 1100 / 2060);
  });

  it("supports fractional quantities", () => {
    const result = analyzeHoldings({
      holdings: [{ symbol: "BRK-B", quantity: 0.375 }],
      quotes: { "BRK-B": q(480, 470) },
    });

    close(result.value, 180);
    close(result.previousValue, 176.25);
    close(result.dayChange, 3.75);
    close(result.returnPercent, (3.75 / 176.25) * 100);
  });

  it("makes dollar and percent contributions sum to the portfolio totals", () => {
    const result = analyzeHoldings({
      holdings: [
        { symbol: "A", quantity: 3.5 },
        { symbol: "B", quantity: 12 },
        { symbol: "C", quantity: 0.25 },
        { symbol: "D", quantity: 40 },
      ],
      quotes: { A: q(101.3, 99.8), B: q(52.1, 53.4), C: q(1890, 1850), D: q(7.77, 7.7) },
      sectorBySymbol: { A: "tech", B: "tech", C: "health" },
    });

    const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
    close(sum(result.positions.map((row) => row.dayChange)), result.dayChange!);
    close(sum(result.positions.map((row) => row.contributionPercent!)), result.returnPercent!);
    close(sum(result.positions.map((row) => row.weight!)), 1);
    close(sum(result.sectors.map((row) => row.dayChange)), result.dayChange!);
    close(sum(result.sectors.map((row) => row.contributionPercent!)), result.returnPercent!);
    assert.equal(result.sectors.find((row) => row.sector === "other")?.positions, 1);
  });

  it("never uses average cost for the daily return", () => {
    const base = { holdings: [{ symbol: "AAA", quantity: 10 }], quotes: { AAA: q(110, 100) } };
    const withCost = analyzeHoldings({
      ...base,
      holdings: [{ symbol: "AAA", quantity: 10, averageCost: 20 }],
    });

    close(analyzeHoldings(base).returnPercent, 10);
    close(withCost.returnPercent, 10);
    close(withCost.dayChange, 100);
  });

  it("reports known P&L but no portfolio return or benchmark comparison when a quote is missing", () => {
    const result = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 10 },
        { symbol: "BBB", quantity: 5 },
      ],
      quotes: { AAA: q(110, 100) },
      benchmarkReturnPercent: 1,
    });

    assert.equal(result.complete, false);
    assert.deepEqual(result.coverage, { holdings: 2, priced: 1, ratio: 0.5, missing: ["BBB"] });
    close(result.dayChange, 100);
    close(result.pricedValue, 1100);
    assert.equal(result.value, null);
    assert.equal(result.previousValue, null);
    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    close(result.benchmarkReturnPercent, 1);
    assert.equal(result.positions[0]!.contributionPercent, null);
    assert.equal(result.positions[0]!.weight, null);
    assert.equal(result.sectors[0]!.contributionPercent, null);
  });

  it("treats invalid prices or previous closes as missing quotes", () => {
    const result = analyzeHoldings({
      holdings: [
        { symbol: "NAN", quantity: 1 },
        { symbol: "ZERO", quantity: 1 },
        { symbol: "NOPREV", quantity: 1 },
        { symbol: "OK", quantity: 1 },
      ],
      quotes: {
        NAN: q(Number.NaN, 10),
        ZERO: q(10, 0),
        NOPREV: q(10, null),
        OK: q(10, 9),
      },
      benchmarkReturnPercent: 0.4,
    });

    assert.deepEqual(result.coverage.missing, ["NAN", "ZERO", "NOPREV"]);
    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    close(result.dayChange, 1);
  });

  it("compares a complete portfolio with the benchmark", () => {
    const result = analyzeHoldings({
      holdings: [{ symbol: "AAA", quantity: 2 }],
      quotes: { AAA: q(101.4, 100) },
      benchmarkReturnPercent: 0.6,
    });

    close(result.returnPercent, 1.4);
    close(result.relativeReturnPercent, 0.8);
  });

  it("ignores a non-finite benchmark", () => {
    const result = analyzeHoldings({
      holdings: [{ symbol: "AAA", quantity: 2 }],
      quotes: { AAA: q(101, 100) },
      benchmarkReturnPercent: Number.NaN,
    });

    assert.equal(result.benchmarkReturnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
  });

  it("counts breadth over priced holdings and ranks contributors by dollars", () => {
    const result = analyzeHoldings({
      holdings: [
        { symbol: "BIG", quantity: 100 },
        { symbol: "SMALL", quantity: 1 },
        { symbol: "LOSS", quantity: 10 },
        { symbol: "FLAT", quantity: 10 },
        { symbol: "UNPRICED", quantity: 10 },
      ],
      quotes: {
        BIG: q(101, 100), // +1%, +$100
        SMALL: q(110, 100), // +10%, +$10
        LOSS: q(95, 100), // −5%, −$50
        FLAT: q(100.04, 100), // +0.04%: inside the flat band
      },
    });

    assert.deepEqual(result.breadth, { quoted: 4, up: 2, down: 1, flat: 1, upRatio: 0.5 });
    assert.equal(result.topContributor?.symbol, "BIG");
    assert.equal(result.topDetractor?.symbol, "LOSS");
    assert.deepEqual(
      result.contributors.map((row) => row.symbol),
      ["BIG", "SMALL", "FLAT"],
    );
  });

  it("reports since-entry P&L from average cost, flagged partial when some costs are unknown", () => {
    const full = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 10, averageCost: 80 },
        { symbol: "BBB", quantity: 2, averageCost: 300 },
      ],
      quotes: { AAA: q(110, 100), BBB: q(240, 250) },
    });

    // Cost 800 + 600 = 1,400; value 1,100 + 480 = 1,580.
    close(full.sinceEntry!.costBasis, 1400);
    close(full.sinceEntry!.change, 180);
    close(full.sinceEntry!.percent, (180 / 1400) * 100);
    assert.equal(full.sinceEntry!.complete, true);
    close(full.positions.find((row) => row.symbol === "AAA")!.sinceEntryChange, 300);

    const partial = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 10, averageCost: 80 },
        { symbol: "BBB", quantity: 2 },
      ],
      quotes: { AAA: q(110, 100), BBB: q(240, 250) },
    });
    assert.equal(partial.sinceEntry!.complete, false);
    assert.equal(partial.sinceEntry!.holdings, 1);
    close(partial.sinceEntry!.change, 300);

    const none = analyzeHoldings({
      holdings: [{ symbol: "AAA", quantity: 1 }],
      quotes: { AAA: q(10, 9) },
    });
    assert.equal(none.sinceEntry, null);
  });

  it("merges duplicate symbols with a quantity-weighted average cost", () => {
    assert.deepEqual(
      cleanHoldings([
        { symbol: "aaa", quantity: 10, averageCost: 100 },
        { symbol: "AAA ", quantity: 30, averageCost: 200 },
        { symbol: "BBB", quantity: 1, averageCost: 5 },
        { symbol: "BBB", quantity: 1 },
      ]),
      [
        { symbol: "AAA", quantity: 40, averageCost: 175 },
        { symbol: "BBB", quantity: 2, averageCost: null },
      ],
    );
  });

  it("drops unusable holdings and returns a safe empty analysis", () => {
    const result = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 0 },
        { symbol: "BBB", quantity: -3 },
        { symbol: "CCC", quantity: Number.NaN },
        { symbol: "", quantity: 4 },
      ],
      quotes: { AAA: q(10, 9) },
      benchmarkReturnPercent: 1,
    });

    assert.equal(result.complete, false);
    assert.deepEqual(result.coverage, { holdings: 0, priced: 0, ratio: null, missing: [] });
    assert.equal(result.dayChange, null);
    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    assert.equal(result.sinceEntry, null);
    assert.deepEqual(result.positions, []);
  });
});
