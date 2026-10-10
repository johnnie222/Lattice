import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, Filter, Search } from "lucide-react";
import { BOARDS, sectorLabel, type SectorId } from "@/data/universe";
import { Heatmap } from "@/components/heatmap";
import { BoardSheet, BookSheet, FilterSheet, InfoSheet, StockSheet, type SheetId } from "@/components/sheets";
import { TodaySheet, TodayStrip } from "@/components/today";
import { CloseSheet } from "@/components/close";
import { buildCloseFacts } from "@/lib/close-facts";
import { marketFacts, SECTOR_FUNDS } from "@/lib/market-facts";
import { analyzeBook, BENCHMARK_SYMBOL, bookSymbols, bookTileWeights } from "@/lib/book-analysis";
import { isLegacyBook } from "@/lib/book-model";
import { formatAsOf, formatPct, marketClock, sessionLabel, type Session } from "@/lib/format";
import {
  applyPriceWeights,
  boardById,
  boardNodes,
  findListing,
  matchesMove,
  matchesQuery,
  syntheticListing,
  weightedChange,
  type FilterId,
  type MapNode,
} from "@/lib/market";
import { useQuotes } from "@/lib/use-quotes";
import { useReferenceCloses } from "@/lib/use-reference-closes";
import {
  HEAT_SCALE,
  isLookback,
  PERIOD_LABEL,
  PERIODS,
  parsePeriod,
  periodMove,
  periodQuotes,
  type Period,
} from "@/lib/periods";
import { periodAnchorDate } from "@/lib/market-calendar";
import { activeBook, useBooks } from "@/store/books";

const DEFAULT_BOARD = "spx";

const CLOSE_WHEN: Record<Session, string> = {
  open: "Market open",
  post: "After the close",
  closed: "Market closed",
  pre: "Before the open",
  holiday: "Market holiday",
};
// Past this, quotes on screen are called out as delayed.
const STALE_MS: Record<Session, number> = {
  open: 3 * 60_000,
  pre: 6 * 60_000,
  post: 6 * 60_000,
  closed: Infinity,
  holiday: Infinity,
};

export function Lattice() {
  // Board, sector drill and search live in the URL so a view can be shared.
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const boardId =
    search.board === "book" || BOARDS.some((b) => b.id === search.board) ? search.board! : DEFAULT_BOARD;
  const drill = search.sector ?? null;
  const query = search.q ?? "";
  const setView = useCallback(
    (next: { board?: string; sector?: SectorId | null; q?: string; t?: Period }) => {
      void navigate({
        replace: true,
        search: (prev) => {
          const merged = { ...prev, ...next };
          return {
            board: merged.board && merged.board !== DEFAULT_BOARD ? merged.board : undefined,
            sector: merged.sector ?? undefined,
            q: merged.q?.trim() ? merged.q : undefined,
            t: merged.t && merged.t !== "1d" ? merged.t : undefined,
          };
        },
      });
    },
    [navigate],
  );
  const setDrill = useCallback((sector: SectorId | null) => setView({ sector }), [setView]);
  const setQuery = useCallback((q: string) => setView({ q }), [setView]);
  // The period changes only how moves are measured; board, sector and search stay.
  const period = parsePeriod(search.t);
  const setPeriod = useCallback((t: Period) => setView({ t }), [setView]);
  const [filter, setFilter] = useState<FilterId>("all");
  const [searchOpen, setSearchOpen] = useState(Boolean(search.q));
  const [sheet, setSheet] = useState<SheetId | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [clock, setClock] = useState<{ label: string; session: Session } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const board = boardById(boardId);
  const bookMode = boardId === "book";

  const rawNodes = useMemo(() => {
    if (bookMode) {
      // Tile sizes come from the analysis below; symbols must not depend on quotes.
      return bookSymbols(book).map((symbol): MapNode => {
        const listing = findListing(symbol) ?? syntheticListing(symbol);
        return {
          symbol: listing.symbol,
          name: listing.name,
          sector: listing.sector,
          industry: listing.industry,
          cap: listing.cap,
          weight: 1,
        };
      });
    }
    return boardNodes(board);
  }, [bookMode, book, board]);

  // Symbols come from the quote-independent nodes so price weighting can't
  // change the fetch key and restart polling.
  // The book also needs the S&P 500 for "vs S&P 500", and the sector funds
  // for Lattice Close's market context. Market maps fetch exactly as before.
  const symbols = useMemo(() => {
    const list = [...rawNodes].sort((a, b) => b.weight - a.weight).map((node) => node.symbol);
    if (!bookMode) return list;
    const extra = [BENCHMARK_SYMBOL, ...SECTOR_FUNDS.map((fund) => fund.symbol)];
    return [...list, ...extra.filter((symbol) => !list.includes(symbol))];
  }, [rawNodes, bookMode]);
  const { quotes, asOf, status } = useQuotes(symbols, refreshToken, bookMode);
  const priceWeighted = !bookMode && board.weighting === "price";
  const bookResult = useMemo(() => (bookMode ? analyzeBook(book, quotes) : null), [bookMode, book, quotes]);
  const closeFacts = useMemo(
    () =>
      bookResult
        ? buildCloseFacts(bookResult.kind === "holdings" ? bookResult.analysis : null, marketFacts(quotes))
        : null,
    [bookResult, quotes],
  );
  // Lookbacks compare the live price with a reference close from the history
  // layer. Only display uses them (colour, move, filters, counts); tile sizes,
  // Today and Close keep the live 1D quotes.
  const session = clock?.session ?? "closed";
  const anchor = periodAnchorDate(new Date(), period);
  const referenceSymbols = useMemo(() => rawNodes.map((node) => node.symbol), [rawNodes]);
  const references = useReferenceCloses(referenceSymbols, period, anchor, refreshToken);
  const displayQuotes = useMemo(
    () => periodQuotes(quotes, period, references.references),
    [quotes, period, references.references],
  );
  const lookback = isLookback(period);
  const baseNodes = useMemo(() => {
    if (bookResult) {
      const weights = bookTileWeights(book, bookResult);
      return rawNodes.map((node) => ({ ...node, weight: weights.get(node.symbol) ?? 0 })).filter((node) => node.weight > 0);
    }
    return priceWeighted ? applyPriceWeights(rawNodes, quotes) : rawNodes;
  }, [bookResult, book, priceWeighted, rawNodes, quotes]);

  const visible = useMemo(() => {
    return baseNodes.filter((node) => {
      if (drill && node.sector !== drill) return false;
      if (!matchesQuery(node, query)) return false;
      return matchesMove(displayQuotes[node.symbol]?.changePercent ?? null, filter);
    });
  }, [baseNodes, drill, query, filter, displayQuotes]);

  const sectorCount = useMemo(() => new Set(visible.map((node) => node.sector)).size, [visible]);
  const grouped = !bookMode && board.grouped && !drill && !query && sectorCount > 1 && visible.length > 24;
  // In book mode the headline comes from the engine, which never presents a
  // partial book's return as complete; the map's weighted move would.
  const bookReturn = bookResult ? bookResult.analysis.returnPercent : null;
  // A lookback over a book would be a current-holdings lookback, not account
  // performance; it isn't aggregated, only shown per holding on the tiles.
  // A lookback headline waits for every batch, then says when it only covers
  // the names that have a reference close (some missing, or some unavailable).
  const lookbackMove = useMemo(
    () =>
      lookback && !bookMode && (references.status === "ready" || references.status === "error")
        ? periodMove(visible, displayQuotes, priceWeighted)
        : null,
    [lookback, bookMode, references.status, visible, displayQuotes, priceWeighted],
  );
  const lookbackPartial = lookbackMove != null && lookbackMove.covered < lookbackMove.total;
  const move = bookMode
    ? lookback
      ? null
      : bookReturn
    : lookback
      ? (lookbackMove?.percent ?? null)
      : weightedChange(visible.length ? visible : baseNodes, displayQuotes);
  const quoted = visible.filter((node) => displayQuotes[node.symbol]?.changePercent != null);
  const ups = quoted.filter((node) => (displayQuotes[node.symbol]?.changePercent ?? 0) > 0.05).length;
  const downs = quoted.filter((node) => (displayQuotes[node.symbol]?.changePercent ?? 0) < -0.05).length;

  const title = bookMode ? book.name : drill ? sectorLabel(drill) : board.title;
  const subtitle = bookMode
    ? isLegacyBook(book)
      ? "Your weights"
      : "Your holdings"
    : drill
      ? board.title
      : board.name !== board.title
        ? board.name
        : "";

  useEffect(() => {
    const tick = () => setClock(marketClock());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = `${title} · LATTICE`;
  }, [title]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "Escape") {
        if (sheet) setSheet(null);
        else if (drill) setDrill(null);
        else if (searchOpen) setSearchOpen(false);
      } else if (event.key === "/" && !sheet) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet, drill, searchOpen, setDrill]);

  const onSelect = useCallback((symbol: string) => {
    setSelected(symbol);
    setSheet("stock");
  }, []);

  const onDrill = useCallback(
    (sector: SectorId) => {
      setDrill(sector);
      setSheet(null);
    },
    [setDrill],
  );

  const now = Date.now();
  const stale = asOf != null && (status === "error" || now - asOf > STALE_MS[session]);
  const asOfLabel = asOf != null ? formatAsOf(asOf, now) : null;
  const showMap = visible.length > 0;
  const bookEmpty = bookMode && bookSymbols(book).length === 0;
  const bookPartial = bookResult != null && !bookResult.analysis.complete && bookSymbols(book).length > 0;
  // Wait for the browser's NYSE clock before offering the Close surface.
  const closeMode = clock != null && session !== "open";

  return (
    <main className="flex h-dvh flex-col bg-bg text-fg">
      <header className="safe-t shrink-0 px-2 pb-2">
        <div className="flex items-center gap-1">
          {drill ? (
            <button
              type="button"
              onClick={() => setDrill(null)}
              className="grid size-11 shrink-0 place-items-center rounded-xl"
              aria-label="Back to full map"
            >
              <ChevronLeft className="size-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRefreshToken((n) => n + 1)}
              className="flex h-11 shrink-0 items-center gap-2 rounded-xl px-2"
              aria-label="Refresh quotes"
            >
              <span className={`size-2 rounded-full ${session === "open" ? "bg-up" : "bg-muted"}`} />
              <span className={`font-mono text-sm ${session === "open" ? "text-up" : "text-muted"}`}>
                {clock?.label ?? "--:--:--"}
              </span>
            </button>
          )}
          <div className="min-w-0 flex-1 text-center">
            {drill ? (
              <p className="truncate text-base font-semibold tracking-tight">{title}</p>
            ) : (
              <button
                type="button"
                onClick={() => setSheet("boards")}
                className="inline-flex max-w-full items-center justify-center gap-1"
              >
                <span className="truncate text-base font-semibold tracking-tight">{title}</span>
                <ChevronDown className="size-4 shrink-0 text-muted" />
              </button>
            )}
            <p className={`font-mono text-sm font-medium ${move == null ? "text-muted" : move >= 0 ? "text-up" : "text-down"}`}>
              {move != null
                ? `${formatPct(move)}${lookback ? ` · ${PERIOD_LABEL[period]}${lookbackPartial ? " · partial" : ""}` : ""}`
                : bookMode && lookback
                  ? `${PERIOD_LABEL[period]} price moves`
                  : lookback && references.status === "loading"
                    ? `Loading ${PERIOD_LABEL[period]}`
                    : lookback && references.status === "ready"
                      ? `No ${PERIOD_LABEL[period]} reference closes`
                    : lookback && references.status === "error"
                      ? `${PERIOD_LABEL[period]} unavailable`
                    : bookPartial && quoted.length
                      ? "Partial data"
                      : status === "error"
                        ? "Tape delayed"
                        : "Loading tape"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Search"
            aria-pressed={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Filter"
            onClick={() => setSheet("filter")}
            className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-surface"
          >
            <Filter className="size-5" />
            {filter !== "all" ? <span className="absolute right-2 top-2 size-1.5 rounded-full bg-up" /> : null}
          </button>
        </div>
        <p className="truncate px-2 text-center text-xs text-muted">
          {subtitle ? `${subtitle} · ` : ""}
          {sessionLabel(session)}
          {quoted.length && !bookMode ? ` · ${ups} up · ${downs} down` : ""}
          {asOfLabel ? (
            <span className={stale ? "text-down" : undefined}>
              {stale ? ` · Delayed, as of ${asOfLabel}` : ` · as of ${asOfLabel}`}
            </span>
          ) : null}

        </p>
        {lookback && !bookMode ? (
          <p className="px-2 text-center text-xs text-muted">
            {priceWeighted ? "Price-weighted basket · " : "Weighted price moves · "}
            {lookbackMove ? `${lookbackMove.covered} of ${lookbackMove.total} priced` : "Loading coverage"}
          </p>
        ) : null}
        <div className="mt-1 flex justify-center" role="radiogroup" aria-label="Period">
          {PERIODS.map((item) => (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={item === period}
              onClick={() => setPeriod(item)}
              className={`h-8 min-w-12 rounded-lg px-2 font-mono text-xs font-semibold ${item === period ? "bg-surface-2 text-fg" : "text-muted"}`}
            >
              {PERIOD_LABEL[item]}
            </button>
          ))}
        </div>
        {bookResult && !bookEmpty ? (
          <div className="mt-2 flex gap-2">
            {closeMode ? (
              <TodayStrip
                result={bookResult}
                label="Close"
                ariaLabel="Open Lattice Close"
                onOpen={() => setSheet("close")}
              />
            ) : (
              <TodayStrip result={bookResult} onOpen={() => setSheet("today")} />
            )}
            <button
              type="button"
              onClick={() => setSheet("book")}
              className="shrink-0 rounded-xl border border-line bg-surface px-3 text-sm font-medium"
            >
              Edit book
            </button>
          </div>
        ) : null}
        {searchOpen ? (
          <div className="mt-2 flex items-center gap-2 px-1">
            <input
              ref={searchRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ticker, name, or industry"
              aria-label="Search the map"
              className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 text-sm"
            />
            {query ? (
              <button type="button" className="h-11 px-2 text-sm text-muted" onClick={() => setQuery("")}>
                Clear
              </button>
            ) : null}
          </div>
        ) : null}
      </header>
      <div className="relative min-h-0 flex-1">
        {bookEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-lg font-semibold">Build a book</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Add the stocks you hold and how many shares. Tile size follows each holding’s value. Color is
              today’s move. Everything stays on this device.
            </p>
            <button
              type="button"
              onClick={() => setSheet("book")}
              className="h-12 rounded-xl bg-fg px-5 font-semibold text-bg"
            >
              Add positions
            </button>
          </div>
        ) : showMap ? (
          <Heatmap
            nodes={visible}
            quotes={displayQuotes}
            heatScale={HEAT_SCALE[period]}
            grouped={grouped}
            selected={sheet === "stock" ? selected : null}
            onSelect={onSelect}
            onDrill={onDrill}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-lg font-semibold">Nothing in this cut</p>
            <p className="text-sm text-muted">Try another filter or a shorter search.</p>
            <button
              type="button"
              className="h-11 rounded-xl border border-line px-4 text-sm font-medium"
              onClick={() => {
                setFilter("all");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {sheet === "boards" ? (
        <BoardSheet
          boardId={boardId}
          bookName={book.name}
          bookCount={bookSymbols(book).length}
          onPick={(id) => {
            setView({ board: id, sector: null });
            setSheet(null);
          }}
          onBook={() => {
            setView({ board: "book", sector: null });
            setSheet(null);
          }}
          onInfo={() => setSheet("info")}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet === "filter" ? (
        <FilterSheet filter={filter} onChange={setFilter} onClose={() => setSheet(null)} />
      ) : null}
      {sheet === "info" ? <InfoSheet onClose={() => setSheet(null)} /> : null}
      {sheet === "book" ? <BookSheet quotes={quotes} onClose={() => setSheet(null)} /> : null}
      {(sheet === "today" || (sheet === "close" && !closeMode)) && bookResult ? <TodaySheet result={bookResult} onClose={() => setSheet(null)} /> : null}
      {sheet === "close" && closeMode && closeFacts && bookResult ? (
        <CloseSheet
          facts={closeFacts}
          when={`${CLOSE_WHEN[session]}${asOfLabel ? ` · as of ${asOfLabel}` : ""}`}
          legacy={bookResult.kind === "legacy"}
          onToday={() => setSheet("today")}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet === "stock" && selected ? (
        <StockSheet
          key={selected}
          symbol={selected}
          quote={displayQuotes[selected]}
          periodLabel={lookback ? PERIOD_LABEL[period] : null}
          node={baseNodes.find((node) => node.symbol === selected) ?? visible.find((node) => node.symbol === selected)}
          book={book}
          canDrill={!bookMode && board.grouped && !drill}
          onDrill={onDrill}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </main>
  );
}
