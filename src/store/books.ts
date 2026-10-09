import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeSymbol } from "@/lib/market";
import { todayNY } from "@/lib/format";

type PositionBase = {
  symbol: string;
  /** Day it was added to Lattice (New York date). */
  added: string;
  /** Price when added; filled in from the first quote if unknown. */
  anchor: number | null;
};

/**
 * A holding is either a real position (shares, optional average cost and
 * purchase date) or, for people who'd rather not record amounts, a share of
 * the portfolio. A percent position is pinned to the price when it was added,
 * so it grows and shrinks with the stock like a real holding would.
 */
export type Position =
  | (PositionBase & { kind: "shares"; shares: number; entry: number | null; since: string | null })
  | (PositionBase & { kind: "percent"; percent: number });

/** Which kind of position a portfolio holds; null while it's empty. */
export function bookKind(book: Book, except?: string): Position["kind"] | null {
  return book.positions.find((p) => p.symbol !== except)?.kind ?? null;
}

export type Book = {
  id: string;
  name: string;
  positions: Position[];
};

type BooksState = {
  books: Book[];
  activeId: string;
  setActive: (id: string) => void;
  rename: (name: string) => void;
  newBook: () => void;
  removeActive: () => void;
  savePosition: (position: Position) => void;
  setAnchors: (prices: Record<string, number>) => void;
  removePosition: (symbol: string) => void;
};

export const EMPTY_BOOK: Book = { id: "main", name: "Main", positions: [] };

function patchActive(books: Book[], activeId: string, edit: (book: Book) => Book): Book[] {
  return books.map((book) => (book.id === activeId ? edit(book) : book));
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function clean(position: Position): Position | null {
  const symbol = normalizeSymbol(position.symbol);
  if (!symbol) return null;
  const added = DATE.test(position.added) ? position.added : todayNY();
  const anchor = position.anchor != null && Number.isFinite(position.anchor) && position.anchor > 0 ? position.anchor : null;
  if (position.kind === "shares") {
    if (!Number.isFinite(position.shares) || position.shares <= 0) return null;
    const entry = position.entry != null && Number.isFinite(position.entry) && position.entry > 0 ? position.entry : null;
    const since = position.since && DATE.test(position.since) && position.since <= todayNY() ? position.since : null;
    return { symbol, added, anchor, kind: "shares", shares: position.shares, entry, since };
  }
  if (!Number.isFinite(position.percent) || position.percent <= 0) return null;
  return { symbol, added, anchor, kind: "percent", percent: Math.min(100, position.percent) };
}

export const useBooks = create<BooksState>()(
  persist(
    (set, get) => ({
      books: [EMPTY_BOOK],
      activeId: "main",
      setActive: (id) => set({ activeId: id }),
      rename: (name) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            name: name.slice(0, 28) || book.name,
          })),
        }),
      newBook: () => {
        const id = Math.random().toString(36).slice(2, 8);
        const count = get().books.length + 1;
        set({ books: [...get().books, { id, name: `Portfolio ${count}`, positions: [] }], activeId: id });
      },
      removeActive: () => {
        const { books, activeId } = get();
        if (books.length === 1) {
          set({ books: [{ ...books[0]!, positions: [], name: "Main" }] });
          return;
        }
        const next = books.filter((book) => book.id !== activeId);
        set({ books: next, activeId: next[0]!.id });
      },
      savePosition: (raw) => {
        const position = clean(raw);
        if (!position) return;
        set({
          books: patchActive(get().books, get().activeId, (book) => {
            const exists = book.positions.some((p) => p.symbol === position.symbol);
            return {
              ...book,
              positions: exists
                ? book.positions.map((p) => (p.symbol === position.symbol ? position : p))
                : [...book.positions, position],
            };
          }),
        });
      },
      // Record the price a position started from, once a quote is in.
      setAnchors: (prices) => {
        let changed = false;
        const books = get().books.map((book) => ({
          ...book,
          positions: book.positions.map((p) => {
            const price = prices[p.symbol];
            if (p.anchor != null || !price) return p;
            changed = true;
            return { ...p, anchor: price };
          }),
        }));
        if (changed) set({ books });
      },
      removePosition: (symbol) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            positions: book.positions.filter((p) => p.symbol !== normalizeSymbol(symbol)),
          })),
        }),
    }),
    {
      name: "lattice-books-v1",
      version: 3,
      // v1 stored { lines: [{ symbol, weight }], notional }. Weights become
      // "% of portfolio" positions so nothing a user entered is lost.
      // v3 adds added/anchor (and since for shares) to every position.
      migrate: (persisted, version) => {
        const state = persisted as { books?: unknown[]; activeId?: string };
        if (version < 2 && Array.isArray(state.books)) {
          state.books = state.books.map((raw) => {
            const old = raw as { id: string; name: string; lines?: { symbol: string; weight: number }[] };
            return {
              id: old.id,
              name: old.name,
              positions: (old.lines ?? [])
                .filter((line) => line.weight > 0)
                .map((line) => ({ symbol: line.symbol, kind: "percent", percent: line.weight })),
            };
          });
        }
        if (version < 3 && Array.isArray(state.books)) {
          const today = todayNY();
          state.books = (state.books as Book[]).map((book) => ({
            ...book,
            positions: book.positions.map((p) => ({
              ...p,
              added: (p as Partial<Position>).added ?? today,
              anchor: (p as Partial<Position>).anchor ?? null,
              ...(p.kind === "shares" ? { since: (p as { since?: string | null }).since ?? null } : {}),
            })) as Position[],
          }));
        }
        return state as BooksState;
      },
    },
  ),
);

export function activeBook(state: Pick<BooksState, "books" | "activeId">): Book {
  return state.books.find((book) => book.id === state.activeId) ?? state.books[0] ?? EMPTY_BOOK;
}
