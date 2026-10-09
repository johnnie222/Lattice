import { createFileRoute } from "@tanstack/react-router";
import { Lattice } from "@/components/lattice";

export const Route = createFileRoute("/")({
  component: Lattice,
});
