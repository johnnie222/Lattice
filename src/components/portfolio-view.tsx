import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronDown, Plus, Settings } from "lucide-react";
import { GlassButton, LargeTitle, Segmented } from "@/components/chrome";
import { InfoSheet, ListGroup, ListRow, Sheet } from "@/components/sheets";
import { SettingsSheet } from "@/components/settings-sheet";
import { PositionSheet } from "@/components/position-sheet";
import { Mark } from "@/components/mark";
import { Heatmap } from "@/components/heatmap";
import { CloseSheet, TodayCard, TodaySheet } from "@/components/today-close";
import { buildCloseFacts } from "@/lib/close-facts";
import { formatAsOf, formatMoney, formatPct, formatShares, marketClock, type Session } from "@/lib/format";
import { findListing, syntheticListing, type MapNode } from "@/lib/market";
import { marketFacts, SECTOR_FUNDS } from "@/lib/market-facts";
import { PERIOD_LABEL, type Period } from "@/lib/periods";
import {
  analyzeBook,
  BENCHMARK_SYMBOL,
  bookTileWeights,
  holdingsLookback,
  sinceEntryRows,
  sizeBook,
} from "@/lib/portfolio";
import type { Quote } from "@/lib/quote-core";
import { usePeriodQuotes, usePeriodWords } from "@/lib/use-period";
import { useQuotes } from "@/lib/use-quotes";
import { activeBook, useBooks } from "@/store/books";

type PortfolioPeriod = Period | "all";

const OPTIONS: { id: PortfolioPeriod; label: string }[] = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "ytd", label: "YTD" },
  { id: "all", label: "All" },
];

type Layout = "map" | "list";
const LAYOUTS: { id: Layout; label: string }[] = [
  { id: "map", label: "Map" },
  { id: "list", label: "List" },
];

const CLOSE_WHEN: Record<Session, string> = {
  open: "Market open",
  post: "After the close",
  closed: "Market closed",
  pre: "Before the open",
  holiday: "Market holiday",
};

function tone(n: number | null | undefined): string {
  if (n == null) return "text-muted";
  return n >= 0 ? "text-up" : "text-down";
}

function PortfoliosSheet({ onClose }: { onClose: () => void }) {
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const setActive = useBooks((s) => s.setActive);
  const newBook = useBooks((s) => s.newBook);
  const rename = useBooks((s) => s.rename);
  const removeActive = useBooks((s) => s.removeActive);
  const [confirm, setConfirm] = useState(false);

  return (
    <Sheet title="Portfolios" onClose={onClose}>
      <ListGroup>
        {books.map((item) => (
          <ListRow
            key={item.id}
            title={item.name}
            subtitle={`${item.positions.length} ${item.positions.length === 1 ? "position" : "positions"}`}
            checked={item.id === book.id}
            onClick={() => {
              setActive(item.id);
              setConfirm(false);
            }}
          />
        ))}
        <ListRow title={<span className="text-accent">New Portfolio</span>} onClick={newBook} />
      </ListGroup>
      <ListGroup title="Name">
        <label className="flex min-h-12 items-center px-4">
          <input
            value={book.name}
            onChange={(event) => rename(event.target.value)}
            aria-label="Portfolio name"
            className="w-full bg-transparent text-[15px] outline-none"
          />
        </label>
      </ListGroup>
      <ListGroup>
        <ListRow
          tone="danger"
          title={
            confirm
              ? `Tap again to ${books.length === 1 ? "clear" : "delete"} “${book.name}”`
              : books.length === 1
                ? "Clear Portfolio"
                : "Delete Portfolio"
          }
          onClick={() => {
            if (!confirm) return setConfirm(true);
            removeActive();
            setConfirm(false);
          }}
        />
      </ListGroup>
    </Sheet>
  );
}

/** "▲ $22.94 (0.21%)" or "▲ 1.20%": the summary card's change line. */
function Arrow({ value, money, pct }: { value: number; money?: number | null; pct?: number | null }) {
  return (
    <>
      {value >= 0 ? "▲" : "▼"}{" "}
      {money != null
        ? `${formatMoney(Math.abs(money))}${pct != null ? ` (${Math.abs(pct).toFixed(2)}%)` : ""}`
        : `${Math.abs(pct ?? 0).toFixed(2)}%`}
    </>
  );
}

function Muted({ children }: { children: ReactNode }) {
  return <span className="font-normal text-muted">{children}</span>;
}

/**
 * Your portfolio: value and today's move from the portfolio intelligence
 * engine, Today / Close, and each position as a map or list. Lookbacks show
 * what the positions held now did over the window; they are not the
 * account's past return, since Lattice doesn't know your trade history.
 */
export function PortfolioView() {
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const [period, setPeriod] = useState<PortfolioPeriod>("1d");
  const [layout, setLayout] = useState<Layout>("map");
  const setAnchors = useBooks((s) => s.setAnchors);
  const [sheet, setSheet] = useState<"settings" | "info" | "portfolios" | "position" | "today" | "close" | null>(
    null,
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [clock, setClock] = useState<{ label: string; session: Session } | null>(null);

  useEffect(() => {
    const tick = () => setClock(marketClock());
    tick();
    const timer = window.setInterval(tick, 10_000);
    return () => window.clearInterval(timer);
  }, []);

  const positionSymbols = useMemo(() => book.positions.map((p) => p.symbol), [book.positions]);
  // The S&P 500 for "vs S&P 500", and the sector funds for Lattice Close's
  // market context. One refresh is committed at once (waitForAll).
  const symbols = useMemo(
    () => [...new Set([...positionSymbols, BENCHMARK_SYMBOL, ...SECTOR_FUNDS.map((fund) => fund.symbol)])],
    [positionSymbols],
  );
  const live = useQuotes(positionSymbols.length ? symbols : [], refreshToken, true);
  const span: Period = period === "all" ? "1d" : period;
  const periodQuotes = usePeriodQuotes(positionSymbols, live.quotes, span, refreshToken);

  const sectors = useMemo(
    () => Object.fromEntries(positionSymbols.map((s) => [s, findListing(s)?.sector ?? "other"])),
    [positionSymbols],
  );
  const result = useMemo(() => analyzeBook(book, live.quotes, sectors), [book, live.quotes, sectors]);
  const sizing = useMemo(() => sizeBook(book, (s) => live.quotes[s]?.price ?? null), [book, live.quotes]);
  const tileWeights = useMemo(() => bookTileWeights(book, result, live.quotes), [book, result, live.quotes]);
  const lookback = useMemo(
    () =>
      periodQuotes.lookback && periodQuotes.status !== "loading" ? holdingsLookback(book, periodQuotes.display) : null,
    [book, periodQuotes],
  );
  const since = useMemo(() => sinceEntryRows(book, live.quotes), [book, live.quotes]);
  const closeFacts = useMemo(
    () => buildCloseFacts(result.kind === "holdings" ? result.analysis : null, marketFacts(live.quotes)),
    [result, live.quotes],
  );

  // Positions added before a quote was in (or migrated) start from the first price seen.
  useEffect(() => {
    const missing = book.positions.filter((p) => p.anchor == null && live.quotes[p.symbol]);
    if (missing.length) setAnchors(Object.fromEntries(missing.map((p) => [p.symbol, live.quotes[p.symbol]!.price])));
  }, [book.positions, live.quotes, setAnchors]);

  const spanWords = usePeriodWords(period === "all" ? "1d" : period);
  const words = period === "all" ? "since entry" : spanWords;
  const holdings = result.kind === "holdings" ? result.analysis : null;
  const weights = result.kind === "weights" ? result.analysis : null;
  const lookbackComplete = lookback != null && lookback.percent != null && lookback.covered === lookback.total;

  // The figure the change line (and, for percent portfolios, the big number) reports.
  let figure: number | null = null;
  let change: ReactNode;
  if (period === "1d") {
    if (holdings) {
      if (holdings.dayChange == null) {
        change = <Muted>{live.status === "error" ? "Prices unavailable" : "Loading…"}</Muted>;
      } else if (holdings.complete) {
        figure = holdings.returnPercent;
        change = (
          <>
            <Arrow value={holdings.dayChange} money={holdings.dayChange} pct={holdings.returnPercent} />
            <Muted> · {words}</Muted>
          </>
        );
      } else {
        change = (
          <>
            <Arrow value={holdings.dayChange} money={holdings.dayChange} />
            <Muted>
              {" "}
              known · {holdings.coverage.priced} of {holdings.coverage.holdings} priced
            </Muted>
          </>
        );
      }
    } else if (weights) {
      if (weights.complete && weights.returnPercent != null) {
        figure = weights.returnPercent;
        change = (
          <>
            <Arrow value={weights.returnPercent} pct={weights.returnPercent} />
            <Muted> · {words}</Muted>
          </>
        );
      } else if (weights.knownContributionPercent != null) {
        change = <Muted>Partial · {Math.round((weights.coverageRatio ?? 0) * 100)}% of portfolio priced</Muted>;
      } else {
        change = <Muted>{live.status === "error" ? "Prices unavailable" : "Loading…"}</Muted>;
      }
    }
  } else if (period === "all") {
    if (holdings?.sinceEntry) {
      const s = holdings.sinceEntry;
      figure = s.complete ? s.percent : null;
      change = (
        <>
          <Arrow value={s.change} money={s.change} pct={s.percent} />
          <Muted>
            {" "}
            · since entry
            {s.complete ? "" : ` · ${s.holdings} of ${holdings.coverage.holdings} with a cost`}
          </Muted>
        </>
      );
    } else {
      change = <Muted>{holdings ? "Add an average cost to see since entry" : "Since added · each position below"}</Muted>;
    }
  } else if (periodQuotes.status === "loading") {
    change = <Muted>Loading {words}</Muted>;
  } else if (lookbackComplete) {
    figure = lookback!.percent;
    change = (
      <>
        <Arrow value={lookback!.percent!} pct={lookback!.percent} />
        <Muted> · current holdings, {words}</Muted>
      </>
    );
  } else if (lookback == null) {
    change = <Muted>Mixed portfolio · each position below</Muted>;
  } else if (periodQuotes.status === "error" && lookback.covered === 0) {
    change = <Muted>{PERIOD_LABEL[span]} unavailable</Muted>;
  } else {
    change = (
      <Muted>
        {lookback.covered} of {lookback.total} have a {PERIOD_LABEL[span]} close
      </Muted>
    );
  }
  const mood = figure == null ? "transparent" : figure >= 0 ? "var(--up-text)" : "var(--dn-text)";

  const label = holdings
    ? holdings.complete || holdings.coverage.priced === 0
      ? "Total value"
      : `Priced value · ${holdings.coverage.priced} of ${holdings.coverage.holdings}`
    : "Percent-based portfolio";
  const big = holdings
    ? holdings.value != null
      ? formatMoney(holdings.value)
      : holdings.coverage.priced
        ? formatMoney(holdings.pricedValue)
        : "—"
    : formatPct(figure);

  // Each tile and row shows that position's own move for the chosen window.
  const rowQuotes = useMemo(() => {
    if (period !== "all") return period === "1d" ? live.quotes : periodQuotes.display;
    const out: Record<string, Quote> = {};
    for (const [symbol, row] of since) {
      out[symbol] = {
        symbol,
        price: live.quotes[symbol]!.price,
        previousClose: null,
        change: row.change,
        changePercent: row.percent,
      };
    }
    return out;
  }, [period, live.quotes, periodQuotes.display, since]);

  const mapNodes = useMemo(
    (): MapNode[] =>
      book.positions
        .filter((p) => (tileWeights.get(p.symbol) ?? 0) > 0)
        .map((p) => {
          const listing = findListing(p.symbol) ?? syntheticListing(p.symbol);
          return {
            symbol: p.symbol,
            name: listing.name,
            sector: listing.sector,
            industry: listing.industry,
            cap: listing.cap,
            weight: tileWeights.get(p.symbol)!,
          };
        }),
    [book.positions, tileWeights],
  );
  const ordered = useMemo(
    () => [...sizing.rows].sort((a, b) => (tileWeights.get(b.symbol) ?? 0) - (tileWeights.get(a.symbol) ?? 0)),
    [sizing, tileWeights],
  );

  const session = clock?.session ?? "closed";
  // Wait for the browser's NYSE clock before offering the Close surface.
  const closeMode = clock != null && session !== "open";

  const openPosition = (symbol: string | null) => {
    setEditing(symbol);
    setSheet("position");
  };

  const footer =
    period === "1d"
      ? "Each position’s move today, from its previous close."
      : period === "all"
        ? "From your average cost. Percent positions count from the price when you added them."
        : `Each position’s own price move over the ${words.replace("past ", "")}, from its closing price at the start. This is not your account’s past return: Lattice doesn’t know when you bought or sold.`;

  return (
    <div className="ambient flex min-h-0 flex-1 flex-col" style={{ "--mood": mood } as CSSProperties}>
      <header className="safe-t shrink-0 px-3 pb-2">
        <div className="flex h-12 items-center gap-2">
          <div className="min-w-0 flex-1 pl-1">
            <button
              type="button"
              onClick={() => setSheet("portfolios")}
              className="flex w-full min-w-0 items-center gap-1 text-left"
              aria-label={`${book.name}. Switch portfolio`}
            >
              <LargeTitle>{book.name}</LargeTitle>
              <ChevronDown className="mt-1 size-5 shrink-0 text-muted" strokeWidth={2.5} />
            </button>
          </div>
          <GlassButton label="Add position" onClick={() => openPosition(null)}>
            <Plus className="size-5" strokeWidth={2.4} />
          </GlassButton>
          <GlassButton label="Settings" onClick={() => setSheet("settings")}>
            <Settings className="size-[19px]" strokeWidth={2.1} />
          </GlassButton>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
        {book.positions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <p className="text-lg font-semibold">No positions yet</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Add what you hold, as shares with an average cost, or just as a percentage if you’d rather not record
              amounts.
            </p>
            <button
              type="button"
              onClick={() => openPosition(null)}
              className="glass-pressable h-12 rounded-full bg-accent px-6 font-semibold text-white"
            >
              Add Your First Position
            </button>
          </div>
        ) : (
          <>
            <section className="glass mb-3 rounded-3xl p-4">
              <button
                type="button"
                onClick={() => setRefreshToken((n) => n + 1)}
                aria-label="Refresh prices"
                className={`text-left text-[13px] ${live.status === "error" ? "text-down" : "text-muted"}`}
              >
                {label}
                {live.asOf ? ` · ${formatAsOf(live.asOf)}` : live.status === "error" ? " · prices unavailable" : ""}
              </button>
              <p className="tabular mt-0.5 text-[34px] font-semibold leading-tight tracking-tight">{big}</p>
              <p className={`tabular mt-0.5 text-[15px] font-semibold ${tone(figure)}`} data-testid="portfolio-change">
                {change}
              </p>
              <div className="mt-3">
                <Segmented label="Time frame" value={period} options={OPTIONS} onChange={setPeriod} compact />
              </div>
              {result.kind === "weights" && result.mixed ? (
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  This portfolio mixes shares and percentages, which older versions allowed. Percentages are read as a
                  share of the total{result.overflow ? ", but they add up to 100% or more" : ""}. For accurate
                  tracking, keep one kind per portfolio.
                </p>
              ) : null}
            </section>

            <TodayCard result={result} close={closeMode} onOpen={() => setSheet(closeMode ? "close" : "today")} />

            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-[13px] font-medium uppercase tracking-wide text-muted">
                {book.positions.length} {book.positions.length === 1 ? "position" : "positions"}
              </h3>
              <Segmented label="Layout" value={layout} options={LAYOUTS} onChange={setLayout} />
            </div>
            {layout === "map" ? (
              <div className="relative h-[max(320px,calc(100dvh-480px))]">
                <Heatmap
                  nodes={mapNodes}
                  quotes={rowQuotes}
                  period={period === "all" ? "ytd" : period}
                  grouped={false}
                  selected={null}
                  onSelect={(symbol) => openPosition(symbol)}
                  onDrill={() => undefined}
                />
              </div>
            ) : (
              <ListGroup footer={footer}>
                {ordered.map((row) => {
                  const p = row.position;
                  const quote = rowQuotes[row.symbol];
                  const priced = holdings?.positions.find((h) => h.symbol === row.symbol);
                  const listing = findListing(row.symbol) ?? syntheticListing(row.symbol);
                  const subtitle =
                    p.kind === "shares"
                      ? `${formatShares(p.shares)} ${p.shares === 1 ? "share" : "shares"}${p.entry != null ? ` · avg ${formatMoney(p.entry)}` : ""}`
                      : `${p.percent}% at start · now ${(row.share * 100).toFixed(1)}%`;
                  // Dollars only where they're facts: today's P&L, or the gain on your cost.
                  const dollars =
                    period === "1d"
                      ? (priced?.dayChange ?? null)
                      : period === "all"
                        ? (since.get(row.symbol)?.change ?? null)
                        : null;
                  const pct = quote?.changePercent ?? null;
                  return (
                    <ListRow
                      key={row.symbol}
                      leading={<Mark symbol={row.symbol} size={36} />}
                      title={
                        <>
                          <span className="font-semibold">{row.symbol}</span>
                          {listing.name !== row.symbol ? <span className="text-muted"> · {listing.name}</span> : null}
                        </>
                      }
                      subtitle={subtitle}
                      detail={
                        <span className="flex flex-col items-end">
                          <span className="text-fg">
                            {p.kind === "percent"
                              ? `${(row.share * 100).toFixed(1)}%`
                              : priced
                                ? formatMoney(priced.value)
                                : "No price"}
                          </span>
                          <span className={`text-xs font-semibold ${tone(pct)}`}>
                            {pct != null
                              ? `${dollars != null ? `${formatMoney(dollars, true)} · ` : ""}${formatPct(pct)}`
                              : "—"}
                          </span>
                          {period === "all" && since.get(row.symbol)?.basis === "added" ? (
                            <span className="text-[11px] text-muted">since added</span>
                          ) : null}
                        </span>
                      }
                      onClick={() => openPosition(row.symbol)}
                    />
                  );
                })}
              </ListGroup>
            )}
          </>
        )}
      </div>

      {sheet === "portfolios" ? <PortfoliosSheet onClose={() => setSheet(null)} /> : null}
      {sheet === "position" ? (
        <PositionSheet
          key={editing ?? "new"}
          symbol={editing}
          price={editing ? live.quotes[editing]?.price : undefined}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet === "today" || (sheet === "close" && !closeMode) ? (
        <TodaySheet result={result} onClose={() => setSheet(null)} />
      ) : null}
      {sheet === "close" && closeMode ? (
        <CloseSheet
          facts={closeFacts}
          when={`${CLOSE_WHEN[session]}${live.asOf ? ` · as of ${formatAsOf(live.asOf)}` : ""}`}
          percentBook={result.kind === "weights"}
          onToday={() => setSheet("today")}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet === "settings" ? (
        <SettingsSheet
          asOf={live.asOf}
          status={live.status}
          onInfo={() => setSheet("info")}
          onClose={() => setSheet(null)}
        />
      ) : null}
      {sheet === "info" ? <InfoSheet onClose={() => setSheet(null)} /> : null}
    </div>
  );
}
