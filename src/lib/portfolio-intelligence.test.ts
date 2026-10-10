import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzePortfolio } from "./portfolio-intelligence.ts";

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
  });

  it("reports partial quote coverage and uses quoted weight for the live return", () => {
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
    close(result.returnPercent, (50 / 70) * 2 + (20 / 70) * -1);
    assert.deepEqual(
      result.positions.map((row) => row.symbol),
      ["AAA", "CCC"],
    );
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
