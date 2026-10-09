import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeSymbol } from "@/lib/market";

export type BookLine = { symbol: string; weight: number };

export type Book = {
  id: string;
  name: string;
  lines: BookLine[];
  notional: number | null;
};

type BooksState = {
  books: Book[];
  activeId: string;
  setActive: (id: string) => void;
  rename: (name: string) => void;
  setNotional: (notional: number | null) => void;
  newBook: () => void;
  removeActive: () => void;
  upsert: (symbol: string, weight: number) => void;
  removeLine: (symbol: string) => void;
  equalize: () => void;
  normalize: () => void;
};

function patchActive(books: Book[], activeId: string, edit: (book: Book) => Book): Book[] {
  return books.map((book) => (book.id === activeId ? edit(book) : book));
}

export const useBooks = create<BooksState>()(
  persist(
    (set, get) => ({
      books: [{ id: "main", name: "Main", lines: [], notional: null }],
      activeId: "main",
      setActive: (id) => set({ activeId: id }),
      rename: (name) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            name: name.slice(0, 28) || book.name,
          })),
        }),
      setNotional: (notional) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({ ...book, notional })),
        }),
      newBook: () => {
        const id = Math.random().toString(36).slice(2, 8);
        const count = get().books.length + 1;
        set({
          books: [...get().books, { id, name: `Book ${count}`, lines: [], notional: null }],
          activeId: id,
        });
      },
      removeActive: () => {
        const { books, activeId } = get();
        if (books.length === 1) {
          set({
            books: [{ ...books[0]!, lines: [], notional: null, name: "Main" }],
          });
          return;
        }
        const next = books.filter((book) => book.id !== activeId);
        set({ books: next, activeId: next[0]!.id });
      },
      upsert: (symbol, weight) => {
        const normalized = normalizeSymbol(symbol);
        if (!normalized) return;
        const safe = Number.isFinite(weight) ? Math.min(100, Math.max(0, weight)) : 0;
        set({
          books: patchActive(get().books, get().activeId, (book) => {
            const lines = book.lines.some((line) => line.symbol === normalized)
              ? book.lines.map((line) =>
                  line.symbol === normalized ? { ...line, weight: safe } : line,
                )
              : [...book.lines, { symbol: normalized, weight: safe }];
            return { ...book, lines };
          }),
        });
      },
      removeLine: (symbol) =>
        set({
          books: patchActive(get().books, get().activeId, (book) => ({
            ...book,
            lines: book.lines.filter((line) => line.symbol !== normalizeSymbol(symbol)),
          })),
        }),
      equalize: () =>
        set({
          books: patchActive(get().books, get().activeId, (book) => {
            if (!book.lines.length) return book;
            const weight = 100 / book.lines.length;
            return {
              ...book,
              lines: book.lines.map((line) => ({ ...line, weight })),
            };
          }),
        }),
      normalize: () =>
        set({
          books: patchActive(get().books, get().activeId, (book) => {
            const sum = book.lines.reduce((total, line) => total + line.weight, 0);
            if (sum <= 0) return book;
            return {
              ...book,
              lines: book.lines.map((line) => ({ ...line, weight: (line.weight / sum) * 100 })),
            };
          }),
        }),
    }),
    { name: "lattice-books-v1" },
  ),
);

export function activeBook(state: Pick<BooksState, "books" | "activeId">): Book {
  return state.books.find((book) => book.id === state.activeId) ?? state.books[0]!;
}
