import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatShares } from "./format.ts";
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

describe("safe legacy conversion", () => {
  it("keeps zero-weight tickers accessible and requires an explicit decision for each", async () => {
    const { convertLegacyBook } = await import("./book-model.ts");
    const book = migrateBooks(
      {
        books: [
          {
            id: "b",
            name: "B",
            lines: [
              { symbol: "AAA", weight: 0 },
              { symbol: "BBB", weight: 100 },
            ],
            notional: 1000,
          },
        ],
      },
      0,
    ).books[0]!;
    assert.equal(isLegacyBook(book), true);
    assert.equal(
      convertLegacyBook(book, [{ symbol: "BBB", quantity: 1, averageCost: null }]),
      book,
    );
    assert.equal(
      convertLegacyBook(book, [
        { symbol: "AAA", quantity: 0, averageCost: null },
        { symbol: "BBB", quantity: 1, averageCost: null },
      ]),
      book,
    );
    const holdings = [
      { symbol: "AAA", quantity: 0.000012345, averageCost: null },
      { symbol: "BBB", quantity: 1.25, averageCost: 50 },
    ];
    const converted = convertLegacyBook(book, holdings);
    assert.deepEqual(converted.holdings, holdings);
    assert.deepEqual(converted.lines, []);
    assert.deepEqual(migrateBooks({ books: [converted] }, 1).books[0], converted);
    assert.equal(
      convertLegacyBook(converted, [{ symbol: "AAA", quantity: 9, averageCost: null }]),
      converted,
    );
  });

  it("preserves holdings even when a snapshot has a missing/old version tag", () => {
    const book = {
      id: "b",
      name: "B",
      holdings: [{ symbol: "AAA", quantity: 0.25, averageCost: 100 }],
      lines: [],
      notional: null,
    };
    assert.deepEqual(migrateBooks({ books: [book] }, 0).books[0], book);
  });

  it("repairs same-version legacy snapshots without hiding their saved lines", () => {
    const state = migrateBooks(
      {
        books: [{ id: "b", name: "B", lines: [{ symbol: "AAA", weight: 0 }], notional: 1234 }],
        activeId: "b",
      },
      1,
    );
    assert.equal(isLegacyBook(state.books[0]!), true);
    assert.equal(state.books[0]!.notional, 1234);
    assert.deepEqual(migrateBooks(state, 1), state);
  });
});

it("shows tiny fractional holdings without rounding them to zero", () => {
  assert.equal(formatShares(0.000012345), "0.000012345");
});
