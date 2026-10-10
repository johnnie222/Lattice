import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizeSymbol } from "@/lib/market";
import { todayNY } from "@/lib/format";
import {
  BOOKS_VERSION,
  cleanPosition,
  emptyBook,
  migrateBooks,
  type Book,
  type Position,
} from "@/lib/book-model";

export { bookKind, isMixedBook } from "@/lib/book-model";
export type { Book, Position } from "@/lib/book-model";

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

export const BOOKS_KEY = "lattice-books-v1";
/** Raw copy of a snapshot from an older build, taken once before migrating it. */
export const BOOKS_BACKUP_KEY = "lattice-books-backup";

export const EMPTY_BOOK: Book = emptyBook("main", "Main");

function patchActive(books: Book[], activeId: string, edit: (book: Book) => Book): Book[] {
  return books.map((book) => (book.id === activeId ? edit(book) : book));
}

function clean(position: Position): Position | null {
  const cleaned = cleanPosition(position, todayNY());
  if (!cleaned) return null;
  return cleaned.kind === "percent" ? { ...cleaned, percent: Math.min(100, cleaned.percent) } : cleaned;
}

/**
 * Keep the untouched snapshot from an older build before migrating it, so a
 * migration mistake can never be the end of someone's portfolio.
 */
function backupBeforeMigrating(version: number) {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (raw && !localStorage.getItem(BOOKS_BACKUP_KEY)) {
      localStorage.setItem(BOOKS_BACKUP_KEY, JSON.stringify({ version, savedAt: Date.now(), raw }));
    }
  } catch {
    /* storage blocked */
  }
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
        set({ books: [...get().books, emptyBook(id, `Portfolio ${count}`)], activeId: id });
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
      name: BOOKS_KEY,
      version: BOOKS_VERSION,
      // Several builds wrote this key with different shapes (see book-model),
      // so migration reads what each book contains, not the version number.
      migrate: (persisted, version) => {
        backupBeforeMigrating(version);
        return migrateBooks(persisted, todayNY()) as unknown as BooksState;
      },
      // Zustand skips migrate for matching or absent version tags. Repair
      // those snapshots too, while keeping the live action functions.
      merge: (persisted, current) => ({ ...current, ...migrateBooks(persisted, todayNY()) }),
    },
  ),
);

export function activeBook(state: Pick<BooksState, "books" | "activeId">): Book {
  return state.books.find((book) => book.id === state.activeId) ?? state.books[0] ?? EMPTY_BOOK;
}
