import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ListFilter, Search, Settings } from "lucide-react";
import { BOARDS, sectorLabel, type SectorId } from "@/data/universe";
import { Heatmap } from "@/components/heatmap";
import { BoardSheet, BookSheet, FilterSheet, InfoSheet, StockSheet, type SheetId } from "@/components/sheets";
import { SettingsSheet } from "@/components/settings-sheet";
import { formatAsOf, formatLevel, formatPct, marketClock, type Session } from "@/lib/format";
import {
  applyPriceWeights,
  benchmarkSymbol,
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
import { useApplyTheme } from "@/lib/theme";
import { activeBook, useBooks } from "@/store/books";

function formatDollars(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

const SESSION_TEXT: Record<Session, string> = {
  open: "Market Open",
  pre: "Pre-Market",
  post: "After Hours",
  closed: "Market Closed",
  holiday: "Market Holiday",
};

function GlassButton({
  label,
  onClick,
  pressed,
  dot,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`glass glass-pressable relative grid size-11 shrink-0 place-items-center rounded-full ${pressed ? "text-accent" : "text-fg"}`}
    >
      {children}
      {dot ? <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" /> : null}
    </button>
  );
}

const DEFAULT_BOARD = "spx";
// Past this, quotes on screen are called out as delayed.
const STALE_MS: Record<Session, number> = {
  open: 3 * 60_000,
  pre: 6 * 60_000,
  post: 6 * 60_000,
  closed: Infinity,
  holiday: Infinity,
};

export function Lattice() {
  useApplyTheme();
  // Board, sector drill and search live in the URL so a view can be shared.
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const boardId =
    search.board === "book" || BOARDS.some((b) => b.id === search.board) ? search.board! : DEFAULT_BOARD;
  const drill = search.sector ?? null;
  const query = search.q ?? "";
  const setView = useCallback(
    (next: { board?: string; sector?: SectorId | null; q?: string }) => {
      void navigate({
        replace: true,
        search: (prev) => {
          const merged = { ...prev, ...next };
          return {
            board: merged.board && merged.board !== DEFAULT_BOARD ? merged.board : undefined,
            sector: merged.sector ?? undefined,
            q: merged.q?.trim() ? merged.q : undefined,
          };
        },
      });
    },
    [navigate],
  );
  const setDrill = useCallback((sector: SectorId | null) => setView({ sector }), [setView]);
  const setQuery = useCallback((q: string) => setView({ q }), [setView]);
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
      return book.lines
        .filter((line) => line.weight > 0)
        .map((line): MapNode => {
          const listing = findListing(line.symbol) ?? syntheticListing(line.symbol);
          return {
            symbol: listing.symbol,
            name: listing.name,
            sector: listing.sector,
            industry: listing.industry,
            cap: listing.cap,
            weight: line.weight,
          };
        });
    }
    return boardNodes(board);
  }, [bookMode, book.lines, board]);

  // Symbols come from the quote-independent nodes so price weighting can't
  // change the fetch key and restart polling.
  // The benchmark (index level or fund price) rides along in the same fetch.
  const bench = bookMode ? null : benchmarkSymbol(board);
  const symbols = useMemo(() => {
    const list = [...rawNodes].sort((a, b) => b.weight - a.weight).map((node) => node.symbol);
    return bench ? [bench, ...list.filter((symbol) => symbol !== bench)] : list;
  }, [rawNodes, bench]);
  const { quotes, asOf, status } = useQuotes(symbols, refreshToken);
  const priceWeighted = !bookMode && board.weighting === "price";
  const baseNodes = useMemo(
    () => (priceWeighted ? applyPriceWeights(rawNodes, quotes) : rawNodes),
    [priceWeighted, rawNodes, quotes],
  );

  const visible = useMemo(() => {
    return baseNodes.filter((node) => {
      if (drill && node.sector !== drill) return false;
      if (!matchesQuery(node, query)) return false;
      return matchesMove(quotes[node.symbol]?.changePercent ?? null, filter);
    });
  }, [baseNodes, drill, query, filter, quotes]);

  const sectorCount = useMemo(() => new Set(visible.map((node) => node.sector)).size, [visible]);
  const grouped = !bookMode && board.grouped && !drill && !query && sectorCount > 1 && visible.length > 24;
  const move = weightedChange(visible.length ? visible : baseNodes, quotes);
  const quoted = visible.filter((node) => quotes[node.symbol]);
  const ups = quoted.filter((node) => (quotes[node.symbol]?.changePercent ?? 0) > 0.05).length;
  const downs = quoted.filter((node) => (quotes[node.symbol]?.changePercent ?? 0) < -0.05).length;

  const title = bookMode ? book.name : drill ? sectorLabel(drill) : board.title;

  useEffect(() => {
    const tick = () => setClock(marketClock());
    tick();
    const timer = window.setInterval(tick, 10_000);
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

  const session = clock?.session ?? "closed";
  const now = Date.now();
  const stale = asOf != null && (status === "error" || now - asOf > STALE_MS[session]);
  const asOfLabel = asOf != null ? formatAsOf(asOf, now) : null;
  const pnl = bookMode && book.notional && move != null ? (book.notional * move) / 100 : null;
  const showMap = visible.length > 0;
  const bookEmpty = bookMode && book.lines.filter((line) => line.weight > 0).length === 0;

  // Headline: the real index level / fund price when we have it; otherwise
  // the weighted move of what's on screen.
  const benchQuote = bench && !drill ? quotes[bench] : undefined;
  const headPct = benchQuote ? benchQuote.changePercent : move;
  const headUp = (headPct ?? 0) >= 0;
  const caption = bookMode
    ? "Your portfolio · today"
    : drill
      ? `${board.title} · ${sectorLabel(drill)} sector`
      : benchQuote
        ? board.group === "Index"
          ? `${board.name === "US market" ? "S&P 500" : board.title} index`
          : `${board.name} · fund price`
        : "Weighted move";
  const updated = asOfLabel
    ? stale
      ? `Delayed ${asOfLabel}`
      : asOfLabel
    : status === "error"
      ? "Prices unavailable"
      : "Updating…";
  const flats = quoted.length - ups - downs;
  const mood = headPct == null ? "transparent" : headUp ? "var(--up-text)" : "var(--dn-text)";

  return (
    <main
      className="ambient flex h-dvh flex-col pb-[env(safe-area-inset-bottom)] text-fg"
      style={{ "--mood": mood } as CSSProperties}
    >
      <header className="safe-t shrink-0 px-3 pb-2">
        <div className="flex h-12 items-center gap-2">
          {drill ? (
            <GlassButton label="Back to full map" onClick={() => setDrill(null)}>
              <ChevronLeft className="size-5" />
            </GlassButton>
          ) : null}
          <div className="min-w-0 flex-1 pl-1">
            {drill ? (
              <h1 className="truncate text-[28px] font-bold leading-tight tracking-tight">{title}</h1>
            ) : (
              <button
                type="button"
                onClick={() => setSheet("boards")}
                className="flex max-w-full items-center gap-1 text-left"
              >
                <h1 className="truncate text-[28px] font-bold leading-tight tracking-tight">{title}</h1>
                <ChevronDown className="mt-1 size-5 shrink-0 text-muted" strokeWidth={2.5} />
              </button>
            )}
          </div>
          <GlassButton label="Search" pressed={searchOpen} onClick={() => setSearchOpen((open) => !open)}>
            <Search className="size-[18px]" strokeWidth={2.25} />
          </GlassButton>
          <GlassButton label="Filter" dot={filter !== "all"} onClick={() => setSheet("filter")}>
            <ListFilter className="size-[18px]" strokeWidth={2.25} />
          </GlassButton>
          <GlassButton label="Settings" onClick={() => setSheet("settings")}>
            <Settings className="size-[19px]" strokeWidth={2.1} />
          </GlassButton>
        </div>

        <div className="mt-1 px-1">
          <div className="flex items-center justify-between gap-3 text-[13px] text-muted">
            <p className="min-w-0 truncate">
              {caption}
              {bookMode ? (
                <>
                  {" · "}
                  <button type="button" className="font-semibold text-accent" onClick={() => setSheet("book")}>
                    Edit
                  </button>
                </>
              ) : null}
            </p>
            <button
              type="button"
              onClick={() => setRefreshToken((n) => n + 1)}
              aria-label={`${SESSION_TEXT[session]}. ${updated}. Refresh prices`}
              className="flex shrink-0 items-center gap-1.5"
            >
              <span className={`size-1.5 rounded-full ${session === "open" ? "bg-up" : "bg-muted"}`} />
              <span>{SESSION_TEXT[session]}</span>
              <span className={stale || status === "error" ? "text-down" : undefined}>· {updated}</span>
            </button>
          </div>
          <div className="mt-0.5 flex items-center gap-2.5">
            <span className="tabular text-[34px] font-semibold leading-tight tracking-tight">
              {benchQuote ? formatLevel(benchQuote.price) : headPct != null ? formatPct(headPct) : "—"}
            </span>
            {headPct != null && (benchQuote || pnl != null) ? (
              <span
                className={`tabular shrink-0 rounded-full px-2.5 py-1 text-[13px] font-semibold ${headUp ? "text-up" : "text-down"}`}
                style={{
                  background: `color-mix(in srgb, ${headUp ? "var(--up-text)" : "var(--dn-text)"} 16%, transparent)`,
                }}
              >
                {benchQuote
                  ? `${benchQuote.change >= 0 ? "▲" : "▼"} ${Math.abs(benchQuote.change).toFixed(2)} (${Math.abs(benchQuote.changePercent).toFixed(2)}%)`
                  : formatDollars(pnl ?? 0)}
              </span>
            ) : null}
          </div>
        </div>

        {quoted.length ? (
          <div className="mt-2 px-1" aria-label={`${ups} advancing, ${downs} declining`}>
            <div className="flex h-1 overflow-hidden rounded-full bg-line">
              <span className="bg-up" style={{ width: `${(ups / quoted.length) * 100}%` }} />
              <span className="bg-line" style={{ width: `${(flats / quoted.length) * 100}%` }} />
              <span className="bg-down" style={{ width: `${(downs / quoted.length) * 100}%` }} />
            </div>
            <div className="tabular mt-1 flex justify-between text-[11px] font-medium text-muted">
              <span>{ups} advancing</span>
              <span>{downs} declining</span>
            </div>
          </div>
        ) : null}

        {searchOpen ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="glass flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full px-4">
              <Search className="size-4 shrink-0 text-muted" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ticker, company, or industry"
                aria-label="Search the map"
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
              />
            </div>
            <button
              type="button"
              className="h-11 px-1 text-[15px] font-medium text-accent"
              onClick={() => {
                setQuery("");
                setSearchOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : null}
      </header>
      <div className="relative min-h-0 flex-1 px-1.5 pb-1.5">
        {bookEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-lg font-semibold">Build a book</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Add tickers and a weight for each. Tile size follows the weight. Color is today’s move.
            </p>
            <button
              type="button"
              onClick={() => setSheet("book")}
              className="glass-pressable h-12 rounded-full bg-fg px-6 font-semibold text-bg"
            >
              Add positions
            </button>
          </div>
        ) : showMap ? (
          <Heatmap
            nodes={visible}
            quotes={quotes}
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
              className="glass glass-pressable h-11 rounded-full px-5 text-sm font-medium"
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
          bookCount={book.lines.length}
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
      {sheet === "settings" ? (
        <SettingsSheet
          asOf={asOf}
          status={status}
          onInfo={() => setSheet("info")}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet === "book" ? <BookSheet onClose={() => setSheet(null)} /> : null}
      {sheet === "stock" && selected ? (
        <StockSheet
          key={selected}
          symbol={selected}
          quote={quotes[selected]}
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
