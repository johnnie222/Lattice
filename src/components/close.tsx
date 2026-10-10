import { sectorLabel, type SectorId } from "@/data/universe";
import { Sheet } from "@/components/sheets";
import { Movers, Section, Stat, type MoverRow } from "@/components/today";
import type { CloseMover, LatticeCloseFacts } from "@/lib/close-facts";
import { formatMoney, formatPct, formatPoints } from "@/lib/format";
import type { DayType } from "@/lib/market-facts";

// Lattice Close renders `LatticeCloseFacts` and nothing else: no portfolio or
// market math happens in this file.

const DAY_TYPE: Record<DayType, string> = {
  "broad-advance": "Broad advance",
  "broad-decline": "Broad decline",
  mixed: "Mixed",
};

const sectorName = (sector: string) => sectorLabel(sector as SectorId);

function tone(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "text-muted";
  return n >= 0 ? "text-up" : "text-down";
}

function moverRows(rows: CloseMover[]): MoverRow[] {
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

function Line({ label, value, valueTone }: { label: string; value: string; valueTone?: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted">{label}</span>
      <span className={`truncate text-right font-mono ${valueTone ?? ""}`}>{value}</span>
    </li>
  );
}

export function CloseSheet({
  facts,
  when,
  legacy,
  onToday,
  onClose,
}: {
  facts: LatticeCloseFacts;
  /** e.g. "Market closed · as of 16:00" */
  when: string;
  /** The book still uses weights from before holdings. */
  legacy: boolean;
  onToday: () => void;
  onClose: () => void;
}) {
  const p = facts.portfolio;
  const m = facts.market;

  return (
    <Sheet title="Lattice Close" onClose={onClose}>
      <p className="-mt-1 mb-3 text-xs text-muted">{when}</p>

      {facts.summary.length ? (
        <p className="text-[15px] leading-relaxed">{facts.summary.join(" ")}</p>
      ) : null}

      {legacy ? (
        <p className="mt-4 rounded-xl border border-line px-3 py-2 text-sm leading-relaxed text-muted">
          Lattice Close covers real holdings. Convert this book in Edit book to see your portfolio’s
          close; the market close is below.
        </p>
      ) : p ? (
        <>
          {!p.complete ? (
            <p className="mt-4 rounded-xl border border-line px-3 py-2 text-sm leading-relaxed">
              <span className="font-semibold">Partial data.</span>{" "}
              <span className="text-muted">
                {p.coverage.priced} of {p.coverage.holdings} holdings have prices
                {p.coverage.missing.length ? ` (missing ${p.coverage.missing.join(", ")})` : ""}.
                The return and the S&P 500 comparison appear once every holding is priced.
              </span>
            </p>
          ) : null}
          <dl className="mt-4 grid grid-cols-3 gap-3">
            <Stat
              label={p.complete ? "Day P&L" : "Known P&L"}
              value={p.dayChange != null ? formatMoney(p.dayChange, true) : "—"}
              valueTone={tone(p.dayChange)}
            />
            <Stat
              label="Return"
              value={p.returnPercent != null ? formatPct(p.returnPercent) : "—"}
              valueTone={tone(p.returnPercent)}
            />
            <Stat
              label="vs S&P 500"
              value={p.relativeReturnPercent != null ? formatPoints(p.relativeReturnPercent) : "—"}
              valueTone={tone(p.relativeReturnPercent)}
            />
          </dl>
          <Movers title="Top contributors" rows={moverRows(p.contributors)} />
          <Movers title="Top detractors" rows={moverRows(p.detractors)} />
          {p.breadth.quoted || p.strongestSector ? (
            <Section title="Breadth & sectors">
              <ul className="flex flex-col gap-1">
                {p.breadth.quoted ? (
                  <Line
                    label="Holdings"
                    value={`${p.breadth.up} up · ${p.breadth.down} down · ${p.breadth.flat} flat`}
                  />
                ) : null}
                {p.strongestSector ? (
                  <Line
                    label={`Strongest · ${sectorName(p.strongestSector.sector)}`}
                    value={`${formatMoney(p.strongestSector.dayChange, true)}${p.strongestSector.contributionPercent != null ? ` · ${formatPoints(p.strongestSector.contributionPercent)}` : ""}`}
                    valueTone={tone(p.strongestSector.dayChange)}
                  />
                ) : null}
                {p.weakestSector ? (
                  <Line
                    label={`Weakest · ${sectorName(p.weakestSector.sector)}`}
                    value={`${formatMoney(p.weakestSector.dayChange, true)}${p.weakestSector.contributionPercent != null ? ` · ${formatPoints(p.weakestSector.contributionPercent)}` : ""}`}
                    valueTone={tone(p.weakestSector.dayChange)}
                  />
                ) : null}
              </ul>
            </Section>
          ) : null}
        </>
      ) : null}

      <Section title="Market">
        <ul className="flex flex-col gap-1">
          <Line
            label="S&P 500"
            value={formatPct(m.benchmarkChangePercent)}
            valueTone={tone(m.benchmarkChangePercent)}
          />
          {m.strongestSector ? (
            <Line
              label={`Led · ${sectorName(m.strongestSector.sector)} (${m.strongestSector.symbol})`}
              value={formatPct(m.strongestSector.changePercent)}
              valueTone={tone(m.strongestSector.changePercent)}
            />
          ) : null}
          {m.weakestSector ? (
            <Line
              label={`Lagged · ${sectorName(m.weakestSector.sector)} (${m.weakestSector.symbol})`}
              value={formatPct(m.weakestSector.changePercent)}
              valueTone={tone(m.weakestSector.changePercent)}
            />
          ) : null}
          <Line
            label="Day"
            value={
              m.dayType && m.sectorBreadth
                ? `${DAY_TYPE[m.dayType]} · ${m.sectorBreadth.up} of ${m.sectorCoverage.total} sectors up`
                : "Sector data incomplete"
            }
          />
        </ul>
      </Section>

      {p && !legacy ? (
        <button
          type="button"
          onClick={onToday}
          className="mt-5 h-11 w-full rounded-xl border border-line text-sm font-medium"
        >
          Full details in My Portfolio Today
        </button>
      ) : null}
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Facts only, from your holdings and delayed public prices. Nothing about your holdings leaves
        this device.
      </p>
    </Sheet>
  );
}
