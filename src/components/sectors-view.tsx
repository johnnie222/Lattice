import { useMemo, useState, type CSSProperties } from "react";
import { ChevronRight, Settings } from "lucide-react";
import { BOARDS } from "@/data/universe";
import { GlassButton, LargeTitle, Segmented } from "@/components/chrome";
import { InfoSheet } from "@/components/sheets";
import { SettingsSheet } from "@/components/settings-sheet";
import { PERIOD_OPTIONS, PERIOD_WORDS } from "@/components/map-view";
import { formatAsOf, formatPct } from "@/lib/format";
import { periodChange, valueBook } from "@/lib/portfolio";
import type { Period } from "@/lib/quote-core";
import { useQuotes } from "@/lib/use-quotes";
import { useView } from "@/lib/use-view";
import { activeBook, useBooks } from "@/store/books";

type Row = {
  id: string;
  name: string;
  detail: string;
  pct: number | null;
  kind: "fund" | "portfolio" | "market";
};

const RANKED = BOARDS.filter((board) => board.group !== "Index");

/**
 * Every sector fund and theme, plus your portfolio, ranked by their move
 * over the chosen window. The S&P 500 is drawn as a line through the list,
 * so everything above it beat the market.
 */
export function SectorsView() {
  const { search, setView } = useView();
  const period: Period = search.t ?? "1d";
  const [sheet, setSheet] = useState<"settings" | "info" | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });

  const symbols = useMemo(
    () => [...new Set(["^GSPC", ...RANKED.map((board) => board.title), ...book.positions.map((p) => p.symbol)])],
    [book.positions],
  );
  const { quotes, asOf, status } = useQuotes(symbols, refreshToken, period);

  const rows = useMemo(() => {
    const list: Row[] = RANKED.map((board) => ({
      id: board.id,
      name: board.name,
      detail: `${board.title} · ${board.group === "Sector ETF" ? "Sector" : "Theme"}`,
      pct: quotes[board.title]?.changePercent ?? null,
      kind: "fund",
    }));
    if (book.positions.length) {
      const change = periodChange(valueBook(book, quotes), quotes, period).total;
      list.push({ id: "book", name: book.name, detail: "Your portfolio", pct: change.pct, kind: "portfolio" });
    }
    const market = quotes["^GSPC"]?.changePercent ?? null;
    if (market != null) list.push({ id: "spx", name: "S&P 500", detail: "Market", pct: market, kind: "market" });
    return list.sort((a, b) => (b.pct ?? -Infinity) - (a.pct ?? -Infinity));
  }, [book, quotes, period]);

  const scale = Math.max(0.5, ...rows.map((row) => Math.abs(row.pct ?? 0)));
  const market = quotes["^GSPC"]?.changePercent ?? null;
  const beat = market == null ? null : rows.filter((r) => r.kind === "fund" && (r.pct ?? -Infinity) > market).length;
  let rank = 0;

  return (
    <div
      className="ambient flex min-h-0 flex-1 flex-col"
      style={{ "--mood": market == null ? "transparent" : market >= 0 ? "var(--up-text)" : "var(--dn-text)" } as CSSProperties}
    >
      <header className="safe-t shrink-0 px-3 pb-2">
        <div className="flex h-12 items-center gap-2">
          <div className="min-w-0 flex-1 pl-1">
            <LargeTitle>Sectors</LargeTitle>
          </div>
          <GlassButton label="Settings" onClick={() => setSheet("settings")}>
            <Settings className="size-[19px]" strokeWidth={2.1} />
          </GlassButton>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3 px-1 text-[13px] text-muted">
          <p className="min-w-0 truncate">
            {beat != null ? `${beat} of ${RANKED.length} beat the market · ${PERIOD_WORDS[period]}` : `Ranked · ${PERIOD_WORDS[period]}`}
          </p>
          <button
            type="button"
            className={`shrink-0 ${status === "error" ? "text-down" : ""}`}
            onClick={() => setRefreshToken((n) => n + 1)}
            aria-label="Refresh prices"
          >
            {asOf ? formatAsOf(asOf) : status === "error" ? "Prices unavailable" : "Updating…"}
          </button>
        </div>
        <div className="mt-2.5 px-1">
          <Segmented
            label="Time frame"
            value={period}
            options={PERIOD_OPTIONS}
            onChange={(t) => setView({ t: t === "1w" || t === "1m" ? t : "1d" })}
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
        <div className="divide-y divide-line/60 overflow-hidden rounded-3xl bg-surface/70">
          {rows.map((row) => {
            if (row.kind === "market") {
              return (
                <div key="market" className="flex items-center gap-2.5 bg-surface-2/60 py-2.5 pl-3 pr-[30px]">
                  <span className="w-4" />
                  <span className="min-w-0 flex-1 text-[13px] font-semibold uppercase tracking-wide text-muted">
                    S&P 500 · the market
                  </span>
                  <span className={`tabular text-[15px] font-semibold ${(row.pct ?? 0) >= 0 ? "text-up" : "text-down"}`}>
                    {row.pct != null ? formatPct(row.pct) : "—"}
                  </span>
                </div>
              );
            }
            rank += 1;
            const pct = row.pct;
            const width = pct == null ? 0 : (Math.abs(pct) / scale) * 50;
            const mine = row.kind === "portfolio";
            return (
              <button
                key={row.id}
                type="button"
                onClick={() => setView({ tab: "map", board: row.id, sector: null })}
                className={`flex w-full items-center gap-2.5 py-3 pl-3 pr-2 text-left active:bg-surface-2/60 ${mine ? "bg-accent/10" : ""}`}
              >
                <span className="tabular w-4 text-right text-[13px] font-semibold text-muted">{rank}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[15px] font-semibold ${mine ? "text-accent" : ""}`}>{row.name}</span>
                  <span className="block truncate text-xs text-muted">{row.detail}</span>
                </span>
                <span className="relative h-1.5 w-14 shrink-0 rounded-full bg-line/50" aria-hidden="true">
                  <span className="absolute inset-y-0 left-1/2 w-px bg-muted/50" />
                  <span
                    className={`absolute inset-y-0 rounded-full ${pct != null && pct >= 0 ? "bg-up" : "bg-down"}`}
                    style={pct != null && pct >= 0 ? { left: "50%", width: `${width}%` } : { right: "50%", width: `${width}%` }}
                  />
                </span>
                <span
                  className={`tabular w-[60px] shrink-0 text-right text-[15px] font-semibold ${pct == null ? "text-muted" : pct >= 0 ? "text-up" : "text-down"}`}
                >
                  {pct != null ? formatPct(pct) : "—"}
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-muted/50" />
              </button>
            );
          })}
        </div>
        <p className="px-4 pt-2 text-xs leading-relaxed text-muted">
          Sectors are ranked by their fund (XLK for Technology, and so on). Your portfolio uses your holdings. Tap any row to open its map.
        </p>
      </div>

      {sheet === "settings" ? (
        <SettingsSheet asOf={asOf} status={status} onInfo={() => setSheet("info")} onClose={() => setSheet(null)} />
      ) : null}
      {sheet === "info" ? <InfoSheet onClose={() => setSheet(null)} /> : null}
    </div>
  );
}
