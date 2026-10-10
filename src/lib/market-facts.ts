/**
 * Deterministic market facts from public quotes Lattice already loads.
 * Shared by Lattice Close today, and meant for Opening Bell / an AI brief
 * later: those consume these facts rather than recomputing them.
 *
 * No portfolio data enters here. Every move is a quote's own change versus
 * its previous close; a missing or invalid quote is reported as missing,
 * never as a zero move.
 */
import { BOARDS, type SectorId } from "../data/universe.ts";

/** S&P 500 index. */
export const MARKET_BENCHMARK = "^GSPC";

/** The 11 SPDR sector funds, one per S&P 500 sector. */
export const SECTOR_FUNDS: readonly { symbol: string; sector: SectorId }[] = BOARDS.filter(
  (board) => board.group === "Sector ETF" && board.sector,
).map((board) => ({ symbol: board.title, sector: board.sector! }));

/** Same ±band the map and breadth use for "flat". */
const FLAT_BAND = 0.05;
/** Share of sectors that must move together to call the day broad. */
const BROAD_SHARE = 0.8;

export type MarketQuote = { changePercent: number | null | undefined };

export type SectorMove = { sector: SectorId; symbol: string; changePercent: number };

export type DayType = "broad-advance" | "broad-decline" | "mixed";

export type MarketFacts = {
  /** S&P 500 move today, or null without a usable quote. */
  benchmarkChangePercent: number | null;
  /** Priced sector funds, strongest first. */
  sectors: SectorMove[];
  sectorCoverage: { total: number; priced: number; complete: boolean; missing: string[] };
  /** Overall extremes; null unless every sector is priced and there are at least two. */
  strongestSector: SectorMove | null;
  weakestSector: SectorMove | null;
  /** Up / down / flat sector count. Null unless every sector is priced. */
  sectorBreadth: { up: number; down: number; flat: number } | null;
  /**
   * Broad advance / decline when ≥80% of sectors moved the same way, else
   * mixed. Null unless every sector is priced, so a gap never reads as a call.
   */
  dayType: DayType | null;
};

function move(quote: MarketQuote | undefined): number | null {
  const value = quote?.changePercent;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function marketFacts(
  quotes: Readonly<Record<string, MarketQuote | undefined>>,
  funds: readonly { symbol: string; sector: SectorId }[] = SECTOR_FUNDS,
): MarketFacts {
  const sectors: SectorMove[] = [];
  const missing: string[] = [];
  for (const fund of funds) {
    const changePercent = move(quotes[fund.symbol]);
    if (changePercent == null) missing.push(fund.symbol);
    else sectors.push({ ...fund, changePercent });
  }
  sectors.sort((a, b) => b.changePercent - a.changePercent);

  const complete = funds.length > 0 && missing.length === 0;
  let sectorBreadth: MarketFacts["sectorBreadth"] = null;
  let dayType: DayType | null = null;
  if (complete) {
    const up = sectors.filter((s) => s.changePercent > FLAT_BAND).length;
    const down = sectors.filter((s) => s.changePercent < -FLAT_BAND).length;
    sectorBreadth = { up, down, flat: sectors.length - up - down };
    dayType =
      up / sectors.length >= BROAD_SHARE
        ? "broad-advance"
        : down / sectors.length >= BROAD_SHARE
          ? "broad-decline"
          : "mixed";
  }

  return {
    benchmarkChangePercent: move(quotes[MARKET_BENCHMARK]),
    sectors,
    sectorCoverage: { total: funds.length, priced: sectors.length, complete, missing },
    strongestSector: complete && sectors.length >= 2 ? sectors[0]! : null,
    weakestSector: complete && sectors.length >= 2 ? sectors[sectors.length - 1]! : null,
    sectorBreadth,
    dayType,
  };
}
