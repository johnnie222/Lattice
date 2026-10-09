import { useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { BOARDS, sectorLabel, type Board, type SectorId } from "@/data/universe";
import { formatCap, formatPct, formatPrice } from "@/lib/format";
import {
  boardNodes,
  findListing,
  normalizeSymbol,
  suggestListings,
  syntheticListing,
  type FilterId,
  type MapNode,
} from "@/lib/market";
import type { Quote } from "@/lib/quote-core";
import { activeBook, useBooks, type Book } from "@/store/books";
import { Mark } from "@/components/mark";

export type SheetId = "boards" | "filter" | "info" | "book" | "stock";

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button type="button" className="scrim absolute inset-0" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-panel safe-b relative flex max-h-[min(86dvh,760px)] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-surface"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-xl text-muted"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

const FILTERS: { id: FilterId; label: string; hint: string }[] = [
  { id: "all", label: "All names", hint: "Full map" },
  { id: "up", label: "Advancers", hint: "Today is green" },
  { id: "down", label: "Decliners", hint: "Today is red" },
  { id: "m1", label: "Move ≥ 1%", hint: "Either direction" },
  { id: "m2", label: "Move ≥ 2%", hint: "The loud ones" },
];

export function FilterSheet({
  filter,
  onChange,
  onClose,
}: {
  filter: FilterId;
  onChange: (filter: FilterId) => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="Filter" onClose={onClose}>
      <div className="flex flex-col gap-2">
        {FILTERS.map((item) => {
          const on = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.id);
                onClose();
              }}
              className={`flex h-14 items-center justify-between rounded-xl border px-3 text-left ${on ? "border-up bg-surface-2" : "border-line"}`}
            >
              <span>
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="block text-xs text-muted">{item.hint}</span>
              </span>
              <span className={`size-2.5 rounded-full ${on ? "bg-up" : "bg-line"}`} />
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

export function InfoSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="How to read LATTICE" onClose={onClose}>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted">
        <p>
          <span className="text-fg">Color is today’s move.</span> Dark green is barely up, bright green is a
          strong up day. Rose is the same scale on the downside.
        </p>
        <p>
          <span className="text-fg">Size is weight.</span> On the S&P 500, Nasdaq 100, and the sector ETFs
          (XLK, XLF, XLE, and the rest), tile area is market cap. That is close to how the SPDR sector funds
          look, not a copy of the official daily basket file. The Dow is price-weighted, like the real index:
          tile area is each stock’s share price.
        </p>
        <p>
          <span className="text-fg">Thematic baskets are approximate.</span> SOXX, SMH, IGV, and KRE use a
          fixed weight mix. XBI and XRT are equal weight. IBB and ITA are sized by market cap inside the
          basket. Prices are live; the weights are not the fund’s latest official holdings.
        </p>
        <p>
          <span className="text-fg">Tap a sector name</span> on the S&P or Nasdaq map to open that sector
          full screen. Tap a stock for the print and to drop it into your book.
        </p>
        <p>
          <span className="text-fg">Your book</span> is sized by the weights you type. The number under the
          title is the weighted average of today’s moves. Weights are saved on this device.
        </p>
      </div>
    </Sheet>
  );
}

export function BoardSheet({
  boardId,
  bookName,
  bookCount,
  onPick,
  onBook,
  onInfo,
  onClose,
}: {
  boardId: string;
  bookName: string;
  bookCount: number;
  onPick: (id: string) => void;
  onBook: () => void;
  onInfo: () => void;
  onClose: () => void;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const board of BOARDS) map.set(board.id, boardNodes(board).length);
    return map;
  }, []);
  const groups = ["Index", "Sector ETF", "Thematic"] as const;

  return (
    <Sheet title="Markets" onClose={onClose}>
      <section className="mb-4">
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted">Your book</h3>
        <button
          type="button"
          onClick={onBook}
          className={`flex h-14 w-full items-center justify-between rounded-xl border px-3 text-left ${boardId === "book" ? "border-up bg-surface-2" : "border-line"}`}
        >
          <span>
            <span className="block text-sm font-semibold">{bookName}</span>
            <span className="block text-xs text-muted">
              {bookCount === 0
                ? "Empty · add weights"
                : `${bookCount} ${bookCount === 1 ? "name" : "names"} · your weights`}
            </span>
          </span>
          <span className={`size-2.5 rounded-full ${boardId === "book" ? "bg-up" : "bg-line"}`} />
        </button>
      </section>
      {groups.map((group) => (
        <section key={group} className="mb-4">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted">{group}</h3>
          <div className="flex flex-col gap-2">
            {BOARDS.filter((board) => board.group === group).map((board) => (
              <BoardRow
                key={board.id}
                board={board}
                count={counts.get(board.id) ?? 0}
                active={board.id === boardId}
                onPick={() => onPick(board.id)}
              />
            ))}
          </div>
        </section>
      ))}
      <button type="button" onClick={onInfo} className="mb-2 h-11 text-sm font-medium text-fg">
        How to read this map
      </button>
    </Sheet>
  );
}

function BoardRow({
  board,
  count,
  active,
  onPick,
}: {
  board: Board;
  count: number;
  active: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex h-14 w-full items-center justify-between rounded-xl border px-3 text-left ${active ? "border-up bg-surface-2" : "border-line"}`}
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">
          {board.title}
          {board.name !== board.title ? <span className="font-normal text-muted"> · {board.name}</span> : null}
        </span>
        <span className="block text-xs text-muted">{count} names</span>
      </span>
      <span className={`size-2.5 shrink-0 rounded-full ${active ? "bg-up" : "bg-line"}`} />
    </button>
  );
}

export function StockSheet({
  symbol,
  quote,
  node,
  book,
  canDrill,
  onDrill,
  onClose,
}: {
  symbol: string;
  quote: Quote | undefined;
  node: MapNode | undefined;
  book: Book;
  canDrill: boolean;
  onDrill: (sector: SectorId) => void;
  onClose: () => void;
}) {
  const known = findListing(symbol);
  const listing = known ?? {
    ...syntheticListing(symbol),
    name: node?.name ?? symbol,
    sector: node?.sector ?? "other",
    industry: node?.industry ?? "",
    cap: node?.cap ?? 0,
  };
  const held = book.lines.find((line) => line.symbol === symbol);
  const [weight, setWeight] = useState(held ? String(round1(held.weight)) : "5");
  const upsert = useBooks((s) => s.upsert);
  const removeLine = useBooks((s) => s.removeLine);
  const sector = (node?.sector ?? listing.sector) as SectorId;
  const up = (quote?.changePercent ?? 0) >= 0;

  return (
    <Sheet title={symbol} onClose={onClose}>
      <div className="flex items-center gap-3">
        <Mark symbol={symbol} size={56} />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{listing.name}</p>
          <p className="truncate text-sm text-muted">
            {sectorLabel(sector)}
            {listing.industry ? ` · ${listing.industry}` : ""}
          </p>
        </div>
      </div>
      <p className="mt-4 font-mono text-3xl font-medium tracking-tight">
        {quote ? formatPrice(quote.price) : "—"}
      </p>
      <p className={`mt-1 font-mono text-sm ${quote ? (up ? "text-up" : "text-down") : "text-muted"}`}>
        {quote ? `${quote.change > 0 ? "+" : ""}${quote.change.toFixed(2)}  ${formatPct(quote.changePercent)}` : "Waiting on the tape"}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Market cap</dt>
          <dd className="font-mono">{formatCap(listing.cap)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">In {book.name}</dt>
          <dd className="font-mono">{held ? `${round1(held.weight)}%` : "Not held"}</dd>
        </div>
      </dl>
      <label className="mt-5 block text-xs font-medium text-muted" htmlFor="weight">
        Weight in {book.name}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="weight"
          inputMode="decimal"
          value={weight}
          onChange={(event) => setWeight(event.target.value)}
          className="h-12 w-28 rounded-xl border border-line bg-bg px-3 font-mono text-base"
        />
        <button
          type="button"
          className="h-12 flex-1 rounded-xl bg-fg font-semibold text-bg"
          onClick={() => {
            const next = Number(weight);
            if (!Number.isFinite(next)) return;
            upsert(symbol, next);
            onClose();
          }}
        >
          {held ? "Update weight" : "Add to book"}
        </button>
      </div>
      {held ? (
        <button
          type="button"
          className="mt-3 h-11 w-full text-sm font-medium text-down"
          onClick={() => {
            removeLine(symbol);
            onClose();
          }}
        >
          Remove from book
        </button>
      ) : null}
      {canDrill ? (
        <button
          type="button"
          className="mt-2 h-11 w-full text-sm font-medium text-fg"
          onClick={() => onDrill(sector)}
        >
          Open {sectorLabel(sector)}
        </button>
      ) : null}
    </Sheet>
  );
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function BookSheet({ onClose }: { onClose: () => void }) {
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const rename = useBooks((s) => s.rename);
  const setNotional = useBooks((s) => s.setNotional);
  const upsert = useBooks((s) => s.upsert);
  const removeLine = useBooks((s) => s.removeLine);
  const equalize = useBooks((s) => s.equalize);
  const normalize = useBooks((s) => s.normalize);
  const newBook = useBooks((s) => s.newBook);
  const removeActive = useBooks((s) => s.removeActive);
  const setActive = useBooks((s) => s.setActive);
  const [draft, setDraft] = useState("");
  const ideas = suggestListings(draft);
  const sum = book.lines.reduce((total, line) => total + line.weight, 0);

  const add = (raw: string) => {
    const symbol = normalizeSymbol(raw);
    if (!symbol) return;
    const exists = book.lines.some((line) => line.symbol === symbol);
    upsert(symbol, exists ? (book.lines.find((line) => line.symbol === symbol)?.weight ?? 5) : book.lines.length ? 5 : 100);
    setDraft("");
  };

  return (
    <Sheet title="Portfolio" onClose={onClose}>
      {books.length > 1 ? (
        <div className="mb-3 flex gap-2 overflow-x-auto">
          {books.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`h-9 shrink-0 rounded-full border px-3 text-sm ${item.id === book.id ? "border-up bg-surface-2" : "border-line text-muted"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}
      <label className="text-xs font-medium text-muted" htmlFor="book-name">
        Name
      </label>
      <input
        id="book-name"
        value={book.name}
        onChange={(event) => rename(event.target.value)}
        className="mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 text-base"
      />
      <p className={`mt-3 font-mono text-sm ${Math.abs(sum - 100) < 0.2 ? "text-muted" : "text-fg"}`}>
        Weights sum to {sum.toFixed(1)}%
        {Math.abs(sum - 100) >= 0.2 ? " · map uses relative size" : ""}
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={equalize} className="h-11 flex-1 rounded-xl border border-line text-sm font-medium">
          Equal weight
        </button>
        <button type="button" onClick={normalize} className="h-11 flex-1 rounded-xl border border-line text-sm font-medium">
          Scale to 100%
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {book.lines.map((line) => (
          <div key={line.symbol} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{line.symbol}</p>
              <p className="truncate text-xs text-muted">{findListing(line.symbol)?.name ?? "Custom ticker"}</p>
            </div>
            <input
              inputMode="decimal"
              aria-label={`${line.symbol} weight`}
              defaultValue={String(round1(line.weight))}
              key={`${line.symbol}-${round1(line.weight)}`}
              onBlur={(event) => {
                const next = Number(event.target.value);
                if (Number.isFinite(next)) upsert(line.symbol, next);
              }}
              className="h-11 w-20 rounded-xl border border-line bg-bg px-2 text-right font-mono"
            />
            <button
              type="button"
              aria-label={`Remove ${line.symbol}`}
              onClick={() => removeLine(line.symbol)}
              className="grid size-11 place-items-center rounded-xl text-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <label className="mt-4 block text-xs font-medium text-muted" htmlFor="add-ticker">
        Add ticker
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id="add-ticker"
          value={draft}
          onChange={(event) => setDraft(event.target.value.toUpperCase())}
          onKeyDown={(event) => {
            if (event.key === "Enter") add(draft);
          }}
          placeholder="NVDA"
          className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 font-mono uppercase"
        />
        <button type="button" onClick={() => add(draft)} className="h-12 rounded-xl bg-fg px-4 font-semibold text-bg">
          Add
        </button>
      </div>
      {ideas.length ? (
        <div className="mt-2 flex flex-col">
          {ideas.map((idea) => (
            <button
              key={idea.symbol}
              type="button"
              onClick={() => add(idea.symbol)}
              className="flex h-11 items-center justify-between text-left text-sm"
            >
              <span className="font-semibold">{idea.symbol}</span>
              <span className="truncate pl-3 text-muted">{idea.name}</span>
            </button>
          ))}
        </div>
      ) : null}
      <label className="mt-4 block text-xs font-medium text-muted" htmlFor="notional">
        Book size, optional $
      </label>
      <input
        id="notional"
        inputMode="decimal"
        defaultValue={book.notional ?? ""}
        key={book.id}
        placeholder="100000"
        onBlur={(event) => {
          const raw = event.target.value.trim();
          if (!raw) {
            setNotional(null);
            return;
          }
          const next = Number(raw.replace(/,/g, ""));
          setNotional(Number.isFinite(next) && next > 0 ? next : null);
        }}
        className="mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 font-mono"
      />
      <p className="mt-1 text-xs text-muted">Used only to turn the weighted % into dollars. Nothing is sent anywhere.</p>
      <div className="mt-4 flex gap-4">
        <button type="button" onClick={newBook} className="h-11 text-sm font-medium text-fg">
          New book
        </button>
        <button type="button" onClick={removeActive} className="h-11 text-sm font-medium text-down">
          {books.length === 1 ? "Clear book" : "Delete book"}
        </button>
      </div>
    </Sheet>
  );
}
