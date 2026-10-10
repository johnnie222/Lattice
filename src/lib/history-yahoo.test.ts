import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseReferenceRequest } from "./history-request.ts";
import { checkedSparkHistory, parseSparkHistory } from "./history-yahoo.ts";

// 2025-12-31 and 2026-01-02 regular sessions open at 14:30 UTC.
const DEC31 = Date.parse("2025-12-31T14:30:00Z") / 1000;
const JAN02 = Date.parse("2026-01-02T14:30:00Z") / 1000;

describe("parseSparkHistory", () => {
  it("normalizes the symbol-keyed shape into New York dated bars", () => {
    const out = parseSparkHistory(
      {
        AAPL: { timestamp: [DEC31, JAN02], close: [250.5, null] },
        MSFT: { timestamp: [DEC31], close: [480] },
      },
      ["AAPL", "MSFT", "NVDA"],
    );
    assert.deepEqual(out, [
      { symbol: "AAPL", bars: [{ date: "2025-12-31", close: 250.5 }] },
      { symbol: "MSFT", bars: [{ date: "2025-12-31", close: 480 }] },
    ]);
  });

  it("reads the older spark.result shape and ignores symbols it wasn't asked for", () => {
    const out = parseSparkHistory(
      {
        spark: {
          result: [
            {
              symbol: "^GSPC",
              response: [
                { timestamp: [DEC31, JAN02], indicators: { quote: [{ close: [6800, 6850] }] } },
              ],
            },
            {
              symbol: "EVIL",
              response: [{ timestamp: [DEC31], indicators: { quote: [{ close: [1] }] } }],
            },
          ],
        },
      },
      ["^GSPC"],
    );
    assert.deepEqual(out, [
      {
        symbol: "^GSPC",
        bars: [
          { date: "2025-12-31", close: 6800 },
          { date: "2026-01-02", close: 6850 },
        ],
      },
    ]);
  });

  it("returns nothing for junk", () => {
    assert.deepEqual(parseSparkHistory(null, ["AAPL"]), []);
    assert.deepEqual(parseSparkHistory({ AAPL: { timestamp: "x", close: [1] } }, ["AAPL"]), [
      { symbol: "AAPL", bars: [] },
    ]);
  });
});

describe("parseReferenceRequest", () => {
  const now = new Date("2026-10-07T20:00:00Z"); // Wed, after 9:30 ET

  it("accepts a valid request", () => {
    assert.deepEqual(
      parseReferenceRequest(
        { symbols: ["aapl", "BRK.B", "^GSPC", "no way"], period: "ytd", anchor: "2026-10-06" },
        now,
      ),
      {
        symbols: ["AAPL", "BRK-B", "^GSPC"],
        period: "ytd",
        anchor: "2026-10-06",
      },
    );
  });

  it("replaces a future, non-trading or malformed anchor with the server's session", () => {
    for (const anchor of ["2026-10-08", "2026-10-04", "yesterday", undefined]) {
      assert.equal(
        parseReferenceRequest({ symbols: [], period: "1w", anchor }, now).anchor,
        "2026-10-07",
      );
    }
  });

  it("defaults an unknown period to 1W", () => {
    assert.equal(parseReferenceRequest({ period: "1d" }, now).period, "1w");
  });
});

describe("upstream errors and anchor validation", () => {
  it("does not turn successful HTTP error/malformed payloads into missing history", () => {
    for (const payload of [
      null,
      {},
      { spark: { error: { code: "rate-limit" }, result: null } },
      { AAPL: { error: "down" } },
      { AAPL: { timestamp: "bad", close: [] } },
    ])
      assert.throws(() => checkedSparkHistory(payload, ["AAPL"]));
    assert.deepEqual(checkedSparkHistory({ spark: { result: [], error: null } }, ["AAPL"]), []);
    assert.deepEqual(checkedSparkHistory({ AAPL: { timestamp: [], close: [] } }, ["AAPL"]), [
      { symbol: "AAPL", bars: [] },
    ]);
  });
  it("rejects impossible calendar dates and accepts YTD's New Year holiday anchor", () => {
    assert.equal(
      parseReferenceRequest({ anchor: "2026-02-30" }, new Date("2026-03-02T16:00:00Z")).anchor,
      "2026-03-02",
    );
    assert.equal(
      parseReferenceRequest(
        { anchor: "2026-01-01", period: "ytd" },
        new Date("2026-01-01T16:00:00Z"),
      ).anchor,
      "2026-01-01",
    );
    assert.equal(
      parseReferenceRequest(
        { anchor: "2026-01-02", period: "1w" },
        new Date("2026-01-02T13:00:00Z"),
      ).anchor,
      "2026-01-02",
    );
  });
});
