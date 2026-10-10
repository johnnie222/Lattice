import { useState, type ReactNode } from "react";
import { sectorLabel, type SectorId } from "@/data/universe";
import { Mark } from "@/components/mark";
import { closeLine, marketLine, type LatticeCloseFacts } from "@/lib/close-facts";
import type { DayState } from "@/lib/day-state";
import { formatMoney, formatPct, formatPoints } from "@/lib/format";
import type { BookAnalysis } from "@/lib/portfolio";

// The portfolio's day, inline on the Portfolio screen: TODAY while the
// regular session is open, CLOSE after it, LAST CLOSE · <day> when the latest
// session wasn't today. Every figure comes from the portfolio intelligence
// engine or close-facts; a full return and the S&P 500 comparison appear only
// when every position is priced. This is the one place the day's P&L shows.

function tone(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "text-muted";
  return n >= 0 ? "text-up" : "text-down";
}

type Mover = { symbol: string; main: string; value: number; sub: string };
type SectorRow = { sector: string; main: string; value: number; sub?: string };

/** Collapsed: two up, two down, two sectors. "Show more" reveals the rest. */
const FEW = 2;

function Label({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted">{children}</h3>
  );
}

function MoverRow({ row }: { row: Mover }) {
  return (
    <li className="flex h-9 items-center gap-2.5">
      <Mark symbol={row.symbol} size={24} />
      <span className="min-w-0 flex-1 truncate text-[15px]">
        <span className="font-semibold">{row.symbol}</span>
        <span className="tabular text-[13px] text-muted"> {row.sub}</span>
      </span>
      <span className={`tabular shrink-0 text-[15px] font-semibold ${tone(row.value)}`}>
        {row.main}
      </span>
    </li>
  );
}

export function DaySection({
  result,
  facts,
  day,
}: {
  result: BookAnalysis;
  facts: LatticeCloseFacts;
  /** Null until the browser's clock is known (server render). */
  day: DayState | null;
}) {
  const [more, setMore] = useState(false);
  const closed = day != null && day.kind !== "today";

  let headline: { text: string; value: number | null };
  let line: ReactNode = null;
  let partial = false;
  let up: Mover[] = [];
  let down: Mover[] = [];
  let sectors: SectorRow[] = [];
  let breadth: string | null = null;

  if (result.kind === "holdings") {
    const a = result.analysis;
    partial = !a.complete;
    headline =
      a.dayChange == null
        ? { text: "Waiting for prices", value: null }
        : { text: formatMoney(a.dayChange, true), value: a.dayChange };
    if (a.dayChange != null) {
      if (closed) {
        line = closeLine(facts.portfolio);
      } else if (a.complete && a.returnPercent != null) {
        line = (
          <>
            <span className={`font-semibold ${tone(a.returnPercent)}`}>
              {formatPct(a.returnPercent)}
            </span>
            {a.relativeReturnPercent != null ? (
              <>
                {" · "}
                <span className={`font-semibold ${tone(a.relativeReturnPercent)}`}>
                  {formatPoints(a.relativeReturnPercent)}
                </span>{" "}
                vs S&P 500
              </>
            ) : null}
          </>
        );
      } else {
        line = `Known P&L · ${a.coverage.priced} of ${a.coverage.holdings} priced · return once every position is priced`;
      }
    }
    const mover = (row: (typeof a.contributors)[number]): Mover => ({
      symbol: row.symbol,
      main: formatMoney(row.dayChange, true),
      value: row.dayChange,
      sub:
        row.contributionPercent != null
          ? `${formatPct(row.changePercent)} · ${formatPoints(row.contributionPercent)}`
          : formatPct(row.changePercent),
    });
    up = a.contributors.slice(0, 3).map(mover);
    down = a.detractors.slice(0, 3).map(mover);
    if (a.breadth.quoted)
      breadth = `${a.breadth.up} of ${a.breadth.quoted} up · ${a.breadth.down} down`;
    sectors = a.sectors.map((row) => ({
      sector: row.sector,
      main: formatMoney(row.dayChange, true),
      value: row.dayChange,
      sub: row.contributionPercent != null ? formatPoints(row.contributionPercent) : undefined,
    }));
  } else {
    const a = result.analysis;
    partial = !a.complete;
    headline =
      a.complete && a.returnPercent != null
        ? { text: formatPct(a.returnPercent), value: a.returnPercent }
        : {
            text: a.knownContributionPercent != null ? "Partial" : "Waiting for prices",
            value: null,
          };
    if (a.complete && a.relativeReturnPercent != null) {
      line = (
        <>
          <span className={`font-semibold ${tone(a.relativeReturnPercent)}`}>
            {formatPoints(a.relativeReturnPercent)}
          </span>{" "}
          vs S&P 500 · % only
        </>
      );
    } else if (partial && a.coverageRatio != null) {
      line = `${Math.round(a.coverageRatio * 100)}% of the portfolio priced · return once every position is priced`;
    } else {
      line = "Percent positions · % only";
    }
    const mover = (row: (typeof a.contributors)[number]): Mover => ({
      symbol: row.symbol,
      main: formatPoints(row.contributionPercent),
      value: row.contributionPercent,
      sub: formatPct(row.changePercent),
    });
    up = a.contributors.slice(0, 3).map(mover);
    down = a.detractors.slice(0, 3).map(mover);
    if (a.breadth.quoted)
      breadth = `${a.breadth.up} of ${a.breadth.quoted} up · ${a.breadth.down} down`;
    sectors = a.sectors.map((row) => ({
      sector: row.sector,
      main: formatPoints(row.contributionPercent),
      value: row.contributionPercent,
    }));
  }

  // Largest impact first, either direction.
  sectors =
    sectors.length > 1 ? [...sectors].sort((x, y) => Math.abs(y.value) - Math.abs(x.value)) : [];
  const movers = more ? [...up, ...down] : [...up.slice(0, FEW), ...down.slice(0, FEW)];
  // "Show more" sits with the movers; with no movers, sectors show in full.
  const collapse = !more && movers.length > 0;
  const shownSectors = collapse ? sectors.slice(0, FEW) : sectors;
  const hidden =
    up.length > FEW || down.length > FEW || (movers.length > 0 && sectors.length > FEW);
  const market = closed ? marketLine(facts.market) : null;

  return (
    <section
      className="glass mb-5 rounded-3xl p-4"
      aria-label="Your portfolio’s day"
      data-testid="day-section"
    >
      <Label>{day?.label ?? " "}</Label>
      <p
        className={`tabular mt-1 font-semibold leading-tight tracking-tight ${headline.value == null ? "text-[20px] text-muted" : `text-[28px] ${tone(headline.value)}`}`}
        data-testid="day-headline"
      >
        {headline.text}
      </p>
      {line ? (
        <p
          className={`mt-1 text-[14px] leading-snug ${closed ? "text-fg/85" : "text-muted"}`}
          data-testid="day-line"
        >
          {line}
        </p>
      ) : null}

      {movers.length ? (
        <div className="mt-3 border-t border-line/70 pt-2">
          <div className="flex items-center justify-between gap-3">
            <Label>{partial ? "Movers · priced positions" : "Movers"}</Label>
            {hidden ? (
              <button
                type="button"
                onClick={() => setMore((open) => !open)}
                aria-expanded={more}
                className="-my-2 h-9 shrink-0 px-1 text-[13px] font-semibold text-accent"
              >
                {more ? "Show less" : "Show more"}
              </button>
            ) : null}
          </div>
          <ul>
            {movers.map((row) => (
              <MoverRow key={row.symbol} row={row} />
            ))}
          </ul>
        </div>
      ) : null}

      {breadth || shownSectors.length ? (
        <div className="mt-2 flex flex-col gap-1.5 border-t border-line/70 pt-2.5 text-[14px]">
          {breadth ? (
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-muted">Breadth</span>
              <span className="tabular">{breadth}</span>
            </p>
          ) : null}
          {shownSectors.map((row) => (
            <p key={row.sector} className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-muted">
                {sectorLabel(row.sector as SectorId)}
              </span>
              <span className={`tabular shrink-0 font-semibold ${tone(row.value)}`}>
                {row.main}
                {row.sub ? <span className="font-normal text-muted"> · {row.sub}</span> : null}
              </span>
            </p>
          ))}
        </div>
      ) : null}

      {market ? (
        <p
          className="mt-2 border-t border-line/70 pt-2.5 text-[13px] leading-snug text-muted"
          data-testid="day-market"
        >
          <span className="font-semibold text-fg/85">Market</span> · {market}
        </p>
      ) : null}
    </section>
  );
}
