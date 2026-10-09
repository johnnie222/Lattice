import {
  BOARDS,
  LISTINGS,
  type Board,
  type Listing,
  type SectorId,
} from "@/data/universe";

const BY_SYMBOL = new Map(LISTINGS.map((row) => [row.symbol, row]));

// Nasdaq reports the whole company on each share class. Split so GOOG + GOOGL
// don't paint Alphabet twice.
const CLASS_SHARE: Record<string, number> = {
  GOOGL: 0.46,
  GOOG: 0.54,
  FOXA: 0.64,
  FOX: 0.36,
  NWSA: 0.72,
  NWS: 0.28,
};

function sizedCap(symbol: string, cap: number): number {
  return Math.max(cap, 1) * (CLASS_SHARE[symbol] ?? 1);
}

export function normalizeSymbol(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\./g, "-")
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 10);
}

export function findListing(symbol: string): Listing | undefined {
  return BY_SYMBOL.get(normalizeSymbol(symbol));
}

export function syntheticListing(symbol: string): Listing {
  const normalized = normalizeSymbol(symbol);
  return {
    symbol: normalized,
    name: normalized,
    sector: "other",
    industry: "",
    cap: 0,
    sp: false,
    ndx: false,
    dow: false,
  };
}

export type MapNode = {
  symbol: string;
  name: string;
  sector: SectorId;
  industry: string;
  cap: number;
  weight: number;
};

export function boardById(id: string): Board {
  return BOARDS.find((board) => board.id === id) ?? BOARDS[0]!;
}

export function boardNodes(board: Board): MapNode[] {
  if (board.lines?.length) {
    const nodes: MapNode[] = [];
    for (const line of board.lines) {
      const listing = BY_SYMBOL.get(line.symbol) ?? syntheticListing(line.symbol);
      const weight =
        board.weighting === "cap"
          ? sizedCap(listing.symbol, listing.cap)
          : board.weighting === "equal"
            ? 1
            : line.weight;
      if (weight <= 0) continue;
      nodes.push({
        symbol: listing.symbol,
        name: listing.name,
        sector: listing.sector,
        industry: listing.industry,
        cap: listing.cap,
        weight,
      });
    }
    return nodes;
  }

  let rows = LISTINGS;
  if (board.index === "sp") rows = rows.filter((row) => row.sp);
  else if (board.index === "ndx") rows = rows.filter((row) => row.ndx);
  else if (board.index === "dow") rows = rows.filter((row) => row.dow);
  if (board.sector) rows = rows.filter((row) => row.sector === board.sector);

  return rows.map((listing) => ({
    symbol: listing.symbol,
    name: listing.name,
    sector: listing.sector,
    industry: listing.industry,
    cap: listing.cap,
    weight: board.weighting === "price" ? 1 : sizedCap(listing.symbol, listing.cap),
  }));
}

// Price-weighted boards (the Dow) size each name by its previous close. That
// makes weightedChange equal sum(change) / sum(prevClose), i.e. the index's own
// percent move. Names without a quote yet borrow the average so nothing jumps.
export function applyPriceWeights(
  nodes: MapNode[],
  quotes: Record<string, { price: number; change: number }>,
): MapNode[] {
  const prev = new Map<string, number>();
  for (const node of nodes) {
    const quote = quotes[node.symbol];
    const close = quote ? quote.price - quote.change : NaN;
    if (Number.isFinite(close) && close > 0) prev.set(node.symbol, close);
  }
  if (!prev.size) return nodes.map((node) => ({ ...node, weight: 1 }));
  const avg = [...prev.values()].reduce((sum, v) => sum + v, 0) / prev.size;
  return nodes.map((node) => ({ ...node, weight: prev.get(node.symbol) ?? avg }));
}

export type FilterId = "all" | "up" | "down" | "m1" | "m2";

export function matchesQuery(node: MapNode, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${node.symbol} ${node.name} ${node.industry}`.toLowerCase().includes(q);
}

export function matchesMove(pct: number | null, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (pct == null || Number.isNaN(pct)) return false;
  if (filter === "up") return pct > 0.05;
  if (filter === "down") return pct < -0.05;
  if (filter === "m1") return Math.abs(pct) >= 1;
  if (filter === "m2") return Math.abs(pct) >= 2;
  return true;
}

export function weightedChange(
  nodes: MapNode[],
  quotes: Record<string, { changePercent: number }>,
): number | null {
  let acc = 0;
  let weight = 0;
  for (const node of nodes) {
    const quote = quotes[node.symbol];
    if (!quote || node.weight <= 0) continue;
    acc += node.weight * quote.changePercent;
    weight += node.weight;
  }
  return weight > 0 ? acc / weight : null;
}

export function suggestListings(query: string, limit = 6): Listing[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: Listing[] = [];
  const rest: Listing[] = [];
  for (const listing of LISTINGS) {
    const symbol = listing.symbol.toLowerCase();
    const name = listing.name.toLowerCase();
    if (symbol.startsWith(q)) starts.push(listing);
    else if (symbol.includes(q) || name.includes(q)) rest.push(listing);
    if (starts.length >= limit) break;
  }
  return [...starts, ...rest].slice(0, limit);
}
