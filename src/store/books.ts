import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeSymbol } from "@/lib/market";
import {
  BOOKS_VERSION,
  emptyBook,
  migrateBooks,
  type Book,
  type HoldingLine,
} from "@/lib/book-model";

export type { Book, HoldingLine } from "@/lib/book-model";

type BooksState = {
  books: Book[];
  activeId: string;
  setActive: (id: string) => void;
  rename: (name: string) => void;
  newBook: () => void;
  removeActive: () => void;
  /** Add or replace a holding. Quantity must be positive; fractions are fine. */
  saveHolding: (holding: HoldingLine) => void;
  removeHolding: (symbol: string) => void;
  /** Legacy books only: drop one weight line. */
  removeLegacyLine: (symbol: string) => void;
  /**
   * Replace a legacy book's weights with real holdings. Only ever called
   * from an explicit user action; the weights are cleared at that point.
   */
  convertLegacy: (holdings: HoldingLine[]) => void;
};

function patchActive(books: Book[], activeId: string, edit: (book: Book) => Book): Book[] {
  return books.map((book) => (book.id === activeId ? edit(book) : book));
}

function cleanHolding(holding: HoldingLine): HoldingLine | null {
  const symbol = normalizeSymbol(holding.symbol);
  if (!symbol || !Number.isFinite(holding.quantity) || holding.quantity <= 0) return null;
  const averageCost =
    holding.averageCost != null && Number.isFinite(holding.averageCost) && holding.averageCost > 0
      ? holding.averageCost
      : null;
  return { symbol, quantity: holding.quantity, averageCost };
}

export const useBooks = create<BooksState>()(
  persist(
    (set, get) => ({
      books: [emptyBook("main", "Main")],
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
        set({ books: [...get().books, emptyBook(id, `Book ${count}`)], activeId: id });
      },
      removeActive: () => {
        const { books, activeId } = get();
        if (books.length === 1) {
          set({ books: [emptyBook(books[0]!.id, "Main")] });
          return;
        }
        const next = books.filter((book) => book.id !== activeId);
        set({ books: next, activeId: next[0]!.id });
      },
      saveHolding: (raw) => {
        const holding = cleanHolding(raw);
        if (!holding) return;
        set({
          books: patchActive(get().books, get().activeId, (book) => {
            const exists = book.holdings.some((h) => h.symbol === holding.symbol);
            return {
              ...book,
              holdings: exists
                ? book.holdings.map((h) => (h.symbol === holding.symbol ? holding : h))
                : [...book.holdings, holding],
            };
          }),
        });
      },
      removeHolding: (symbol) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            holdings: book.holdings.filter((h) => h.symbol !== normalizeSymbol(symbol)),
          })),
        }),
      removeLegacyLine: (symbol) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            lines: book.lines.filter((line) => line.symbol !== normalizeSymbol(symbol)),
          })),
        }),
      convertLegacy: (holdings) => {
        const clean = holdings.map(cleanHolding).filter((h): h is HoldingLine => h != null);
        if (!clean.length) return;
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            holdings: clean,
            lines: [],
            notional: null,
          })),
        });
      },
    }),
    {
      name: "lattice-books-v1",
      version: BOOKS_VERSION,
      migrate: (persisted, version) => migrateBooks(persisted, version) as unknown as BooksState,
    },
  ),
);

export function activeBook(state: Pick<BooksState, "books" | "activeId">): Book {
  return (
    state.books.find((book) => book.id === state.activeId) ??
    state.books[0] ??
    emptyBook("main", "Main")
  );
}
