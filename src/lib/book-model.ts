/**
 * Saved portfolio ("book") model and its migrations. Pure functions only, so
 * the persistence rules are unit-tested apart from the store and UI.
 *
 * A book holds real holdings: a quantity (fractional allowed) and an optional
 * average cost per share. Value and weight are always derived from
 * quantity × price; users never maintain percentages.
 *
 * Books saved before holdings existed contain only relative weights (`lines`)
 * and an optional dollar size (`notional`). Those are kept untouched, and the
 * book stays readable, until the user explicitly converts it to holdings.
 * Everything stays on this device.
 */

export type HoldingLine = {
  symbol: string;
  quantity: number;
  averageCost: number | null;
};

/** A weight from before holdings existed. Read-only; kept until conversion. */
export type LegacyLine = { symbol: string; weight: number };

export type Book = {
  id: string;
  name: string;
  holdings: HoldingLine[];
  /** Legacy weights. Empty for books created with holdings. */
  lines: LegacyLine[];
  /** Legacy whole-book dollar size, only meaningful with `lines`. */
  notional: number | null;
};

export const BOOKS_VERSION = 1;

export function emptyBook(id: string, name: string): Book {
  return { id, name, holdings: [], lines: [], notional: null };
}

/** A book that still uses weights and hasn't been converted to holdings. */
export function isLegacyBook(book: Book): boolean {
  return book.holdings.length === 0 && book.lines.length > 0;
}

function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function symbolOf(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toUpperCase() : "";
}

/**
 * Bring a persisted books state up to the current version.
 * v0 books ({ lines, notional }) gain an empty `holdings` list; their weights
 * and notional are preserved exactly. Malformed entries are repaired rather
 * than dropped where possible.
 */
export function migrateBooks(
  persisted: unknown,
  _version: number,
): { books: Book[]; activeId: string } {
  const state = (persisted && typeof persisted === "object" ? persisted : {}) as {
    books?: unknown;
    activeId?: unknown;
  };
  const rawBooks = Array.isArray(state.books) ? state.books : [];
  const books: Book[] = rawBooks.flatMap((raw, index) => {
    if (!raw || typeof raw !== "object") return [];
    const book = raw as Record<string, unknown>;
    const id = typeof book.id === "string" && book.id ? book.id : `book-${index + 1}`;
    const name = typeof book.name === "string" && book.name ? book.name : `Book ${index + 1}`;
    const lines = (Array.isArray(book.lines) ? book.lines : []).flatMap((line) => {
      const l = line as Record<string, unknown>;
      const symbol = symbolOf(l?.symbol);
      return symbol && typeof l.weight === "number" && Number.isFinite(l.weight)
        ? [{ symbol, weight: l.weight }]
        : [];
    });
    const holdings =
      Array.isArray(book.holdings)
        ? book.holdings.flatMap((holding) => {
            const h = holding as Record<string, unknown>;
            const symbol = symbolOf(h?.symbol);
            if (!symbol || !positive(h.quantity)) return [];
            return [
              {
                symbol,
                quantity: h.quantity,
                averageCost: positive(h.averageCost) ? h.averageCost : null,
              },
            ];
          })
        : [];
    const notional = positive(book.notional) ? book.notional : null;
    return [{ id, name, holdings, lines, notional }];
  });
  if (!books.length) books.push(emptyBook("main", "Main"));
  const activeId =
    typeof state.activeId === "string" && books.some((book) => book.id === state.activeId)
      ? state.activeId
      : books[0]!.id;
  return { books, activeId };
}

/** Conversion is all-or-nothing, including saved zero-weight tickers. */
export function convertLegacyBook(book: Book, holdings: HoldingLine[]): Book {
  if (!isLegacyBook(book) || !holdings.length) return book;
  if (holdings.some((holding) => !positive(holding.quantity))) return book;
  const symbols = new Set(holdings.map((holding) => holding.symbol));
  if (symbols.size !== holdings.length || book.lines.some((line) => !symbols.has(line.symbol)))
    return book;
  return { ...book, holdings, lines: [], notional: null };
}

/**
 * Suggested share counts for converting a legacy weight book: each line's
 * share of the book size, divided by today's price. Only possible when the
 * book has a dollar size and the line has a price; others stay null and
 * must be entered by the user. Suggestions are never applied automatically.
 */
export function suggestQuantities(
  lines: readonly LegacyLine[],
  notional: number | null,
  prices: Readonly<Record<string, number | null | undefined>>,
): Record<string, number | null> {
  const valid = lines.filter((line) => positive(line.weight));
  const total = valid.reduce((sum, line) => sum + line.weight, 0);
  const out: Record<string, number | null> = {};
  for (const line of valid) {
    const price = prices[line.symbol];
    out[line.symbol] =
      positive(notional) && positive(price) && total > 0
        ? (notional * line.weight) / total / price
        : null;
  }
  return out;
}
