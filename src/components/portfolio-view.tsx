import { useMemo, useState, type CSSProperties } from "react";
import { ChevronDown, LayoutGrid, Plus, Settings } from "lucide-react";
import { GlassButton, LargeTitle, Segmented } from "@/components/chrome";
import { InfoSheet, ListGroup, ListRow, Sheet } from "@/components/sheets";
import { SettingsSheet } from "@/components/settings-sheet";
import { PositionSheet } from "@/components/position-sheet";
import { Mark } from "@/components/mark";
import { formatAsOf, formatMoney, formatPct } from "@/lib/format";
import { findListing, syntheticListing } from "@/lib/market";
import { periodChange, valueBook, type PortfolioPeriod } from "@/lib/portfolio";
import { useQuotes } from "@/lib/use-quotes";
import { useView } from "@/lib/use-view";
import { activeBook, useBooks } from "@/store/books";

const OPTIONS: { id: PortfolioPeriod; label: string }[] = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1Y" },
  { id: "5y", label: "5Y" },
  { id: "all", label: "All" },
];

const WORDS: Record<PortfolioPeriod, string> = {
  "1d": "today",
  "1w": "past week",
  "1m": "past month",
  ytd: "this year",
  "1y": "past year",
  "5y": "past 5 years",
  all: "since purchase",
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

/**
 * Your holdings as a list: value, change over the chosen window (YTD/1Y/5Y
 * included) and gain since purchase when an average cost was given.
 */
export function PortfolioView() {
  const { setView } = useView();
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const [period, setPeriod] = useState<PortfolioPeriod>("1d");
  const [sheet, setSheet] = useState<"settings" | "info" | "portfolios" | "position" | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const symbols = useMemo(() => book.positions.map((p) => p.symbol), [book.positions]);
  // Today's quotes carry live prices (values); the window's quotes carry its change.
  const live = useQuotes(symbols, refreshToken, "1d");
  const windowed = useQuotes(period === "1d" || period === "all" ? [] : symbols, refreshToken, period === "1d" || period === "all" ? "1d" : period);
  const changeQuotes = period === "1d" || period === "all" ? live.quotes : windowed.quotes;

  const valuation = useMemo(() => valueBook(book, live.quotes), [book, live.quotes]);
  const change = useMemo(() => periodChange(valuation, changeQuotes, period), [valuation, changeQuotes, period]);
  const total = change.total;
  const hasCost = book.positions.some((p) => p.kind === "shares" && p.entry != null);
  const mood = total.pct == null ? "transparent" : total.pct >= 0 ? "var(--up-text)" : "var(--dn-text)";

  const openPosition = (symbol: string | null) => {
    setEditing(symbol);
    setSheet("position");
  };

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
            <section className="glass mb-5 rounded-3xl p-4">
              <button
                type="button"
                onClick={() => setRefreshToken((n) => n + 1)}
                aria-label="Refresh prices"
                className={`text-left text-[13px] ${live.status === "error" ? "text-down" : "text-muted"}`}
              >
                {valuation.total != null ? "Total value" : "Percent-based portfolio"}
                {live.asOf ? ` · ${formatAsOf(live.asOf)}` : live.status === "error" ? " · prices unavailable" : ""}
              </button>
              <p className="tabular mt-0.5 text-[34px] font-semibold leading-tight tracking-tight">
                {valuation.total != null ? formatMoney(valuation.total) : total.pct != null ? formatPct(total.pct) : "—"}
              </p>
              <p className={`tabular mt-0.5 text-[15px] font-semibold ${tone(total.pct)}`}>
                {period === "all" && !hasCost ? (
                  <span className="font-normal text-muted">Add an average cost to see your gain since purchase</span>
                ) : total.pct == null ? (
                  <span className="font-normal text-muted">Loading…</span>
                ) : (
                  <>
                    {total.pct >= 0 ? "▲" : "▼"}{" "}
                    {total.dollars != null ? `${formatMoney(Math.abs(total.dollars))} (${Math.abs(total.pct).toFixed(2)}%)` : `${Math.abs(total.pct).toFixed(2)}%`}
                    <span className="font-normal text-muted"> · {WORDS[period]}</span>
                  </>
                )}
              </p>
              <div className="mt-3">
                <Segmented label="Time frame" value={period} options={OPTIONS} onChange={setPeriod} compact />
              </div>
              {valuation.overflow ? (
                <p className="mt-3 text-xs text-down">
                  Your percentage positions add up to 100% or more, so they can’t be combined with share positions.
                </p>
              ) : null}
            </section>

            <ListGroup
              title="Positions"
              footer={
                period === "ytd" || period === "1y" || period === "5y"
                  ? "Longer windows assume you held the same positions the whole time."
                  : undefined
              }
            >
              {valuation.holdings.map((h) => {
                const p = h.position;
                const row = change.rows.get(h.symbol);
                const listing = findListing(h.symbol) ?? syntheticListing(h.symbol);
                const subtitle =
                  p.kind === "shares"
                    ? `${p.shares.toLocaleString("en-US")} ${p.shares === 1 ? "share" : "shares"}${p.entry != null ? ` · avg ${formatMoney(p.entry)}` : ""}`
                    : `${p.percent}% of portfolio`;
                return (
                  <ListRow
                    key={h.symbol}
                    leading={<Mark symbol={h.symbol} size={36} />}
                    title={
                      <>
                        <span className="font-semibold">{h.symbol}</span>
                        {listing.name !== h.symbol ? <span className="text-muted"> · {listing.name}</span> : null}
                      </>
                    }
                    subtitle={subtitle}
                    detail={
                      <span className="flex flex-col items-end">
                        <span className="text-fg">
                          {h.value != null ? formatMoney(h.value) : `${(h.share * 100).toFixed(1)}%`}
                        </span>
                        <span className={`text-xs font-semibold ${tone(row?.pct)}`}>
                          {row?.pct != null
                            ? `${row.dollars != null ? `${formatMoney(row.dollars, true)} · ` : ""}${formatPct(row.pct)}`
                            : "—"}
                        </span>
                      </span>
                    }
                    onClick={() => openPosition(h.symbol)}
                  />
                );
              })}
            </ListGroup>

            <ListGroup>
              <ListRow
                leading={<LayoutGrid className="size-5 text-accent" />}
                title="View as Heatmap"
                chevron
                onClick={() => setView({ tab: "map", board: "book", sector: null })}
              />
              <ListRow
                leading={<Plus className="size-5 text-accent" />}
                title="Add Position"
                chevron
                onClick={() => openPosition(null)}
              />
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
