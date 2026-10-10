import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanPosition, migrateBooks } from "./book-model.ts";

const TODAY = "2026-10-07";

describe("migrateBooks: every shape ever saved under lattice-books-v1", () => {
  it("original export weights become percent positions, keeping the dollar size", () => {
    const state = migrateBooks(
      {
        books: [
          {
            id: "main",
            name: "Main",
            lines: [
              { symbol: "AAPL", weight: 60 },
              { symbol: "msft", weight: 40 },
              { symbol: "ZERO", weight: 0 },
            ],
            notional: 10_000,
          },
        ],
        activeId: "main",
      },
      TODAY,
    );
    assert.deepEqual(state, {
      books: [
        {
          id: "main",
          name: "Main",
          notional: 10_000,
          positions: [
            { symbol: "AAPL", added: TODAY, anchor: null, kind: "percent", percent: 60 },
            { symbol: "MSFT", added: TODAY, anchor: null, kind: "percent", percent: 40 },
          ],
        },
      ],
      activeId: "main",
    });
  });

  it("holdings builds: holdings become share positions; unconverted weight books stay weights", () => {
    const state = migrateBooks(
      {
        books: [
          {
            id: "main",
            name: "Main",
            holdings: [
              { symbol: "AAPL", quantity: 2.5, averageCost: 150 },
              { symbol: "brk.b", quantity: 0.333, averageCost: null },
            ],
            lines: [],
            notional: null,
          },
          {
            id: "old",
            name: "Old",
            holdings: [],
            lines: [{ symbol: "XOM", weight: 3 }],
            notional: 5_000,
          },
        ],
        activeId: "old",
      },
      TODAY,
    );
    assert.equal(state.activeId, "old");
    assert.deepEqual(state.books[0]!.positions, [
      {
        symbol: "AAPL",
        added: TODAY,
        anchor: null,
        kind: "shares",
        shares: 2.5,
        entry: 150,
        since: null,
      },
      {
        symbol: "BRK-B",
        added: TODAY,
        anchor: null,
        kind: "shares",
        shares: 0.333,
        entry: null,
        since: null,
      },
    ]);
    assert.equal(state.books[0]!.notional, undefined);
    assert.deepEqual(state.books[1], {
      id: "old",
      name: "Old",
      notional: 5_000,
      positions: [{ symbol: "XOM", added: TODAY, anchor: null, kind: "percent", percent: 3 }],
    });
  });

  it("APK v3 books pass through unchanged, and migration is idempotent", () => {
    const saved = {
      books: [
        {
          id: "main",
          name: "Main",
          positions: [
            {
              symbol: "AAPL",
              added: "2026-09-01",
              anchor: 160,
              kind: "shares",
              shares: 10,
              entry: 150,
              since: "2026-08-15",
            },
          ],
        },
        {
          id: "p2",
          name: "Private",
          positions: [
            { symbol: "NVDA", added: "2026-09-02", anchor: 120, kind: "percent", percent: 25 },
          ],
        },
      ],
      activeId: "p2",
    };
    const once = migrateBooks(saved, TODAY);
    assert.deepEqual(once, saved);
    assert.deepEqual(migrateBooks(once, TODAY), once);
  });

  it("APK v2 positions gain added/anchor/since", () => {
    const state = migrateBooks(
      {
        books: [
          {
            id: "main",
            name: "Main",
            positions: [
              { symbol: "AAPL", kind: "shares", shares: 3, entry: null },
              { symbol: "MSFT", kind: "percent", percent: 20 },
            ],
          },
        ],
        activeId: "main",
      },
      TODAY,
    );
    assert.deepEqual(state.books[0]!.positions, [
      {
        symbol: "AAPL",
        added: TODAY,
        anchor: null,
        kind: "shares",
        shares: 3,
        entry: null,
        since: null,
      },
      { symbol: "MSFT", added: TODAY, anchor: null, kind: "percent", percent: 20 },
    ]);
  });

  it("merges duplicate symbols instead of dropping one", () => {
    const state = migrateBooks(
      {
        books: [
          {
            id: "main",
            name: "Main",
            holdings: [
              { symbol: "AAPL", quantity: 1, averageCost: 100 },
              { symbol: "aapl", quantity: 3, averageCost: 200 },
              { symbol: "MSFT", quantity: 1, averageCost: 100 },
              { symbol: "MSFT", quantity: 1, averageCost: null },
            ],
          },
        ],
      },
      TODAY,
    );
    const [aapl, msft] = state.books[0]!.positions as { shares: number; entry: number | null }[];
    assert.equal(aapl!.shares, 4);
    assert.equal(aapl!.entry, 175);
    assert.equal(msft!.shares, 2);
    assert.equal(msft!.entry, null);
  });

  it("repairs junk without losing usable books", () => {
    assert.deepEqual(migrateBooks(null, TODAY), {
      books: [{ id: "main", name: "Main", positions: [] }],
      activeId: "main",
    });
    assert.deepEqual(migrateBooks({ books: "nope" }, TODAY).books.length, 1);
    const state = migrateBooks(
      {
        books: [
          null,
          {
            id: "a",
            name: "",
            positions: [
              { symbol: "", kind: "shares", shares: 1 },
              { symbol: "X", shares: -1 },
            ],
          },
          {
            id: "a",
            name: "Second",
            positions: [
              { symbol: "AMD", kind: "shares", shares: 1, added: "bad", since: "2099-01-01" },
            ],
          },
        ],
        activeId: "missing",
      },
      TODAY,
    );
    assert.deepEqual(
      state.books.map((book) => [book.id, book.name, book.positions.length]),
      [
        ["a", "Portfolio 2", 0],
        ["a-3", "Second", 1],
      ],
    );
    assert.equal(state.activeId, "a");
    const amd = state.books[1]!.positions[0]!;
    assert.equal(amd.added, TODAY);
    assert.equal(amd.kind === "shares" ? amd.since : "x", null);
  });
});

describe("cleanPosition", () => {
  it("rejects positions without a positive size and normalizes symbols", () => {
    assert.equal(cleanPosition({ symbol: "AAPL", kind: "shares", shares: 0 }, TODAY), null);
    assert.equal(
      cleanPosition({ symbol: "AAPL", kind: "percent", percent: Number.NaN }, TODAY),
      null,
    );
    assert.deepEqual(
      cleanPosition({ symbol: " brk.b ", kind: "shares", shares: 0.5, entry: -3 }, TODAY),
      {
        symbol: "BRK-B",
        added: TODAY,
        anchor: null,
        kind: "shares",
        shares: 0.5,
        entry: null,
        since: null,
      },
    );
  });
});
