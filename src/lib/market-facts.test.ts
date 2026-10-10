import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MARKET_BENCHMARK, SECTOR_FUNDS, marketFacts } from "./market-facts.ts";

const moves = (values: number[]): Record<string, { changePercent: number | null }> =>
  Object.fromEntries(SECTOR_FUNDS.map((fund, i) => [fund.symbol, { changePercent: values[i]! }]));

describe("marketFacts", () => {
  it("covers the 11 S&P 500 sector funds", () => {
    assert.equal(SECTOR_FUNDS.length, 11);
    assert.ok(SECTOR_FUNDS.some((fund) => fund.symbol === "XLK" && fund.sector === "tech"));
  });

  it("ranks sectors and finds the strongest and weakest", () => {
    const facts = marketFacts({
      ...moves([1.2, 0.3, -0.9, 0.1, 0.5, -0.2, 0.4, 0, 0.02, -0.04, 0.8]),
      [MARKET_BENCHMARK]: { changePercent: 0.54 },
    });

    assert.equal(facts.benchmarkChangePercent, 0.54);
    assert.equal(facts.strongestSector?.symbol, SECTOR_FUNDS[0]!.symbol);
    assert.equal(facts.strongestSector?.changePercent, 1.2);
    assert.equal(facts.weakestSector?.changePercent, -0.9);
    assert.deepEqual(
      facts.sectors.map((s) => s.changePercent),
      [1.2, 0.8, 0.5, 0.4, 0.3, 0.1, 0.02, 0, -0.04, -0.2, -0.9],
    );
    // ±0.05% is flat, as on the map: 0.02, 0 and −0.04 are flat.
    assert.deepEqual(facts.sectorBreadth, { up: 6, down: 2, flat: 3 });
    assert.equal(facts.dayType, "mixed");
  });

  it("calls a broad advance or decline only when ≥80% of sectors agree", () => {
    assert.equal(marketFacts(moves([1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1])).dayType, "broad-advance"); // 9/11
    assert.equal(marketFacts(moves([1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1])).dayType, "mixed"); // 8/11
    assert.equal(
      marketFacts(moves([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0])).dayType,
      "broad-decline",
    );
  });

  it("never calls the day or counts breadth when a sector is missing or invalid", () => {
    const quotes = moves([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    quotes[SECTOR_FUNDS[3]!.symbol] = { changePercent: null };
    delete quotes[SECTOR_FUNDS[7]!.symbol];
    quotes[SECTOR_FUNDS[9]!.symbol] = { changePercent: Number.NaN };
    const facts = marketFacts(quotes);

    assert.deepEqual(facts.sectorCoverage, {
      total: 11,
      priced: 8,
      complete: false,
      missing: [SECTOR_FUNDS[3]!.symbol, SECTOR_FUNDS[7]!.symbol, SECTOR_FUNDS[9]!.symbol],
    });
    assert.equal(facts.sectorBreadth, null);
    assert.equal(facts.dayType, null);
    // Known rows remain available; overall extremes must wait for complete data.
    assert.equal(facts.sectors.length, 8);
    assert.equal(facts.strongestSector, null);
    assert.equal(facts.weakestSector, null);
  });

  it("reports nothing it doesn't have", () => {
    const facts = marketFacts({});
    assert.equal(facts.benchmarkChangePercent, null);
    assert.equal(facts.strongestSector, null);
    assert.equal(facts.weakestSector, null);
    assert.equal(facts.dayType, null);
    assert.deepEqual(facts.sectors, []);
    // A single priced sector is not "strongest" of anything.
    assert.equal(marketFacts({ XLK: { changePercent: 1 } }).strongestSector, null);
  });
});

it("does not claim overall sector leaders when missing quotes could outrank them", () => {
  const quotes = moves([1, 0.8, -1, 0.2, 0.1, 0, 0.3, 0.4, 0.5, 0.6, 0.7]);
  delete quotes[SECTOR_FUNDS[4]!.symbol];
  const facts = marketFacts(quotes);
  assert.equal(facts.strongestSector, null);
  assert.equal(facts.weakestSector, null);
  assert.equal(facts.sectors.length, 10);
  assert.equal(facts.sectorBreadth, null);
  assert.equal(facts.dayType, null);
});

it("handles both sides of the 80% threshold and the inclusive flat band", () => {
  assert.equal(
    marketFacts(moves([1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1]), SECTOR_FUNDS.slice(0, 10)).dayType,
    "broad-advance", // Exactly 8/10 = 80%, not just the 9/11 case.
  );
  assert.equal(
    marketFacts(moves([-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1])).dayType,
    "broad-decline",
  );
  assert.equal(marketFacts(moves([-1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1])).dayType, "mixed");
  assert.deepEqual(marketFacts(moves([0.05, -0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0])).sectorBreadth, {
    up: 0,
    down: 0,
    flat: 11,
  });
});
