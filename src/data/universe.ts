// Snapshot of index membership. Prices are live; market caps size the tiles until refreshed.
export type SectorId =
  | "tech"
  | "financials"
  | "health"
  | "discretionary"
  | "communication"
  | "industrials"
  | "staples"
  | "energy"
  | "utilities"
  | "realestate"
  | "materials"
  | "other";

export type Listing = {
  symbol: string;
  name: string;
  sector: SectorId;
  industry: string;
  cap: number;
  sp: boolean;
  ndx: boolean;
  dow: boolean;
};

export type BoardLine = { symbol: string; weight: number };

export type Board = {
  id: string;
  title: string;
  name: string;
  group: "Index" | "Sector ETF" | "Thematic";
  grouped: boolean;
  weighting: "cap" | "equal" | "custom" | "price";
  index?: "sp" | "ndx" | "dow";
  sector?: SectorId;
  lines?: BoardLine[];
};

export const SECTORS: { id: SectorId; label: string }[] = [
  { id: "tech", label: "Technology" },
  { id: "financials", label: "Financials" },
  { id: "health", label: "Health Care" },
  { id: "discretionary", label: "Discretionary" },
  { id: "communication", label: "Communication" },
  { id: "industrials", label: "Industrials" },
  { id: "staples", label: "Staples" },
  { id: "energy", label: "Energy" },
  { id: "utilities", label: "Utilities" },
  { id: "realestate", label: "Real Estate" },
  { id: "materials", label: "Materials" },
  { id: "other", label: "Other" },
];

const SECTOR_LABEL = new Map(SECTORS.map((s) => [s.id, s.label]));

export function sectorLabel(id: SectorId): string {
  return SECTOR_LABEL.get(id) ?? id;
}

export const LISTINGS = [
  {
    "symbol": "NVDA",
    "name": "Nvidia",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 5554568000000.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 4968150755600.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "MSFT",
    "name": "Microsoft",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 3880664329052.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "AVGO",
    "name": "Broadcom",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 1719175059581.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MU",
    "name": "Micron Technology",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 1169870601532.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "AMD",
    "name": "Advanced Micro Devices",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 1013244609069.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "INTC",
    "name": "Intel",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 565925243238.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "PLTR",
    "name": "Palantir Technologies",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 477480190754.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CSCO",
    "name": "Cisco",
    "sector": "tech",
    "industry": "Communications Equipment",
    "cap": 452963805839.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "ORCL",
    "name": "Oracle Corporation",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 411344390908.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMAT",
    "name": "Applied Materials",
    "sector": "tech",
    "industry": "Semiconductor Materials & Equipment",
    "cap": 404393449030.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "LRCX",
    "name": "Lam Research",
    "sector": "tech",
    "industry": "Semiconductor Materials & Equipment",
    "cap": 401194136214.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "DELL",
    "name": "Dell Technologies",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 365306215513.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PANW",
    "name": "Palo Alto Networks",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 325973000000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CRWD",
    "name": "CrowdStrike",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 269305102794.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ANET",
    "name": "Arista Networks",
    "sector": "tech",
    "industry": "Communications Equipment",
    "cap": 266080563989.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TXN",
    "name": "Texas Instruments",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 263197983105.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "KLAC",
    "name": "KLA Corporation",
    "sector": "tech",
    "industry": "Semiconductor Materials & Equipment",
    "cap": 256720877106.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MRVL",
    "name": "Marvell Technology",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 240849354000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "SNDK",
    "name": "Sandisk",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 233899091072.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "IBM",
    "name": "IBM",
    "sector": "tech",
    "industry": "IT Consulting & Other Services",
    "cap": 213497074118.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "APH",
    "name": "Amphenol",
    "sector": "tech",
    "industry": "Electronic Components",
    "cap": 210396297102.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ADI",
    "name": "Analog Devices",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 196699659207.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CRM",
    "name": "Salesforce",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 187479400000.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "QCOM",
    "name": "Qualcomm",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 184851672435.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "STX",
    "name": "Seagate Technology",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 177216851279.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "WDC",
    "name": "Western Digital",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 146928022214.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "NOW",
    "name": "ServiceNow",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 144501500000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ACN",
    "name": "Accenture",
    "sector": "tech",
    "industry": "IT Consulting & Other Services",
    "cap": 139082427356.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FTNT",
    "name": "Fortinet",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 138745251782.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "GLW",
    "name": "Corning Inc.",
    "sector": "tech",
    "industry": "Electronic Components",
    "cap": 131645978627.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DDOG",
    "name": "Datadog",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 98314741571.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CDNS",
    "name": "Cadence Design Systems",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 96068094120.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "SNPS",
    "name": "Synopsys",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 95387140547.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "LITE",
    "name": "Lumentum",
    "sector": "tech",
    "industry": "Communications Equipment",
    "cap": 94985182802.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "HPE",
    "name": "Hewlett Packard Enterprise",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 94249999309.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ADBE",
    "name": "Adobe Inc.",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 93816660000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "INTU",
    "name": "Intuit",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 81207675680.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MSI",
    "name": "Motorola Solutions",
    "sector": "tech",
    "industry": "Communications Equipment",
    "cap": 73995582491.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MPWR",
    "name": "Monolithic Power Systems",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 67316081400.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "KEYS",
    "name": "Keysight Technologies",
    "sector": "tech",
    "industry": "Electronic Equipment & Instruments",
    "cap": 63785598609.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TER",
    "name": "Teradyne",
    "sector": "tech",
    "industry": "Semiconductor Materials & Equipment",
    "cap": 62336183840.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "TEL",
    "name": "TE Connectivity",
    "sector": "tech",
    "industry": "Electronic Manufacturing Services",
    "cap": 62045579893.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CIEN",
    "name": "Ciena",
    "sector": "tech",
    "industry": "Communications Equipment",
    "cap": 60400505053.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "COHR",
    "name": "Coherent Corp.",
    "sector": "tech",
    "industry": "Electronic Components",
    "cap": 59209879578.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NXPI",
    "name": "NXP Semiconductors",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 58267575686.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "P",
    "name": "Everpure",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 50174027183.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ADSK",
    "name": "Autodesk",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 48822400000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "NTAP",
    "name": "NetApp",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 45382611105.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WDAY",
    "name": "Workday, Inc.",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 45262210000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "FLEX",
    "name": "Flex Ltd.",
    "sector": "tech",
    "industry": "Electronic Manufacturing Services",
    "cap": 42391891230.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TWLO",
    "name": "Twilio",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 42351438419.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MCHP",
    "name": "Microchip Technology",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 41008016344.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ROP",
    "name": "Roper Technologies",
    "sector": "tech",
    "industry": "Electronic Equipment & Instruments",
    "cap": 36022665337.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "JBL",
    "name": "Jabil",
    "sector": "tech",
    "industry": "Electronic Manufacturing Services",
    "cap": 31348105545.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ON",
    "name": "ON Semiconductor",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 30915791058.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HPQ",
    "name": "HP Inc.",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 29254099034.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SMCI",
    "name": "Supermicro",
    "sector": "tech",
    "industry": "Technology Hardware, Storage & Peripherals",
    "cap": 28098409474.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TDY",
    "name": "Teledyne Technologies",
    "sector": "tech",
    "industry": "Electronic Equipment & Instruments",
    "cap": 28036838144.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CTSH",
    "name": "Cognizant",
    "sector": "tech",
    "industry": "IT Consulting & Other Services",
    "cap": 27031156982.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VRSN",
    "name": "Verisign",
    "sector": "tech",
    "industry": "Internet Services & Infrastructure",
    "cap": 26890437000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "Q",
    "name": "Qnity Electronics",
    "sector": "tech",
    "industry": "Semiconductor Materials & Equipment",
    "cap": 26502538227.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FFIV",
    "name": "F5, Inc.",
    "sector": "tech",
    "industry": "Communications Equipment",
    "cap": 26142504842.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PTC",
    "name": "PTC Inc.",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 21020917944.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FSLR",
    "name": "First Solar",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 19220971584.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ZBRA",
    "name": "Zebra Technologies",
    "sector": "tech",
    "industry": "Electronic Equipment & Instruments",
    "cap": 18079295612.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CDW",
    "name": "CDW Corporation",
    "sector": "tech",
    "industry": "Technology Distributors",
    "cap": 17487437549.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FICO",
    "name": "Fair Isaac",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 15278814928.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AKAM",
    "name": "Akamai Technologies",
    "sector": "tech",
    "industry": "Internet Services & Infrastructure",
    "cap": 14501005848.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TRMB",
    "name": "Trimble Inc.",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 13955813903.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GEN",
    "name": "Gen Digital",
    "sector": "tech",
    "industry": "Systems Software",
    "cap": 13617854978.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TYL",
    "name": "Tyler Technologies",
    "sector": "tech",
    "industry": "Application Software",
    "cap": 13561345535.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GDDY",
    "name": "GoDaddy",
    "sector": "tech",
    "industry": "Internet Services & Infrastructure",
    "cap": 13068776576.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IT",
    "name": "Gartner",
    "sector": "tech",
    "industry": "IT Consulting & Other Services",
    "cap": 12339941400.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SWKS",
    "name": "Skyworks Solutions",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 12005891185.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BRK-B",
    "name": "Berkshire Hathaway",
    "sector": "financials",
    "industry": "Multi-Sector Holdings",
    "cap": 1127535426150.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "JPM",
    "name": "JPMorgan Chase",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 880976068747.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "V",
    "name": "Visa Inc.",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 670211884898.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "MA",
    "name": "Mastercard",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 503495473114.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BAC",
    "name": "Bank of America",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 374881239848.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MS",
    "name": "Morgan Stanley",
    "sector": "financials",
    "industry": "Investment Banking & Brokerage",
    "cap": 294386945772.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GS",
    "name": "Goldman Sachs",
    "sector": "financials",
    "industry": "Investment Banking & Brokerage",
    "cap": 256984972987.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "WFC",
    "name": "Wells Fargo",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 248058665532.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "C",
    "name": "Citigroup",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 214846103167.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AXP",
    "name": "American Express",
    "sector": "financials",
    "industry": "Consumer Finance",
    "cap": 208062959547.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "SCHW",
    "name": "Charles Schwab Corporation",
    "sector": "financials",
    "industry": "Investment Banking & Brokerage",
    "cap": 167520750615.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BLK",
    "name": "BlackRock",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 164989965076.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CB",
    "name": "Chubb Limited",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 132630275527.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PGR",
    "name": "Progressive Corporation",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 127163447252.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "COF",
    "name": "Capital One",
    "sector": "financials",
    "industry": "Consumer Finance",
    "cap": 122328876298.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SPGI",
    "name": "S&P Global",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 118724804000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CME",
    "name": "CME Group",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 99402091464.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BNY",
    "name": "BNY Mellon",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 97439979833.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HOOD",
    "name": "Robinhood Markets",
    "sector": "financials",
    "industry": "Investment Banking & Brokerage",
    "cap": 96210794034.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "USB",
    "name": "U.S. Bancorp",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 88855673965.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PNC",
    "name": "PNC Financial Services",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 87639944767.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ICE",
    "name": "Intercontinental Exchange",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 87212633555.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BX",
    "name": "Blackstone Inc.",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 84580437846.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MRSH",
    "name": "Marsh McLennan",
    "sector": "financials",
    "industry": "Insurance Brokers",
    "cap": 84308914718.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KKR",
    "name": "KKR & Co.",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 80392244426.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MCO",
    "name": "Moody's Corporation",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 79445108000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TRV",
    "name": "Travelers Companies (The)",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 77229073396.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "APO",
    "name": "Apollo Global Management",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 68089626233.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MET",
    "name": "MetLife",
    "sector": "financials",
    "industry": "Life & Health Insurance",
    "cap": 62575413002.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AJG",
    "name": "Arthur J. Gallagher & Co.",
    "sector": "financials",
    "industry": "Insurance Brokers",
    "cap": 59987015000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AON",
    "name": "Aon plc",
    "sector": "financials",
    "industry": "Insurance Brokers",
    "cap": 58784200270.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ALL",
    "name": "Allstate",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 58316629009.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AFL",
    "name": "Aflac",
    "sector": "financials",
    "industry": "Life & Health Insurance",
    "cap": 57624398672.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TFC",
    "name": "Truist Financial",
    "sector": "financials",
    "industry": "Diversified Banks",
    "cap": 56414697362.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NDAQ",
    "name": "Nasdaq, Inc.",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 51632739852.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "STT",
    "name": "State Street Corporation",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 48097532034.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PYPL",
    "name": "PayPal",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 47067457287.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "FITB",
    "name": "Fifth Third Bancorp",
    "sector": "financials",
    "industry": "Regional Banks",
    "cap": 45979452995.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "COIN",
    "name": "Coinbase",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 45379950756.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "XYZ",
    "name": "Block, Inc.",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 45197807850.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMP",
    "name": "Ameriprise Financial",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 44865836683.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MSCI",
    "name": "MSCI",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 40833409000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AIG",
    "name": "American International Group",
    "sector": "financials",
    "industry": "Multi-line Insurance",
    "cap": 40288918671.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IBKR",
    "name": "Interactive Brokers",
    "sector": "financials",
    "industry": "Investment Banking & Brokerage",
    "cap": 39177669446.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PRU",
    "name": "Prudential Financial",
    "sector": "financials",
    "industry": "Life & Health Insurance",
    "cap": 39167850000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ARES",
    "name": "Ares Management",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 38398030644.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HIG",
    "name": "Hartford (The)",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 35072506819.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CBOE",
    "name": "Cboe Global Markets",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 32883658000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ACGL",
    "name": "Arch Capital Group",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 32785294426.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MTB",
    "name": "M&T Bank",
    "sector": "financials",
    "industry": "Regional Banks",
    "cap": 31419201961.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HBAN",
    "name": "Huntington Bancshares",
    "sector": "financials",
    "industry": "Regional Banks",
    "cap": 31053775876.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NTRS",
    "name": "Northern Trust",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 30828027531.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RJF",
    "name": "Raymond James Financial",
    "sector": "financials",
    "industry": "Investment Banking & Brokerage",
    "cap": 30508567365.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WTW",
    "name": "Willis Towers Watson",
    "sector": "financials",
    "industry": "Insurance Brokers",
    "cap": 27662835155.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SYF",
    "name": "Synchrony Financial",
    "sector": "financials",
    "industry": "Consumer Finance",
    "cap": 27428082439.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CFG",
    "name": "Citizens Financial Group",
    "sector": "financials",
    "industry": "Regional Banks",
    "cap": 26993220343.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WRB",
    "name": "W. R. Berkley Corporation",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 26746943464.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CPAY",
    "name": "Corpay",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 26400411566.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CINF",
    "name": "Cincinnati Financial",
    "sector": "financials",
    "industry": "Property & Casualty Insurance",
    "cap": 25362246936.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FISV",
    "name": "Fiserv",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 24429363163.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PFG",
    "name": "Principal Financial Group",
    "sector": "financials",
    "industry": "Life & Health Insurance",
    "cap": 23502266443.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RF",
    "name": "Regions Financial Corporation",
    "sector": "financials",
    "industry": "Regional Banks",
    "cap": 23061731727.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TROW",
    "name": "T. Rowe Price",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 22233911046.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "L",
    "name": "Loews Corporation",
    "sector": "financials",
    "industry": "Multi-line Insurance",
    "cap": 21996422672.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GPN",
    "name": "Global Payments",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 21902464140.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KEY",
    "name": "KeyCorp",
    "sector": "financials",
    "industry": "Regional Banks",
    "cap": 21449283935.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BRO",
    "name": "Brown & Brown",
    "sector": "financials",
    "industry": "Insurance Brokers",
    "cap": 21331410259.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FIS",
    "name": "Fidelity National Information Services",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 17709341190.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BEN",
    "name": "Franklin Resources",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 16461691884.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EG",
    "name": "Everest Group",
    "sector": "financials",
    "industry": "Reinsurance",
    "cap": 14305674055.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AIZ",
    "name": "Assurant",
    "sector": "financials",
    "industry": "Multi-line Insurance",
    "cap": 13458483064.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IVZ",
    "name": "Invesco",
    "sector": "financials",
    "industry": "Asset Management & Custody Banks",
    "cap": 13284728380.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GL",
    "name": "Globe Life",
    "sector": "financials",
    "industry": "Life & Health Insurance",
    "cap": 12763156158.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ERIE",
    "name": "Erie Indemnity",
    "sector": "financials",
    "industry": "Insurance Brokers",
    "cap": 10463671465.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "JKHY",
    "name": "Jack Henry & Associates",
    "sector": "financials",
    "industry": "Transaction & Payment Processing Services",
    "cap": 10450193451.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FDS",
    "name": "FactSet",
    "sector": "financials",
    "industry": "Financial Exchanges & Data",
    "cap": 10190239380.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LLY",
    "name": "Lilly (Eli)",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 1101011223224.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "JNJ",
    "name": "Johnson & Johnson",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 618090792159.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "ABBV",
    "name": "AbbVie",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 481398090780.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MRK",
    "name": "Merck & Co.",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 351275897818.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "UNH",
    "name": "UnitedHealth Group",
    "sector": "health",
    "industry": "Managed Health Care",
    "cap": 332962808495.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "TMO",
    "name": "Thermo Fisher Scientific",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 241067835526.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMGN",
    "name": "Amgen",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 220275104117.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "GILD",
    "name": "Gilead Sciences",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 182397403301.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ABT",
    "name": "Abbott Laboratories",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 170425450823.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PFE",
    "name": "Pfizer",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 158564919246.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DHR",
    "name": "Danaher Corporation",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 152871347303.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ISRG",
    "name": "Intuitive Surgical",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 146755229766.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "VRTX",
    "name": "Vertex Pharmaceuticals",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 127554210003.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "BMY",
    "name": "Bristol Myers Squibb",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 121704939204.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CVS",
    "name": "CVS Health",
    "sector": "health",
    "industry": "Health Care Services",
    "cap": 112293598398.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MDT",
    "name": "Medtronic",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 112244349848.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MCK",
    "name": "McKesson Corporation",
    "sector": "health",
    "industry": "Health Care Distributors",
    "cap": 108458185181.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SYK",
    "name": "Stryker Corporation",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 106238226551.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HCA",
    "name": "HCA Healthcare",
    "sector": "health",
    "industry": "Health Care Facilities",
    "cap": 96345332515.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ELV",
    "name": "Elevance Health",
    "sector": "health",
    "industry": "Managed Health Care",
    "cap": 86951573133.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MRNA",
    "name": "Moderna",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 78649470133.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "REGN",
    "name": "Regeneron Pharmaceuticals",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 76142420475.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CI",
    "name": "Cigna",
    "sector": "health",
    "industry": "Health Care Services",
    "cap": 74259503781.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "COR",
    "name": "Cencora",
    "sector": "health",
    "industry": "Health Care Distributors",
    "cap": 61322309473.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BSX",
    "name": "Boston Scientific",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 60925609273.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CAH",
    "name": "Cardinal Health",
    "sector": "health",
    "industry": "Health Care Distributors",
    "cap": 55333421081.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BDX",
    "name": "Becton Dickinson",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 49778687700.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EW",
    "name": "Edwards Lifesciences",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 48555936000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "A",
    "name": "Agilent Technologies",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 47411975377.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HUM",
    "name": "Humana",
    "sector": "health",
    "industry": "Managed Health Care",
    "cap": 46485488833.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VEEV",
    "name": "Veeva Systems",
    "sector": "health",
    "industry": "Health Care Technology",
    "cap": 46118116834.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IQV",
    "name": "IQVIA",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 42611648000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WAT",
    "name": "Waters Corporation",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 42161211873.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IDXX",
    "name": "Idexx Laboratories",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 40425741864.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ILMN",
    "name": "Illumina, Inc.",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 39950070000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BIIB",
    "name": "Biogen",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 32273905783.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RMD",
    "name": "ResMed|",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 31887135565.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CNC",
    "name": "Centene Corporation",
    "sector": "health",
    "industry": "Managed Health Care",
    "cap": 31882437300.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DXCM",
    "name": "Dexcom",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 31853022174.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MTD",
    "name": "Mettler Toledo",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 30645115528.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ZTS",
    "name": "Zoetis",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 30198380834.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GEHC",
    "name": "GE HealthCare",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 29007291103.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "WST",
    "name": "West Pharmaceutical Services",
    "sector": "health",
    "industry": "Health Care Supplies",
    "cap": 25565403062.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LH",
    "name": "Labcorp",
    "sector": "health",
    "industry": "Health Care Services",
    "cap": 25481620000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DGX",
    "name": "Quest Diagnostics",
    "sector": "health",
    "industry": "Health Care Services",
    "cap": 25475275222.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "INCY",
    "name": "Incyte",
    "sector": "health",
    "industry": "Biotechnology",
    "cap": 22854170862.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "STE",
    "name": "Steris",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 20549123184.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VTRS",
    "name": "Viatris",
    "sector": "health",
    "industry": "Pharmaceuticals",
    "cap": 20031424668.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RVTY",
    "name": "Revvity",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 16978986776.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ZBH",
    "name": "Zimmer Biomet",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 16952765798.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SOLV",
    "name": "Solventum",
    "sector": "health",
    "industry": "Health Care Technology",
    "cap": 14709032423.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CRL",
    "name": "Charles River Laboratories",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 14226183856.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BAX",
    "name": "Baxter International",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 12356204376.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TECH",
    "name": "Bio-Techne",
    "sector": "health",
    "industry": "Life Sciences Tools & Services",
    "cap": 11361481343.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DVA",
    "name": "DaVita",
    "sector": "health",
    "industry": "Health Care Services",
    "cap": 11293876000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "UHS",
    "name": "Universal Health Services",
    "sector": "health",
    "industry": "Health Care Facilities",
    "cap": 10356324416.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "COO",
    "name": "Cooper Companies (The)",
    "sector": "health",
    "industry": "Health Care Supplies",
    "cap": 10325432464.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ALGN",
    "name": "Align Technology",
    "sector": "health",
    "industry": "Health Care Supplies",
    "cap": 10018750328.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HSIC",
    "name": "Henry Schein",
    "sector": "health",
    "industry": "Health Care Distributors",
    "cap": 9431720849.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PODD",
    "name": "Insulet Corporation",
    "sector": "health",
    "industry": "Health Care Equipment",
    "cap": 9326059140.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMZN",
    "name": "Amazon",
    "sector": "discretionary",
    "industry": "Broadline Retail",
    "cap": 2740370826102.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "TSLA",
    "name": "Tesla, Inc.",
    "sector": "discretionary",
    "industry": "Automobile Manufacturers",
    "cap": 1481080272750.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "HD",
    "name": "Home Depot (The)",
    "sector": "discretionary",
    "industry": "Home Improvement Retail",
    "cap": 294787353794.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "MCD",
    "name": "McDonald's",
    "sector": "discretionary",
    "industry": "Restaurants",
    "cap": 167640278694.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "TJX",
    "name": "TJX Companies",
    "sector": "discretionary",
    "industry": "Apparel Retail",
    "cap": 152621400964.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BKNG",
    "name": "Booking Holdings",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 120198338585.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "SBUX",
    "name": "Starbucks",
    "sector": "discretionary",
    "industry": "Restaurants",
    "cap": 106259400000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "LOW",
    "name": "Lowe's",
    "sector": "discretionary",
    "industry": "Home Improvement Retail",
    "cap": 105955051488.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ABNB",
    "name": "Airbnb",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 97739786873.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MAR",
    "name": "Marriott International",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 94157491271.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "DASH",
    "name": "DoorDash",
    "sector": "discretionary",
    "industry": "Specialized Consumer Services",
    "cap": 83067547502.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "RCL",
    "name": "Royal Caribbean Group",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 75263690958.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HLT",
    "name": "Hilton Worldwide",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 72761234754.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GM",
    "name": "General Motors",
    "sector": "discretionary",
    "industry": "Automobile Manufacturers",
    "cap": 72170389247.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ROST",
    "name": "Ross Stores",
    "sector": "discretionary",
    "industry": "Apparel Retail",
    "cap": 71940840372.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ORLY",
    "name": "O'Reilly Automotive",
    "sector": "discretionary",
    "industry": "Automotive Retail",
    "cap": 69578717720.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CVNA",
    "name": "Carvana",
    "sector": "discretionary",
    "industry": "Automotive Retail",
    "cap": 69549310264.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GRMN",
    "name": "Garmin",
    "sector": "discretionary",
    "industry": "Consumer Electronics",
    "cap": 51769334764.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NKE",
    "name": "Nike, Inc.",
    "sector": "discretionary",
    "industry": "Apparel, Accessories & Luxury Goods",
    "cap": 51599628719.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "EBAY",
    "name": "eBay Inc.",
    "sector": "discretionary",
    "industry": "Broadline Retail",
    "cap": 49831100000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "F",
    "name": "Ford Motor Company",
    "sector": "discretionary",
    "industry": "Automobile Manufacturers",
    "cap": 47980108990.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AZO",
    "name": "AutoZone",
    "sector": "discretionary",
    "industry": "Automotive Retail",
    "cap": 47515598742.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CMG",
    "name": "Chipotle Mexican Grill",
    "sector": "discretionary",
    "industry": "Restaurants",
    "cap": 41353860240.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "YUM",
    "name": "Yum! Brands",
    "sector": "discretionary",
    "industry": "Restaurants",
    "cap": 39024855155.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DHI",
    "name": "D. R. Horton",
    "sector": "discretionary",
    "industry": "Homebuilding",
    "cap": 37989026084.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CCL",
    "name": "Carnival Corporation",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 35134662671.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EXPE",
    "name": "Expedia Group",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 30928775036.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WSM",
    "name": "Williams-Sonoma, Inc.",
    "sector": "discretionary",
    "industry": "Homefurnishing Retail",
    "cap": 28149222347.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ULTA",
    "name": "Ulta Beauty",
    "sector": "discretionary",
    "industry": "Other Specialty Retail",
    "cap": 24124192713.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LVS",
    "name": "Las Vegas Sands",
    "sector": "discretionary",
    "industry": "Casinos & Gaming",
    "cap": 23382012742.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TPR",
    "name": "Tapestry, Inc.",
    "sector": "discretionary",
    "industry": "Apparel, Accessories & Luxury Goods",
    "cap": 23135093876.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DRI",
    "name": "Darden Restaurants",
    "sector": "discretionary",
    "industry": "Restaurants",
    "cap": 22687479276.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RL",
    "name": "Ralph Lauren Corporation",
    "sector": "discretionary",
    "industry": "Apparel, Accessories & Luxury Goods",
    "cap": 21889918786.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PHM",
    "name": "PulteGroup",
    "sector": "discretionary",
    "industry": "Homebuilding",
    "cap": 21281486866.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BBY",
    "name": "Best Buy",
    "sector": "discretionary",
    "industry": "Computer & Electronics Retail",
    "cap": 18539928503.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LEN",
    "name": "Lennar",
    "sector": "discretionary",
    "industry": "Homebuilding",
    "cap": 18461058546.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GPC",
    "name": "Genuine Parts Company",
    "sector": "discretionary",
    "industry": "Distributors",
    "cap": 17669485183.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TSCO",
    "name": "Tractor Supply",
    "sector": "discretionary",
    "industry": "Other Specialty Retail",
    "cap": 17444423787.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NVR",
    "name": "NVR, Inc.",
    "sector": "discretionary",
    "industry": "Homebuilding",
    "cap": 15995955393.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HAS",
    "name": "Hasbro",
    "sector": "discretionary",
    "industry": "Leisure Products",
    "cap": 13046613198.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DECK",
    "name": "Deckers Brands",
    "sector": "discretionary",
    "industry": "Footwear",
    "cap": 11262358581.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DPZ",
    "name": "Domino's",
    "sector": "discretionary",
    "industry": "Restaurants",
    "cap": 10210677508.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LULU",
    "name": "Lululemon Athletica",
    "sector": "discretionary",
    "industry": "Apparel, Accessories & Luxury Goods",
    "cap": 9786457852.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "APTV",
    "name": "Aptiv",
    "sector": "discretionary",
    "industry": "Automotive Parts & Equipment",
    "cap": 9179469564.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WYNN",
    "name": "Wynn Resorts",
    "sector": "discretionary",
    "industry": "Casinos & Gaming",
    "cap": 7752904253.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MGM",
    "name": "MGM Resorts",
    "sector": "discretionary",
    "industry": "Casinos & Gaming",
    "cap": 7752277521.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NCLH",
    "name": "Norwegian Cruise Line Holdings",
    "sector": "discretionary",
    "industry": "Hotels, Resorts & Cruise Lines",
    "cap": 7112819735.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GOOGL",
    "name": "Alphabet Inc. (Class A)",
    "sector": "communication",
    "industry": "Interactive Media & Services",
    "cap": 4259586700000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "GOOG",
    "name": "Alphabet Inc. (Class C)",
    "sector": "communication",
    "industry": "Interactive Media & Services",
    "cap": 4217637800000.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "META",
    "name": "Meta Platforms",
    "sector": "communication",
    "industry": "Interactive Media & Services",
    "cap": 1836471762540.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "NFLX",
    "name": "Netflix",
    "sector": "communication",
    "industry": "Movies & Entertainment",
    "cap": 298013162611.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "VZ",
    "name": "Verizon",
    "sector": "communication",
    "industry": "Integrated Telecommunication Services",
    "cap": 192573830613.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "DIS",
    "name": "Walt Disney Company (The)",
    "sector": "communication",
    "industry": "Movies & Entertainment",
    "cap": 184790032252.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "TMUS",
    "name": "T-Mobile US",
    "sector": "communication",
    "industry": "Wireless Telecommunication Services",
    "cap": 183759374023.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "T",
    "name": "AT&T",
    "sector": "communication",
    "industry": "Integrated Telecommunication Services",
    "cap": 170418831116.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "APP",
    "name": "AppLovin",
    "sector": "communication",
    "industry": "Advertising",
    "cap": 93742438120.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CMCSA",
    "name": "Comcast",
    "sector": "communication",
    "industry": "Cable & Satellite",
    "cap": 75266581713.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "SKYD",
    "name": "Skydance Corporation",
    "sector": "communication",
    "industry": "Movies & Entertainment",
    "cap": 46791412647.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LYV",
    "name": "Live Nation Entertainment",
    "sector": "communication",
    "industry": "Movies & Entertainment",
    "cap": 40373505572.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TTWO",
    "name": "Take-Two Interactive",
    "sector": "communication",
    "industry": "Interactive Home Entertainment",
    "cap": 39148095351.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "TKO",
    "name": "TKO Group Holdings",
    "sector": "communication",
    "industry": "Movies & Entertainment",
    "cap": 34377057972.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RDDT",
    "name": "Reddit",
    "sector": "communication",
    "industry": "Interactive Media & Services",
    "cap": 30104281920.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ECHO",
    "name": "EchoStar",
    "sector": "communication",
    "industry": "Wireless Telecommunication Services",
    "cap": 27150567196.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FOXA",
    "name": "Fox Corporation (Class A)",
    "sector": "communication",
    "industry": "Broadcasting",
    "cap": 26805792151.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FOX",
    "name": "Fox Corporation (Class B)",
    "sector": "communication",
    "industry": "Broadcasting",
    "cap": 24022746245.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "OMC",
    "name": "Omnicom Group",
    "sector": "communication",
    "industry": "Advertising",
    "cap": 20973749177.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NWS",
    "name": "News Corp (Class B)",
    "sector": "communication",
    "industry": "Publishing",
    "cap": 17251036416.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NWSA",
    "name": "News Corp (Class A)",
    "sector": "communication",
    "industry": "Publishing",
    "cap": 15656720707.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CHTR",
    "name": "Charter Communications",
    "sector": "communication",
    "industry": "Cable & Satellite",
    "cap": 12565713548.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CAT",
    "name": "Caterpillar Inc.",
    "sector": "industrials",
    "industry": "Construction Machinery & Heavy Transportation Equipment",
    "cap": 365983953124.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "GE",
    "name": "GE Aerospace",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 317099855223.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GEV",
    "name": "GE Vernova",
    "sector": "industrials",
    "industry": "Heavy Electrical Equipment",
    "cap": 266160464172.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RTX",
    "name": "RTX Corporation",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 248418781102.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DE",
    "name": "Deere & Company",
    "sector": "industrials",
    "industry": "Agricultural & Farm Machinery",
    "cap": 175952151363.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "UNP",
    "name": "Union Pacific Corporation",
    "sector": "industrials",
    "industry": "Rail Transportation",
    "cap": 165271803544.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ETN",
    "name": "Eaton Corporation",
    "sector": "industrials",
    "industry": "Electrical Components & Equipment",
    "cap": 164879684000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BA",
    "name": "Boeing",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 148391971255.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "UBER",
    "name": "Uber",
    "sector": "industrials",
    "industry": "Passenger Ground Transportation",
    "cap": 143469422899.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PH",
    "name": "Parker Hannifin",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 119423412508.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LMT",
    "name": "Lockheed Martin",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 117216315541.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ADP",
    "name": "Automatic Data Processing",
    "sector": "industrials",
    "industry": "Human Resource & Employment Services",
    "cap": 107277181590.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "TT",
    "name": "Trane Technologies",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 103397691799.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PWR",
    "name": "Quanta Services",
    "sector": "industrials",
    "industry": "Construction & Engineering",
    "cap": 100969517442.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VRT",
    "name": "Vertiv",
    "sector": "industrials",
    "industry": "Electrical Components & Equipment",
    "cap": 93833167405.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "JCI",
    "name": "Johnson Controls",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 93284186380.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GD",
    "name": "General Dynamics",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 89256818631.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HWM",
    "name": "Howmet Aerospace",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 88757239361.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EMR",
    "name": "Emerson Electric",
    "sector": "industrials",
    "industry": "Electrical Components & Equipment",
    "cap": 88723668000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CSX",
    "name": "CSX Corporation",
    "sector": "industrials",
    "industry": "Rail Transportation",
    "cap": 87696162571.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MMM",
    "name": "3M",
    "sector": "industrials",
    "industry": "Industrial Conglomerates",
    "cap": 84361872973.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "WM",
    "name": "Waste Management",
    "sector": "industrials",
    "industry": "Environmental & Facilities Services",
    "cap": 83980160158.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BE",
    "name": "Bloom Energy",
    "sector": "industrials",
    "industry": "Electrical Components & Equipment",
    "cap": 80352950536.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "UPS",
    "name": "United Parcel Service",
    "sector": "industrials",
    "industry": "Air Freight & Logistics",
    "cap": 80084070314.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CTAS",
    "name": "Cintas",
    "sector": "industrials",
    "industry": "Diversified Support Services",
    "cap": 79859742704.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ITW",
    "name": "Illinois Tool Works",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 75389408000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CMI",
    "name": "Cummins",
    "sector": "industrials",
    "industry": "Construction Machinery & Heavy Transportation Equipment",
    "cap": 71640599035.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NSC",
    "name": "Norfolk Southern",
    "sector": "industrials",
    "industry": "Rail Transportation",
    "cap": 71198608157.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FDX",
    "name": "FedEx",
    "sector": "industrials",
    "industry": "Air Freight & Logistics",
    "cap": 69043866003.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NOC",
    "name": "Northrop Grumman",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 68826694836.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RSG",
    "name": "Republic Services",
    "sector": "industrials",
    "industry": "Environmental & Facilities Services",
    "cap": 66399222150.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HON",
    "name": "Honeywell Technologies",
    "sector": "industrials",
    "industry": "Industrial Conglomerates",
    "cap": 65479806066.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "URI",
    "name": "United Rentals",
    "sector": "industrials",
    "industry": "Trading Companies & Distributors",
    "cap": 65363949823.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TDG",
    "name": "TransDigm Group",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 60212718683.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FIX",
    "name": "Comfort Systems USA",
    "sector": "industrials",
    "industry": "Construction & Engineering",
    "cap": 60055251062.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GWW",
    "name": "W. W. Grainger",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 59755552087.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FAST",
    "name": "Fastenal",
    "sector": "industrials",
    "industry": "Trading Companies & Distributors",
    "cap": 57937152461.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "PCAR",
    "name": "Paccar",
    "sector": "industrials",
    "industry": "Construction Machinery & Heavy Transportation Equipment",
    "cap": 57721180746.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "AME",
    "name": "Ametek",
    "sector": "industrials",
    "industry": "Electrical Components & Equipment",
    "cap": 56746743115.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DAL",
    "name": "Delta Air Lines",
    "sector": "industrials",
    "industry": "Passenger Airlines",
    "cap": 54017155684.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HONA",
    "name": "Honeywell Aerospace",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 48813889177.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ROK",
    "name": "Rockwell Automation",
    "sector": "industrials",
    "industry": "Electrical Components & Equipment",
    "cap": 48308473955.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WAB",
    "name": "Wabtec",
    "sector": "industrials",
    "industry": "Construction Machinery & Heavy Transportation Equipment",
    "cap": 47430166961.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CARR",
    "name": "Carrier Global",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 46022067932.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LHX",
    "name": "L3Harris",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 44117966823.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FERG",
    "name": "Ferguson Enterprises",
    "sector": "industrials",
    "industry": "Trading Companies & Distributors",
    "cap": 41927007355.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ODFL",
    "name": "Old Dominion",
    "sector": "industrials",
    "industry": "Cargo Ground Transportation",
    "cap": 37666330386.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "PAYX",
    "name": "Paychex",
    "sector": "industrials",
    "industry": "Human Resource & Employment Services",
    "cap": 37185720210.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "UAL",
    "name": "United Airlines Holdings",
    "sector": "industrials",
    "industry": "Passenger Airlines",
    "cap": 34873280464.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EME",
    "name": "Emcor",
    "sector": "industrials",
    "industry": "Construction & Engineering",
    "cap": 34328089354.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AXON",
    "name": "Axon Enterprise",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 33901185654.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "IR",
    "name": "Ingersoll Rand",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 30263955462.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CPRT",
    "name": "Copart",
    "sector": "industrials",
    "industry": "Diversified Support Services",
    "cap": 25455560821.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "DOV",
    "name": "Dover Corporation",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 25449175316.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EXPD",
    "name": "Expeditors International",
    "sector": "industrials",
    "industry": "Air Freight & Logistics",
    "cap": 25180483388.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "OTIS",
    "name": "Otis Worldwide",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 25166050001.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HUBB",
    "name": "Hubbell Incorporated",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 25116604253.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "XYL",
    "name": "Xylem Inc.",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 23813319956.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VLTO",
    "name": "Veralto",
    "sector": "industrials",
    "industry": "Environmental & Facilities Services",
    "cap": 23521181829.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VRSK",
    "name": "Verisk Analytics",
    "sector": "industrials",
    "industry": "Research & Consulting Services",
    "cap": 22841078546.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "JBHT",
    "name": "J.B. Hunt",
    "sector": "industrials",
    "industry": "Cargo Ground Transportation",
    "cap": 21452050366.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LUV",
    "name": "Southwest Airlines",
    "sector": "industrials",
    "industry": "Passenger Airlines",
    "cap": 20233651193.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BR",
    "name": "Broadridge Financial Solutions",
    "sector": "industrials",
    "industry": "Data Processing & Outsourced Services",
    "cap": 18652214287.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SNA",
    "name": "Snap-on",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 18563830261.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NDSN",
    "name": "Nordson Corporation",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 18206451764.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DD",
    "name": "DuPont",
    "sector": "industrials",
    "industry": "Industrial Conglomerates",
    "cap": 17890493328.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FDXF",
    "name": "FedEx Freight",
    "sector": "industrials",
    "industry": "Cargo Ground Transportation",
    "cap": 17291772081.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EFX",
    "name": "Equifax",
    "sector": "industrials",
    "industry": "Research & Consulting Services",
    "cap": 17098751764.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IEX",
    "name": "IDEX Corporation",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 17084585898.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FTV",
    "name": "Fortive",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 17039802074.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CHRW",
    "name": "C.H. Robinson",
    "sector": "industrials",
    "industry": "Air Freight & Logistics",
    "cap": 16515756806.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "J",
    "name": "Jacobs Solutions",
    "sector": "industrials",
    "industry": "Construction & Engineering",
    "cap": 16220381098.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ROL",
    "name": "Rollins, Inc.",
    "sector": "industrials",
    "industry": "Environmental & Facilities Services",
    "cap": 15521750733.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LDOS",
    "name": "Leidos",
    "sector": "industrials",
    "industry": "Diversified Support Services",
    "cap": 14961181157.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MAS",
    "name": "Masco",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 13704526385.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SWK",
    "name": "Stanley Black & Decker",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 13466153878.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GNRC",
    "name": "Generac",
    "sector": "industrials",
    "industry": "Heavy Electrical Equipment",
    "cap": 13241027408.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ALLE",
    "name": "Allegion",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 12754667532.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TXT",
    "name": "Textron",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 12592882063.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LII",
    "name": "Lennox International",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 12495066440.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HII",
    "name": "Huntington Ingalls Industries",
    "sector": "industrials",
    "industry": "Aerospace & Defense",
    "cap": 10443006562.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PNR",
    "name": "Pentair",
    "sector": "industrials",
    "industry": "Industrial Machinery & Supplies & Components",
    "cap": 8349064785.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AOS",
    "name": "A. O. Smith",
    "sector": "industrials",
    "industry": "Building Products",
    "cap": 7686988889.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WMT",
    "name": "Walmart",
    "sector": "staples",
    "industry": "Consumer Staples Merchandise Retail",
    "cap": 877154984405.0,
    "sp": true,
    "ndx": true,
    "dow": true
  },
  {
    "symbol": "COST",
    "name": "Costco",
    "sector": "staples",
    "industry": "Consumer Staples Merchandise Retail",
    "cap": 420051172504.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "KO",
    "name": "Coca-Cola Company (The)",
    "sector": "staples",
    "industry": "Soft Drinks & Non-alcoholic Beverages",
    "cap": 377634747058.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "PG",
    "name": "Procter & Gamble",
    "sector": "staples",
    "industry": "Personal Care Products",
    "cap": 350036374505.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "PM",
    "name": "Philip Morris International",
    "sector": "staples",
    "industry": "Tobacco",
    "cap": 312501994520.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PEP",
    "name": "PepsiCo",
    "sector": "staples",
    "industry": "Soft Drinks & Non-alcoholic Beverages",
    "cap": 175170182554.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MNST",
    "name": "Monster Beverage",
    "sector": "staples",
    "industry": "Soft Drinks & Non-alcoholic Beverages",
    "cap": 128269042535.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MO",
    "name": "Altria",
    "sector": "staples",
    "industry": "Tobacco",
    "cap": 119253111195.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MDLZ",
    "name": "Mondelez International",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 77433609818.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "TGT",
    "name": "Target Corporation",
    "sector": "staples",
    "industry": "Consumer Staples Merchandise Retail",
    "cap": 70306962863.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CL",
    "name": "Colgate-Palmolive",
    "sector": "staples",
    "industry": "Household Products",
    "cap": 70230926235.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VYLR",
    "name": "Vylor",
    "sector": "staples",
    "industry": "Agricultural Products & Services",
    "cap": 48572980275.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KDP",
    "name": "Keurig Dr Pepper",
    "sector": "staples",
    "industry": "Soft Drinks & Non-alcoholic Beverages",
    "cap": 42539421948.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ADM",
    "name": "Archer Daniels Midland",
    "sector": "staples",
    "industry": "Agricultural Products & Services",
    "cap": 39737567618.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SYY",
    "name": "Sysco",
    "sector": "staples",
    "industry": "Food Distributors",
    "cap": 38468723697.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KR",
    "name": "Kroger",
    "sector": "staples",
    "industry": "Food Retail",
    "cap": 36268052067.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EL",
    "name": "Est\u00e9e Lauder Companies (The)",
    "sector": "staples",
    "industry": "Personal Care Products",
    "cap": 34174284138.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KVUE",
    "name": "Kenvue",
    "sector": "staples",
    "industry": "Personal Care Products",
    "cap": 34055313570.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HSY",
    "name": "Hershey Company (The)",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 32658456289.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KMB",
    "name": "Kimberly-Clark",
    "sector": "staples",
    "industry": "Household Products",
    "cap": 32506275174.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DG",
    "name": "Dollar General",
    "sector": "staples",
    "industry": "Consumer Staples Merchandise Retail",
    "cap": 27416048493.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KHC",
    "name": "Kraft Heinz",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 26657318080.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CASY",
    "name": "Casey's",
    "sector": "staples",
    "industry": "Food Retail",
    "cap": 23738776061.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CHD",
    "name": "Church & Dwight",
    "sector": "staples",
    "industry": "Household Products",
    "cap": 23181937831.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DLTR",
    "name": "Dollar Tree",
    "sector": "staples",
    "industry": "Consumer Staples Merchandise Retail",
    "cap": 22256706067.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "STZ",
    "name": "Constellation Brands",
    "sector": "staples",
    "industry": "Distillers & Vintners",
    "cap": 20918008948.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BG",
    "name": "Bunge Global",
    "sector": "staples",
    "industry": "Agricultural Products & Services",
    "cap": 20714283842.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TSN",
    "name": "Tyson Foods",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 18413291138.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GIS",
    "name": "General Mills",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 17425454023.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SJM",
    "name": "J.M. Smucker Company (The)",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 12755756282.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MKC",
    "name": "McCormick & Company",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 12360822165.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HRL",
    "name": "Hormel Foods",
    "sector": "staples",
    "industry": "Packaged Foods & Meats",
    "cap": 10687812536.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CLX",
    "name": "Clorox",
    "sector": "staples",
    "industry": "Household Products",
    "cap": 10091025167.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BF-B",
    "name": "Brown\u2013Forman",
    "sector": "staples",
    "industry": "Distillers & Vintners",
    "cap": 8000000000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "XOM",
    "name": "ExxonMobil",
    "sector": "energy",
    "industry": "Integrated Oil & Gas",
    "cap": 692857165260.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CVX",
    "name": "Chevron Corporation",
    "sector": "energy",
    "industry": "Integrated Oil & Gas",
    "cap": 417974413015.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "COP",
    "name": "ConocoPhillips",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 161207476307.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MPC",
    "name": "Marathon Petroleum",
    "sector": "energy",
    "industry": "Oil & Gas Refining & Marketing",
    "cap": 130117345688.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VLO",
    "name": "Valero Energy",
    "sector": "energy",
    "industry": "Oil & Gas Refining & Marketing",
    "cap": 127782207192.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PSX",
    "name": "Phillips 66",
    "sector": "energy",
    "industry": "Oil & Gas Refining & Marketing",
    "cap": 112364289946.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WMB",
    "name": "Williams Companies",
    "sector": "energy",
    "industry": "Oil & Gas Storage & Transportation",
    "cap": 88483934924.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EOG",
    "name": "EOG Resources",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 77897827928.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SLB",
    "name": "Schlumberger",
    "sector": "energy",
    "industry": "Oil & Gas Equipment & Services",
    "cap": 72693335454.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KMI",
    "name": "Kinder Morgan",
    "sector": "energy",
    "industry": "Oil & Gas Storage & Transportation",
    "cap": 71814367370.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TRGP",
    "name": "Targa Resources",
    "sector": "energy",
    "industry": "Oil & Gas Storage & Transportation",
    "cap": 61861205248.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "OXY",
    "name": "Occidental Petroleum",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 60258140724.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "OKE",
    "name": "Oneok",
    "sector": "energy",
    "industry": "Oil & Gas Storage & Transportation",
    "cap": 56916077233.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BKR",
    "name": "Baker Hughes",
    "sector": "energy",
    "industry": "Oil & Gas Equipment & Services",
    "cap": 55887550197.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "DVN",
    "name": "Devon Energy",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 53812000000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FANG",
    "name": "Diamondback Energy",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 53675067983.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "EQT",
    "name": "EQT Corporation",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 33114817040.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HAL",
    "name": "Halliburton",
    "sector": "energy",
    "industry": "Oil & Gas Equipment & Services",
    "cap": 27135056053.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TPL",
    "name": "Texas Pacific Land Corporation",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 24677762084.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EXE",
    "name": "Expand Energy",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 20571426691.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "APA",
    "name": "APA Corporation",
    "sector": "energy",
    "industry": "Oil & Gas Exploration & Production",
    "cap": 15930483160.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NEE",
    "name": "NextEra Energy",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 161392134030.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CEG",
    "name": "Constellation Energy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 101002404532.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "SO",
    "name": "Southern Company",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 99103769521.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DUK",
    "name": "Duke Energy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 91100404230.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AEP",
    "name": "American Electric Power",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 66590684097.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "D",
    "name": "Dominion Energy",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 54310727351.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VST",
    "name": "Vistra Corp.",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 52406079347.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SRE",
    "name": "Sempra",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 52364339868.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ETR",
    "name": "Entergy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 47825062230.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "XEL",
    "name": "Xcel Energy",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 45823172688.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "EXC",
    "name": "Exelon",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 43075958043.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ED",
    "name": "Consolidated Edison",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 39198136812.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PEG",
    "name": "Public Service Enterprise Group",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 35806494955.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PCG",
    "name": "PG&E Corporation",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 33956999984.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WEC",
    "name": "WEC Energy Group",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 33761254573.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AEE",
    "name": "Ameren",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 28193716682.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ATO",
    "name": "Atmos Energy",
    "sector": "utilities",
    "industry": "Gas Utilities",
    "cap": 27149700925.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DTE",
    "name": "DTE Energy",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 26447993570.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FE",
    "name": "FirstEnergy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 25952000950.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PPL",
    "name": "PPL Corporation",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 25661779078.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AWK",
    "name": "American Water Works",
    "sector": "utilities",
    "industry": "Water Utilities",
    "cap": 25473081810.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CNP",
    "name": "CenterPoint Energy",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 25308033465.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ES",
    "name": "Eversource Energy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 24743764590.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NRG",
    "name": "NRG Energy",
    "sector": "utilities",
    "industry": "Independent Power Producers & Energy Traders",
    "cap": 22349578553.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EIX",
    "name": "Edison International",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 20895399060.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CMS",
    "name": "CMS Energy",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 20489130066.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NI",
    "name": "NiSource",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 19436570853.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EVRG",
    "name": "Evergy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 18565268689.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LNT",
    "name": "Alliant Energy",
    "sector": "utilities",
    "industry": "Electric Utilities",
    "cap": 16983147785.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PNW",
    "name": "Pinnacle West Capital",
    "sector": "utilities",
    "industry": "Multi-Utilities",
    "cap": 11874904987.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AES",
    "name": "AES Corporation",
    "sector": "utilities",
    "industry": "Independent Power Producers & Energy Traders",
    "cap": 10651638746.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WELL",
    "name": "Welltower",
    "sector": "realestate",
    "industry": "Health Care REITs",
    "cap": 160754953871.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PLD",
    "name": "Prologis",
    "sector": "realestate",
    "industry": "Industrial REITs",
    "cap": 122576746040.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EQIX",
    "name": "Equinix",
    "sector": "realestate",
    "industry": "Data Center REITs",
    "cap": 99772862016.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMT",
    "name": "American Tower",
    "sector": "realestate",
    "industry": "Telecom Tower REITs",
    "cap": 77689518803.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DLR",
    "name": "Digital Realty",
    "sector": "realestate",
    "industry": "Data Center REITs",
    "cap": 65152269508.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SPG",
    "name": "Simon Property Group",
    "sector": "realestate",
    "industry": "Retail REITs",
    "cap": 64584117909.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PSA",
    "name": "Public Storage",
    "sector": "realestate",
    "industry": "Self-Storage REITs",
    "cap": 53350067268.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "O",
    "name": "Realty Income",
    "sector": "realestate",
    "industry": "Retail REITs",
    "cap": 51256630848.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VMRK",
    "name": "Vivmark Residential",
    "sector": "realestate",
    "industry": "Multi-Family Residential REITs",
    "cap": 47234250000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VTR",
    "name": "Ventas",
    "sector": "realestate",
    "industry": "Health Care REITs",
    "cap": 41938494312.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CBRE",
    "name": "CBRE Group",
    "sector": "realestate",
    "industry": "Real Estate Services",
    "cap": 37957530062.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IRM",
    "name": "Iron Mountain",
    "sector": "realestate",
    "industry": "Other Specialized REITs",
    "cap": 33631486672.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CCI",
    "name": "Crown Castle",
    "sector": "realestate",
    "industry": "Telecom Tower REITs",
    "cap": 29309625193.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EXR",
    "name": "Extra Space Storage",
    "sector": "realestate",
    "industry": "Self-Storage REITs",
    "cap": 28124203561.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VICI",
    "name": "Vici Properties",
    "sector": "realestate",
    "industry": "Hotel & Resort REITs",
    "cap": 25093557638.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SBAC",
    "name": "SBA Communications",
    "sector": "realestate",
    "industry": "Telecom Tower REITs",
    "cap": 18036039581.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ESS",
    "name": "Essex Property Trust",
    "sector": "realestate",
    "industry": "Multi-Family Residential REITs",
    "cap": 17261217347.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "INVH",
    "name": "Invitation Homes",
    "sector": "realestate",
    "industry": "Single-Family Residential REITs",
    "cap": 15639703024.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HST",
    "name": "Host Hotels & Resorts",
    "sector": "realestate",
    "industry": "Hotel & Resort REITs",
    "cap": 15442703953.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KIM",
    "name": "Kimco Realty",
    "sector": "realestate",
    "industry": "Retail REITs",
    "cap": 14817737250.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WY",
    "name": "Weyerhaeuser",
    "sector": "realestate",
    "industry": "Timber REITs",
    "cap": 13816509120.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MAA",
    "name": "Mid-America Apartment Communities",
    "sector": "realestate",
    "industry": "Multi-Family Residential REITs",
    "cap": 13480591184.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "REG",
    "name": "Regency Centers",
    "sector": "realestate",
    "industry": "Retail REITs",
    "cap": 13089456700.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DOC",
    "name": "Healthpeak Properties",
    "sector": "realestate",
    "industry": "Health Care REITs",
    "cap": 12770044855.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CSGP",
    "name": "CoStar Group",
    "sector": "realestate",
    "industry": "Real Estate Services",
    "cap": 12078940098.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "UDR",
    "name": "UDR, Inc.",
    "sector": "realestate",
    "industry": "Multi-Family Residential REITs",
    "cap": 10784839933.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CPT",
    "name": "Camden Property Trust",
    "sector": "realestate",
    "industry": "Multi-Family Residential REITs",
    "cap": 9728187506.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BXP",
    "name": "BXP, Inc.",
    "sector": "realestate",
    "industry": "Office REITs",
    "cap": 9471123502.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FRT",
    "name": "Federal Realty Investment Trust",
    "sector": "realestate",
    "industry": "Retail REITs",
    "cap": 9163327966.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ARE",
    "name": "Alexandria Real Estate Equities",
    "sector": "realestate",
    "industry": "Office REITs",
    "cap": 7945689192.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LIN",
    "name": "Linde plc",
    "sector": "materials",
    "industry": "Industrial Gases",
    "cap": 222054144517.0,
    "sp": true,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "NEM",
    "name": "Newmont",
    "sector": "materials",
    "industry": "Gold",
    "cap": 121754141914.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FCX",
    "name": "Freeport-McMoRan",
    "sector": "materials",
    "industry": "Copper",
    "cap": 102158286586.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ECL",
    "name": "Ecolab",
    "sector": "materials",
    "industry": "Specialty Chemicals",
    "cap": 78965764179.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SHW",
    "name": "Sherwin-Williams",
    "sector": "materials",
    "industry": "Specialty Chemicals",
    "cap": 77932649216.0,
    "sp": true,
    "ndx": false,
    "dow": true
  },
  {
    "symbol": "APD",
    "name": "Air Products",
    "sector": "materials",
    "industry": "Industrial Gases",
    "cap": 61991197841.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NUE",
    "name": "Nucor",
    "sector": "materials",
    "industry": "Steel",
    "cap": 55843178891.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CRH",
    "name": "CRH plc",
    "sector": "materials",
    "industry": "Construction Materials",
    "cap": 54805512692.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MLM",
    "name": "Martin Marietta Materials",
    "sector": "materials",
    "industry": "Construction Materials",
    "cap": 34201260800.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "STLD",
    "name": "Steel Dynamics",
    "sector": "materials",
    "industry": "Steel",
    "cap": 33563138367.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VMC",
    "name": "Vulcan Materials Company",
    "sector": "materials",
    "industry": "Construction Materials",
    "cap": 31910060266.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PPG",
    "name": "PPG Industries",
    "sector": "materials",
    "industry": "Specialty Chemicals",
    "cap": 23443758000.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SW",
    "name": "Smurfit Westrock",
    "sector": "materials",
    "industry": "Paper & Plastic Packaging Products & Materials",
    "cap": 21741474537.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IFF",
    "name": "International Flavors & Fragrances",
    "sector": "materials",
    "industry": "Specialty Chemicals",
    "cap": 21598444368.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DOW",
    "name": "Dow Inc.",
    "sector": "materials",
    "industry": "Commodity Chemicals",
    "cap": 20651720927.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PKG",
    "name": "Packaging Corporation of America",
    "sector": "materials",
    "industry": "Paper & Plastic Packaging Products & Materials",
    "cap": 20487262872.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LYB",
    "name": "LyondellBasell",
    "sector": "materials",
    "industry": "Specialty Chemicals",
    "cap": 19492110024.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMCR",
    "name": "Amcor",
    "sector": "materials",
    "industry": "Paper & Plastic Packaging Products & Materials",
    "cap": 19363037497.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CF",
    "name": "CF Industries",
    "sector": "materials",
    "industry": "Fertilizers & Agricultural Chemicals",
    "cap": 17188984805.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IP",
    "name": "International Paper",
    "sector": "materials",
    "industry": "Paper & Plastic Packaging Products & Materials",
    "cap": 16882688253.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BALL",
    "name": "Ball Corporation",
    "sector": "materials",
    "industry": "Metal, Glass & Plastic Containers",
    "cap": 15450734948.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AVY",
    "name": "Avery Dennison",
    "sector": "materials",
    "industry": "Paper & Plastic Packaging Products & Materials",
    "cap": 12703608362.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ALB",
    "name": "Albemarle Corporation",
    "sector": "materials",
    "industry": "Specialty Chemicals",
    "cap": 12048316320.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MOS",
    "name": "Mosaic Company (The)",
    "sector": "materials",
    "industry": "Fertilizers & Agricultural Chemicals",
    "cap": 6272081096.0,
    "sp": true,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TSM",
    "name": "Taiwan Semiconductor Manufacturing Company Ltd.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 2375367380983.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SPCX",
    "name": "Space Exploration Technologies Corp.",
    "sector": "tech",
    "industry": "Computer Software: Programming Data Processing",
    "cap": 2179387968326.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ASML",
    "name": "ASML Holding N.V. New York Registry Shares",
    "sector": "tech",
    "industry": "Industrial Machinery/Components",
    "cap": 682108329340.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ARM",
    "name": "Arm Holdings plc",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 292923770323.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "SHOP",
    "name": "Shopify Inc. Class A Subordinate Voting Shares",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 213238662274.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "NET",
    "name": "Cloudflare Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 121740093761.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SNOW",
    "name": "Snowflake Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 121151520000.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ASX",
    "name": "ASE Technology Holding Co. Ltd. American Depositary Shares (each representing Two Common Shares)",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 100789439281.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MSTR",
    "name": "Strategy Inc Common Stock",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 63916993725.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ALAB",
    "name": "Astera Labs, Inc.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 60208005343.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "NBIS",
    "name": "Nebius Group N.V. Class A",
    "sector": "tech",
    "industry": "Computer Software: Programming Data Processing",
    "cap": 59729309947.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "TEAM",
    "name": "Atlassian Corporation",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 51531468570.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "STM",
    "name": "STMicroelectronics N.V.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 47046057861.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CRWV",
    "name": "CoreWeave, Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 44994355991.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "CRDO",
    "name": "Credo Technology Group Holding Ltd",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 39819493347.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ZS",
    "name": "Zscaler Inc.",
    "sector": "tech",
    "industry": "EDP Services",
    "cap": 35351889073.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MDB",
    "name": "MongoDB Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 29914597230.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ZM",
    "name": "Zoom Communications Inc.",
    "sector": "tech",
    "industry": "Computer Software: Programming Data Processing",
    "cap": 27623163920.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GFS",
    "name": "GlobalFoundries Inc.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 27514182244.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MTSI",
    "name": "MACOM Technology Solutions Holdings Inc.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 24607477678.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CW",
    "name": "Curtiss-Wright Corporation",
    "sector": "tech",
    "industry": "Industrial Machinery/Components",
    "cap": 18736474097.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LSCC",
    "name": "Lattice Semiconductor Corporation",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 17750943395.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "GWRE",
    "name": "Guidewire Software Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 13510751998.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DOCU",
    "name": "DocuSign Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 13350442146.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CACI",
    "name": "CACI International Inc.",
    "sector": "tech",
    "industry": "EDP Services",
    "cap": 13246498442.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AMKR",
    "name": "Amkor Technology Inc.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 12671076072.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MANH",
    "name": "Manhattan Associates Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 12056302110.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RMBS",
    "name": "Rambus Inc.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 11764830077.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HUBS",
    "name": "HubSpot Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 11560980040.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PAYC",
    "name": "Paycom Software Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 10361965208.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ESTC",
    "name": "Elastic N.V.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 10001469333.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PCOR",
    "name": "Procore Technologies Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 8324113416.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PATH",
    "name": "UiPath Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 6905309169.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ALGM",
    "name": "Allegro MicroSystems Inc.",
    "sector": "tech",
    "industry": "Semiconductors",
    "cap": 6760802208.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SAIC",
    "name": "Science Applications International Corporation",
    "sector": "tech",
    "industry": "EDP Services",
    "cap": 5434542236.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BILL",
    "name": "BILL Holdings Inc.",
    "sector": "tech",
    "industry": "Computer Software: Prepackaged Software",
    "cap": 3835749654.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EWBC",
    "name": "East West Bancorp Inc.",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 17297746820.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PNFP",
    "name": "Pinnacle Financial Partners Inc. Common stock",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 14305833629.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FHN",
    "name": "First Horizon Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 11043745553.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "UMBF",
    "name": "UMB Financial Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 9903124412.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SSB",
    "name": "SouthState Bank Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 9752728884.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WTFC",
    "name": "Wintrust Financial Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 9728592441.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CFR",
    "name": "Cullen/Frost Bankers Inc.",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 9468988883.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ONB",
    "name": "Old National Bancorp",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 9460956100.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ZION",
    "name": "Zions Bancorporation N.A.",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 9155653959.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "WAL",
    "name": "Western Alliance Bancorporation Common Stock (DE)",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 8237115232.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "COLB",
    "name": "Columbia Banking System Inc.",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 8071201706.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CBSH",
    "name": "Commerce Bancshares Inc.",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 7832831241.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BOKF",
    "name": "BOK Financial Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 7682147326.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FNB",
    "name": "F.N.B. Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 6099856796.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HWC",
    "name": "Hancock Whitney Corporation",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 5833018547.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HOMB",
    "name": "Home BancShares Inc.",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 5697413462.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ASB",
    "name": "Associated Banc-Corp",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 5431316193.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "OZK",
    "name": "Bank OZK",
    "sector": "financials",
    "industry": "Major Banks",
    "cap": 5075286882.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ARGX",
    "name": "argenx SE",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 50806542003.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RVMD",
    "name": "Revolution Medicines Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 40320966954.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ALNY",
    "name": "Alnylam Pharmaceuticals, Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 30044161265.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "BNTX",
    "name": "BioNTech SE American Depositary Share",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 23125873934.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "UTHR",
    "name": "United Therapeutics Corporation",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 22851302884.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "INSM",
    "name": "Insmed Incorporated",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 21942973421.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "EXEL",
    "name": "Exelixis Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 14624075462.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "JAZZ",
    "name": "Jazz Pharmaceuticals plc Common Stock (Ireland)",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 14440247654.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NBIX",
    "name": "Neurocrine Biosciences Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 14357946816.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SMMT",
    "name": "Summit Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 13731302597.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HALO",
    "name": "Halozyme Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 12466620320.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "MDGL",
    "name": "Madrigal Pharmaceuticals Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 11018588731.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BMRN",
    "name": "BioMarin Pharmaceutical Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 10625263632.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KRYS",
    "name": "Krystal Biotech Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 9687699023.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PCVX",
    "name": "Vaxcyte Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 9674575149.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CYTK",
    "name": "Cytokinetics Incorporated",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 8620842150.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ARWR",
    "name": "Arrowhead Pharmaceuticals Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 8579796326.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "TGTX",
    "name": "TG Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 8164703287.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IONS",
    "name": "Ionis Pharmaceuticals Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 7195781143.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RYTM",
    "name": "Rhythm Pharmaceuticals Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 6171900630.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PTCT",
    "name": "PTC Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 5221307773.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CRSP",
    "name": "CRISPR Therapeutics AG",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 4877177417.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "LEGN",
    "name": "Legend Biotech Corporation",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 3638878207.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "VKTX",
    "name": "Viking Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 3485346292.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BEAM",
    "name": "Beam Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 2540876559.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "IRON",
    "name": "Disc Medicine Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 2333133130.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RXRX",
    "name": "Recursion Pharmaceuticals Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 2114601572.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "SRPT",
    "name": "Sarepta Therapeutics Inc. Common Stock (DE)",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 1923468052.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "NTLA",
    "name": "Intellia Therapeutics Inc.",
    "sector": "health",
    "industry": "Biotechnology: In Vitro & In Vivo Diagnostic Substances",
    "cap": 1765596332.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RARE",
    "name": "Ultragenyx Pharmaceutical Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 1507423868.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DNA",
    "name": "Ginkgo Bioworks Holdings Inc.",
    "sector": "health",
    "industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
    "cap": 729618741.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RCKT",
    "name": "Rocket Pharmaceuticals Inc.",
    "sector": "health",
    "industry": "Biotechnology: Pharmaceutical Preparations",
    "cap": 288707190.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "PDD",
    "name": "PDD Holdings Inc.",
    "sector": "discretionary",
    "industry": "Business Services",
    "cap": 111395007116.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "MELI",
    "name": "MercadoLibre, Inc.",
    "sector": "discretionary",
    "industry": "Business Services",
    "cap": 94126724401.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "TRI",
    "name": "Thomson Reuters Corporation",
    "sector": "discretionary",
    "industry": "Publishing",
    "cap": 43991460000.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ONON",
    "name": "On Holding AG Class A",
    "sector": "discretionary",
    "industry": "Shoe Manufacturing",
    "cap": 20540793623.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BURL",
    "name": "Burlington Stores Inc.",
    "sector": "discretionary",
    "industry": "Department/Specialty Retail Stores",
    "cap": 17389758584.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "W",
    "name": "Wayfair Inc.",
    "sector": "discretionary",
    "industry": "Catalog/Specialty Distribution",
    "cap": 14399453199.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "DKS",
    "name": "Dick's Sporting Goods Inc",
    "sector": "discretionary",
    "industry": "Other Specialty Stores",
    "cap": 11972182234.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KMX",
    "name": "CarMax Inc",
    "sector": "discretionary",
    "industry": "Retail-Auto Dealers and Gas Stations",
    "cap": 7635103589.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CHWY",
    "name": "Chewy Inc.",
    "sector": "discretionary",
    "industry": "Catalog/Specialty Distribution",
    "cap": 7600444279.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "URBN",
    "name": "Urban Outfitters Inc.",
    "sector": "discretionary",
    "industry": "Clothing/Shoe/Accessory Stores",
    "cap": 6935048254.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ETSY",
    "name": "Etsy Inc.",
    "sector": "discretionary",
    "industry": "Business Services",
    "cap": 6896480545.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "M",
    "name": "Macy's Inc",
    "sector": "discretionary",
    "industry": "Department/Specialty Retail Stores",
    "cap": 5952215762.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AN",
    "name": "AutoNation Inc.",
    "sector": "discretionary",
    "industry": "Retail-Auto Dealers and Gas Stations",
    "cap": 5192860798.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BBWI",
    "name": "Bath & Body Works Inc.",
    "sector": "discretionary",
    "industry": "Other Specialty Stores",
    "cap": 3571138493.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AEO",
    "name": "American Eagle Outfitters Inc.",
    "sector": "discretionary",
    "industry": "Clothing/Shoe/Accessory Stores",
    "cap": 3011292794.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "RKLB",
    "name": "Rocket Lab Corporation",
    "sector": "industrials",
    "industry": "Military/Government/Technical",
    "cap": 42938766148.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "HEI",
    "name": "Heico Corporation",
    "sector": "industrials",
    "industry": "Aerospace",
    "cap": 41355613714.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "FER",
    "name": "Ferrovial N.V.",
    "sector": "industrials",
    "industry": "Military/Government/Technical",
    "cap": 36181530348.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "ENTG",
    "name": "Entegris Inc.",
    "sector": "industrials",
    "industry": "Plastic Products",
    "cap": 24782632000.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "ONTO",
    "name": "Onto Innovation Inc.",
    "sector": "industrials",
    "industry": "Industrial Machinery/Components",
    "cap": 14362559869.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "BWXT",
    "name": "BWX Technologies Inc.",
    "sector": "industrials",
    "industry": "Industrial Machinery/Components",
    "cap": 13030477996.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "KTOS",
    "name": "Kratos Defense & Security Solutions Inc.",
    "sector": "industrials",
    "industry": "Military/Government/Technical",
    "cap": 7871155241.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "AVAV",
    "name": "AeroVironment Inc.",
    "sector": "industrials",
    "industry": "Aerospace",
    "cap": 6992928595.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "HXL",
    "name": "Hexcel Corporation",
    "sector": "industrials",
    "industry": "Major Chemicals",
    "cap": 6437824469.0,
    "sp": false,
    "ndx": false,
    "dow": false
  },
  {
    "symbol": "CCEP",
    "name": "Coca-Cola Europacific Partners plc",
    "sector": "staples",
    "industry": "Beverages (Production/Distribution)",
    "cap": 47050739356.0,
    "sp": false,
    "ndx": true,
    "dow": false
  },
  {
    "symbol": "WWD",
    "name": "Woodward Inc.",
    "sector": "energy",
    "industry": "Industrial Machinery/Components",
    "cap": 19098370479.0,
    "sp": false,
    "ndx": false,
    "dow": false
  }
] as Listing[];

export const BOARDS = [
  {
    "id": "spx",
    "title": "S&P 500",
    "name": "US market",
    "group": "Index",
    "grouped": true,
    "weighting": "cap",
    "index": "sp"
  },
  {
    "id": "ndx",
    "title": "Nasdaq 100",
    "name": "NDX",
    "group": "Index",
    "grouped": true,
    "weighting": "cap",
    "index": "ndx"
  },
  {
    "id": "dow",
    "title": "Dow 30",
    "name": "DJIA",
    "group": "Index",
    "grouped": false,
    "weighting": "price",
    "index": "dow"
  },
  {
    "id": "xlk",
    "title": "XLK",
    "name": "Technology",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "tech"
  },
  {
    "id": "xlf",
    "title": "XLF",
    "name": "Financials",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "financials"
  },
  {
    "id": "xle",
    "title": "XLE",
    "name": "Energy",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "energy"
  },
  {
    "id": "xlv",
    "title": "XLV",
    "name": "Health Care",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "health"
  },
  {
    "id": "xly",
    "title": "XLY",
    "name": "Discretionary",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "discretionary"
  },
  {
    "id": "xlp",
    "title": "XLP",
    "name": "Staples",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "staples"
  },
  {
    "id": "xli",
    "title": "XLI",
    "name": "Industrials",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "industrials"
  },
  {
    "id": "xlb",
    "title": "XLB",
    "name": "Materials",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "materials"
  },
  {
    "id": "xlre",
    "title": "XLRE",
    "name": "Real Estate",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "realestate"
  },
  {
    "id": "xlu",
    "title": "XLU",
    "name": "Utilities",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "utilities"
  },
  {
    "id": "xlc",
    "title": "XLC",
    "name": "Communication",
    "group": "Sector ETF",
    "grouped": false,
    "weighting": "cap",
    "index": "sp",
    "sector": "communication"
  },
  {
    "id": "soxx",
    "title": "SOXX",
    "name": "Semiconductors",
    "group": "Thematic",
    "grouped": false,
    "weighting": "custom",
    "lines": [
      {
        "symbol": "NVDA",
        "weight": 9.2
      },
      {
        "symbol": "AVGO",
        "weight": 8.4
      },
      {
        "symbol": "AMD",
        "weight": 6.4
      },
      {
        "symbol": "AMAT",
        "weight": 5.4
      },
      {
        "symbol": "MU",
        "weight": 5.2
      },
      {
        "symbol": "LRCX",
        "weight": 5.0
      },
      {
        "symbol": "KLAC",
        "weight": 4.6
      },
      {
        "symbol": "TXN",
        "weight": 4.4
      },
      {
        "symbol": "QCOM",
        "weight": 4.3
      },
      {
        "symbol": "ADI",
        "weight": 3.6
      },
      {
        "symbol": "INTC",
        "weight": 3.2
      },
      {
        "symbol": "MRVL",
        "weight": 3.2
      },
      {
        "symbol": "NXPI",
        "weight": 2.8
      },
      {
        "symbol": "MPWR",
        "weight": 2.8
      },
      {
        "symbol": "ARM",
        "weight": 2.7
      },
      {
        "symbol": "MCHP",
        "weight": 2.4
      },
      {
        "symbol": "ON",
        "weight": 2.0
      },
      {
        "symbol": "TER",
        "weight": 1.8
      },
      {
        "symbol": "AMKR",
        "weight": 1.6
      },
      {
        "symbol": "ENTG",
        "weight": 1.5
      },
      {
        "symbol": "GFS",
        "weight": 1.4
      },
      {
        "symbol": "ALAB",
        "weight": 1.4
      },
      {
        "symbol": "COHR",
        "weight": 1.3
      },
      {
        "symbol": "CRDO",
        "weight": 1.2
      },
      {
        "symbol": "SWKS",
        "weight": 1.2
      },
      {
        "symbol": "LSCC",
        "weight": 1.1
      },
      {
        "symbol": "SNDK",
        "weight": 1.1
      },
      {
        "symbol": "WDC",
        "weight": 1.1
      },
      {
        "symbol": "STX",
        "weight": 1.0
      },
      {
        "symbol": "ALGM",
        "weight": 0.9
      },
      {
        "symbol": "MTSI",
        "weight": 0.8
      },
      {
        "symbol": "ONTO",
        "weight": 0.7
      },
      {
        "symbol": "RMBS",
        "weight": 0.6
      }
    ]
  },
  {
    "id": "smh",
    "title": "SMH",
    "name": "Semiconductors",
    "group": "Thematic",
    "grouped": false,
    "weighting": "custom",
    "lines": [
      {
        "symbol": "NVDA",
        "weight": 18.5
      },
      {
        "symbol": "TSM",
        "weight": 11.5
      },
      {
        "symbol": "AVGO",
        "weight": 8.2
      },
      {
        "symbol": "ASML",
        "weight": 5.4
      },
      {
        "symbol": "AMD",
        "weight": 4.8
      },
      {
        "symbol": "AMAT",
        "weight": 4.6
      },
      {
        "symbol": "MU",
        "weight": 4.4
      },
      {
        "symbol": "LRCX",
        "weight": 4.2
      },
      {
        "symbol": "KLAC",
        "weight": 3.8
      },
      {
        "symbol": "TXN",
        "weight": 3.4
      },
      {
        "symbol": "QCOM",
        "weight": 3.2
      },
      {
        "symbol": "ADI",
        "weight": 2.8
      },
      {
        "symbol": "ARM",
        "weight": 2.6
      },
      {
        "symbol": "INTC",
        "weight": 2.4
      },
      {
        "symbol": "MRVL",
        "weight": 2.2
      },
      {
        "symbol": "NXPI",
        "weight": 2.0
      },
      {
        "symbol": "MPWR",
        "weight": 2.0
      },
      {
        "symbol": "AMKR",
        "weight": 1.6
      },
      {
        "symbol": "MCHP",
        "weight": 1.6
      },
      {
        "symbol": "ON",
        "weight": 1.4
      },
      {
        "symbol": "TER",
        "weight": 1.3
      },
      {
        "symbol": "GFS",
        "weight": 1.2
      },
      {
        "symbol": "ENTG",
        "weight": 1.1
      },
      {
        "symbol": "STM",
        "weight": 1.0
      },
      {
        "symbol": "ASX",
        "weight": 0.9
      },
      {
        "symbol": "ALAB",
        "weight": 0.9
      },
      {
        "symbol": "SWKS",
        "weight": 0.8
      },
      {
        "symbol": "CRDO",
        "weight": 0.8
      }
    ]
  },
  {
    "id": "igv",
    "title": "IGV",
    "name": "Software",
    "group": "Thematic",
    "grouped": false,
    "weighting": "custom",
    "lines": [
      {
        "symbol": "MSFT",
        "weight": 8.6
      },
      {
        "symbol": "ORCL",
        "weight": 8.0
      },
      {
        "symbol": "CRM",
        "weight": 7.2
      },
      {
        "symbol": "NOW",
        "weight": 6.0
      },
      {
        "symbol": "INTU",
        "weight": 5.2
      },
      {
        "symbol": "ADBE",
        "weight": 4.6
      },
      {
        "symbol": "PANW",
        "weight": 4.6
      },
      {
        "symbol": "SNPS",
        "weight": 4.4
      },
      {
        "symbol": "CDNS",
        "weight": 4.2
      },
      {
        "symbol": "CRWD",
        "weight": 4.0
      },
      {
        "symbol": "PLTR",
        "weight": 3.8
      },
      {
        "symbol": "ADSK",
        "weight": 3.0
      },
      {
        "symbol": "FTNT",
        "weight": 2.8
      },
      {
        "symbol": "WDAY",
        "weight": 2.6
      },
      {
        "symbol": "APP",
        "weight": 2.4
      },
      {
        "symbol": "SNOW",
        "weight": 2.0
      },
      {
        "symbol": "DDOG",
        "weight": 1.9
      },
      {
        "symbol": "ZS",
        "weight": 1.8
      },
      {
        "symbol": "NET",
        "weight": 1.6
      },
      {
        "symbol": "TEAM",
        "weight": 1.5
      },
      {
        "symbol": "HUBS",
        "weight": 1.4
      },
      {
        "symbol": "MDB",
        "weight": 1.3
      },
      {
        "symbol": "PCOR",
        "weight": 1.1
      },
      {
        "symbol": "PTC",
        "weight": 1.1
      },
      {
        "symbol": "TYL",
        "weight": 0.9
      },
      {
        "symbol": "GWRE",
        "weight": 0.8
      },
      {
        "symbol": "PAYC",
        "weight": 0.7
      },
      {
        "symbol": "PATH",
        "weight": 0.7
      },
      {
        "symbol": "BILL",
        "weight": 0.6
      },
      {
        "symbol": "MANH",
        "weight": 0.6
      },
      {
        "symbol": "DOCU",
        "weight": 0.5
      },
      {
        "symbol": "ESTC",
        "weight": 0.5
      },
      {
        "symbol": "ZM",
        "weight": 0.4
      }
    ]
  },
  {
    "id": "xbi",
    "title": "XBI",
    "name": "Biotech",
    "group": "Thematic",
    "grouped": false,
    "weighting": "equal",
    "lines": [
      {
        "symbol": "ALNY",
        "weight": 1
      },
      {
        "symbol": "ARGX",
        "weight": 1
      },
      {
        "symbol": "INSM",
        "weight": 1
      },
      {
        "symbol": "BMRN",
        "weight": 1
      },
      {
        "symbol": "EXEL",
        "weight": 1
      },
      {
        "symbol": "NBIX",
        "weight": 1
      },
      {
        "symbol": "UTHR",
        "weight": 1
      },
      {
        "symbol": "IONS",
        "weight": 1
      },
      {
        "symbol": "SRPT",
        "weight": 1
      },
      {
        "symbol": "TECH",
        "weight": 1
      },
      {
        "symbol": "MRNA",
        "weight": 1
      },
      {
        "symbol": "CRSP",
        "weight": 1
      },
      {
        "symbol": "RXRX",
        "weight": 1
      },
      {
        "symbol": "RVMD",
        "weight": 1
      },
      {
        "symbol": "VKTX",
        "weight": 1
      },
      {
        "symbol": "MDGL",
        "weight": 1
      },
      {
        "symbol": "HALO",
        "weight": 1
      },
      {
        "symbol": "RARE",
        "weight": 1
      },
      {
        "symbol": "CYTK",
        "weight": 1
      },
      {
        "symbol": "KRYS",
        "weight": 1
      },
      {
        "symbol": "TGTX",
        "weight": 1
      },
      {
        "symbol": "IRON",
        "weight": 1
      },
      {
        "symbol": "PCVX",
        "weight": 1
      },
      {
        "symbol": "RYTM",
        "weight": 1
      },
      {
        "symbol": "INCY",
        "weight": 1
      },
      {
        "symbol": "JAZZ",
        "weight": 1
      },
      {
        "symbol": "BIIB",
        "weight": 1
      },
      {
        "symbol": "NTLA",
        "weight": 1
      },
      {
        "symbol": "BEAM",
        "weight": 1
      },
      {
        "symbol": "PTCT",
        "weight": 1
      },
      {
        "symbol": "LEGN",
        "weight": 1
      },
      {
        "symbol": "ARWR",
        "weight": 1
      },
      {
        "symbol": "RCKT",
        "weight": 1
      },
      {
        "symbol": "BNTX",
        "weight": 1
      },
      {
        "symbol": "DNA",
        "weight": 1
      },
      {
        "symbol": "SMMT",
        "weight": 1
      }
    ]
  },
  {
    "id": "ibb",
    "title": "IBB",
    "name": "Biotech",
    "group": "Thematic",
    "grouped": false,
    "weighting": "cap",
    "lines": [
      {
        "symbol": "AMGN",
        "weight": 1
      },
      {
        "symbol": "GILD",
        "weight": 1
      },
      {
        "symbol": "VRTX",
        "weight": 1
      },
      {
        "symbol": "REGN",
        "weight": 1
      },
      {
        "symbol": "BIIB",
        "weight": 1
      },
      {
        "symbol": "ALNY",
        "weight": 1
      },
      {
        "symbol": "ARGX",
        "weight": 1
      },
      {
        "symbol": "INSM",
        "weight": 1
      },
      {
        "symbol": "BMRN",
        "weight": 1
      },
      {
        "symbol": "INCY",
        "weight": 1
      },
      {
        "symbol": "JAZZ",
        "weight": 1
      },
      {
        "symbol": "UTHR",
        "weight": 1
      },
      {
        "symbol": "IONS",
        "weight": 1
      },
      {
        "symbol": "TECH",
        "weight": 1
      },
      {
        "symbol": "NBIX",
        "weight": 1
      },
      {
        "symbol": "EXEL",
        "weight": 1
      },
      {
        "symbol": "MRNA",
        "weight": 1
      },
      {
        "symbol": "BNTX",
        "weight": 1
      },
      {
        "symbol": "SRPT",
        "weight": 1
      }
    ]
  },
  {
    "id": "kre",
    "title": "KRE",
    "name": "Regional banks",
    "group": "Thematic",
    "grouped": false,
    "weighting": "custom",
    "lines": [
      {
        "symbol": "TFC",
        "weight": 6.2
      },
      {
        "symbol": "USB",
        "weight": 6.0
      },
      {
        "symbol": "PNC",
        "weight": 5.8
      },
      {
        "symbol": "RF",
        "weight": 4.4
      },
      {
        "symbol": "CFG",
        "weight": 4.2
      },
      {
        "symbol": "HBAN",
        "weight": 4.0
      },
      {
        "symbol": "KEY",
        "weight": 3.8
      },
      {
        "symbol": "FITB",
        "weight": 3.8
      },
      {
        "symbol": "MTB",
        "weight": 3.6
      },
      {
        "symbol": "EWBC",
        "weight": 3.4
      },
      {
        "symbol": "ZION",
        "weight": 3.2
      },
      {
        "symbol": "WAL",
        "weight": 2.8
      },
      {
        "symbol": "FHN",
        "weight": 2.6
      },
      {
        "symbol": "WTFC",
        "weight": 2.4
      },
      {
        "symbol": "CBSH",
        "weight": 2.4
      },
      {
        "symbol": "UMBF",
        "weight": 2.2
      },
      {
        "symbol": "CFR",
        "weight": 2.2
      },
      {
        "symbol": "OZK",
        "weight": 2.2
      },
      {
        "symbol": "SSB",
        "weight": 2.0
      },
      {
        "symbol": "BOKF",
        "weight": 2.0
      },
      {
        "symbol": "PNFP",
        "weight": 2.0
      },
      {
        "symbol": "HOMB",
        "weight": 1.8
      },
      {
        "symbol": "FNB",
        "weight": 1.6
      },
      {
        "symbol": "COLB",
        "weight": 1.6
      },
      {
        "symbol": "ASB",
        "weight": 1.6
      },
      {
        "symbol": "ONB",
        "weight": 1.4
      },
      {
        "symbol": "HWC",
        "weight": 1.4
      }
    ]
  },
  {
    "id": "xrt",
    "title": "XRT",
    "name": "Retail",
    "group": "Thematic",
    "grouped": false,
    "weighting": "equal",
    "lines": [
      {
        "symbol": "AMZN",
        "weight": 1
      },
      {
        "symbol": "HD",
        "weight": 1
      },
      {
        "symbol": "LOW",
        "weight": 1
      },
      {
        "symbol": "TJX",
        "weight": 1
      },
      {
        "symbol": "ROST",
        "weight": 1
      },
      {
        "symbol": "ORLY",
        "weight": 1
      },
      {
        "symbol": "AZO",
        "weight": 1
      },
      {
        "symbol": "ULTA",
        "weight": 1
      },
      {
        "symbol": "DG",
        "weight": 1
      },
      {
        "symbol": "TGT",
        "weight": 1
      },
      {
        "symbol": "LULU",
        "weight": 1
      },
      {
        "symbol": "NKE",
        "weight": 1
      },
      {
        "symbol": "SBUX",
        "weight": 1
      },
      {
        "symbol": "CMG",
        "weight": 1
      },
      {
        "symbol": "YUM",
        "weight": 1
      },
      {
        "symbol": "DRI",
        "weight": 1
      },
      {
        "symbol": "DPZ",
        "weight": 1
      },
      {
        "symbol": "WSM",
        "weight": 1
      },
      {
        "symbol": "TSCO",
        "weight": 1
      },
      {
        "symbol": "BBY",
        "weight": 1
      },
      {
        "symbol": "EBAY",
        "weight": 1
      },
      {
        "symbol": "ETSY",
        "weight": 1
      },
      {
        "symbol": "CVNA",
        "weight": 1
      },
      {
        "symbol": "CHWY",
        "weight": 1
      },
      {
        "symbol": "GPC",
        "weight": 1
      },
      {
        "symbol": "AN",
        "weight": 1
      },
      {
        "symbol": "KMX",
        "weight": 1
      },
      {
        "symbol": "TPR",
        "weight": 1
      },
      {
        "symbol": "RL",
        "weight": 1
      },
      {
        "symbol": "DECK",
        "weight": 1
      },
      {
        "symbol": "ONON",
        "weight": 1
      },
      {
        "symbol": "BURL",
        "weight": 1
      },
      {
        "symbol": "AEO",
        "weight": 1
      },
      {
        "symbol": "URBN",
        "weight": 1
      },
      {
        "symbol": "BBWI",
        "weight": 1
      },
      {
        "symbol": "M",
        "weight": 1
      },
      {
        "symbol": "W",
        "weight": 1
      },
      {
        "symbol": "DKS",
        "weight": 1
      }
    ]
  },
  {
    "id": "ita",
    "title": "ITA",
    "name": "Aerospace & defense",
    "group": "Thematic",
    "grouped": false,
    "weighting": "cap",
    "lines": [
      {
        "symbol": "GE",
        "weight": 1
      },
      {
        "symbol": "RTX",
        "weight": 1
      },
      {
        "symbol": "BA",
        "weight": 1
      },
      {
        "symbol": "LMT",
        "weight": 1
      },
      {
        "symbol": "NOC",
        "weight": 1
      },
      {
        "symbol": "GD",
        "weight": 1
      },
      {
        "symbol": "HWM",
        "weight": 1
      },
      {
        "symbol": "TDG",
        "weight": 1
      },
      {
        "symbol": "LHX",
        "weight": 1
      },
      {
        "symbol": "AXON",
        "weight": 1
      },
      {
        "symbol": "LDOS",
        "weight": 1
      },
      {
        "symbol": "TXT",
        "weight": 1
      },
      {
        "symbol": "HII",
        "weight": 1
      },
      {
        "symbol": "HEI",
        "weight": 1
      },
      {
        "symbol": "CW",
        "weight": 1
      },
      {
        "symbol": "KTOS",
        "weight": 1
      },
      {
        "symbol": "BWXT",
        "weight": 1
      },
      {
        "symbol": "CACI",
        "weight": 1
      },
      {
        "symbol": "SAIC",
        "weight": 1
      },
      {
        "symbol": "AVAV",
        "weight": 1
      },
      {
        "symbol": "TDY",
        "weight": 1
      },
      {
        "symbol": "HXL",
        "weight": 1
      },
      {
        "symbol": "WWD",
        "weight": 1
      }
    ]
  }
] as Board[];
