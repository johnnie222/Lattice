import { createFileRoute } from "@tanstack/react-router";
import { Lattice } from "@/components/lattice";
import { SECTORS, type SectorId } from "@/data/universe";

export type LatticeSearch = {
  board?: string;
  sector?: SectorId;
  q?: string;
};

const SECTOR_IDS = new Set<string>(SECTORS.map((sector) => sector.id));

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): LatticeSearch => {
    const out: LatticeSearch = {};
    if (typeof search.board === "string" && /^[a-z0-9-]{1,24}$/.test(search.board)) out.board = search.board;
    if (typeof search.sector === "string" && SECTOR_IDS.has(search.sector)) out.sector = search.sector as SectorId;
    if (typeof search.q === "string" && search.q.trim()) out.q = search.q.slice(0, 40);
    return out;
  },
  component: Lattice,
});
