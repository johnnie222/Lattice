import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SectorId } from "@/data/universe";
import type { Period } from "@/lib/periods";
import type { LatticeSearch } from "@/lib/view-search";

export const DEFAULT_BOARD = "spx";

export type ViewPatch = {
  board?: string;
  sector?: SectorId | null;
  q?: string;
  t?: Period;
  tab?: "map" | "sectors" | "portfolio";
};

/**
 * Tab, board, sector drill, search and time frame live in the URL so any view
 * can be shared or restored. Defaults are left out to keep links short.
 */
export function useView() {
  const search = useSearch({ from: "/" }) as LatticeSearch;
  const navigate = useNavigate({ from: "/" });
  const setView = useCallback(
    (next: ViewPatch, options?: { push?: boolean }) => {
      void navigate({
        // Views replace each other; a jump between tabs can push, so Back returns.
        replace: !options?.push,
        search: (prev: LatticeSearch) => {
          const merged = { ...prev, ...next };
          return {
            tab: merged.tab && merged.tab !== "map" ? merged.tab : undefined,
            board: merged.board && merged.board !== DEFAULT_BOARD ? merged.board : undefined,
            sector: merged.sector ?? undefined,
            q: merged.q?.trim() ? merged.q : undefined,
            t: merged.t && merged.t !== "1d" ? merged.t : undefined,
          };
        },
      });
    },
    [navigate],
  );
  return { search, setView };
}
