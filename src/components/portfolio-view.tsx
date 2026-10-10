import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
import { GlassButton, LargeTitle } from "@/components/chrome";
import { InfoSheet, ListGroup, ListRow, Sheet } from "@/components/sheets";
import { SettingsSheet } from "@/components/settings-sheet";
import { PositionSheet } from "@/components/position-sheet";
import { Mark } from "@/components/mark";
import { DaySection } from "@/components/day-section";
import { buildCloseFacts } from "@/lib/close-facts";
import { dayState, type DayState } from "@/lib/day-state";
import { formatAsOf, formatMoney, formatPct, formatShares } from "@/lib/format";
import { findListing, syntheticListing } from "@/lib/market";
import { marketFacts, SECTOR_FUNDS } from "@/lib/market-facts";
import { analyzeBook, BENCHMARK_SYMBOL, bookTileWeights, sinceEntryRows, sizeBook } from "@/lib/portfolio";
import { useQuotes } from "@/lib/use-quotes";
import { useView } from "@/lib/use-view";
import { activeBook, useBooks } from "@/store/books";

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

/**
 * Your portfolio as a dashboard: what it's worth (value, since entry), what
 * happened today (the day section, the only place the day's P&L shows), and
 * each position. The heatmap lives on the Map tab ("Show heatmap").
 */
export function PortfolioView() {
  const { setView } = useView();
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const setAnchors = useBooks((s) => s.setAnchors);
  const [sheet, setSheet] = useState<"settings" | "info" | "portfolios" | "position" | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  // Which session the day section describes, from the browser's clock only,
  // so server and client renders agree.
  const [day, setDay] = useState<DayState | null>(null);

  useEffect(() => {
    const tick = () => setDay(dayState(new Date()));
    tick();
    const timer = window.setInterval(tick, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const positionSymbols = useMemo(() => book.positions.map((p) => p.symbol), [book.positions]);
  // The S&P 500 for "vs S&P 500", and the sector funds for the close's market
  // context. One refresh is committed at once (waitForAll).
  const symbols = useMemo(
    () => [...new Set([...positionSymbols, BENCHMARK_SYMBOL, ...SECTOR_FUNDS.map((fund) => fund.symbol)])],
    [positionSymbols],
  );
  const live = useQuotes(positionSymbols.length ? symbols : [], refreshToken, true);

  const sectors = useMemo(
    () => Object.fromEntries(positionSymbols.map((s) => [s, findListing(s)?.sector ?? "other"])),
    [positionSymbols],
  );
  const result = useMemo(() => analyzeBook(book, live.quotes, sectors), [book, live.quotes, sectors]);
  const sizing = useMemo(() => sizeBook(book, (s) => live.quotes[s]?.price ?? null), [book, live.quotes]);
  const sizes = useMemo(() => bookTileWeights(book, result, live.quotes), [book, result, live.quotes]);
  const since = useMemo(() => sinceEntryRows(book, live.quotes), [book, live.quotes]);
  const facts = useMemo(
    () => buildCloseFacts(result.kind === "holdings" ? result.analysis : null, marketFacts(live.quotes)),
    [result, live.quotes],
  );

  // Positions added before a quote was in (or migrated) start from the first price seen.
  useEffect(() => {
    const missing = book.positions.filter((p) => p.anchor == null && live.quotes[p.symbol]);
    if (missing.length) setAnchors(Object.fromEntries(missing.map((p) => [p.symbol, live.quotes[p.symbol]!.price])));
  }, [book.positions, live.quotes, setAnchors]);

  const holdings = result.kind === "holdings" ? result.analysis : null;
  const today = holdings ? holdings.dayChange : result.analysis.returnPercent;
  const mood = today == null ? "transparent" : today >= 0 ? "var(--up-text)" : "var(--dn-text)";
  const ordered = useMemo(
    () => [...sizing.rows].sort((a, b) => (sizes.get(b.symbol) ?? 0) - (sizes.get(a.symbol) ?? 0)),
    [sizing, sizes],
  );
  const count = book.positions.length;
  const asOf = live.asOf ? ` · ${formatAsOf(live.asOf)}` : live.status === "error" ? " · prices unavailable" : "";

  // Since entry is conservative: an aggregate only when every position has an
  // average cost and a price. Otherwise say what's missing, or say nothing
  // when no cost was ever entered.
  const withCost = book.positions.filter((p) => p.kind === "shares" && p.entry != null).length;
  const sinceEntry = holdings?.sinceEntry?.complete ? holdings.sinceEntry : null;
  const sinceHint =
    !holdings || sinceEntry || withCost === 0
      ? null
      : withCost < count
        ? `Since entry: average cost on ${withCost} of ${count} positions`
        : "Since entry: waiting for every position’s price";

  const openPosition = (symbol: string | null) => {
    setEditing(symbol);
    setSheet("position");
  };
  const showHeatmap = () => setView({ tab: "map", board: "book", sector: null, q: "" }, { push: true });

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
        {count === 0 ? (
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
            <section className="glass mb-3 rounded-3xl p-4" data-testid="value-card">
              <button
                type="button"
                onClick={() => setRefreshToken((n) => n + 1)}
                aria-label="Refresh prices"
                className={`text-left text-[13px] ${live.status === "error" ? "text-down" : "text-muted"}`}
              >
                {holdings
                  ? holdings.complete || holdings.coverage.priced === 0
                    ? "Total value"
                    : `Priced value · ${holdings.coverage.priced} of ${holdings.coverage.holdings}`
                  : "Percent-based portfolio"}
                {asOf}
              </button>
              {holdings ? (
                <p className="tabular mt-0.5 text-[34px] font-semibold leading-tight tracking-tight">
                  {holdings.value != null
                    ? formatMoney(holdings.value)
                    : holdings.coverage.priced
                      ? formatMoney(holdings.pricedValue)
                      : "—"}
                </p>
              ) : (
                <p className="mt-1 text-[15px] leading-snug text-muted">
                  Positions are percentages, so figures are in % only.
                </p>
              )}
              {sinceEntry ? (
                <p className={`tabular mt-0.5 text-[15px] font-semibold ${tone(sinceEntry.change)}`} data-testid="since-entry">
                  {sinceEntry.change >= 0 ? "▲" : "▼"} {formatMoney(Math.abs(sinceEntry.change))} (
                  {Math.abs(sinceEntry.percent).toFixed(2)}%)<span className="font-normal text-muted"> · since entry</span>
                </p>
              ) : sinceHint ? (
                <p className="mt-0.5 text-[13px] leading-snug text-muted" data-testid="since-entry">
                  {sinceHint}
                </p>
              ) : null}
              <div className="mt-2 flex items-center justify-between gap-3 text-[13px]">
                <span className="text-muted">
                  {count} {count === 1 ? "position" : "positions"}
                </span>
                <button
                  type="button"
                  onClick={showHeatmap}
                  className="-my-2 flex h-9 items-center gap-0.5 font-semibold text-accent"
                >
                  Show heatmap
                  <ChevronRight className="size-4" strokeWidth={2.5} />
                </button>
              </div>
              {result.kind === "weights" && result.mixed ? (
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  This portfolio mixes shares and percentages, which older versions allowed. Percentages are read as a
                  share of the total{result.overflow ? ", but they add up to 100% or more" : ""}. For accurate
                  tracking, keep one kind per portfolio.
                </p>
              ) : null}
            </section>

            <DaySection result={result} facts={facts} day={day} />

            <h3 className="mb-1.5 px-1 text-[13px] font-medium uppercase tracking-wide text-muted">
              {count} {count === 1 ? "position" : "positions"}
            </h3>
            <ListGroup footer="Today’s move for each position, from its previous close. Tap one to edit it.">
              {ordered.map((row) => {
                const p = row.position;
                const quote = live.quotes[row.symbol];
                const priced = holdings?.positions.find((h) => h.symbol === row.symbol);
                const listing = findListing(row.symbol) ?? syntheticListing(row.symbol);
                const entry = since.get(row.symbol);
                const subtitle =
                  p.kind === "shares"
                    ? `${formatShares(p.shares)} ${p.shares === 1 ? "share" : "shares"}${entry?.basis === "cost" ? ` · ${formatPct(entry.percent)} since entry` : ""}`
                    : `${p.percent}% at start · now ${(row.share * 100).toFixed(1)}%`;
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
                    wrap
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
                            ? `${priced ? `${formatMoney(priced.dayChange, true)} · ` : ""}${formatPct(pct)}`
                            : "—"}
                        </span>
                      </span>
                    }
                    onClick={() => openPosition(row.symbol)}
                  />
                );
              })}
            </ListGroup>
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
