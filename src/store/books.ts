import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeSymbol } from "@/lib/market";

/**
 * A holding is either a real position (shares, optional entry price) or,
 * for people who'd rather not record amounts, a share of the portfolio.
 */
export type Position =
  | { symbol: string; kind: "shares"; shares: number; entry: number | null }
  | { symbol: string; kind: "percent"; percent: number };

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
  removePosition: (symbol: string) => void;
};

export const EMPTY_BOOK: Book = { id: "main", name: "Main", positions: [] };

function patchActive(books: Book[], activeId: string, edit: (book: Book) => Book): Book[] {
  return books.map((book) => (book.id === activeId ? edit(book) : book));
}

function clean(position: Position): Position | null {
  const symbol = normalizeSymbol(position.symbol);
  if (!symbol) return null;
  if (position.kind === "shares") {
    if (!Number.isFinite(position.shares) || position.shares <= 0) return null;
    const entry = position.entry != null && Number.isFinite(position.entry) && position.entry > 0 ? position.entry : null;
    return { symbol, kind: "shares", shares: position.shares, entry };
  }
  if (!Number.isFinite(position.percent) || position.percent <= 0) return null;
  return { symbol, kind: "percent", percent: Math.min(100, position.percent) };
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
      version: 2,
      // v1 stored { lines: [{ symbol, weight }], notional }. Weights become
      // "% of portfolio" positions so nothing a user entered is lost.
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
        return state as BooksState;
      },
    },
  ),
);

export function activeBook(state: Pick<BooksState, "books" | "activeId">): Book {
  return state.books.find((book) => book.id === state.activeId) ?? state.books[0] ?? EMPTY_BOOK;
}
