import { ChevronRight } from "lucide-react";
import { sectorLabel, type SectorId } from "@/data/universe";
import { Sheet } from "@/components/sheets";
import type { BookAnalysis } from "@/lib/book-analysis";
import { formatMoney, formatPct, formatPoints } from "@/lib/format";

// My Portfolio Today. Everything shown here comes from the portfolio
// intelligence engine; this file only decides what to display. Full-return
// and benchmark figures appear only when the engine says the data is complete.

function tone(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "text-muted";
  return n >= 0 ? "text-up" : "text-down";
}

function breadthText(up: number, quoted: number, noun: string): string {
  return `${up} of ${quoted} ${noun}${quoted === 1 ? "" : "s"} up`;
}

/** The compact, glanceable line under the header. */
export function TodayStrip({ result, onOpen }: { result: BookAnalysis; onOpen: () => void }) {
  let headline: { text: string; value: number | null };
  const details: string[] = [];

  if (result.kind === "holdings") {
    const a = result.analysis;
    if (a.dayChange == null) {
      headline = {
        text: a.coverage.holdings ? "Waiting for prices" : "No holdings yet",
        value: null,
      };
    } else {
      headline = { text: formatMoney(a.dayChange, true), value: a.dayChange };
      if (a.complete && a.returnPercent != null) details.push(formatPct(a.returnPercent));
      else details.push(`partial · ${a.coverage.priced} of ${a.coverage.holdings} priced`);
      if (a.relativeReturnPercent != null)
        details.push(`${formatPoints(a.relativeReturnPercent)} vs S&P 500`);
      if (a.breadth.quoted) details.push(breadthText(a.breadth.up, a.breadth.quoted, "holding"));
    }
  } else {
    const a = result.analysis;
    if (a.complete && a.returnPercent != null) {
      headline = { text: formatPct(a.returnPercent), value: a.returnPercent };
      if (a.dollarChange != null) details.push(formatMoney(a.dollarChange, true));
      if (a.relativeReturnPercent != null)
        details.push(`${formatPoints(a.relativeReturnPercent)} vs S&P 500`);
    } else if (a.knownContributionPercent != null) {
      headline = { text: "Partial", value: null };
      details.push(`${Math.round((a.coverageRatio ?? 0) * 100)}% of book priced`);
    } else {
      headline = { text: "Waiting for prices", value: null };
    }
    if (a.breadth.quoted) details.push(breadthText(a.breadth.up, a.breadth.quoted, "name"));
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open My Portfolio Today"
      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2 text-left"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">Today</span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate font-mono text-base font-semibold ${tone(headline.value)}`}
        >
          {headline.text}
        </span>
        {details.length ? (
          <span className="block truncate text-xs text-muted">{details.join(" · ")}</span>
        ) : null}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted" />
    </button>
  );
}

function Stat({
  label,
  value,
  sub,
  valueTone,
}: {
  label: string;
  value: string;
  sub?: string;
  valueTone?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`truncate font-mono text-lg font-semibold ${valueTone ?? ""}`}>{value}</dd>
      {sub ? <dd className="truncate text-xs text-muted">{sub}</dd> : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </section>
  );
}

type MoverRow = { symbol: string; main: string; mainValue: number; sub: string };

function Movers({ title, rows }: { title: string; rows: MoverRow[] }) {
  if (!rows.length) return null;
  return (
    <Section title={title}>
      <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
        {rows.map((row) => (
          <li key={row.symbol} className="flex items-center justify-between gap-3 px-3 py-2">
            <span className="text-sm font-semibold">{row.symbol}</span>
            <span className="text-right">
              <span className={`block font-mono text-sm font-semibold ${tone(row.mainValue)}`}>
                {row.main}
              </span>
              <span className="block text-xs text-muted">{row.sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const sectorName = (sector: string) => sectorLabel(sector as SectorId);

export function TodaySheet({ result, onClose }: { result: BookAnalysis; onClose: () => void }) {
  return (
    <Sheet title="My Portfolio Today" onClose={onClose}>
      {result.kind === "holdings" ? (
        <HoldingsToday result={result} />
      ) : (
        <LegacyToday result={result} />
      )}
      <p className="mt-6 text-xs leading-relaxed text-muted">
        Your holdings and figures stay on this device. Prices may be delayed.
      </p>
    </Sheet>
  );
}

function HoldingsToday({ result }: { result: Extract<BookAnalysis, { kind: "holdings" }> }) {
  const a = result.analysis;
  if (!a.coverage.holdings) {
    return <p className="text-sm text-muted">Add holdings to see how your book is doing today.</p>;
  }
  const partial = !a.complete;
  const top = (rows: typeof a.contributors) =>
    rows.slice(0, 3).map((row): MoverRow => ({
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
        <p className="mb-4 rounded-xl border border-line px-3 py-2 text-sm leading-relaxed">
          <span className="font-semibold">Partial data.</span>{" "}
          <span className="text-muted">
            {a.coverage.priced} of {a.coverage.holdings} holdings have prices
            {a.coverage.missing.length ? ` (missing ${a.coverage.missing.join(", ")})` : ""}. Dollar
            figures count priced holdings only; today’s return and the S&P 500 comparison appear
            once every holding is priced.
          </span>
        </p>
      ) : null}
      <dl className="grid grid-cols-2 gap-4">
        <Stat
          label={partial ? "Today, priced holdings" : "Today"}
          value={a.dayChange != null ? formatMoney(a.dayChange, true) : "—"}
          valueTone={tone(a.dayChange)}
          sub={
            a.value != null ? `of ${formatMoney(a.value)}` : `${formatMoney(a.pricedValue)} priced`
          }
        />
        <Stat
          label="Today’s return"
          value={a.returnPercent != null ? formatPct(a.returnPercent) : "—"}
          valueTone={tone(a.returnPercent)}
          sub={a.returnPercent == null ? "Needs every holding priced" : undefined}
        />
        <Stat
          label="vs S&P 500"
          value={a.relativeReturnPercent != null ? formatPoints(a.relativeReturnPercent) : "—"}
          valueTone={tone(a.relativeReturnPercent)}
          sub={
            a.benchmarkReturnPercent != null
              ? `S&P 500 ${formatPct(a.benchmarkReturnPercent)}`
              : "S&P 500 not loaded"
          }
        />
        <Stat
          label="Breadth"
          value={a.breadth.quoted ? `${a.breadth.up} of ${a.breadth.quoted} up` : "—"}
          sub={a.breadth.quoted ? `${a.breadth.down} down · ${a.breadth.flat} flat` : undefined}
        />
      </dl>
      <Movers title="Top contributors" rows={top(a.contributors)} />
      <Movers title="Top detractors" rows={top(a.detractors)} />
      {a.sectors.length > 1 ? (
        <Section title="By sector">
          <ul className="flex flex-col gap-1">
            {a.sectors.map((row) => (
              <li key={row.sector} className="flex items-center justify-between text-sm">
                <span>
                  {sectorName(row.sector)}
                  <span className="text-muted"> · {row.positions}</span>
                </span>
                <span className={`font-mono ${tone(row.dayChange)}`}>
                  {formatMoney(row.dayChange, true)}
                  {row.contributionPercent != null ? (
                    <span className="text-muted"> · {formatPoints(row.contributionPercent)}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {a.sinceEntry ? (
        <Section title="Since entry">
          <p className={`font-mono text-base font-semibold ${tone(a.sinceEntry.change)}`}>
            {formatMoney(a.sinceEntry.change, true)} ({formatPct(a.sinceEntry.percent)})
          </p>
          <p className="text-xs text-muted">
            On {formatMoney(a.sinceEntry.costBasis)} cost
            {a.sinceEntry.complete
              ? ""
              : ` · ${a.sinceEntry.holdings} of ${a.coverage.holdings} holdings with an average cost and price`}
          </p>
        </Section>
      ) : null}
    </>
  );
}

function LegacyToday({ result }: { result: Extract<BookAnalysis, { kind: "legacy" }> }) {
  const a = result.analysis;
  const partial = !a.complete;
  const top = (rows: typeof a.contributors) =>
    rows.slice(0, 3).map((row): MoverRow => ({
      symbol: row.symbol,
      main: formatPoints(row.contributionPercent),
      mainValue: row.contributionPercent,
      sub: `${formatPct(row.changePercent)}${row.dollarContribution != null ? ` · ${formatMoney(row.dollarContribution, true)}` : ""}`,
    }));

  return (
    <>
      <p className="mb-4 rounded-xl border border-line px-3 py-2 text-sm leading-relaxed text-muted">
        This book uses weights from an earlier version. Convert it to holdings in the book editor
        for exact dollar figures.
      </p>
      {partial && a.coverageRatio != null ? (
        <p className="mb-4 text-sm text-muted">
          <span className="font-semibold text-fg">Partial data.</span>{" "}
          {Math.round(a.coverageRatio * 100)}% of the book has prices. Today’s return and the S&P
          500 comparison appear once every name is priced.
        </p>
      ) : null}
      <dl className="grid grid-cols-2 gap-4">
        <Stat
          label="Today’s return"
          value={a.returnPercent != null ? formatPct(a.returnPercent) : "—"}
          valueTone={tone(a.returnPercent)}
          sub={
            a.returnPercent == null && a.knownContributionPercent != null
              ? `${formatPoints(a.knownContributionPercent)} known so far`
              : a.dollarChange != null
                ? formatMoney(a.dollarChange, true)
                : undefined
          }
        />
        <Stat
          label="vs S&P 500"
          value={a.relativeReturnPercent != null ? formatPoints(a.relativeReturnPercent) : "—"}
          valueTone={tone(a.relativeReturnPercent)}
          sub={
            a.benchmarkReturnPercent != null
              ? `S&P 500 ${formatPct(a.benchmarkReturnPercent)}`
              : "S&P 500 not loaded"
          }
        />
        <Stat
          label="Breadth"
          value={a.breadth.quoted ? `${a.breadth.up} of ${a.breadth.quoted} up` : "—"}
          sub={a.breadth.quoted ? `${a.breadth.down} down · ${a.breadth.flat} flat` : undefined}
        />
      </dl>
      <Movers title="Top contributors" rows={top(a.contributors)} />
      <Movers title="Top detractors" rows={top(a.detractors)} />
    </>
  );
}
