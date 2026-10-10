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

// Common funds people hold, so a portfolio shows "Invesco QQQ" rather than a
// bare ticker. They aren't index members, so they live outside LISTINGS.
const FUND_NAMES: Record<string, string> = {
  SPY: "SPDR S&P 500 ETF",
  VOO: "Vanguard S&P 500 ETF",
  IVV: "iShares Core S&P 500 ETF",
  VTI: "Vanguard Total Stock Market ETF",
  QQQ: "Invesco QQQ Trust",
  QQQM: "Invesco Nasdaq 100 ETF",
  DIA: "SPDR Dow Jones Industrial ETF",
  IWM: "iShares Russell 2000 ETF",
  VT: "Vanguard Total World Stock ETF",
  VXUS: "Vanguard Total International ETF",
  VEA: "Vanguard Developed Markets ETF",
  VWO: "Vanguard Emerging Markets ETF",
  EFA: "iShares MSCI EAFE ETF",
  EEM: "iShares MSCI Emerging Markets ETF",
  SCHD: "Schwab US Dividend Equity ETF",
  VIG: "Vanguard Dividend Appreciation ETF",
  VYM: "Vanguard High Dividend Yield ETF",
  VUG: "Vanguard Growth ETF",
  VTV: "Vanguard Value ETF",
  BND: "Vanguard Total Bond Market ETF",
  AGG: "iShares Core US Aggregate Bond ETF",
  TLT: "iShares 20+ Year Treasury ETF",
  GLD: "SPDR Gold Shares",
  SLV: "iShares Silver Trust",
  ARKK: "ARK Innovation ETF",
  XLK: "Technology Select Sector SPDR",
  XLF: "Financial Select Sector SPDR",
  XLE: "Energy Select Sector SPDR",
  XLV: "Health Care Select Sector SPDR",
  XLY: "Consumer Discretionary SPDR",
  XLP: "Consumer Staples SPDR",
  XLI: "Industrial Select Sector SPDR",
  XLB: "Materials Select Sector SPDR",
  XLRE: "Real Estate Select Sector SPDR",
  XLU: "Utilities Select Sector SPDR",
  XLC: "Communication Services SPDR",
  SOXX: "iShares Semiconductor ETF",
  SMH: "VanEck Semiconductor ETF",
  IGV: "iShares Expanded Tech-Software ETF",
  XBI: "SPDR S&P Biotech ETF",
  IBB: "iShares Biotechnology ETF",
  KRE: "SPDR S&P Regional Banking ETF",
  XRT: "SPDR S&P Retail ETF",
  ITA: "iShares US Aerospace & Defense ETF",
};

export function syntheticListing(symbol: string): Listing {
  const normalized = normalizeSymbol(symbol);
  const fund = FUND_NAMES[normalized];
  return {
    symbol: normalized,
    name: fund ?? normalized,
    sector: "other",
    industry: fund ? "ETF" : "",
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
  quotes: Record<string, { price: number; change: number | null }>,
): MapNode[] {
  const prev = new Map<string, number>();
  for (const node of nodes) {
    const quote = quotes[node.symbol];
    const close = quote?.change != null ? quote.price - quote.change : NaN;
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
  quotes: Record<string, { changePercent: number | null }>,
): number | null {
  let acc = 0;
  let weight = 0;
  for (const node of nodes) {
    const quote = quotes[node.symbol];
    if (!quote || quote.changePercent == null || !Number.isFinite(quote.changePercent) || node.weight <= 0) continue;
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
  // Funds aren't index members; offer them too so QQQ or VOO can be added by name.
  for (const [symbol, name] of Object.entries(FUND_NAMES)) {
    if (starts.length + rest.length >= limit * 2) break;
    const s = symbol.toLowerCase();
    if (s.startsWith(q)) starts.unshift(syntheticListing(symbol));
    else if (name.toLowerCase().includes(q)) rest.push(syntheticListing(symbol));
  }
  return [...starts, ...rest].slice(0, limit);
}

const INDEX_SYMBOL: Record<string, string> = { spx: "^GSPC", ndx: "^NDX", dow: "^DJI" };

/** The quote shown in the header banner: the real index, or the fund itself. */
export function benchmarkSymbol(board: Board): string {
  return INDEX_SYMBOL[board.id] ?? board.title;
}

// Short names for the title bar; long ones get cut off next to the buttons.
const SHORT_TITLE: Record<string, string> = { ndx: "NASDAQ" };

export function boardTitle(board: Board): string {
  return SHORT_TITLE[board.id] ?? board.title;
}
