import { useMemo, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { BOARDS, sectorLabel, type Board, type SectorId } from "@/data/universe";
import { formatCap, formatMoney, formatPct, formatPrice, formatShares } from "@/lib/format";
import {
  boardNodes,
  findListing,
  normalizeSymbol,
  suggestListings,
  syntheticListing,
  type FilterId,
  type MapNode,
} from "@/lib/market";
import type { Quote } from "@/lib/quotes";
import { activeBook, useBooks, type Book } from "@/store/books";
import { isLegacyBook, suggestQuantities } from "@/lib/book-model";
import { Mark } from "@/components/mark";

export type SheetId = "boards" | "filter" | "info" | "book" | "stock" | "today" | "close";

export function Sheet({
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
          <span className="text-fg">Your book</span> holds real positions: shares and, optionally, your average
          cost. Each tile is sized by its value today (shares × price). Today’s return is your total dollar move
          divided by yesterday’s closing value, and it is only shown once every holding has a price. Holdings are
          saved on this device only.
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
                ? "Empty · add holdings"
                : `${bookCount} ${bookCount === 1 ? "holding" : "holdings"}`}
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
  periodLabel = null,
  node,
  book,
  canDrill,
  onDrill,
  onClose,
}: {
  symbol: string;
  quote: Quote | undefined;
  /** Set when the move shown is a lookback (e.g. "1W") rather than today's. */
  periodLabel?: string | null;
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
  const legacy = isLegacyBook(book);
  const held = book.holdings.find((holding) => holding.symbol === symbol);
  const legacyLine = legacy ? book.lines.find((line) => line.symbol === symbol) : undefined;
  const [quantity, setQuantity] = useState(held ? String(held.quantity) : "");
  const [cost, setCost] = useState(held?.averageCost != null ? String(held.averageCost) : "");
  const saveHolding = useBooks((s) => s.saveHolding);
  const removeHolding = useBooks((s) => s.removeHolding);
  const quantityN = parseAmount(quantity);
  const costN = cost.trim() ? parseAmount(cost) : null;
  const canSave = quantityN != null && (cost.trim() === "" || costN != null);
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
      <p className={`mt-1 font-mono text-sm ${quote?.change != null ? (up ? "text-up" : "text-down") : "text-muted"}`}>
        {quote?.change != null
          ? `${quote.change > 0 ? "+" : ""}${quote.change.toFixed(2)}  ${formatPct(quote.changePercent)}${periodLabel ? ` · ${periodLabel}` : ""}`
          : periodLabel
            ? `No ${periodLabel} reference close`
            : "Waiting on the tape"}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Market cap</dt>
          <dd className="font-mono">{formatCap(listing.cap)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">In {book.name}</dt>
          <dd className="font-mono">
            {held
              ? `${formatShares(held.quantity)} ${held.quantity === 1 ? "share" : "shares"}`
              : legacyLine
                ? `${round1(legacyLine.weight)} weight`
                : "Not held"}
          </dd>
        </div>
      </dl>
      {legacy ? (
        <p className="mt-5 rounded-xl border border-line px-3 py-3 text-sm leading-relaxed text-muted">
          {book.name} still uses weights from an earlier version. Convert it to holdings from the book
          editor to add positions by share count.
        </p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <label className="block text-xs font-medium text-muted">
              Shares
              <input
                inputMode="decimal"
                value={quantity}
                placeholder="10"
                onChange={(event) => setQuantity(event.target.value)}
                className="mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 font-mono text-base text-fg"
              />
            </label>
            <label className="block text-xs font-medium text-muted">
              Average cost, optional
              <input
                inputMode="decimal"
                value={cost}
                placeholder={quote ? quote.price.toFixed(2) : "$"}
                onChange={(event) => setCost(event.target.value)}
                className="mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 font-mono text-base text-fg"
              />
            </label>
          </div>
          {quantityN != null && quote ? (
            <p className="mt-2 text-xs text-muted">Worth {formatMoney(quantityN * quote.price)} at today’s price.</p>
          ) : null}
          <button
            type="button"
            disabled={!canSave}
            className="mt-3 h-12 w-full rounded-xl bg-fg font-semibold text-bg disabled:opacity-40"
            onClick={() => {
              if (quantityN == null) return;
              saveHolding({ symbol, quantity: quantityN, averageCost: costN });
              onClose();
            }}
          >
            {held ? "Update holding" : "Add to book"}
          </button>
          {held ? (
            <button
              type="button"
              className="mt-3 h-11 w-full text-sm font-medium text-down"
              onClick={() => {
                removeHolding(symbol);
                onClose();
              }}
            >
              Remove from book
            </button>
          ) : null}
        </>
      )}
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

/** "1,234.5" or "$12" → 1234.5; null unless a positive finite number. */
function parseAmount(raw: string): number | null {
  const n = Number(raw.replace(/[,$\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function HoldingRow({ symbol, quantity, averageCost }: { symbol: string; quantity: number; averageCost: number | null }) {
  const saveHolding = useBooks((s) => s.saveHolding);
  const removeHolding = useBooks((s) => s.removeHolding);
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{symbol}</p>
        <p className="truncate text-xs text-muted">{findListing(symbol)?.name ?? "Custom ticker"}</p>
      </div>
      <input
        inputMode="decimal"
        aria-label={`${symbol} shares`}
        title="Shares"
        defaultValue={String(quantity)}
        key={`${symbol}-q-${quantity}`}
        onBlur={(event) => {
          const next = parseAmount(event.target.value);
          if (next != null) saveHolding({ symbol, quantity: next, averageCost });
          else event.target.value = String(quantity);
        }}
        className="h-11 w-20 rounded-xl border border-line bg-bg px-2 text-right font-mono"
      />
      <input
        inputMode="decimal"
        aria-label={`${symbol} average cost`}
        title="Average cost per share"
        placeholder="cost"
        defaultValue={averageCost != null ? String(averageCost) : ""}
        key={`${symbol}-c-${averageCost}`}
        onBlur={(event) => {
          const raw = event.target.value.trim();
          const next = raw ? parseAmount(raw) : null;
          if (raw && next == null) {
            event.target.value = averageCost != null ? String(averageCost) : "";
            return;
          }
          saveHolding({ symbol, quantity, averageCost: next });
        }}
        className="h-11 w-20 rounded-xl border border-line bg-bg px-2 text-right font-mono"
      />
      <button
        type="button"
        aria-label={`Remove ${symbol}`}
        onClick={() => removeHolding(symbol)}
        className="grid size-11 place-items-center rounded-xl text-muted"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/**
 * Converting a book saved with weights. Weights stay visible and untouched
 * until the user enters share counts and confirms; suggestions from the old
 * book size are offered but never applied on their own.
 */
function LegacyConversion({ book, quotes }: { book: Book; quotes: Record<string, Quote> }) {
  const convertLegacy = useBooks((s) => s.convertLegacy);
  const removeLegacyLine = useBooks((s) => s.removeLegacyLine);
  const lines = book.lines;
  const [draft, setDraft] = useState<Record<string, string>>({});
  const suggestions = useMemo(
    () =>
      suggestQuantities(
        lines,
        book.notional,
        Object.fromEntries(lines.map((line) => [line.symbol, quotes[line.symbol]?.price])),
      ),
    [lines, book.notional, quotes],
  );
  const hasSuggestions = Object.values(suggestions).some((value) => value != null);
  const parsed = lines.map((line) => ({ symbol: line.symbol, quantity: parseAmount(draft[line.symbol] ?? "") }));
  const ready = parsed.length > 0 && parsed.every((row) => row.quantity != null);

  return (
    <div className="rounded-xl border border-line p-3">
      <p className="text-sm font-semibold">Switch {book.name} to real holdings</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        This book was saved with weights. Enter how many shares you hold of each; Lattice then sizes the book by
        value and shows exact dollar moves. Your weights stay exactly as they are until you convert, and nothing
        leaves this device.
      </p>
      {hasSuggestions ? (
        <button
          type="button"
          className="mt-2 h-10 text-sm font-medium text-fg underline underline-offset-4"
          onClick={() =>
            setDraft((prev) => {
              const next = { ...prev };
              for (const [symbol, value] of Object.entries(suggestions)) {
                if (value != null && !next[symbol]) next[symbol] = String(value);
              }
              return next;
            })
          }
        >
          Estimate shares from your {formatMoney(book.notional ?? 0)} book size
        </button>
      ) : null}
      <div className="mt-2 flex flex-col gap-2">
        {lines.map((line) => (
          <div key={line.symbol} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{line.symbol}</p>
              <p className="truncate text-xs text-muted">weight {round1(line.weight)}</p>
            </div>
            <input
              inputMode="decimal"
              aria-label={`${line.symbol} shares`}
              placeholder="shares"
              value={draft[line.symbol] ?? ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, [line.symbol]: event.target.value }))}
              className="h-11 w-24 rounded-xl border border-line bg-bg px-2 text-right font-mono"
            />
            <button
              type="button"
              aria-label={`Remove ${line.symbol}`}
              onClick={() => removeLegacyLine(line.symbol)}
              className="grid size-11 place-items-center rounded-xl text-muted"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={!ready}
        onClick={() =>
          convertLegacy(parsed.map((row) => ({ symbol: row.symbol, quantity: row.quantity!, averageCost: null })))
        }
        className="mt-3 h-12 w-full rounded-xl bg-fg font-semibold text-bg disabled:opacity-40"
      >
        Convert to holdings
      </button>
      {!ready ? <p className="mt-1 text-xs text-muted">Enter shares for every ticker, or remove the ones you no longer hold.</p> : null}
    </div>
  );
}

export function BookSheet({ quotes, onClose }: { quotes: Record<string, Quote>; onClose: () => void }) {
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const rename = useBooks((s) => s.rename);
  const saveHolding = useBooks((s) => s.saveHolding);
  const newBook = useBooks((s) => s.newBook);
  const removeActive = useBooks((s) => s.removeActive);
  const setActive = useBooks((s) => s.setActive);
  const [draft, setDraft] = useState("");
  const [shares, setShares] = useState("");
  const [cost, setCost] = useState("");
  const ideas = suggestListings(draft);
  const legacy = isLegacyBook(book);
  const sharesN = parseAmount(shares);
  const costN = cost.trim() ? parseAmount(cost) : null;
  const symbol = normalizeSymbol(draft);
  const canAdd = Boolean(symbol) && sharesN != null && (cost.trim() === "" || costN != null);

  const add = () => {
    if (!canAdd || sharesN == null) return;
    saveHolding({ symbol, quantity: sharesN, averageCost: costN });
    setDraft("");
    setShares("");
    setCost("");
  };

  return (
    <Sheet title="Book" onClose={onClose}>
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
      <div className="mt-4">
        {legacy ? (
          <LegacyConversion key={book.id} book={book} quotes={quotes} />
        ) : (
          <>
            {book.holdings.length ? (
              <>
                <div className="mb-1 flex justify-end gap-2 pr-[52px] text-[11px] text-muted">
                  <span className="w-20 text-right">Shares</span>
                  <span className="w-20 text-right">Avg cost</span>
                </div>
                <div className="flex flex-col gap-2">
                  {book.holdings.map((holding) => (
                    <HoldingRow key={holding.symbol} {...holding} />
                  ))}
                </div>
              </>
            ) : null}
            <p className="mt-4 text-xs font-medium text-muted">Add a holding</p>
            <div className="mt-1 flex gap-2">
              <input
                aria-label="Ticker"
                value={draft}
                onChange={(event) => setDraft(event.target.value.toUpperCase())}
                placeholder="NVDA"
                className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 font-mono uppercase"
              />
              <input
                aria-label="Shares"
                inputMode="decimal"
                value={shares}
                onChange={(event) => setShares(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") add();
                }}
                placeholder="shares"
                className="h-12 w-20 rounded-xl border border-line bg-bg px-2 text-right font-mono"
              />
              <input
                aria-label="Average cost, optional"
                inputMode="decimal"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") add();
                }}
                placeholder="cost"
                className="h-12 w-20 rounded-xl border border-line bg-bg px-2 text-right font-mono"
              />
            </div>
            {ideas.length && !ideas.some((idea) => idea.symbol === symbol) ? (
              <div className="mt-2 flex flex-col">
                {ideas.map((idea) => (
                  <button
                    key={idea.symbol}
                    type="button"
                    onClick={() => setDraft(idea.symbol)}
                    className="flex h-11 items-center justify-between text-left text-sm"
                  >
                    <span className="font-semibold">{idea.symbol}</span>
                    <span className="truncate pl-3 text-muted">{idea.name}</span>
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              disabled={!canAdd}
              onClick={add}
              className="mt-2 h-12 w-full rounded-xl bg-fg font-semibold text-bg disabled:opacity-40"
            >
              Add
            </button>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Fractional shares are fine. Average cost is optional and only used for your gain since entry. Holdings
              are saved on this device only.
            </p>
          </>
        )}
      </div>
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
