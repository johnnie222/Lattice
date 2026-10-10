import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { sectorLabel, type SectorId } from "@/data/universe";
import { ListGroup, ListRow, Sheet } from "@/components/sheets";
import { Mark } from "@/components/mark";
import type { CloseMover, LatticeCloseFacts } from "@/lib/close-facts";
import { formatMoney, formatPct, formatPoints } from "@/lib/format";
import type { DayType } from "@/lib/market-facts";
import type { BookAnalysis } from "@/lib/portfolio";

// My Portfolio Today and Lattice Close. Every figure comes from the portfolio
// intelligence engine or close-facts; these components only decide what to
// show. A full return and the S&P 500 comparison appear only when the engine
// reports the portfolio as complete.

function tone(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "text-muted";
  return n >= 0 ? "text-up" : "text-down";
}

function Tinted({ value, children }: { value: number | null | undefined; children: ReactNode }) {
  return <span className={`font-semibold ${tone(value)}`}>{children}</span>;
}

const sectorName = (sector: string) => sectorLabel(sector as SectorId);

function upOf(up: number, quoted: number, noun: string): string {
  return `${up} of ${quoted} ${noun}${quoted === 1 ? "" : "s"} up`;
}

/** The headline and detail line shared by the card and the sheet titles. */
function todayLine(result: BookAnalysis): {
  text: string;
  value: number | null;
  details: string[];
} {
  const details: string[] = [];
  if (result.kind === "holdings") {
    const a = result.analysis;
    if (a.dayChange == null) {
      return {
        text: a.coverage.holdings ? "Waiting for prices" : "No positions yet",
        value: null,
        details,
      };
    }
    if (a.complete && a.returnPercent != null) details.push(formatPct(a.returnPercent));
    else details.push(`partial · ${a.coverage.priced} of ${a.coverage.holdings} priced`);
    if (a.relativeReturnPercent != null)
      details.push(`${formatPoints(a.relativeReturnPercent)} vs S&P 500`);
    if (a.breadth.quoted) details.push(upOf(a.breadth.up, a.breadth.quoted, "holding"));
    return { text: formatMoney(a.dayChange, true), value: a.dayChange, details };
  }
  const a = result.analysis;
  if (a.breadth.quoted) details.push(upOf(a.breadth.up, a.breadth.quoted, "position"));
  if (a.complete && a.returnPercent != null) {
    if (a.relativeReturnPercent != null)
      details.unshift(`${formatPoints(a.relativeReturnPercent)} vs S&P 500`);
    return { text: formatPct(a.returnPercent), value: a.returnPercent, details };
  }
  if (a.knownContributionPercent != null) {
    details.unshift(`${Math.round((a.coverageRatio ?? 0) * 100)}% of portfolio priced`);
    return { text: "Partial", value: null, details };
  }
  return { text: "Waiting for prices", value: null, details };
}

/**
 * Compact card under the portfolio summary. Outside the regular session it
 * is labelled "Close" and opens Lattice Close.
 */
export function TodayCard({
  result,
  close,
  onOpen,
}: {
  result: BookAnalysis;
  close: boolean;
  onOpen: () => void;
}) {
  const line = todayLine(result);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={close ? "Open Lattice Close" : "Open My Portfolio Today"}
      className="glass glass-pressable mb-5 flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left"
    >
      <span className="w-12 shrink-0 text-[12px] font-semibold uppercase tracking-wide text-muted">
        {close ? "Close" : "Today"}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`tabular block truncate text-[20px] font-semibold leading-tight tracking-tight ${tone(line.value)}`}
        >
          {line.text}
        </span>
        {line.details.length ? (
          <span className="block truncate text-[13px] text-muted">{line.details.join(" · ")}</span>
        ) : null}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted/70" strokeWidth={2.5} />
    </button>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 rounded-2xl bg-surface/80 px-4 py-3 text-[13px] leading-relaxed text-muted">
      {children}
    </p>
  );
}

type Mover = { symbol: string; main: string; mainValue: number; sub: string };

function Movers({ title, rows }: { title: string; rows: Mover[] }) {
  if (!rows.length) return null;
  return (
    <ListGroup title={title}>
      {rows.map((row) => (
        <ListRow
          key={row.symbol}
          leading={<Mark symbol={row.symbol} size={32} />}
          title={<span className="font-semibold">{row.symbol}</span>}
          subtitle={row.sub}
          detail={<Tinted value={row.mainValue}>{row.main}</Tinted>}
        />
      ))}
    </ListGroup>
  );
}

const PRIVACY = "Your positions and figures stay on this device. Prices may be delayed.";

export function TodaySheet({ result, onClose }: { result: BookAnalysis; onClose: () => void }) {
  return (
    <Sheet title="My Portfolio Today" onClose={onClose}>
      {result.kind === "holdings" ? (
        <HoldingsToday result={result} />
      ) : (
        <WeightsToday result={result} />
      )}
      <p className="px-1 text-xs leading-relaxed text-muted">{PRIVACY}</p>
    </Sheet>
  );
}

function HoldingsToday({ result }: { result: Extract<BookAnalysis, { kind: "holdings" }> }) {
  const a = result.analysis;
  if (!a.coverage.holdings)
    return <Note>Add positions to see how your portfolio is doing today.</Note>;
  const partial = !a.complete;
  const top = (rows: typeof a.contributors): Mover[] =>
    rows.slice(0, 3).map((row) => ({
      symbol: row.symbol,
      main: formatMoney(row.dayChange, true),
      mainValue: row.dayChange,
      sub:
        row.contributionPercent != null
          ? `${formatPct(row.changePercent)} · ${formatPoints(row.contributionPercent)} of return`
          : formatPct(row.changePercent),
    }));

  return (
    <>
      {partial ? (
        <Note>
          <span className="font-semibold text-fg">Partial data.</span> {a.coverage.priced} of{" "}
          {a.coverage.holdings} holdings have prices
          {a.coverage.missing.length ? ` (missing ${a.coverage.missing.join(", ")})` : ""}. Dollar
          figures count priced holdings only; today’s return and the S&P 500 comparison appear once
          every holding is priced.
        </Note>
      ) : null}
      <ListGroup title="Today">
        <ListRow
          title={partial ? "Known P&L" : "Day P&L"}
          subtitle={
            a.value != null ? `of ${formatMoney(a.value)}` : `${formatMoney(a.pricedValue)} priced`
          }
          detail={
            <Tinted value={a.dayChange}>
              {a.dayChange != null ? formatMoney(a.dayChange, true) : "—"}
            </Tinted>
          }
        />
        <ListRow
          title="Return"
          subtitle={a.returnPercent == null ? "Needs every holding priced" : undefined}
          detail={<Tinted value={a.returnPercent}>{formatPct(a.returnPercent)}</Tinted>}
        />
        <ListRow
          title="vs S&P 500"
          subtitle={
            a.benchmarkReturnPercent != null
              ? `S&P 500 ${formatPct(a.benchmarkReturnPercent)}`
              : "S&P 500 not loaded"
          }
          detail={
            <Tinted value={a.relativeReturnPercent}>
              {a.relativeReturnPercent != null ? formatPoints(a.relativeReturnPercent) : "—"}
            </Tinted>
          }
        />
        <ListRow
          title="Breadth"
          subtitle={
            a.breadth.quoted ? `${a.breadth.down} down · ${a.breadth.flat} flat` : undefined
          }
          detail={a.breadth.quoted ? upOf(a.breadth.up, a.breadth.quoted, "holding") : "—"}
        />
      </ListGroup>
      <Movers
        title={partial ? "Known contributors" : "Top contributors"}
        rows={top(a.contributors)}
      />
      <Movers title={partial ? "Known detractors" : "Top detractors"} rows={top(a.detractors)} />
      {a.sectors.length > 1 ? (
        <ListGroup title="By sector">
          {a.sectors.map((row) => (
            <ListRow
              key={row.sector}
              title={sectorName(row.sector)}
              subtitle={`${row.positions} ${row.positions === 1 ? "holding" : "holdings"}`}
              detail={
                <Tinted value={row.dayChange}>
                  {formatMoney(row.dayChange, true)}
                  {row.contributionPercent != null
                    ? ` · ${formatPoints(row.contributionPercent)}`
                    : ""}
                </Tinted>
              }
            />
          ))}
        </ListGroup>
      ) : null}
      {a.sinceEntry ? (
        <ListGroup
          title="Since entry"
          footer={
            a.sinceEntry.complete
              ? undefined
              : `${a.sinceEntry.holdings} of ${a.coverage.holdings} holdings have an average cost and a price.`
          }
        >
          <ListRow
            title={`On ${formatMoney(a.sinceEntry.costBasis)} cost`}
            detail={
              <Tinted value={a.sinceEntry.change}>
                {formatMoney(a.sinceEntry.change, true)} ({formatPct(a.sinceEntry.percent)})
              </Tinted>
            }
          />
        </ListGroup>
      ) : null}
    </>
  );
}

function WeightsToday({ result }: { result: Extract<BookAnalysis, { kind: "weights" }> }) {
  const a = result.analysis;
  const partial = !a.complete;
  const top = (rows: typeof a.contributors): Mover[] =>
    rows.slice(0, 3).map((row) => ({
      symbol: row.symbol,
      main: formatPoints(row.contributionPercent),
      mainValue: row.contributionPercent,
      sub: `${formatPct(row.changePercent)} · ${Math.round(row.normalizedWeight * 100)}% of portfolio`,
    }));

  return (
    <>
      <Note>
        {result.mixed
          ? "This portfolio mixes shares and percentages, so it is read by weight and shown in % only."
          : "This portfolio tracks percentages, so its figures are in % only."}
        {partial && a.coverageRatio != null
          ? ` Partial data: ${Math.round(a.coverageRatio * 100)}% of it has prices; today’s return and the S&P 500 comparison appear once every position is priced.`
          : ""}
      </Note>
      <ListGroup title="Today">
        <ListRow
          title="Return"
          subtitle={
            a.returnPercent == null && a.knownContributionPercent != null
              ? `${formatPoints(a.knownContributionPercent)} known so far`
              : undefined
          }
          detail={<Tinted value={a.returnPercent}>{formatPct(a.returnPercent)}</Tinted>}
        />
        <ListRow
          title="vs S&P 500"
          subtitle={
            a.benchmarkReturnPercent != null
              ? `S&P 500 ${formatPct(a.benchmarkReturnPercent)}`
              : "S&P 500 not loaded"
          }
          detail={
            <Tinted value={a.relativeReturnPercent}>
              {a.relativeReturnPercent != null ? formatPoints(a.relativeReturnPercent) : "—"}
            </Tinted>
          }
        />
        <ListRow
          title="Breadth"
          subtitle={
            a.breadth.quoted ? `${a.breadth.down} down · ${a.breadth.flat} flat` : undefined
          }
          detail={a.breadth.quoted ? upOf(a.breadth.up, a.breadth.quoted, "position") : "—"}
        />
      </ListGroup>
      <Movers
        title={partial ? "Known contributors" : "Top contributors"}
        rows={top(a.contributors)}
      />
      <Movers title={partial ? "Known detractors" : "Top detractors"} rows={top(a.detractors)} />
    </>
  );
}

const DAY_TYPE: Record<DayType, string> = {
  "broad-advance": "Broad advance",
  "broad-decline": "Broad decline",
  mixed: "Mixed",
};

function closeMovers(rows: CloseMover[]): Mover[] {
  return rows.map((row) => ({
    symbol: row.symbol,
    main: formatMoney(row.dayChange, true),
    mainValue: row.dayChange,
    sub:
      row.contributionPercent != null
        ? `${formatPct(row.changePercent)} · ${formatPoints(row.contributionPercent)} of return`
        : formatPct(row.changePercent),
  }));
}

/** Lattice Close renders `LatticeCloseFacts` and nothing else. */
export function CloseSheet({
  facts,
  when,
  percentBook,
  onToday,
  onClose,
}: {
  facts: LatticeCloseFacts;
  /** e.g. "Market closed · as of 16:00" */
  when: string;
  /** The portfolio tracks percentages (or is mixed): no dollar close. */
  percentBook: boolean;
  onToday: () => void;
  onClose: () => void;
}) {
  const p = facts.portfolio;
  const m = facts.market;

  return (
    <Sheet title="Lattice Close" onClose={onClose}>
      <p className="-mt-1 mb-3 text-center text-xs text-muted">{when}</p>
      {facts.summary.length ? (
        <p className="mb-4 px-1 text-[15px] leading-relaxed">{facts.summary.join(" ")}</p>
      ) : null}

      {percentBook ? (
        <Note>
          Lattice Close covers share portfolios. This one tracks percentages, so its day is under My
          Portfolio Today; the market close is below.
        </Note>
      ) : p ? (
        <>
          {!p.complete ? (
            <Note>
              <span className="font-semibold text-fg">Partial data.</span> {p.coverage.priced} of{" "}
              {p.coverage.holdings} holdings have prices
              {p.coverage.missing.length ? ` (missing ${p.coverage.missing.join(", ")})` : ""}. The
              return and the S&P 500 comparison appear once every holding is priced.
            </Note>
          ) : null}
          <ListGroup title="Your portfolio">
            <ListRow
              title={p.complete ? "Day P&L" : "Known P&L"}
              detail={
                <Tinted value={p.dayChange}>
                  {p.dayChange != null ? formatMoney(p.dayChange, true) : "—"}
                </Tinted>
              }
            />
            <ListRow
              title="Return"
              detail={<Tinted value={p.returnPercent}>{formatPct(p.returnPercent)}</Tinted>}
            />
            <ListRow
              title="vs S&P 500"
              detail={
                <Tinted value={p.relativeReturnPercent}>
                  {p.relativeReturnPercent != null ? formatPoints(p.relativeReturnPercent) : "—"}
                </Tinted>
              }
            />
            {p.breadth.quoted ? (
              <ListRow
                title="Holdings"
                detail={`${p.breadth.up} up · ${p.breadth.down} down · ${p.breadth.flat} flat`}
              />
            ) : null}
            {p.strongestSector ? (
              <ListRow
                title={`Strongest · ${sectorName(p.strongestSector.sector)}`}
                detail={
                  <Tinted value={p.strongestSector.dayChange}>
                    {formatMoney(p.strongestSector.dayChange, true)}
                    {p.strongestSector.contributionPercent != null
                      ? ` · ${formatPoints(p.strongestSector.contributionPercent)}`
                      : ""}
                  </Tinted>
                }
              />
            ) : null}
            {p.weakestSector ? (
              <ListRow
                title={`Weakest · ${sectorName(p.weakestSector.sector)}`}
                detail={
                  <Tinted value={p.weakestSector.dayChange}>
                    {formatMoney(p.weakestSector.dayChange, true)}
                    {p.weakestSector.contributionPercent != null
                      ? ` · ${formatPoints(p.weakestSector.contributionPercent)}`
                      : ""}
                  </Tinted>
                }
              />
            ) : null}
          </ListGroup>
          <Movers
            title={p.complete ? "Top contributors" : "Known contributors"}
            rows={closeMovers(p.contributors)}
          />
          <Movers
            title={p.complete ? "Top detractors" : "Known detractors"}
            rows={closeMovers(p.detractors)}
          />
        </>
      ) : null}

      <ListGroup title="Market">
        <ListRow
          title="S&P 500"
          detail={
            <Tinted value={m.benchmarkChangePercent}>{formatPct(m.benchmarkChangePercent)}</Tinted>
          }
        />
        {m.strongestSector ? (
          <ListRow
            title={`Led · ${sectorName(m.strongestSector.sector)}`}
            subtitle={m.strongestSector.symbol}
            detail={
              <Tinted value={m.strongestSector.changePercent}>
                {formatPct(m.strongestSector.changePercent)}
              </Tinted>
            }
          />
        ) : null}
        {m.weakestSector ? (
          <ListRow
            title={`Lagged · ${sectorName(m.weakestSector.sector)}`}
            subtitle={m.weakestSector.symbol}
            detail={
              <Tinted value={m.weakestSector.changePercent}>
                {formatPct(m.weakestSector.changePercent)}
              </Tinted>
            }
          />
        ) : null}
        <ListRow
          title="Day"
          wrap
          subtitle={
            m.dayType && m.sectorBreadth
              ? `${DAY_TYPE[m.dayType]} · ${m.sectorBreadth.up} of ${m.sectorCoverage.total} sectors up`
              : `Sector data incomplete · ${m.sectorCoverage.priced} of ${m.sectorCoverage.total} priced`
          }
        />
      </ListGroup>

      {p || percentBook ? (
        <button
          type="button"
          onClick={onToday}
          className="glass glass-pressable mb-4 h-12 w-full rounded-full text-[15px] font-semibold"
        >
          Full details in My Portfolio Today
        </button>
      ) : null}
      <p className="px-1 text-xs leading-relaxed text-muted">
        Facts only, from your positions and delayed public prices. Nothing about your positions
        leaves this device.
      </p>
    </Sheet>
  );
}
