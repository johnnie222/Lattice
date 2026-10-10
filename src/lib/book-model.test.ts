import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLegacyBook, migrateBooks, suggestQuantities } from "./book-model.ts";

describe("migrateBooks", () => {
  it("keeps a legacy weight book's weights and notional untouched", () => {
    const legacy = {
      books: [
        {
          id: "main",
          name: "Main",
          lines: [
            { symbol: "QQQ", weight: 31.6 },
            { symbol: "VOO", weight: 12 },
          ],
          notional: 25_000,
        },
      ],
      activeId: "main",
    };
    const { books, activeId } = migrateBooks(legacy, 0);

    assert.equal(activeId, "main");
    assert.deepEqual(books[0], {
      id: "main",
      name: "Main",
      holdings: [],
      lines: [
        { symbol: "QQQ", weight: 31.6 },
        { symbol: "VOO", weight: 12 },
      ],
      notional: 25_000,
    });
    assert.equal(isLegacyBook(books[0]!), true);
  });

  it("keeps current holdings, including fractional quantities", () => {
    const { books } = migrateBooks(
      {
        books: [
          {
            id: "b",
            name: "Brokerage",
            holdings: [
              { symbol: "BRK-B", quantity: 0.375, averageCost: 410.5 },
              { symbol: "AAPL", quantity: 12, averageCost: null },
            ],
            lines: [],
            notional: null,
          },
        ],
        activeId: "b",
      },
      1,
    );

    assert.deepEqual(books[0]!.holdings, [
      { symbol: "BRK-B", quantity: 0.375, averageCost: 410.5 },
      { symbol: "AAPL", quantity: 12, averageCost: null },
    ]);
    assert.equal(isLegacyBook(books[0]!), false);
  });

  it("repairs malformed data instead of failing", () => {
    const { books, activeId } = migrateBooks(
      {
        books: [
          null,
          {
            id: "x",
            name: "",
            lines: [
              { symbol: " aapl ", weight: 5 },
              { symbol: "", weight: 3 },
            ],
            notional: -1,
          },
          {
            id: "y",
            name: "Y",
            holdings: [
              { symbol: "MSFT", quantity: 0 },
              { symbol: "NVDA", quantity: 2, averageCost: -5 },
            ],
          },
        ],
        activeId: "missing",
      },
      1,
    );

    assert.equal(activeId, "x");
    assert.deepEqual(books[0]!.lines, [{ symbol: "AAPL", weight: 5 }]);
    assert.equal(books[0]!.notional, null);
    assert.equal(books[0]!.name, "Book 2");
    assert.deepEqual(books[1]!.holdings, [{ symbol: "NVDA", quantity: 2, averageCost: null }]);
  });

  it("starts with one empty book when nothing is saved", () => {
    const { books, activeId } = migrateBooks(undefined, 0);
    assert.deepEqual(books, [
      { id: "main", name: "Main", holdings: [], lines: [], notional: null },
    ]);
    assert.equal(activeId, "main");
  });
});

describe("suggestQuantities", () => {
  it("splits the book size by weight and divides by price", () => {
    const suggested = suggestQuantities(
      [
        { symbol: "AAA", weight: 60 },
        { symbol: "BBB", weight: 40 },
        { symbol: "CCC", weight: 0 },
      ],
      10_000,
      { AAA: 200, BBB: 50 },
    );

    assert.deepEqual(suggested, { AAA: 30, BBB: 80 });
  });

  it("leaves a quantity unknown without a book size or a price", () => {
    assert.deepEqual(suggestQuantities([{ symbol: "AAA", weight: 1 }], null, { AAA: 10 }), {
      AAA: null,
    });
    assert.deepEqual(suggestQuantities([{ symbol: "AAA", weight: 1 }], 1000, {}), { AAA: null });
  });
});
