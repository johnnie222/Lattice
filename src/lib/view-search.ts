import { SECTORS, type SectorId } from "@/data/universe";

export type LatticeSearch = {
  board?: string;
  sector?: SectorId;
  q?: string;
  /** Lookback period; absent means 1D. */
  t?: "1w" | "1m" | "ytd";
  tab?: "sectors" | "portfolio";
};

const SECTOR_IDS = new Set<string>(SECTORS.map((sector) => sector.id));

export function validateLatticeSearch(search: Record<string, unknown>): LatticeSearch {
  const out: LatticeSearch = {};
  if (typeof search.board === "string" && /^[a-z0-9-]{1,24}$/.test(search.board)) out.board = search.board;
  if (typeof search.sector === "string" && SECTOR_IDS.has(search.sector)) out.sector = search.sector as SectorId;
  if (typeof search.q === "string" && search.q.trim()) out.q = search.q.slice(0, 40);
  if (search.t === "1w" || search.t === "1m" || search.t === "ytd") out.t = search.t;
  if (search.tab === "sectors" || search.tab === "portfolio") out.tab = search.tab;
  return out;
}
