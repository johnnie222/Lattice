import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseQuote, replaceQuoteBatch } from "./quote-data.ts";
import { analyzeHoldings, analyzePortfolio } from "./portfolio-intelligence.ts";

describe("quote ingestion and coverage (#17)", () => {
  it("never coerces missing, blank or boolean changes into a flat day", () => {
    for (const missing of [null, undefined, "", " ", false, true, NaN, Infinity]) {
      const quote = parseQuote("AAA", { fulldayPrice: 110, fulldayChange: missing });
      assert.deepEqual(quote, {
        symbol: "AAA",
        price: 110,
        previousClose: null,
        change: null,
        changePercent: null,
      });
      const quotes = { AAA: quote! };
      const holding = analyzeHoldings({
        holdings: [{ symbol: "AAA", quantity: 0.25 }],
        quotes,
        benchmarkReturnPercent: 1,
      });
      const legacy = analyzePortfolio({
        lines: [{ symbol: "AAA", weight: 100 }],
        quotes,
        benchmarkReturnPercent: 1,
      });
      for (const result of [holding, legacy]) {
        assert.equal(result.complete, false);
        assert.equal(result.returnPercent, null);
        assert.equal(result.relativeReturnPercent, null);
      }
    }
  });

  it("uses an explicit previous close, even if change is absent or contradictory", () => {
    for (const change of [null, undefined, 0, 999]) {
      const quote = parseQuote("AAA", {
        fulldayPrice: 110,
        fulldayChange: change,
        chartPreviousClose: 100,
      })!;
      assert.equal(quote.previousClose, 100);
      assert.equal(quote.change, 10);
      assert.ok(Math.abs(quote.changePercent! - 10) < 1e-10);
    }
    assert.equal(
      parseQuote("AAA", { fulldayPrice: 110, chartPreviousClose: 0, previousClose: 100 })!
        .previousClose,
      100,
    );
  });

  it("accepts a genuine zero change and derives an unrounded return from price/close", () => {
    assert.equal(parseQuote("AAA", { fulldayPrice: 100, fulldayChange: 0 })!.changePercent, 0);
    const quote = parseQuote("^GSPC", {
      fulldayPrice: "6010",
      fulldayChange: "10",
      fulldayChangePercent: null,
    })!;
    assert.equal(quote.previousClose, 6000);
    assert.ok(Math.abs(quote.changePercent! - 100 / 600) < 1e-10);
  });

  it("rejects invalid prices and never substitutes a percent for a missing previous close", () => {
    for (const price of [null, undefined, "", false, 0, -1, Infinity])
      assert.equal(parseQuote("AAA", { fulldayPrice: price, fulldayChange: 1 }), null);
    assert.equal(parseQuote("AAA", { fulldayPrice: 10, fulldayChange: 10 })!.previousClose, null);
    assert.equal(
      parseQuote("AAA", { fulldayPrice: 10, fulldayChangePercent: 2 })!.previousClose,
      null,
    );
  });

  it("removes omitted or failed quotes so previous data cannot create full coverage", () => {
    const old = parseQuote("AAA", { fulldayPrice: 110, fulldayChange: 10 })!;
    const current = parseQuote("BBB", { fulldayPrice: 90, fulldayChange: -10 })!;
    const partial = replaceQuoteBatch({ AAA: old }, ["AAA", "BBB"], [current]);
    assert.deepEqual(Object.keys(partial), ["BBB"]);
    const result = analyzeHoldings({
      holdings: [
        { symbol: "AAA", quantity: 1 },
        { symbol: "BBB", quantity: 1 },
      ],
      quotes: partial,
      benchmarkReturnPercent: 1,
    });
    assert.equal(result.dayChange, -10);
    assert.equal(result.returnPercent, null);
    assert.equal(result.relativeReturnPercent, null);
    assert.deepEqual(result.coverage.missing, ["AAA"]);
    assert.deepEqual(replaceQuoteBatch(partial, ["BBB"], []), {});
  });
});
