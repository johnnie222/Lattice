import { createFileRoute } from "@tanstack/react-router";
import { Lattice } from "@/components/lattice";
import { validateLatticeSearch } from "@/lib/view-search";

export const Route = createFileRoute("/")({
  validateSearch: validateLatticeSearch,
  component: Lattice,
});
