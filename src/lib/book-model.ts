/**
 * Saved portfolio ("book") model and its migration. Pure functions only, so
 * the persistence rules are unit-tested apart from the store and UI.
 *
 * A book holds positions of one kind:
 * - shares: a quantity (fractional allowed), an optional average cost and an
 *   optional purchase date. Value is always quantity × price.
 * - percent: for people who'd rather not record amounts, a starting share of
 *   the portfolio, pinned to the price when it was added (`anchor`), so it
 *   then moves with its price like a real holding. No dollar figures exist
 *   for these books.
 *
 * Several builds have written the same storage key with different shapes, so
 * migration goes by what a saved book contains, never by the version number:
 * - original export: { lines: [{ symbol, weight }], notional }
 * - holdings builds: { holdings: [{ symbol, quantity, averageCost }], lines, notional }
 * - APK builds v2/v3: { positions: [...] } (v3 added `added`/`anchor`/`since`)
 * Weights become percent positions and holdings become share positions, so
 * nothing a user entered is dropped. A legacy book's dollar size (`notional`)
 * is kept with the book. Everything stays on this device.
 */

export type PositionBase = {
  symbol: string;
  /** Day it was added to Lattice (New York date). */
  added: string;
  /** Price when added; filled in from the first quote if unknown. */
  anchor: number | null;
};

export type SharesPosition = PositionBase & {
  kind: "shares";
  shares: number;
  /** Average cost per share; optional, only used for since-entry figures. */
  entry: number | null;
  /** Purchase date, if the user gave one (informational). */
  since: string | null;
};

export type PercentPosition = PositionBase & { kind: "percent"; percent: number };

export type Position = SharesPosition | PercentPosition;

export type Book = {
  id: string;
  name: string;
  positions: Position[];
  /** Dollar size of a book saved with weights before positions existed. */
  notional?: number | null;
};

export const BOOKS_VERSION = 4;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function emptyBook(id: string, name: string): Book {
  return { id, name, positions: [] };
}

function positive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Same normalization as the market's symbols ("brk.b" → "BRK-B"). */
export function cleanSymbol(raw: unknown): string {
  return typeof raw === "string"
    ? raw
        .trim()
        .toUpperCase()
        .replace(/\./g, "-")
        .replace(/[^A-Z0-9-]/g, "")
        .slice(0, 10)
    : "";
}

function date(raw: unknown, fallback: string): string {
  return typeof raw === "string" && DATE.test(raw) ? raw : fallback;
}

/** Which kind of position a book holds; null while it's empty. */
export function bookKind(book: Book, except?: string): Position["kind"] | null {
  return book.positions.find((p) => p.symbol !== except)?.kind ?? null;
}

/** Holds both kinds (only possible in data saved by older APK builds). */
export function isMixedBook(book: Book): boolean {
  return (
    book.positions.some((p) => p.kind === "shares") &&
    book.positions.some((p) => p.kind === "percent")
  );
}

/**
 * Validate one position. Returns null for unusable input (no symbol, or no
 * positive size), which the editor never saves.
 */
export function cleanPosition(raw: unknown, today: string): Position | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const symbol = cleanSymbol(p.symbol);
  if (!symbol) return null;
  const added = date(p.added, today);
  const anchor = positive(p.anchor) ? p.anchor : null;
  const kind =
    p.kind === "percent" || (p.kind !== "shares" && positive(p.percent)) ? "percent" : "shares";
  if (kind === "shares") {
    if (!positive(p.shares)) return null;
    const since =
      typeof p.since === "string" && DATE.test(p.since) && p.since <= today ? p.since : null;
    return {
      symbol,
      added,
      anchor,
      kind,
      shares: p.shares,
      entry: positive(p.entry) ? p.entry : null,
      since,
    };
  }
  if (!positive(p.percent)) return null;
  return { symbol, added, anchor, kind, percent: p.percent };
}

/**
 * One position per symbol. Shares add up, with a quantity-weighted average
 * cost (unknown if any part lacks one); percentages add up. The first entry
 * keeps its dates and anchor. Different kinds for one symbol stay separate
 * only in the unlikely mixed case; the first one wins.
 */
function mergeDuplicates(positions: Position[]): Position[] {
  const out: Position[] = [];
  const index = new Map<string, number>();
  for (const position of positions) {
    const at = index.get(position.symbol);
    if (at == null) {
      index.set(position.symbol, out.length);
      out.push(position);
      continue;
    }
    const current = out[at]!;
    if (current.kind === "shares" && position.kind === "shares") {
      const shares = current.shares + position.shares;
      const entry =
        current.entry != null && position.entry != null
          ? (current.entry * current.shares + position.entry * position.shares) / shares
          : null;
      out[at] = { ...current, shares, entry };
    } else if (current.kind === "percent" && position.kind === "percent") {
      out[at] = { ...current, percent: current.percent + position.percent };
    }
  }
  return out;
}

function positionsOf(book: Record<string, unknown>, today: string): Position[] {
  // APK builds: positions.
  if (Array.isArray(book.positions)) {
    return book.positions.flatMap((raw) => {
      const position = cleanPosition(raw, today);
      return position ? [position] : [];
    });
  }
  // Holdings builds: real holdings become share positions.
  const holdings = Array.isArray(book.holdings) ? book.holdings : [];
  const fromHoldings = holdings.flatMap((raw) => {
    const h = (raw ?? {}) as Record<string, unknown>;
    const position = cleanPosition(
      { kind: "shares", symbol: h.symbol, shares: h.quantity, entry: h.averageCost, since: null },
      today,
    );
    return position ? [position] : [];
  });
  if (fromHoldings.length) return fromHoldings;
  // Weight books (original export, or not yet converted): weights become
  // percent positions. They start drifting from the first price seen.
  const lines = Array.isArray(book.lines) ? book.lines : [];
  return lines.flatMap((raw) => {
    const l = (raw ?? {}) as Record<string, unknown>;
    const position = cleanPosition({ kind: "percent", symbol: l.symbol, percent: l.weight }, today);
    return position ? [position] : [];
  });
}

/**
 * Bring any saved books state to the current shape. Malformed entries are
 * repaired where possible and dropped only when they hold nothing usable.
 */
export function migrateBooks(
  persisted: unknown,
  today: string,
): { books: Book[]; activeId: string } {
  const state = (persisted && typeof persisted === "object" ? persisted : {}) as {
    books?: unknown;
    activeId?: unknown;
  };
  const rawBooks = Array.isArray(state.books) ? state.books : [];
  const seen = new Set<string>();
  const books: Book[] = rawBooks.flatMap((raw, index) => {
    if (!raw || typeof raw !== "object") return [];
    const book = raw as Record<string, unknown>;
    let id = typeof book.id === "string" && book.id ? book.id : `book-${index + 1}`;
    if (seen.has(id)) id = `${id}-${index + 1}`;
    seen.add(id);
    const name =
      typeof book.name === "string" && book.name.trim()
        ? book.name.slice(0, 28)
        : `Portfolio ${index + 1}`;
    const out: Book = { id, name, positions: mergeDuplicates(positionsOf(book, today)) };
    if (positive(book.notional)) out.notional = book.notional;
    return [out];
  });
  if (!books.length) books.push(emptyBook("main", "Main"));
  const activeId =
    typeof state.activeId === "string" && books.some((book) => book.id === state.activeId)
      ? state.activeId
      : books[0]!.id;
  return { books, activeId };
}
