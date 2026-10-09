import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as ChevronRight, i as Funnel, o as ChevronLeft, r as Search, s as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BNhwtNKA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SECTOR_LABEL = new Map([
	{
		id: "tech",
		label: "Technology"
	},
	{
		id: "financials",
		label: "Financials"
	},
	{
		id: "health",
		label: "Health Care"
	},
	{
		id: "discretionary",
		label: "Discretionary"
	},
	{
		id: "communication",
		label: "Communication"
	},
	{
		id: "industrials",
		label: "Industrials"
	},
	{
		id: "staples",
		label: "Staples"
	},
	{
		id: "energy",
		label: "Energy"
	},
	{
		id: "utilities",
		label: "Utilities"
	},
	{
		id: "realestate",
		label: "Real Estate"
	},
	{
		id: "materials",
		label: "Materials"
	},
	{
		id: "other",
		label: "Other"
	}
].map((s) => [s.id, s.label]));
function sectorLabel(id) {
	return SECTOR_LABEL.get(id) ?? id;
}
var LISTINGS = [
	{
		"symbol": "NVDA",
		"name": "Nvidia",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 5554568e6,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "AAPL",
		"name": "Apple Inc.",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 4968150755600,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "MSFT",
		"name": "Microsoft",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 3880664329052,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "AVGO",
		"name": "Broadcom",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 1719175059581,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MU",
		"name": "Micron Technology",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 1169870601532,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "AMD",
		"name": "Advanced Micro Devices",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 0xebea15c22d,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "INTC",
		"name": "Intel",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 565925243238,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "PLTR",
		"name": "Palantir Technologies",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 477480190754,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CSCO",
		"name": "Cisco",
		"sector": "tech",
		"industry": "Communications Equipment",
		"cap": 452963805839,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "ORCL",
		"name": "Oracle Corporation",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 411344390908,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMAT",
		"name": "Applied Materials",
		"sector": "tech",
		"industry": "Semiconductor Materials & Equipment",
		"cap": 404393449030,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "LRCX",
		"name": "Lam Research",
		"sector": "tech",
		"industry": "Semiconductor Materials & Equipment",
		"cap": 401194136214,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "DELL",
		"name": "Dell Technologies",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 365306215513,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PANW",
		"name": "Palo Alto Networks",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 325973e6,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CRWD",
		"name": "CrowdStrike",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 269305102794,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ANET",
		"name": "Arista Networks",
		"sector": "tech",
		"industry": "Communications Equipment",
		"cap": 266080563989,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TXN",
		"name": "Texas Instruments",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 263197983105,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "KLAC",
		"name": "KLA Corporation",
		"sector": "tech",
		"industry": "Semiconductor Materials & Equipment",
		"cap": 256720877106,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MRVL",
		"name": "Marvell Technology",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 240849354e3,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "SNDK",
		"name": "Sandisk",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 233899091072,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "IBM",
		"name": "IBM",
		"sector": "tech",
		"industry": "IT Consulting & Other Services",
		"cap": 213497074118,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "APH",
		"name": "Amphenol",
		"sector": "tech",
		"industry": "Electronic Components",
		"cap": 210396297102,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ADI",
		"name": "Analog Devices",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 196699659207,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CRM",
		"name": "Salesforce",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 1874794e5,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "QCOM",
		"name": "Qualcomm",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 184851672435,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "STX",
		"name": "Seagate Technology",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 177216851279,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "WDC",
		"name": "Western Digital",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 146928022214,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "NOW",
		"name": "ServiceNow",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 1445015e5,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ACN",
		"name": "Accenture",
		"sector": "tech",
		"industry": "IT Consulting & Other Services",
		"cap": 139082427356,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FTNT",
		"name": "Fortinet",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 138745251782,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "GLW",
		"name": "Corning Inc.",
		"sector": "tech",
		"industry": "Electronic Components",
		"cap": 131645978627,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DDOG",
		"name": "Datadog",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 98314741571,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CDNS",
		"name": "Cadence Design Systems",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 96068094120,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "SNPS",
		"name": "Synopsys",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 95387140547,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "LITE",
		"name": "Lumentum",
		"sector": "tech",
		"industry": "Communications Equipment",
		"cap": 94985182802,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "HPE",
		"name": "Hewlett Packard Enterprise",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 94249999309,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ADBE",
		"name": "Adobe Inc.",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 9381666e4,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "INTU",
		"name": "Intuit",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 81207675680,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MSI",
		"name": "Motorola Solutions",
		"sector": "tech",
		"industry": "Communications Equipment",
		"cap": 73995582491,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MPWR",
		"name": "Monolithic Power Systems",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 67316081400,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "KEYS",
		"name": "Keysight Technologies",
		"sector": "tech",
		"industry": "Electronic Equipment & Instruments",
		"cap": 63785598609,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TER",
		"name": "Teradyne",
		"sector": "tech",
		"industry": "Semiconductor Materials & Equipment",
		"cap": 62336183840,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "TEL",
		"name": "TE Connectivity",
		"sector": "tech",
		"industry": "Electronic Manufacturing Services",
		"cap": 62045579893,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CIEN",
		"name": "Ciena",
		"sector": "tech",
		"industry": "Communications Equipment",
		"cap": 60400505053,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "COHR",
		"name": "Coherent Corp.",
		"sector": "tech",
		"industry": "Electronic Components",
		"cap": 59209879578,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NXPI",
		"name": "NXP Semiconductors",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 58267575686,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "P",
		"name": "Everpure",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 50174027183,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ADSK",
		"name": "Autodesk",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 488224e5,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "NTAP",
		"name": "NetApp",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 45382611105,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WDAY",
		"name": "Workday, Inc.",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 4526221e4,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "FLEX",
		"name": "Flex Ltd.",
		"sector": "tech",
		"industry": "Electronic Manufacturing Services",
		"cap": 42391891230,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TWLO",
		"name": "Twilio",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 42351438419,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MCHP",
		"name": "Microchip Technology",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 41008016344,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ROP",
		"name": "Roper Technologies",
		"sector": "tech",
		"industry": "Electronic Equipment & Instruments",
		"cap": 36022665337,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "JBL",
		"name": "Jabil",
		"sector": "tech",
		"industry": "Electronic Manufacturing Services",
		"cap": 31348105545,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ON",
		"name": "ON Semiconductor",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 30915791058,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HPQ",
		"name": "HP Inc.",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 29254099034,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SMCI",
		"name": "Supermicro",
		"sector": "tech",
		"industry": "Technology Hardware, Storage & Peripherals",
		"cap": 28098409474,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TDY",
		"name": "Teledyne Technologies",
		"sector": "tech",
		"industry": "Electronic Equipment & Instruments",
		"cap": 28036838144,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CTSH",
		"name": "Cognizant",
		"sector": "tech",
		"industry": "IT Consulting & Other Services",
		"cap": 27031156982,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VRSN",
		"name": "Verisign",
		"sector": "tech",
		"industry": "Internet Services & Infrastructure",
		"cap": 26890437e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "Q",
		"name": "Qnity Electronics",
		"sector": "tech",
		"industry": "Semiconductor Materials & Equipment",
		"cap": 26502538227,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FFIV",
		"name": "F5, Inc.",
		"sector": "tech",
		"industry": "Communications Equipment",
		"cap": 26142504842,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PTC",
		"name": "PTC Inc.",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 21020917944,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FSLR",
		"name": "First Solar",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 19220971584,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ZBRA",
		"name": "Zebra Technologies",
		"sector": "tech",
		"industry": "Electronic Equipment & Instruments",
		"cap": 18079295612,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CDW",
		"name": "CDW Corporation",
		"sector": "tech",
		"industry": "Technology Distributors",
		"cap": 17487437549,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FICO",
		"name": "Fair Isaac",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 15278814928,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AKAM",
		"name": "Akamai Technologies",
		"sector": "tech",
		"industry": "Internet Services & Infrastructure",
		"cap": 14501005848,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TRMB",
		"name": "Trimble Inc.",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 13955813903,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GEN",
		"name": "Gen Digital",
		"sector": "tech",
		"industry": "Systems Software",
		"cap": 13617854978,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TYL",
		"name": "Tyler Technologies",
		"sector": "tech",
		"industry": "Application Software",
		"cap": 13561345535,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GDDY",
		"name": "GoDaddy",
		"sector": "tech",
		"industry": "Internet Services & Infrastructure",
		"cap": 13068776576,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IT",
		"name": "Gartner",
		"sector": "tech",
		"industry": "IT Consulting & Other Services",
		"cap": 12339941400,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SWKS",
		"name": "Skyworks Solutions",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 12005891185,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BRK-B",
		"name": "Berkshire Hathaway",
		"sector": "financials",
		"industry": "Multi-Sector Holdings",
		"cap": 1127535426150,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "JPM",
		"name": "JPMorgan Chase",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 880976068747,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "V",
		"name": "Visa Inc.",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 670211884898,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "MA",
		"name": "Mastercard",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 503495473114,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BAC",
		"name": "Bank of America",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 374881239848,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MS",
		"name": "Morgan Stanley",
		"sector": "financials",
		"industry": "Investment Banking & Brokerage",
		"cap": 294386945772,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GS",
		"name": "Goldman Sachs",
		"sector": "financials",
		"industry": "Investment Banking & Brokerage",
		"cap": 256984972987,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "WFC",
		"name": "Wells Fargo",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 248058665532,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "C",
		"name": "Citigroup",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 214846103167,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AXP",
		"name": "American Express",
		"sector": "financials",
		"industry": "Consumer Finance",
		"cap": 208062959547,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "SCHW",
		"name": "Charles Schwab Corporation",
		"sector": "financials",
		"industry": "Investment Banking & Brokerage",
		"cap": 167520750615,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BLK",
		"name": "BlackRock",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 164989965076,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CB",
		"name": "Chubb Limited",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 132630275527,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PGR",
		"name": "Progressive Corporation",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 127163447252,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "COF",
		"name": "Capital One",
		"sector": "financials",
		"industry": "Consumer Finance",
		"cap": 122328876298,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SPGI",
		"name": "S&P Global",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 118724804e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CME",
		"name": "CME Group",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 99402091464,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BNY",
		"name": "BNY Mellon",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 97439979833,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HOOD",
		"name": "Robinhood Markets",
		"sector": "financials",
		"industry": "Investment Banking & Brokerage",
		"cap": 96210794034,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "USB",
		"name": "U.S. Bancorp",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 88855673965,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PNC",
		"name": "PNC Financial Services",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 87639944767,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ICE",
		"name": "Intercontinental Exchange",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 87212633555,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BX",
		"name": "Blackstone Inc.",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 84580437846,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MRSH",
		"name": "Marsh McLennan",
		"sector": "financials",
		"industry": "Insurance Brokers",
		"cap": 84308914718,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KKR",
		"name": "KKR & Co.",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 80392244426,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MCO",
		"name": "Moody's Corporation",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 79445108e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TRV",
		"name": "Travelers Companies (The)",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 77229073396,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "APO",
		"name": "Apollo Global Management",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 68089626233,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MET",
		"name": "MetLife",
		"sector": "financials",
		"industry": "Life & Health Insurance",
		"cap": 62575413002,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AJG",
		"name": "Arthur J. Gallagher & Co.",
		"sector": "financials",
		"industry": "Insurance Brokers",
		"cap": 59987015e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AON",
		"name": "Aon plc",
		"sector": "financials",
		"industry": "Insurance Brokers",
		"cap": 58784200270,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ALL",
		"name": "Allstate",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 58316629009,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AFL",
		"name": "Aflac",
		"sector": "financials",
		"industry": "Life & Health Insurance",
		"cap": 57624398672,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TFC",
		"name": "Truist Financial",
		"sector": "financials",
		"industry": "Diversified Banks",
		"cap": 56414697362,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NDAQ",
		"name": "Nasdaq, Inc.",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 51632739852,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "STT",
		"name": "State Street Corporation",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 48097532034,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PYPL",
		"name": "PayPal",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 47067457287,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "FITB",
		"name": "Fifth Third Bancorp",
		"sector": "financials",
		"industry": "Regional Banks",
		"cap": 45979452995,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "COIN",
		"name": "Coinbase",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 45379950756,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "XYZ",
		"name": "Block, Inc.",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 45197807850,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMP",
		"name": "Ameriprise Financial",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 44865836683,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MSCI",
		"name": "MSCI",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 40833409e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AIG",
		"name": "American International Group",
		"sector": "financials",
		"industry": "Multi-line Insurance",
		"cap": 40288918671,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IBKR",
		"name": "Interactive Brokers",
		"sector": "financials",
		"industry": "Investment Banking & Brokerage",
		"cap": 39177669446,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PRU",
		"name": "Prudential Financial",
		"sector": "financials",
		"industry": "Life & Health Insurance",
		"cap": 3916785e4,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ARES",
		"name": "Ares Management",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 38398030644,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HIG",
		"name": "Hartford (The)",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 35072506819,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CBOE",
		"name": "Cboe Global Markets",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 32883658e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ACGL",
		"name": "Arch Capital Group",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 32785294426,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MTB",
		"name": "M&T Bank",
		"sector": "financials",
		"industry": "Regional Banks",
		"cap": 31419201961,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HBAN",
		"name": "Huntington Bancshares",
		"sector": "financials",
		"industry": "Regional Banks",
		"cap": 31053775876,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NTRS",
		"name": "Northern Trust",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 30828027531,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RJF",
		"name": "Raymond James Financial",
		"sector": "financials",
		"industry": "Investment Banking & Brokerage",
		"cap": 30508567365,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WTW",
		"name": "Willis Towers Watson",
		"sector": "financials",
		"industry": "Insurance Brokers",
		"cap": 27662835155,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SYF",
		"name": "Synchrony Financial",
		"sector": "financials",
		"industry": "Consumer Finance",
		"cap": 27428082439,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CFG",
		"name": "Citizens Financial Group",
		"sector": "financials",
		"industry": "Regional Banks",
		"cap": 26993220343,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WRB",
		"name": "W. R. Berkley Corporation",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 26746943464,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CPAY",
		"name": "Corpay",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 26400411566,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CINF",
		"name": "Cincinnati Financial",
		"sector": "financials",
		"industry": "Property & Casualty Insurance",
		"cap": 25362246936,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FISV",
		"name": "Fiserv",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 24429363163,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PFG",
		"name": "Principal Financial Group",
		"sector": "financials",
		"industry": "Life & Health Insurance",
		"cap": 23502266443,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RF",
		"name": "Regions Financial Corporation",
		"sector": "financials",
		"industry": "Regional Banks",
		"cap": 23061731727,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TROW",
		"name": "T. Rowe Price",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 22233911046,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "L",
		"name": "Loews Corporation",
		"sector": "financials",
		"industry": "Multi-line Insurance",
		"cap": 21996422672,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GPN",
		"name": "Global Payments",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 21902464140,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KEY",
		"name": "KeyCorp",
		"sector": "financials",
		"industry": "Regional Banks",
		"cap": 21449283935,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BRO",
		"name": "Brown & Brown",
		"sector": "financials",
		"industry": "Insurance Brokers",
		"cap": 21331410259,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FIS",
		"name": "Fidelity National Information Services",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 17709341190,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BEN",
		"name": "Franklin Resources",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 16461691884,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EG",
		"name": "Everest Group",
		"sector": "financials",
		"industry": "Reinsurance",
		"cap": 14305674055,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AIZ",
		"name": "Assurant",
		"sector": "financials",
		"industry": "Multi-line Insurance",
		"cap": 13458483064,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IVZ",
		"name": "Invesco",
		"sector": "financials",
		"industry": "Asset Management & Custody Banks",
		"cap": 13284728380,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GL",
		"name": "Globe Life",
		"sector": "financials",
		"industry": "Life & Health Insurance",
		"cap": 12763156158,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ERIE",
		"name": "Erie Indemnity",
		"sector": "financials",
		"industry": "Insurance Brokers",
		"cap": 10463671465,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "JKHY",
		"name": "Jack Henry & Associates",
		"sector": "financials",
		"industry": "Transaction & Payment Processing Services",
		"cap": 10450193451,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FDS",
		"name": "FactSet",
		"sector": "financials",
		"industry": "Financial Exchanges & Data",
		"cap": 10190239380,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LLY",
		"name": "Lilly (Eli)",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 1101011223224,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "JNJ",
		"name": "Johnson & Johnson",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 618090792159,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "ABBV",
		"name": "AbbVie",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 481398090780,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MRK",
		"name": "Merck & Co.",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 351275897818,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "UNH",
		"name": "UnitedHealth Group",
		"sector": "health",
		"industry": "Managed Health Care",
		"cap": 332962808495,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "TMO",
		"name": "Thermo Fisher Scientific",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 241067835526,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMGN",
		"name": "Amgen",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 220275104117,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "GILD",
		"name": "Gilead Sciences",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 182397403301,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ABT",
		"name": "Abbott Laboratories",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 170425450823,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PFE",
		"name": "Pfizer",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 158564919246,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DHR",
		"name": "Danaher Corporation",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 152871347303,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ISRG",
		"name": "Intuitive Surgical",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 146755229766,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "VRTX",
		"name": "Vertex Pharmaceuticals",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 127554210003,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "BMY",
		"name": "Bristol Myers Squibb",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 121704939204,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CVS",
		"name": "CVS Health",
		"sector": "health",
		"industry": "Health Care Services",
		"cap": 112293598398,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MDT",
		"name": "Medtronic",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 112244349848,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MCK",
		"name": "McKesson Corporation",
		"sector": "health",
		"industry": "Health Care Distributors",
		"cap": 108458185181,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SYK",
		"name": "Stryker Corporation",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 106238226551,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HCA",
		"name": "HCA Healthcare",
		"sector": "health",
		"industry": "Health Care Facilities",
		"cap": 96345332515,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ELV",
		"name": "Elevance Health",
		"sector": "health",
		"industry": "Managed Health Care",
		"cap": 86951573133,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MRNA",
		"name": "Moderna",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 78649470133,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "REGN",
		"name": "Regeneron Pharmaceuticals",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 76142420475,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CI",
		"name": "Cigna",
		"sector": "health",
		"industry": "Health Care Services",
		"cap": 74259503781,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "COR",
		"name": "Cencora",
		"sector": "health",
		"industry": "Health Care Distributors",
		"cap": 61322309473,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BSX",
		"name": "Boston Scientific",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 60925609273,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CAH",
		"name": "Cardinal Health",
		"sector": "health",
		"industry": "Health Care Distributors",
		"cap": 55333421081,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BDX",
		"name": "Becton Dickinson",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 49778687700,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EW",
		"name": "Edwards Lifesciences",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 48555936e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "A",
		"name": "Agilent Technologies",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 47411975377,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HUM",
		"name": "Humana",
		"sector": "health",
		"industry": "Managed Health Care",
		"cap": 46485488833,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VEEV",
		"name": "Veeva Systems",
		"sector": "health",
		"industry": "Health Care Technology",
		"cap": 46118116834,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IQV",
		"name": "IQVIA",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 42611648e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WAT",
		"name": "Waters Corporation",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 42161211873,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IDXX",
		"name": "Idexx Laboratories",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 40425741864,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ILMN",
		"name": "Illumina, Inc.",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 3995007e4,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BIIB",
		"name": "Biogen",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 32273905783,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RMD",
		"name": "ResMed|",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 31887135565,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CNC",
		"name": "Centene Corporation",
		"sector": "health",
		"industry": "Managed Health Care",
		"cap": 31882437300,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DXCM",
		"name": "Dexcom",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 31853022174,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MTD",
		"name": "Mettler Toledo",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 30645115528,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ZTS",
		"name": "Zoetis",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 30198380834,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GEHC",
		"name": "GE HealthCare",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 29007291103,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "WST",
		"name": "West Pharmaceutical Services",
		"sector": "health",
		"industry": "Health Care Supplies",
		"cap": 25565403062,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LH",
		"name": "Labcorp",
		"sector": "health",
		"industry": "Health Care Services",
		"cap": 2548162e4,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DGX",
		"name": "Quest Diagnostics",
		"sector": "health",
		"industry": "Health Care Services",
		"cap": 25475275222,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "INCY",
		"name": "Incyte",
		"sector": "health",
		"industry": "Biotechnology",
		"cap": 22854170862,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "STE",
		"name": "Steris",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 20549123184,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VTRS",
		"name": "Viatris",
		"sector": "health",
		"industry": "Pharmaceuticals",
		"cap": 20031424668,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RVTY",
		"name": "Revvity",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 16978986776,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ZBH",
		"name": "Zimmer Biomet",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 16952765798,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SOLV",
		"name": "Solventum",
		"sector": "health",
		"industry": "Health Care Technology",
		"cap": 14709032423,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CRL",
		"name": "Charles River Laboratories",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 14226183856,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BAX",
		"name": "Baxter International",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 12356204376,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TECH",
		"name": "Bio-Techne",
		"sector": "health",
		"industry": "Life Sciences Tools & Services",
		"cap": 11361481343,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DVA",
		"name": "DaVita",
		"sector": "health",
		"industry": "Health Care Services",
		"cap": 11293876e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "UHS",
		"name": "Universal Health Services",
		"sector": "health",
		"industry": "Health Care Facilities",
		"cap": 10356324416,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "COO",
		"name": "Cooper Companies (The)",
		"sector": "health",
		"industry": "Health Care Supplies",
		"cap": 10325432464,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ALGN",
		"name": "Align Technology",
		"sector": "health",
		"industry": "Health Care Supplies",
		"cap": 10018750328,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HSIC",
		"name": "Henry Schein",
		"sector": "health",
		"industry": "Health Care Distributors",
		"cap": 9431720849,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PODD",
		"name": "Insulet Corporation",
		"sector": "health",
		"industry": "Health Care Equipment",
		"cap": 9326059140,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMZN",
		"name": "Amazon",
		"sector": "discretionary",
		"industry": "Broadline Retail",
		"cap": 2740370826102,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "TSLA",
		"name": "Tesla, Inc.",
		"sector": "discretionary",
		"industry": "Automobile Manufacturers",
		"cap": 1481080272750,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "HD",
		"name": "Home Depot (The)",
		"sector": "discretionary",
		"industry": "Home Improvement Retail",
		"cap": 294787353794,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "MCD",
		"name": "McDonald's",
		"sector": "discretionary",
		"industry": "Restaurants",
		"cap": 167640278694,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "TJX",
		"name": "TJX Companies",
		"sector": "discretionary",
		"industry": "Apparel Retail",
		"cap": 152621400964,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BKNG",
		"name": "Booking Holdings",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 120198338585,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "SBUX",
		"name": "Starbucks",
		"sector": "discretionary",
		"industry": "Restaurants",
		"cap": 1062594e5,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "LOW",
		"name": "Lowe's",
		"sector": "discretionary",
		"industry": "Home Improvement Retail",
		"cap": 105955051488,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ABNB",
		"name": "Airbnb",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 97739786873,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MAR",
		"name": "Marriott International",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 94157491271,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "DASH",
		"name": "DoorDash",
		"sector": "discretionary",
		"industry": "Specialized Consumer Services",
		"cap": 83067547502,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "RCL",
		"name": "Royal Caribbean Group",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 75263690958,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HLT",
		"name": "Hilton Worldwide",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 72761234754,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GM",
		"name": "General Motors",
		"sector": "discretionary",
		"industry": "Automobile Manufacturers",
		"cap": 72170389247,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ROST",
		"name": "Ross Stores",
		"sector": "discretionary",
		"industry": "Apparel Retail",
		"cap": 71940840372,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ORLY",
		"name": "O'Reilly Automotive",
		"sector": "discretionary",
		"industry": "Automotive Retail",
		"cap": 69578717720,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CVNA",
		"name": "Carvana",
		"sector": "discretionary",
		"industry": "Automotive Retail",
		"cap": 69549310264,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GRMN",
		"name": "Garmin",
		"sector": "discretionary",
		"industry": "Consumer Electronics",
		"cap": 51769334764,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NKE",
		"name": "Nike, Inc.",
		"sector": "discretionary",
		"industry": "Apparel, Accessories & Luxury Goods",
		"cap": 51599628719,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "EBAY",
		"name": "eBay Inc.",
		"sector": "discretionary",
		"industry": "Broadline Retail",
		"cap": 498311e5,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "F",
		"name": "Ford Motor Company",
		"sector": "discretionary",
		"industry": "Automobile Manufacturers",
		"cap": 47980108990,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AZO",
		"name": "AutoZone",
		"sector": "discretionary",
		"industry": "Automotive Retail",
		"cap": 47515598742,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CMG",
		"name": "Chipotle Mexican Grill",
		"sector": "discretionary",
		"industry": "Restaurants",
		"cap": 41353860240,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "YUM",
		"name": "Yum! Brands",
		"sector": "discretionary",
		"industry": "Restaurants",
		"cap": 39024855155,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DHI",
		"name": "D. R. Horton",
		"sector": "discretionary",
		"industry": "Homebuilding",
		"cap": 37989026084,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CCL",
		"name": "Carnival Corporation",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 35134662671,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EXPE",
		"name": "Expedia Group",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 30928775036,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WSM",
		"name": "Williams-Sonoma, Inc.",
		"sector": "discretionary",
		"industry": "Homefurnishing Retail",
		"cap": 28149222347,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ULTA",
		"name": "Ulta Beauty",
		"sector": "discretionary",
		"industry": "Other Specialty Retail",
		"cap": 24124192713,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LVS",
		"name": "Las Vegas Sands",
		"sector": "discretionary",
		"industry": "Casinos & Gaming",
		"cap": 23382012742,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TPR",
		"name": "Tapestry, Inc.",
		"sector": "discretionary",
		"industry": "Apparel, Accessories & Luxury Goods",
		"cap": 23135093876,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DRI",
		"name": "Darden Restaurants",
		"sector": "discretionary",
		"industry": "Restaurants",
		"cap": 22687479276,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RL",
		"name": "Ralph Lauren Corporation",
		"sector": "discretionary",
		"industry": "Apparel, Accessories & Luxury Goods",
		"cap": 21889918786,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PHM",
		"name": "PulteGroup",
		"sector": "discretionary",
		"industry": "Homebuilding",
		"cap": 21281486866,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BBY",
		"name": "Best Buy",
		"sector": "discretionary",
		"industry": "Computer & Electronics Retail",
		"cap": 18539928503,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LEN",
		"name": "Lennar",
		"sector": "discretionary",
		"industry": "Homebuilding",
		"cap": 18461058546,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GPC",
		"name": "Genuine Parts Company",
		"sector": "discretionary",
		"industry": "Distributors",
		"cap": 17669485183,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TSCO",
		"name": "Tractor Supply",
		"sector": "discretionary",
		"industry": "Other Specialty Retail",
		"cap": 17444423787,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NVR",
		"name": "NVR, Inc.",
		"sector": "discretionary",
		"industry": "Homebuilding",
		"cap": 15995955393,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HAS",
		"name": "Hasbro",
		"sector": "discretionary",
		"industry": "Leisure Products",
		"cap": 13046613198,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DECK",
		"name": "Deckers Brands",
		"sector": "discretionary",
		"industry": "Footwear",
		"cap": 11262358581,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DPZ",
		"name": "Domino's",
		"sector": "discretionary",
		"industry": "Restaurants",
		"cap": 10210677508,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LULU",
		"name": "Lululemon Athletica",
		"sector": "discretionary",
		"industry": "Apparel, Accessories & Luxury Goods",
		"cap": 9786457852,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "APTV",
		"name": "Aptiv",
		"sector": "discretionary",
		"industry": "Automotive Parts & Equipment",
		"cap": 9179469564,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WYNN",
		"name": "Wynn Resorts",
		"sector": "discretionary",
		"industry": "Casinos & Gaming",
		"cap": 7752904253,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MGM",
		"name": "MGM Resorts",
		"sector": "discretionary",
		"industry": "Casinos & Gaming",
		"cap": 7752277521,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NCLH",
		"name": "Norwegian Cruise Line Holdings",
		"sector": "discretionary",
		"industry": "Hotels, Resorts & Cruise Lines",
		"cap": 7112819735,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GOOGL",
		"name": "Alphabet Inc. (Class A)",
		"sector": "communication",
		"industry": "Interactive Media & Services",
		"cap": 42595867e5,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "GOOG",
		"name": "Alphabet Inc. (Class C)",
		"sector": "communication",
		"industry": "Interactive Media & Services",
		"cap": 42176378e5,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "META",
		"name": "Meta Platforms",
		"sector": "communication",
		"industry": "Interactive Media & Services",
		"cap": 1836471762540,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "NFLX",
		"name": "Netflix",
		"sector": "communication",
		"industry": "Movies & Entertainment",
		"cap": 298013162611,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "VZ",
		"name": "Verizon",
		"sector": "communication",
		"industry": "Integrated Telecommunication Services",
		"cap": 192573830613,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "DIS",
		"name": "Walt Disney Company (The)",
		"sector": "communication",
		"industry": "Movies & Entertainment",
		"cap": 184790032252,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "TMUS",
		"name": "T-Mobile US",
		"sector": "communication",
		"industry": "Wireless Telecommunication Services",
		"cap": 183759374023,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "T",
		"name": "AT&T",
		"sector": "communication",
		"industry": "Integrated Telecommunication Services",
		"cap": 170418831116,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "APP",
		"name": "AppLovin",
		"sector": "communication",
		"industry": "Advertising",
		"cap": 93742438120,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CMCSA",
		"name": "Comcast",
		"sector": "communication",
		"industry": "Cable & Satellite",
		"cap": 75266581713,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "SKYD",
		"name": "Skydance Corporation",
		"sector": "communication",
		"industry": "Movies & Entertainment",
		"cap": 46791412647,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LYV",
		"name": "Live Nation Entertainment",
		"sector": "communication",
		"industry": "Movies & Entertainment",
		"cap": 40373505572,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TTWO",
		"name": "Take-Two Interactive",
		"sector": "communication",
		"industry": "Interactive Home Entertainment",
		"cap": 39148095351,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "TKO",
		"name": "TKO Group Holdings",
		"sector": "communication",
		"industry": "Movies & Entertainment",
		"cap": 34377057972,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RDDT",
		"name": "Reddit",
		"sector": "communication",
		"industry": "Interactive Media & Services",
		"cap": 30104281920,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ECHO",
		"name": "EchoStar",
		"sector": "communication",
		"industry": "Wireless Telecommunication Services",
		"cap": 27150567196,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FOXA",
		"name": "Fox Corporation (Class A)",
		"sector": "communication",
		"industry": "Broadcasting",
		"cap": 26805792151,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FOX",
		"name": "Fox Corporation (Class B)",
		"sector": "communication",
		"industry": "Broadcasting",
		"cap": 24022746245,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "OMC",
		"name": "Omnicom Group",
		"sector": "communication",
		"industry": "Advertising",
		"cap": 20973749177,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NWS",
		"name": "News Corp (Class B)",
		"sector": "communication",
		"industry": "Publishing",
		"cap": 17251036416,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NWSA",
		"name": "News Corp (Class A)",
		"sector": "communication",
		"industry": "Publishing",
		"cap": 15656720707,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CHTR",
		"name": "Charter Communications",
		"sector": "communication",
		"industry": "Cable & Satellite",
		"cap": 12565713548,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CAT",
		"name": "Caterpillar Inc.",
		"sector": "industrials",
		"industry": "Construction Machinery & Heavy Transportation Equipment",
		"cap": 365983953124,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "GE",
		"name": "GE Aerospace",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 317099855223,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GEV",
		"name": "GE Vernova",
		"sector": "industrials",
		"industry": "Heavy Electrical Equipment",
		"cap": 266160464172,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RTX",
		"name": "RTX Corporation",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 248418781102,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DE",
		"name": "Deere & Company",
		"sector": "industrials",
		"industry": "Agricultural & Farm Machinery",
		"cap": 175952151363,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "UNP",
		"name": "Union Pacific Corporation",
		"sector": "industrials",
		"industry": "Rail Transportation",
		"cap": 165271803544,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ETN",
		"name": "Eaton Corporation",
		"sector": "industrials",
		"industry": "Electrical Components & Equipment",
		"cap": 164879684e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BA",
		"name": "Boeing",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 148391971255,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "UBER",
		"name": "Uber",
		"sector": "industrials",
		"industry": "Passenger Ground Transportation",
		"cap": 143469422899,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PH",
		"name": "Parker Hannifin",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 119423412508,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LMT",
		"name": "Lockheed Martin",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 117216315541,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ADP",
		"name": "Automatic Data Processing",
		"sector": "industrials",
		"industry": "Human Resource & Employment Services",
		"cap": 107277181590,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "TT",
		"name": "Trane Technologies",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 103397691799,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PWR",
		"name": "Quanta Services",
		"sector": "industrials",
		"industry": "Construction & Engineering",
		"cap": 100969517442,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VRT",
		"name": "Vertiv",
		"sector": "industrials",
		"industry": "Electrical Components & Equipment",
		"cap": 93833167405,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "JCI",
		"name": "Johnson Controls",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 93284186380,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GD",
		"name": "General Dynamics",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 89256818631,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HWM",
		"name": "Howmet Aerospace",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 88757239361,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EMR",
		"name": "Emerson Electric",
		"sector": "industrials",
		"industry": "Electrical Components & Equipment",
		"cap": 88723668e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CSX",
		"name": "CSX Corporation",
		"sector": "industrials",
		"industry": "Rail Transportation",
		"cap": 87696162571,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MMM",
		"name": "3M",
		"sector": "industrials",
		"industry": "Industrial Conglomerates",
		"cap": 84361872973,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "WM",
		"name": "Waste Management",
		"sector": "industrials",
		"industry": "Environmental & Facilities Services",
		"cap": 83980160158,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BE",
		"name": "Bloom Energy",
		"sector": "industrials",
		"industry": "Electrical Components & Equipment",
		"cap": 80352950536,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "UPS",
		"name": "United Parcel Service",
		"sector": "industrials",
		"industry": "Air Freight & Logistics",
		"cap": 80084070314,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CTAS",
		"name": "Cintas",
		"sector": "industrials",
		"industry": "Diversified Support Services",
		"cap": 79859742704,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ITW",
		"name": "Illinois Tool Works",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 75389408e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CMI",
		"name": "Cummins",
		"sector": "industrials",
		"industry": "Construction Machinery & Heavy Transportation Equipment",
		"cap": 71640599035,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NSC",
		"name": "Norfolk Southern",
		"sector": "industrials",
		"industry": "Rail Transportation",
		"cap": 71198608157,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FDX",
		"name": "FedEx",
		"sector": "industrials",
		"industry": "Air Freight & Logistics",
		"cap": 69043866003,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NOC",
		"name": "Northrop Grumman",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 68826694836,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RSG",
		"name": "Republic Services",
		"sector": "industrials",
		"industry": "Environmental & Facilities Services",
		"cap": 66399222150,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HON",
		"name": "Honeywell Technologies",
		"sector": "industrials",
		"industry": "Industrial Conglomerates",
		"cap": 65479806066,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "URI",
		"name": "United Rentals",
		"sector": "industrials",
		"industry": "Trading Companies & Distributors",
		"cap": 65363949823,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TDG",
		"name": "TransDigm Group",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 60212718683,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FIX",
		"name": "Comfort Systems USA",
		"sector": "industrials",
		"industry": "Construction & Engineering",
		"cap": 60055251062,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GWW",
		"name": "W. W. Grainger",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 59755552087,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FAST",
		"name": "Fastenal",
		"sector": "industrials",
		"industry": "Trading Companies & Distributors",
		"cap": 57937152461,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "PCAR",
		"name": "Paccar",
		"sector": "industrials",
		"industry": "Construction Machinery & Heavy Transportation Equipment",
		"cap": 57721180746,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "AME",
		"name": "Ametek",
		"sector": "industrials",
		"industry": "Electrical Components & Equipment",
		"cap": 56746743115,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DAL",
		"name": "Delta Air Lines",
		"sector": "industrials",
		"industry": "Passenger Airlines",
		"cap": 54017155684,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HONA",
		"name": "Honeywell Aerospace",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 48813889177,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ROK",
		"name": "Rockwell Automation",
		"sector": "industrials",
		"industry": "Electrical Components & Equipment",
		"cap": 48308473955,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WAB",
		"name": "Wabtec",
		"sector": "industrials",
		"industry": "Construction Machinery & Heavy Transportation Equipment",
		"cap": 47430166961,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CARR",
		"name": "Carrier Global",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 46022067932,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LHX",
		"name": "L3Harris",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 44117966823,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FERG",
		"name": "Ferguson Enterprises",
		"sector": "industrials",
		"industry": "Trading Companies & Distributors",
		"cap": 41927007355,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ODFL",
		"name": "Old Dominion",
		"sector": "industrials",
		"industry": "Cargo Ground Transportation",
		"cap": 37666330386,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "PAYX",
		"name": "Paychex",
		"sector": "industrials",
		"industry": "Human Resource & Employment Services",
		"cap": 37185720210,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "UAL",
		"name": "United Airlines Holdings",
		"sector": "industrials",
		"industry": "Passenger Airlines",
		"cap": 34873280464,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EME",
		"name": "Emcor",
		"sector": "industrials",
		"industry": "Construction & Engineering",
		"cap": 34328089354,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AXON",
		"name": "Axon Enterprise",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 33901185654,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "IR",
		"name": "Ingersoll Rand",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 30263955462,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CPRT",
		"name": "Copart",
		"sector": "industrials",
		"industry": "Diversified Support Services",
		"cap": 25455560821,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "DOV",
		"name": "Dover Corporation",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 25449175316,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EXPD",
		"name": "Expeditors International",
		"sector": "industrials",
		"industry": "Air Freight & Logistics",
		"cap": 25180483388,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "OTIS",
		"name": "Otis Worldwide",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 25166050001,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HUBB",
		"name": "Hubbell Incorporated",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 25116604253,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "XYL",
		"name": "Xylem Inc.",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 23813319956,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VLTO",
		"name": "Veralto",
		"sector": "industrials",
		"industry": "Environmental & Facilities Services",
		"cap": 23521181829,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VRSK",
		"name": "Verisk Analytics",
		"sector": "industrials",
		"industry": "Research & Consulting Services",
		"cap": 22841078546,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "JBHT",
		"name": "J.B. Hunt",
		"sector": "industrials",
		"industry": "Cargo Ground Transportation",
		"cap": 21452050366,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LUV",
		"name": "Southwest Airlines",
		"sector": "industrials",
		"industry": "Passenger Airlines",
		"cap": 20233651193,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BR",
		"name": "Broadridge Financial Solutions",
		"sector": "industrials",
		"industry": "Data Processing & Outsourced Services",
		"cap": 18652214287,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SNA",
		"name": "Snap-on",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 18563830261,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NDSN",
		"name": "Nordson Corporation",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 18206451764,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DD",
		"name": "DuPont",
		"sector": "industrials",
		"industry": "Industrial Conglomerates",
		"cap": 17890493328,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FDXF",
		"name": "FedEx Freight",
		"sector": "industrials",
		"industry": "Cargo Ground Transportation",
		"cap": 17291772081,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EFX",
		"name": "Equifax",
		"sector": "industrials",
		"industry": "Research & Consulting Services",
		"cap": 17098751764,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IEX",
		"name": "IDEX Corporation",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 17084585898,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FTV",
		"name": "Fortive",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 17039802074,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CHRW",
		"name": "C.H. Robinson",
		"sector": "industrials",
		"industry": "Air Freight & Logistics",
		"cap": 16515756806,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "J",
		"name": "Jacobs Solutions",
		"sector": "industrials",
		"industry": "Construction & Engineering",
		"cap": 16220381098,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ROL",
		"name": "Rollins, Inc.",
		"sector": "industrials",
		"industry": "Environmental & Facilities Services",
		"cap": 15521750733,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LDOS",
		"name": "Leidos",
		"sector": "industrials",
		"industry": "Diversified Support Services",
		"cap": 14961181157,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MAS",
		"name": "Masco",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 13704526385,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SWK",
		"name": "Stanley Black & Decker",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 13466153878,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GNRC",
		"name": "Generac",
		"sector": "industrials",
		"industry": "Heavy Electrical Equipment",
		"cap": 13241027408,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ALLE",
		"name": "Allegion",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 12754667532,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TXT",
		"name": "Textron",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 12592882063,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LII",
		"name": "Lennox International",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 12495066440,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HII",
		"name": "Huntington Ingalls Industries",
		"sector": "industrials",
		"industry": "Aerospace & Defense",
		"cap": 10443006562,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PNR",
		"name": "Pentair",
		"sector": "industrials",
		"industry": "Industrial Machinery & Supplies & Components",
		"cap": 8349064785,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AOS",
		"name": "A. O. Smith",
		"sector": "industrials",
		"industry": "Building Products",
		"cap": 7686988889,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WMT",
		"name": "Walmart",
		"sector": "staples",
		"industry": "Consumer Staples Merchandise Retail",
		"cap": 877154984405,
		"sp": true,
		"ndx": true,
		"dow": true
	},
	{
		"symbol": "COST",
		"name": "Costco",
		"sector": "staples",
		"industry": "Consumer Staples Merchandise Retail",
		"cap": 420051172504,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "KO",
		"name": "Coca-Cola Company (The)",
		"sector": "staples",
		"industry": "Soft Drinks & Non-alcoholic Beverages",
		"cap": 377634747058,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "PG",
		"name": "Procter & Gamble",
		"sector": "staples",
		"industry": "Personal Care Products",
		"cap": 350036374505,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "PM",
		"name": "Philip Morris International",
		"sector": "staples",
		"industry": "Tobacco",
		"cap": 312501994520,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PEP",
		"name": "PepsiCo",
		"sector": "staples",
		"industry": "Soft Drinks & Non-alcoholic Beverages",
		"cap": 175170182554,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MNST",
		"name": "Monster Beverage",
		"sector": "staples",
		"industry": "Soft Drinks & Non-alcoholic Beverages",
		"cap": 128269042535,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MO",
		"name": "Altria",
		"sector": "staples",
		"industry": "Tobacco",
		"cap": 119253111195,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MDLZ",
		"name": "Mondelez International",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 77433609818,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "TGT",
		"name": "Target Corporation",
		"sector": "staples",
		"industry": "Consumer Staples Merchandise Retail",
		"cap": 70306962863,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CL",
		"name": "Colgate-Palmolive",
		"sector": "staples",
		"industry": "Household Products",
		"cap": 70230926235,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VYLR",
		"name": "Vylor",
		"sector": "staples",
		"industry": "Agricultural Products & Services",
		"cap": 48572980275,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KDP",
		"name": "Keurig Dr Pepper",
		"sector": "staples",
		"industry": "Soft Drinks & Non-alcoholic Beverages",
		"cap": 42539421948,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ADM",
		"name": "Archer Daniels Midland",
		"sector": "staples",
		"industry": "Agricultural Products & Services",
		"cap": 39737567618,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SYY",
		"name": "Sysco",
		"sector": "staples",
		"industry": "Food Distributors",
		"cap": 38468723697,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KR",
		"name": "Kroger",
		"sector": "staples",
		"industry": "Food Retail",
		"cap": 36268052067,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EL",
		"name": "Estée Lauder Companies (The)",
		"sector": "staples",
		"industry": "Personal Care Products",
		"cap": 34174284138,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KVUE",
		"name": "Kenvue",
		"sector": "staples",
		"industry": "Personal Care Products",
		"cap": 34055313570,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HSY",
		"name": "Hershey Company (The)",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 32658456289,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KMB",
		"name": "Kimberly-Clark",
		"sector": "staples",
		"industry": "Household Products",
		"cap": 32506275174,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DG",
		"name": "Dollar General",
		"sector": "staples",
		"industry": "Consumer Staples Merchandise Retail",
		"cap": 27416048493,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KHC",
		"name": "Kraft Heinz",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 26657318080,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CASY",
		"name": "Casey's",
		"sector": "staples",
		"industry": "Food Retail",
		"cap": 23738776061,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CHD",
		"name": "Church & Dwight",
		"sector": "staples",
		"industry": "Household Products",
		"cap": 23181937831,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DLTR",
		"name": "Dollar Tree",
		"sector": "staples",
		"industry": "Consumer Staples Merchandise Retail",
		"cap": 22256706067,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "STZ",
		"name": "Constellation Brands",
		"sector": "staples",
		"industry": "Distillers & Vintners",
		"cap": 20918008948,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BG",
		"name": "Bunge Global",
		"sector": "staples",
		"industry": "Agricultural Products & Services",
		"cap": 20714283842,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TSN",
		"name": "Tyson Foods",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 18413291138,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GIS",
		"name": "General Mills",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 17425454023,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SJM",
		"name": "J.M. Smucker Company (The)",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 12755756282,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MKC",
		"name": "McCormick & Company",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 12360822165,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HRL",
		"name": "Hormel Foods",
		"sector": "staples",
		"industry": "Packaged Foods & Meats",
		"cap": 10687812536,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CLX",
		"name": "Clorox",
		"sector": "staples",
		"industry": "Household Products",
		"cap": 10091025167,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BF-B",
		"name": "Brown–Forman",
		"sector": "staples",
		"industry": "Distillers & Vintners",
		"cap": 8e9,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "XOM",
		"name": "ExxonMobil",
		"sector": "energy",
		"industry": "Integrated Oil & Gas",
		"cap": 692857165260,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CVX",
		"name": "Chevron Corporation",
		"sector": "energy",
		"industry": "Integrated Oil & Gas",
		"cap": 417974413015,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "COP",
		"name": "ConocoPhillips",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 161207476307,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MPC",
		"name": "Marathon Petroleum",
		"sector": "energy",
		"industry": "Oil & Gas Refining & Marketing",
		"cap": 130117345688,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VLO",
		"name": "Valero Energy",
		"sector": "energy",
		"industry": "Oil & Gas Refining & Marketing",
		"cap": 127782207192,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PSX",
		"name": "Phillips 66",
		"sector": "energy",
		"industry": "Oil & Gas Refining & Marketing",
		"cap": 112364289946,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WMB",
		"name": "Williams Companies",
		"sector": "energy",
		"industry": "Oil & Gas Storage & Transportation",
		"cap": 88483934924,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EOG",
		"name": "EOG Resources",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 77897827928,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SLB",
		"name": "Schlumberger",
		"sector": "energy",
		"industry": "Oil & Gas Equipment & Services",
		"cap": 72693335454,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KMI",
		"name": "Kinder Morgan",
		"sector": "energy",
		"industry": "Oil & Gas Storage & Transportation",
		"cap": 71814367370,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TRGP",
		"name": "Targa Resources",
		"sector": "energy",
		"industry": "Oil & Gas Storage & Transportation",
		"cap": 61861205248,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "OXY",
		"name": "Occidental Petroleum",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 60258140724,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "OKE",
		"name": "Oneok",
		"sector": "energy",
		"industry": "Oil & Gas Storage & Transportation",
		"cap": 56916077233,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BKR",
		"name": "Baker Hughes",
		"sector": "energy",
		"industry": "Oil & Gas Equipment & Services",
		"cap": 55887550197,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "DVN",
		"name": "Devon Energy",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 53812e6,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FANG",
		"name": "Diamondback Energy",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 53675067983,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "EQT",
		"name": "EQT Corporation",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 33114817040,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HAL",
		"name": "Halliburton",
		"sector": "energy",
		"industry": "Oil & Gas Equipment & Services",
		"cap": 27135056053,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TPL",
		"name": "Texas Pacific Land Corporation",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 24677762084,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EXE",
		"name": "Expand Energy",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 20571426691,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "APA",
		"name": "APA Corporation",
		"sector": "energy",
		"industry": "Oil & Gas Exploration & Production",
		"cap": 15930483160,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NEE",
		"name": "NextEra Energy",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 161392134030,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CEG",
		"name": "Constellation Energy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 101002404532,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "SO",
		"name": "Southern Company",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 99103769521,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DUK",
		"name": "Duke Energy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 91100404230,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AEP",
		"name": "American Electric Power",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 66590684097,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "D",
		"name": "Dominion Energy",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 54310727351,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VST",
		"name": "Vistra Corp.",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 52406079347,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SRE",
		"name": "Sempra",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 52364339868,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ETR",
		"name": "Entergy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 47825062230,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "XEL",
		"name": "Xcel Energy",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 45823172688,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "EXC",
		"name": "Exelon",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 43075958043,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ED",
		"name": "Consolidated Edison",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 39198136812,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PEG",
		"name": "Public Service Enterprise Group",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 35806494955,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PCG",
		"name": "PG&E Corporation",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 33956999984,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WEC",
		"name": "WEC Energy Group",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 33761254573,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AEE",
		"name": "Ameren",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 28193716682,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ATO",
		"name": "Atmos Energy",
		"sector": "utilities",
		"industry": "Gas Utilities",
		"cap": 27149700925,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DTE",
		"name": "DTE Energy",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 26447993570,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FE",
		"name": "FirstEnergy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 25952000950,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PPL",
		"name": "PPL Corporation",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 25661779078,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AWK",
		"name": "American Water Works",
		"sector": "utilities",
		"industry": "Water Utilities",
		"cap": 25473081810,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CNP",
		"name": "CenterPoint Energy",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 25308033465,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ES",
		"name": "Eversource Energy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 24743764590,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NRG",
		"name": "NRG Energy",
		"sector": "utilities",
		"industry": "Independent Power Producers & Energy Traders",
		"cap": 22349578553,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EIX",
		"name": "Edison International",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 20895399060,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CMS",
		"name": "CMS Energy",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 20489130066,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NI",
		"name": "NiSource",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 19436570853,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EVRG",
		"name": "Evergy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 18565268689,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LNT",
		"name": "Alliant Energy",
		"sector": "utilities",
		"industry": "Electric Utilities",
		"cap": 16983147785,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PNW",
		"name": "Pinnacle West Capital",
		"sector": "utilities",
		"industry": "Multi-Utilities",
		"cap": 11874904987,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AES",
		"name": "AES Corporation",
		"sector": "utilities",
		"industry": "Independent Power Producers & Energy Traders",
		"cap": 10651638746,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WELL",
		"name": "Welltower",
		"sector": "realestate",
		"industry": "Health Care REITs",
		"cap": 160754953871,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PLD",
		"name": "Prologis",
		"sector": "realestate",
		"industry": "Industrial REITs",
		"cap": 122576746040,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EQIX",
		"name": "Equinix",
		"sector": "realestate",
		"industry": "Data Center REITs",
		"cap": 99772862016,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMT",
		"name": "American Tower",
		"sector": "realestate",
		"industry": "Telecom Tower REITs",
		"cap": 77689518803,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DLR",
		"name": "Digital Realty",
		"sector": "realestate",
		"industry": "Data Center REITs",
		"cap": 65152269508,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SPG",
		"name": "Simon Property Group",
		"sector": "realestate",
		"industry": "Retail REITs",
		"cap": 64584117909,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PSA",
		"name": "Public Storage",
		"sector": "realestate",
		"industry": "Self-Storage REITs",
		"cap": 53350067268,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "O",
		"name": "Realty Income",
		"sector": "realestate",
		"industry": "Retail REITs",
		"cap": 51256630848,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VMRK",
		"name": "Vivmark Residential",
		"sector": "realestate",
		"industry": "Multi-Family Residential REITs",
		"cap": 4723425e4,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VTR",
		"name": "Ventas",
		"sector": "realestate",
		"industry": "Health Care REITs",
		"cap": 41938494312,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CBRE",
		"name": "CBRE Group",
		"sector": "realestate",
		"industry": "Real Estate Services",
		"cap": 37957530062,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IRM",
		"name": "Iron Mountain",
		"sector": "realestate",
		"industry": "Other Specialized REITs",
		"cap": 33631486672,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CCI",
		"name": "Crown Castle",
		"sector": "realestate",
		"industry": "Telecom Tower REITs",
		"cap": 29309625193,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EXR",
		"name": "Extra Space Storage",
		"sector": "realestate",
		"industry": "Self-Storage REITs",
		"cap": 28124203561,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VICI",
		"name": "Vici Properties",
		"sector": "realestate",
		"industry": "Hotel & Resort REITs",
		"cap": 25093557638,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SBAC",
		"name": "SBA Communications",
		"sector": "realestate",
		"industry": "Telecom Tower REITs",
		"cap": 18036039581,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ESS",
		"name": "Essex Property Trust",
		"sector": "realestate",
		"industry": "Multi-Family Residential REITs",
		"cap": 17261217347,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "INVH",
		"name": "Invitation Homes",
		"sector": "realestate",
		"industry": "Single-Family Residential REITs",
		"cap": 15639703024,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HST",
		"name": "Host Hotels & Resorts",
		"sector": "realestate",
		"industry": "Hotel & Resort REITs",
		"cap": 15442703953,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KIM",
		"name": "Kimco Realty",
		"sector": "realestate",
		"industry": "Retail REITs",
		"cap": 14817737250,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WY",
		"name": "Weyerhaeuser",
		"sector": "realestate",
		"industry": "Timber REITs",
		"cap": 13816509120,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MAA",
		"name": "Mid-America Apartment Communities",
		"sector": "realestate",
		"industry": "Multi-Family Residential REITs",
		"cap": 13480591184,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "REG",
		"name": "Regency Centers",
		"sector": "realestate",
		"industry": "Retail REITs",
		"cap": 13089456700,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DOC",
		"name": "Healthpeak Properties",
		"sector": "realestate",
		"industry": "Health Care REITs",
		"cap": 12770044855,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CSGP",
		"name": "CoStar Group",
		"sector": "realestate",
		"industry": "Real Estate Services",
		"cap": 12078940098,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "UDR",
		"name": "UDR, Inc.",
		"sector": "realestate",
		"industry": "Multi-Family Residential REITs",
		"cap": 10784839933,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CPT",
		"name": "Camden Property Trust",
		"sector": "realestate",
		"industry": "Multi-Family Residential REITs",
		"cap": 9728187506,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BXP",
		"name": "BXP, Inc.",
		"sector": "realestate",
		"industry": "Office REITs",
		"cap": 9471123502,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FRT",
		"name": "Federal Realty Investment Trust",
		"sector": "realestate",
		"industry": "Retail REITs",
		"cap": 9163327966,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ARE",
		"name": "Alexandria Real Estate Equities",
		"sector": "realestate",
		"industry": "Office REITs",
		"cap": 7945689192,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LIN",
		"name": "Linde plc",
		"sector": "materials",
		"industry": "Industrial Gases",
		"cap": 222054144517,
		"sp": true,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "NEM",
		"name": "Newmont",
		"sector": "materials",
		"industry": "Gold",
		"cap": 121754141914,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FCX",
		"name": "Freeport-McMoRan",
		"sector": "materials",
		"industry": "Copper",
		"cap": 102158286586,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ECL",
		"name": "Ecolab",
		"sector": "materials",
		"industry": "Specialty Chemicals",
		"cap": 78965764179,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SHW",
		"name": "Sherwin-Williams",
		"sector": "materials",
		"industry": "Specialty Chemicals",
		"cap": 77932649216,
		"sp": true,
		"ndx": false,
		"dow": true
	},
	{
		"symbol": "APD",
		"name": "Air Products",
		"sector": "materials",
		"industry": "Industrial Gases",
		"cap": 61991197841,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NUE",
		"name": "Nucor",
		"sector": "materials",
		"industry": "Steel",
		"cap": 55843178891,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CRH",
		"name": "CRH plc",
		"sector": "materials",
		"industry": "Construction Materials",
		"cap": 54805512692,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MLM",
		"name": "Martin Marietta Materials",
		"sector": "materials",
		"industry": "Construction Materials",
		"cap": 34201260800,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "STLD",
		"name": "Steel Dynamics",
		"sector": "materials",
		"industry": "Steel",
		"cap": 33563138367,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VMC",
		"name": "Vulcan Materials Company",
		"sector": "materials",
		"industry": "Construction Materials",
		"cap": 31910060266,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PPG",
		"name": "PPG Industries",
		"sector": "materials",
		"industry": "Specialty Chemicals",
		"cap": 23443758e3,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SW",
		"name": "Smurfit Westrock",
		"sector": "materials",
		"industry": "Paper & Plastic Packaging Products & Materials",
		"cap": 21741474537,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IFF",
		"name": "International Flavors & Fragrances",
		"sector": "materials",
		"industry": "Specialty Chemicals",
		"cap": 21598444368,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DOW",
		"name": "Dow Inc.",
		"sector": "materials",
		"industry": "Commodity Chemicals",
		"cap": 20651720927,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PKG",
		"name": "Packaging Corporation of America",
		"sector": "materials",
		"industry": "Paper & Plastic Packaging Products & Materials",
		"cap": 20487262872,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LYB",
		"name": "LyondellBasell",
		"sector": "materials",
		"industry": "Specialty Chemicals",
		"cap": 19492110024,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMCR",
		"name": "Amcor",
		"sector": "materials",
		"industry": "Paper & Plastic Packaging Products & Materials",
		"cap": 19363037497,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CF",
		"name": "CF Industries",
		"sector": "materials",
		"industry": "Fertilizers & Agricultural Chemicals",
		"cap": 17188984805,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IP",
		"name": "International Paper",
		"sector": "materials",
		"industry": "Paper & Plastic Packaging Products & Materials",
		"cap": 16882688253,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BALL",
		"name": "Ball Corporation",
		"sector": "materials",
		"industry": "Metal, Glass & Plastic Containers",
		"cap": 15450734948,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AVY",
		"name": "Avery Dennison",
		"sector": "materials",
		"industry": "Paper & Plastic Packaging Products & Materials",
		"cap": 12703608362,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ALB",
		"name": "Albemarle Corporation",
		"sector": "materials",
		"industry": "Specialty Chemicals",
		"cap": 12048316320,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MOS",
		"name": "Mosaic Company (The)",
		"sector": "materials",
		"industry": "Fertilizers & Agricultural Chemicals",
		"cap": 6272081096,
		"sp": true,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TSM",
		"name": "Taiwan Semiconductor Manufacturing Company Ltd.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 2375367380983,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SPCX",
		"name": "Space Exploration Technologies Corp.",
		"sector": "tech",
		"industry": "Computer Software: Programming Data Processing",
		"cap": 2179387968326,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ASML",
		"name": "ASML Holding N.V. New York Registry Shares",
		"sector": "tech",
		"industry": "Industrial Machinery/Components",
		"cap": 682108329340,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ARM",
		"name": "Arm Holdings plc",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 292923770323,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "SHOP",
		"name": "Shopify Inc. Class A Subordinate Voting Shares",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 213238662274,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "NET",
		"name": "Cloudflare Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 121740093761,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SNOW",
		"name": "Snowflake Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 12115152e4,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ASX",
		"name": "ASE Technology Holding Co. Ltd. American Depositary Shares (each representing Two Common Shares)",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 100789439281,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MSTR",
		"name": "Strategy Inc Common Stock",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 63916993725,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ALAB",
		"name": "Astera Labs, Inc.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 60208005343,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "NBIS",
		"name": "Nebius Group N.V. Class A",
		"sector": "tech",
		"industry": "Computer Software: Programming Data Processing",
		"cap": 59729309947,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "TEAM",
		"name": "Atlassian Corporation",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 51531468570,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "STM",
		"name": "STMicroelectronics N.V.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 47046057861,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CRWV",
		"name": "CoreWeave, Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 44994355991,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "CRDO",
		"name": "Credo Technology Group Holding Ltd",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 39819493347,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ZS",
		"name": "Zscaler Inc.",
		"sector": "tech",
		"industry": "EDP Services",
		"cap": 35351889073,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MDB",
		"name": "MongoDB Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 29914597230,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ZM",
		"name": "Zoom Communications Inc.",
		"sector": "tech",
		"industry": "Computer Software: Programming Data Processing",
		"cap": 27623163920,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GFS",
		"name": "GlobalFoundries Inc.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 27514182244,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MTSI",
		"name": "MACOM Technology Solutions Holdings Inc.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 24607477678,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CW",
		"name": "Curtiss-Wright Corporation",
		"sector": "tech",
		"industry": "Industrial Machinery/Components",
		"cap": 18736474097,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LSCC",
		"name": "Lattice Semiconductor Corporation",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 17750943395,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "GWRE",
		"name": "Guidewire Software Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 13510751998,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DOCU",
		"name": "DocuSign Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 13350442146,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CACI",
		"name": "CACI International Inc.",
		"sector": "tech",
		"industry": "EDP Services",
		"cap": 13246498442,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AMKR",
		"name": "Amkor Technology Inc.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 12671076072,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MANH",
		"name": "Manhattan Associates Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 12056302110,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RMBS",
		"name": "Rambus Inc.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 11764830077,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HUBS",
		"name": "HubSpot Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 11560980040,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PAYC",
		"name": "Paycom Software Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 10361965208,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ESTC",
		"name": "Elastic N.V.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 10001469333,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PCOR",
		"name": "Procore Technologies Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 8324113416,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PATH",
		"name": "UiPath Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 6905309169,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ALGM",
		"name": "Allegro MicroSystems Inc.",
		"sector": "tech",
		"industry": "Semiconductors",
		"cap": 6760802208,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SAIC",
		"name": "Science Applications International Corporation",
		"sector": "tech",
		"industry": "EDP Services",
		"cap": 5434542236,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BILL",
		"name": "BILL Holdings Inc.",
		"sector": "tech",
		"industry": "Computer Software: Prepackaged Software",
		"cap": 3835749654,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EWBC",
		"name": "East West Bancorp Inc.",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 17297746820,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PNFP",
		"name": "Pinnacle Financial Partners Inc. Common stock",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 14305833629,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FHN",
		"name": "First Horizon Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 11043745553,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "UMBF",
		"name": "UMB Financial Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 9903124412,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SSB",
		"name": "SouthState Bank Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 9752728884,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WTFC",
		"name": "Wintrust Financial Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 9728592441,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CFR",
		"name": "Cullen/Frost Bankers Inc.",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 9468988883,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ONB",
		"name": "Old National Bancorp",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 9460956100,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ZION",
		"name": "Zions Bancorporation N.A.",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 9155653959,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "WAL",
		"name": "Western Alliance Bancorporation Common Stock (DE)",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 8237115232,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "COLB",
		"name": "Columbia Banking System Inc.",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 8071201706,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CBSH",
		"name": "Commerce Bancshares Inc.",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 7832831241,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BOKF",
		"name": "BOK Financial Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 7682147326,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FNB",
		"name": "F.N.B. Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 6099856796,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HWC",
		"name": "Hancock Whitney Corporation",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 5833018547,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HOMB",
		"name": "Home BancShares Inc.",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 5697413462,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ASB",
		"name": "Associated Banc-Corp",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 5431316193,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "OZK",
		"name": "Bank OZK",
		"sector": "financials",
		"industry": "Major Banks",
		"cap": 5075286882,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ARGX",
		"name": "argenx SE",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 50806542003,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RVMD",
		"name": "Revolution Medicines Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 40320966954,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ALNY",
		"name": "Alnylam Pharmaceuticals, Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 30044161265,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "BNTX",
		"name": "BioNTech SE American Depositary Share",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 23125873934,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "UTHR",
		"name": "United Therapeutics Corporation",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 22851302884,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "INSM",
		"name": "Insmed Incorporated",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 21942973421,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "EXEL",
		"name": "Exelixis Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 14624075462,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "JAZZ",
		"name": "Jazz Pharmaceuticals plc Common Stock (Ireland)",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 14440247654,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NBIX",
		"name": "Neurocrine Biosciences Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 14357946816,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SMMT",
		"name": "Summit Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 13731302597,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HALO",
		"name": "Halozyme Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 12466620320,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "MDGL",
		"name": "Madrigal Pharmaceuticals Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 11018588731,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BMRN",
		"name": "BioMarin Pharmaceutical Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 10625263632,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KRYS",
		"name": "Krystal Biotech Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 9687699023,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PCVX",
		"name": "Vaxcyte Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 9674575149,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CYTK",
		"name": "Cytokinetics Incorporated",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 8620842150,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ARWR",
		"name": "Arrowhead Pharmaceuticals Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 8579796326,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "TGTX",
		"name": "TG Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 8164703287,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IONS",
		"name": "Ionis Pharmaceuticals Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 7195781143,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RYTM",
		"name": "Rhythm Pharmaceuticals Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 6171900630,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PTCT",
		"name": "PTC Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 5221307773,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CRSP",
		"name": "CRISPR Therapeutics AG",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 4877177417,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "LEGN",
		"name": "Legend Biotech Corporation",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 3638878207,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "VKTX",
		"name": "Viking Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 3485346292,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BEAM",
		"name": "Beam Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 2540876559,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "IRON",
		"name": "Disc Medicine Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 2333133130,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RXRX",
		"name": "Recursion Pharmaceuticals Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 2114601572,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "SRPT",
		"name": "Sarepta Therapeutics Inc. Common Stock (DE)",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 1923468052,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "NTLA",
		"name": "Intellia Therapeutics Inc.",
		"sector": "health",
		"industry": "Biotechnology: In Vitro & In Vivo Diagnostic Substances",
		"cap": 1765596332,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RARE",
		"name": "Ultragenyx Pharmaceutical Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 1507423868,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DNA",
		"name": "Ginkgo Bioworks Holdings Inc.",
		"sector": "health",
		"industry": "Biotechnology: Biological Products (No Diagnostic Substances)",
		"cap": 729618741,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RCKT",
		"name": "Rocket Pharmaceuticals Inc.",
		"sector": "health",
		"industry": "Biotechnology: Pharmaceutical Preparations",
		"cap": 288707190,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "PDD",
		"name": "PDD Holdings Inc.",
		"sector": "discretionary",
		"industry": "Business Services",
		"cap": 111395007116,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "MELI",
		"name": "MercadoLibre, Inc.",
		"sector": "discretionary",
		"industry": "Business Services",
		"cap": 94126724401,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "TRI",
		"name": "Thomson Reuters Corporation",
		"sector": "discretionary",
		"industry": "Publishing",
		"cap": 4399146e4,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ONON",
		"name": "On Holding AG Class A",
		"sector": "discretionary",
		"industry": "Shoe Manufacturing",
		"cap": 20540793623,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BURL",
		"name": "Burlington Stores Inc.",
		"sector": "discretionary",
		"industry": "Department/Specialty Retail Stores",
		"cap": 17389758584,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "W",
		"name": "Wayfair Inc.",
		"sector": "discretionary",
		"industry": "Catalog/Specialty Distribution",
		"cap": 14399453199,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "DKS",
		"name": "Dick's Sporting Goods Inc",
		"sector": "discretionary",
		"industry": "Other Specialty Stores",
		"cap": 11972182234,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KMX",
		"name": "CarMax Inc",
		"sector": "discretionary",
		"industry": "Retail-Auto Dealers and Gas Stations",
		"cap": 7635103589,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CHWY",
		"name": "Chewy Inc.",
		"sector": "discretionary",
		"industry": "Catalog/Specialty Distribution",
		"cap": 7600444279,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "URBN",
		"name": "Urban Outfitters Inc.",
		"sector": "discretionary",
		"industry": "Clothing/Shoe/Accessory Stores",
		"cap": 6935048254,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ETSY",
		"name": "Etsy Inc.",
		"sector": "discretionary",
		"industry": "Business Services",
		"cap": 6896480545,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "M",
		"name": "Macy's Inc",
		"sector": "discretionary",
		"industry": "Department/Specialty Retail Stores",
		"cap": 5952215762,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AN",
		"name": "AutoNation Inc.",
		"sector": "discretionary",
		"industry": "Retail-Auto Dealers and Gas Stations",
		"cap": 5192860798,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BBWI",
		"name": "Bath & Body Works Inc.",
		"sector": "discretionary",
		"industry": "Other Specialty Stores",
		"cap": 3571138493,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AEO",
		"name": "American Eagle Outfitters Inc.",
		"sector": "discretionary",
		"industry": "Clothing/Shoe/Accessory Stores",
		"cap": 3011292794,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "RKLB",
		"name": "Rocket Lab Corporation",
		"sector": "industrials",
		"industry": "Military/Government/Technical",
		"cap": 42938766148,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "HEI",
		"name": "Heico Corporation",
		"sector": "industrials",
		"industry": "Aerospace",
		"cap": 41355613714,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "FER",
		"name": "Ferrovial N.V.",
		"sector": "industrials",
		"industry": "Military/Government/Technical",
		"cap": 36181530348,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "ENTG",
		"name": "Entegris Inc.",
		"sector": "industrials",
		"industry": "Plastic Products",
		"cap": 24782632e3,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "ONTO",
		"name": "Onto Innovation Inc.",
		"sector": "industrials",
		"industry": "Industrial Machinery/Components",
		"cap": 14362559869,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "BWXT",
		"name": "BWX Technologies Inc.",
		"sector": "industrials",
		"industry": "Industrial Machinery/Components",
		"cap": 13030477996,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "KTOS",
		"name": "Kratos Defense & Security Solutions Inc.",
		"sector": "industrials",
		"industry": "Military/Government/Technical",
		"cap": 7871155241,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "AVAV",
		"name": "AeroVironment Inc.",
		"sector": "industrials",
		"industry": "Aerospace",
		"cap": 6992928595,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "HXL",
		"name": "Hexcel Corporation",
		"sector": "industrials",
		"industry": "Major Chemicals",
		"cap": 6437824469,
		"sp": false,
		"ndx": false,
		"dow": false
	},
	{
		"symbol": "CCEP",
		"name": "Coca-Cola Europacific Partners plc",
		"sector": "staples",
		"industry": "Beverages (Production/Distribution)",
		"cap": 47050739356,
		"sp": false,
		"ndx": true,
		"dow": false
	},
	{
		"symbol": "WWD",
		"name": "Woodward Inc.",
		"sector": "energy",
		"industry": "Industrial Machinery/Components",
		"cap": 19098370479,
		"sp": false,
		"ndx": false,
		"dow": false
	}
];
var BOARDS = [
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
		"weighting": "cap",
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
				"weight": 5
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
				"weight": 2
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
				"weight": 1
			},
			{
				"symbol": "ALGM",
				"weight": .9
			},
			{
				"symbol": "MTSI",
				"weight": .8
			},
			{
				"symbol": "ONTO",
				"weight": .7
			},
			{
				"symbol": "RMBS",
				"weight": .6
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
				"weight": 2
			},
			{
				"symbol": "MPWR",
				"weight": 2
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
				"weight": 1
			},
			{
				"symbol": "ASX",
				"weight": .9
			},
			{
				"symbol": "ALAB",
				"weight": .9
			},
			{
				"symbol": "SWKS",
				"weight": .8
			},
			{
				"symbol": "CRDO",
				"weight": .8
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
				"weight": 8
			},
			{
				"symbol": "CRM",
				"weight": 7.2
			},
			{
				"symbol": "NOW",
				"weight": 6
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
				"weight": 4
			},
			{
				"symbol": "PLTR",
				"weight": 3.8
			},
			{
				"symbol": "ADSK",
				"weight": 3
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
				"weight": 2
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
				"weight": .9
			},
			{
				"symbol": "GWRE",
				"weight": .8
			},
			{
				"symbol": "PAYC",
				"weight": .7
			},
			{
				"symbol": "PATH",
				"weight": .7
			},
			{
				"symbol": "BILL",
				"weight": .6
			},
			{
				"symbol": "MANH",
				"weight": .6
			},
			{
				"symbol": "DOCU",
				"weight": .5
			},
			{
				"symbol": "ESTC",
				"weight": .5
			},
			{
				"symbol": "ZM",
				"weight": .4
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
				"weight": 6
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
				"weight": 4
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
				"weight": 2
			},
			{
				"symbol": "BOKF",
				"weight": 2
			},
			{
				"symbol": "PNFP",
				"weight": 2
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
];
function formatPrice(n) {
	if (!Number.isFinite(n)) return "—";
	return `$${n.toFixed(2)}`;
}
function formatPct(n, digits = 2) {
	if (!Number.isFinite(n)) return "—";
	return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}
function formatCap(n) {
	if (!Number.isFinite(n) || n <= 0) return "—";
	if (n >= 0xe8d4a51000) return `$${(n / 0xe8d4a51000).toFixed(2)}T`;
	if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
	if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
	return `$${n.toFixed(0)}`;
}
function marketClock(now = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}).formatToParts(now);
	const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
	const weekday = get("weekday");
	const hour = Number(get("hour"));
	const minute = Number(get("minute"));
	const second = get("second");
	const hh = get("hour");
	const mm = get("minute");
	const mins = hour * 60 + minute;
	const weekend = weekday === "Sat" || weekday === "Sun";
	let session = "closed";
	if (!weekend) {
		if (mins >= 240 && mins < 570) session = "pre";
		else if (mins >= 570 && mins < 960) session = "open";
		else if (mins >= 960 && mins < 1200) session = "post";
	}
	return {
		label: `${hh}:${mm}:${second}`,
		session
	};
}
function sessionLabel(session) {
	if (session === "open") return "Open";
	if (session === "pre") return "Pre";
	if (session === "post") return "After";
	return "Closed";
}
function heatClass(pct) {
	if (pct == null || Number.isNaN(pct)) return "bg-heat-wait";
	if (pct >= 4) return "bg-heat-up5";
	if (pct >= 2.5) return "bg-heat-up4";
	if (pct >= 1.25) return "bg-heat-up3";
	if (pct >= .4) return "bg-heat-up2";
	if (pct > .05) return "bg-heat-up1";
	if (pct >= -.05) return "bg-heat-flat";
	if (pct > -.4) return "bg-heat-dn1";
	if (pct > -1.25) return "bg-heat-dn2";
	if (pct > -2.5) return "bg-heat-dn3";
	if (pct > -4) return "bg-heat-dn4";
	return "bg-heat-dn5";
}
function worst(row, side) {
	if (!row.length || side <= 0) return Infinity;
	let sum = 0;
	let max = 0;
	let min = Infinity;
	for (const n of row) {
		sum += n.area;
		if (n.area > max) max = n.area;
		if (n.area < min) min = n.area;
	}
	if (sum <= 0) return Infinity;
	const sum2 = sum * sum;
	const side2 = side * side;
	return Math.max(side2 * max / sum2, sum2 / (side2 * min));
}
/** Squarified treemap. `value` is a weight, not a pixel area. */
function treemap(items, bounds) {
	if (bounds.w < 1 || bounds.h < 1) return [];
	const clean = items.filter((i) => i.value > 0);
	const total = clean.reduce((s, i) => s + i.value, 0);
	if (!total) return [];
	const field = bounds.w * bounds.h;
	const nodes = clean.map((i) => ({
		id: i.id,
		area: i.value / total * field
	})).sort((a, b) => b.area - a.area);
	const rects = [];
	let cx = bounds.x;
	let cy = bounds.y;
	let cw = bounds.w;
	let ch = bounds.h;
	let rest = nodes;
	while (rest.length && cw > .5 && ch > .5) {
		const side = Math.min(cw, ch);
		const row = [];
		let rowArea = 0;
		for (const n of rest) {
			const next = row.concat(n);
			if (row.length === 0 || worst(next, side) <= worst(row, side)) {
				row.push(n);
				rowArea += n.area;
			} else break;
		}
		if (!row.length) break;
		rest = rest.slice(row.length);
		if (cw >= ch) {
			const width = Math.min(cw, rowArea / ch);
			let y = cy;
			for (let i = 0; i < row.length; i++) {
				const n = row[i];
				const h = i === row.length - 1 ? cy + ch - y : n.area / width;
				rects.push({
					id: n.id,
					x: cx,
					y,
					w: width,
					h: Math.max(0, h)
				});
				y += h;
			}
			cx += width;
			cw -= width;
		} else {
			const height = Math.min(ch, rowArea / cw);
			let x = cx;
			for (let i = 0; i < row.length; i++) {
				const n = row[i];
				const w = i === row.length - 1 ? cx + cw - x : n.area / height;
				rects.push({
					id: n.id,
					x,
					y: cy,
					w: Math.max(0, w),
					h: height
				});
				x += w;
			}
			cy += height;
			ch -= height;
		}
	}
	return rects;
}
/** Sector blocks, each with its own squarified children and a label strip. */
function treemapGrouped(groups, bounds) {
	const parents = groups.map((g) => ({
		id: g.id,
		value: g.children.reduce((s, c) => s + Math.max(0, c.value), 0),
		children: g.children
	})).filter((g) => g.value > 0);
	const sectorRects = treemap(parents.map((g) => ({
		id: g.id,
		value: g.value
	})), bounds);
	const byId = new Map(parents.map((g) => [g.id, g]));
	const tiles = [];
	const headers = [];
	const gutter = 3;
	for (const sr of sectorRects) {
		const g = byId.get(sr.id);
		if (!g) continue;
		const inner = {
			x: sr.x + gutter / 2,
			y: sr.y + gutter / 2,
			w: Math.max(0, sr.w - gutter),
			h: Math.max(0, sr.h - gutter)
		};
		const show = inner.w >= 52 && inner.h >= 28;
		const reserve = show && inner.h >= 52 && inner.w >= 68;
		const headH = reserve ? Math.min(22, inner.h * .28) : 0;
		if (show) headers.push({
			id: g.id,
			x: inner.x,
			y: inner.y,
			w: inner.w,
			h: reserve ? headH : Math.min(18, inner.h),
			overlay: !reserve
		});
		const childBox = reserve ? {
			x: inner.x,
			y: inner.y + headH,
			w: inner.w,
			h: Math.max(0, inner.h - headH)
		} : inner;
		tiles.push(...treemap(g.children, childBox));
	}
	return {
		tiles,
		headers
	};
}
function Mark({ symbol, size }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	if (failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid place-items-center rounded-full bg-surface-2 font-semibold text-ink",
		style: {
			width: size,
			height: size,
			fontSize: Math.max(10, size * .34)
		},
		children: symbol.slice(0, 1)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: `https://assets.parqet.com/logos/symbol/${encodeURIComponent(symbol)}`,
		alt: "",
		width: size,
		height: size,
		decoding: "async",
		loading: "lazy",
		className: "rounded-full bg-bg object-cover",
		style: {
			width: size,
			height: size
		},
		onError: () => setFailed(true)
	});
}
var GAP = 1.5;
function fitSize(text, width, preferred) {
	const cap = Math.floor((width - 8) / Math.max(text.length, 1) / .62);
	return Math.max(0, Math.min(preferred, cap));
}
function Tile({ rect, node, quote, selected, onSelect }) {
	const w = rect.w - GAP * 2;
	const h = rect.h - GAP * 2;
	if (w < 2 || h < 2) return null;
	const wide = w > h * 1.65 && h < 72;
	const showLogo = !wide && w >= 74 && h >= 108;
	const showPrice = Boolean(quote) && w >= 58 && h >= (showLogo ? 96 : 64);
	const showPct = Boolean(quote) && w >= 40 && h >= 36;
	const tickerPreferred = showLogo ? Math.min(26, h * .16) : Math.min(22, Math.max(h, 12) * .34);
	const tickerSize = fitSize(node.symbol, w, tickerPreferred);
	const showTicker = tickerSize >= 9;
	const priceSize = Math.max(10, Math.min(16, tickerSize * .72));
	const pctSize = Math.max(10, Math.min(15, showPrice ? priceSize : tickerSize * .86));
	const logo = Math.max(28, Math.min(64, Math.min(w * .42, h * .28)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		tabIndex: w >= 64 && h >= 48 ? 0 : -1,
		"aria-label": `${node.symbol}${quote ? ` ${formatPrice(quote.price)} ${formatPct(quote.changePercent)}` : ""}`,
		onClick: () => onSelect(node.symbol),
		className: `tile-ink absolute overflow-hidden text-ink ${heatClass(quote?.changePercent ?? null)} ${selected ? "tile-selected" : ""}`,
		style: {
			left: rect.x + GAP,
			top: rect.y + GAP,
			width: w,
			height: h
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `flex h-full w-full items-center justify-center px-1 ${wide ? "flex-row gap-1.5" : "flex-col gap-0.5"}`,
			children: [
				showLogo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
					symbol: node.symbol,
					size: logo
				}) : null,
				showTicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "max-w-full truncate font-semibold leading-none tracking-tight",
					style: { fontSize: tickerSize },
					children: node.symbol
				}) : null,
				showPrice && quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono leading-none opacity-80",
					style: { fontSize: priceSize },
					children: formatPrice(quote.price)
				}) : null,
				showPct && quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono leading-none",
					style: { fontSize: pctSize },
					children: formatPct(quote.changePercent, w < 70 ? 1 : 2)
				}) : null
			]
		})
	});
}
var Heatmap = (0, import_react.memo)(function Heatmap({ nodes, quotes, grouped, selected, onSelect, onDrill }) {
	const ref = (0, import_react.useRef)(null);
	const [size, setSize] = (0, import_react.useState)({
		w: 0,
		h: 0
	});
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const measure = () => {
			const rect = el.getBoundingClientRect();
			setSize({
				w: rect.width,
				h: rect.height
			});
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const layout = (0, import_react.useMemo)(() => {
		if (size.w < 2 || size.h < 2 || !nodes.length) return {
			tiles: [],
			headers: []
		};
		const bounds = {
			x: 0,
			y: 0,
			w: size.w,
			h: size.h
		};
		if (!grouped) return {
			tiles: treemap(nodes.map((node) => ({
				id: node.symbol,
				value: node.weight
			})), bounds),
			headers: []
		};
		const groups = /* @__PURE__ */ new Map();
		for (const node of nodes) {
			const list = groups.get(node.sector) ?? [];
			list.push({
				id: node.symbol,
				value: node.weight
			});
			groups.set(node.sector, list);
		}
		return treemapGrouped([...groups.entries()].map(([id, children]) => ({
			id,
			children
		})), bounds);
	}, [
		nodes,
		size.w,
		size.h,
		grouped
	]);
	const bySymbol = (0, import_react.useMemo)(() => new Map(nodes.map((node) => [node.symbol, node])), [nodes]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative h-full w-full",
		children: [layout.tiles.map((rect) => {
			const node = bySymbol.get(rect.id);
			if (!node) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
				rect,
				node,
				quote: quotes[rect.id],
				selected: selected === rect.id,
				onSelect
			}, rect.id);
		}), layout.headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onDrill(header.id),
			className: `absolute z-10 flex items-center gap-0.5 truncate px-1 text-left text-xs font-semibold tracking-wide text-fg ${header.overlay ? "tile-ink" : ""}`,
			style: {
				left: header.x,
				top: header.y,
				width: header.w,
				height: header.h
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: sectorLabel(header.id)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				className: "size-3.5 shrink-0 opacity-80",
				"aria-hidden": "true"
			})]
		}, header.id))]
	});
});
var BY_SYMBOL = new Map(LISTINGS.map((row) => [row.symbol, row]));
var CLASS_SHARE = {
	GOOGL: .46,
	GOOG: .54,
	FOXA: .64,
	FOX: .36,
	NWSA: .72,
	NWS: .28
};
function sizedCap(symbol, cap) {
	return Math.max(cap, 1) * (CLASS_SHARE[symbol] ?? 1);
}
function normalizeSymbol(raw) {
	return raw.trim().toUpperCase().replace(/\./g, "-").replace(/[^A-Z0-9-]/g, "").slice(0, 10);
}
function findListing(symbol) {
	return BY_SYMBOL.get(normalizeSymbol(symbol));
}
function syntheticListing(symbol) {
	const normalized = normalizeSymbol(symbol);
	return {
		symbol: normalized,
		name: normalized,
		sector: "other",
		industry: "",
		cap: 0,
		sp: false,
		ndx: false,
		dow: false
	};
}
function boardById(id) {
	return BOARDS.find((board) => board.id === id) ?? BOARDS[0];
}
function boardNodes(board) {
	if (board.lines?.length) {
		const nodes = [];
		for (const line of board.lines) {
			const listing = BY_SYMBOL.get(line.symbol) ?? syntheticListing(line.symbol);
			const weight = board.weighting === "cap" ? sizedCap(listing.symbol, listing.cap) : board.weighting === "equal" ? 1 : line.weight;
			if (weight <= 0) continue;
			nodes.push({
				symbol: listing.symbol,
				name: listing.name,
				sector: listing.sector,
				industry: listing.industry,
				cap: listing.cap,
				weight
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
		weight: sizedCap(listing.symbol, listing.cap)
	}));
}
function matchesQuery(node, query) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return `${node.symbol} ${node.name} ${node.industry}`.toLowerCase().includes(q);
}
function matchesMove(pct, filter) {
	if (filter === "all") return true;
	if (pct == null || Number.isNaN(pct)) return false;
	if (filter === "up") return pct > .05;
	if (filter === "down") return pct < -.05;
	if (filter === "m1") return Math.abs(pct) >= 1;
	if (filter === "m2") return Math.abs(pct) >= 2;
	return true;
}
function weightedChange(nodes, quotes) {
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
function suggestListings(query, limit = 6) {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	const starts = [];
	const rest = [];
	for (const listing of LISTINGS) {
		const symbol = listing.symbol.toLowerCase();
		const name = listing.name.toLowerCase();
		if (symbol.startsWith(q)) starts.push(listing);
		else if (symbol.includes(q) || name.includes(q)) rest.push(listing);
		if (starts.length >= limit) break;
	}
	return [...starts, ...rest].slice(0, limit);
}
function patchActive(books, activeId, edit) {
	return books.map((book) => book.id === activeId ? edit(book) : book);
}
var useBooks = create()(persist((set, get) => ({
	books: [{
		id: "main",
		name: "Main",
		lines: [],
		notional: null
	}],
	activeId: "main",
	setActive: (id) => set({ activeId: id }),
	rename: (name) => set({ books: patchActive(get().books, get().activeId, (book) => ({
		...book,
		name: name.slice(0, 28) || book.name
	})) }),
	setNotional: (notional) => set({ books: patchActive(get().books, get().activeId, (book) => ({
		...book,
		notional
	})) }),
	newBook: () => {
		const id = Math.random().toString(36).slice(2, 8);
		const count = get().books.length + 1;
		set({
			books: [...get().books, {
				id,
				name: `Book ${count}`,
				lines: [],
				notional: null
			}],
			activeId: id
		});
	},
	removeActive: () => {
		const { books, activeId } = get();
		if (books.length === 1) {
			set({ books: [{
				...books[0],
				lines: [],
				notional: null,
				name: "Main"
			}] });
			return;
		}
		const next = books.filter((book) => book.id !== activeId);
		set({
			books: next,
			activeId: next[0].id
		});
	},
	upsert: (symbol, weight) => {
		const normalized = normalizeSymbol(symbol);
		if (!normalized) return;
		const safe = Number.isFinite(weight) ? Math.min(100, Math.max(0, weight)) : 0;
		set({ books: patchActive(get().books, get().activeId, (book) => {
			const lines = book.lines.some((line) => line.symbol === normalized) ? book.lines.map((line) => line.symbol === normalized ? {
				...line,
				weight: safe
			} : line) : [...book.lines, {
				symbol: normalized,
				weight: safe
			}];
			return {
				...book,
				lines
			};
		}) });
	},
	removeLine: (symbol) => set({ books: patchActive(get().books, get().activeId, (book) => ({
		...book,
		lines: book.lines.filter((line) => line.symbol !== normalizeSymbol(symbol))
	})) }),
	equalize: () => set({ books: patchActive(get().books, get().activeId, (book) => {
		if (!book.lines.length) return book;
		const weight = 100 / book.lines.length;
		return {
			...book,
			lines: book.lines.map((line) => ({
				...line,
				weight
			}))
		};
	}) }),
	normalize: () => set({ books: patchActive(get().books, get().activeId, (book) => {
		const sum = book.lines.reduce((total, line) => total + line.weight, 0);
		if (sum <= 0) return book;
		return {
			...book,
			lines: book.lines.map((line) => ({
				...line,
				weight: line.weight / sum * 100
			}))
		};
	}) })
}), { name: "lattice-books-v1" }));
function activeBook(state) {
	return state.books.find((book) => book.id === state.activeId) ?? state.books[0];
}
function Sheet({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "scrim absolute inset-0",
			"aria-label": "Close",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			className: "sheet-panel safe-b relative flex max-h-[min(86dvh,760px)] w-full max-w-lg flex-col rounded-t-2xl border border-line bg-surface",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-2",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-10 rounded-full bg-line" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 px-4 pb-2 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold tracking-tight",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "grid size-11 place-items-center rounded-xl text-muted",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4",
					children
				})
			]
		})]
	});
}
var FILTERS = [
	{
		id: "all",
		label: "All names",
		hint: "Full map"
	},
	{
		id: "up",
		label: "Advancers",
		hint: "Today is green"
	},
	{
		id: "down",
		label: "Decliners",
		hint: "Today is red"
	},
	{
		id: "m1",
		label: "Move ≥ 1%",
		hint: "Either direction"
	},
	{
		id: "m2",
		label: "Move ≥ 2%",
		hint: "The loud ones"
	}
];
function FilterSheet({ filter, onChange, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		title: "Filter",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: FILTERS.map((item) => {
				const on = item.id === filter;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						onChange(item.id);
						onClose();
					},
					className: `flex h-14 items-center justify-between rounded-xl border px-3 text-left ${on ? "border-up bg-surface-2" : "border-line"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: item.hint
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 rounded-full ${on ? "bg-up" : "bg-line"}` })]
				}, item.id);
			})
		})
	});
}
function InfoSheet({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		title: "How to read LATTICE",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 text-sm leading-relaxed text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Color is today’s move."
				}), " Dark green is barely up, bright green is a strong up day. Rose is the same scale on the downside."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Size is weight."
				}), " On the S&P 500, Nasdaq 100, Dow, and the sector ETFs (XLK, XLF, XLE, and the rest), tile area is market cap. That is close to how the SPDR sector funds look, not a copy of the official daily basket file."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Thematic baskets are approximate."
				}), " SOXX, SMH, IGV, and KRE use a fixed weight mix. XBI and XRT are equal weight. IBB and ITA are sized by market cap inside the basket. Prices are live; the weights are not the fund’s latest official holdings."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Tap a sector name"
				}), " on the S&P or Nasdaq map to open that sector full screen. Tap a stock for the print and to drop it into your book."] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "Your book"
				}), " is sized by the weights you type. The number under the title is the weighted average of today’s moves. Weights are saved on this device."] })
			]
		})
	});
}
function BoardSheet({ boardId, bookName, bookCount, onPick, onBook, onInfo, onClose }) {
	const counts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const board of BOARDS) map.set(board.id, boardNodes(board).length);
		return map;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "Markets",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-xs font-semibold tracking-wide text-muted",
					children: "Your book"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onBook,
					className: `flex h-14 w-full items-center justify-between rounded-xl border px-3 text-left ${boardId === "book" ? "border-up bg-surface-2" : "border-line"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold",
						children: bookName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: bookCount === 0 ? "Empty · add weights" : `${bookCount} ${bookCount === 1 ? "name" : "names"} · your weights`
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 rounded-full ${boardId === "book" ? "bg-up" : "bg-line"}` })]
				})]
			}),
			[
				"Index",
				"Sector ETF",
				"Thematic"
			].map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-xs font-semibold tracking-wide text-muted",
					children: group
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: BOARDS.filter((board) => board.group === group).map((board) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardRow, {
						board,
						count: counts.get(board.id) ?? 0,
						active: board.id === boardId,
						onPick: () => onPick(board.id)
					}, board.id))
				})]
			}, group)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onInfo,
				className: "mb-2 h-11 text-sm font-medium text-fg",
				children: "How to read this map"
			})
		]
	});
}
function BoardRow({ board, count, active, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onPick,
		className: `flex h-14 w-full items-center justify-between rounded-xl border px-3 text-left ${active ? "border-up bg-surface-2" : "border-line"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "block truncate text-sm font-semibold",
				children: [board.title, board.name !== board.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-normal text-muted",
					children: [" · ", board.name]
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "block text-xs text-muted",
				children: [count, " names"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 shrink-0 rounded-full ${active ? "bg-up" : "bg-line"}` })]
	});
}
function StockSheet({ symbol, quote, node, book, canDrill, onDrill, onClose }) {
	const listing = findListing(symbol) ?? {
		...syntheticListing(symbol),
		name: node?.name ?? symbol,
		sector: node?.sector ?? "other",
		industry: node?.industry ?? "",
		cap: node?.cap ?? 0
	};
	const held = book.lines.find((line) => line.symbol === symbol);
	const [weight, setWeight] = (0, import_react.useState)(held ? String(round1(held.weight)) : "5");
	const upsert = useBooks((s) => s.upsert);
	const removeLine = useBooks((s) => s.removeLine);
	const sector = node?.sector ?? listing.sector;
	const up = (quote?.changePercent ?? 0) >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: symbol,
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
					symbol,
					size: 56
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-lg font-semibold",
						children: listing.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm text-muted",
						children: [sectorLabel(sector), listing.industry ? ` · ${listing.industry}` : ""]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-mono text-3xl font-medium tracking-tight",
				children: quote ? formatPrice(quote.price) : "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-1 font-mono text-sm ${quote ? up ? "text-up" : "text-down" : "text-muted"}`,
				children: quote ? `${quote.change > 0 ? "+" : ""}${quote.change.toFixed(2)}  ${formatPct(quote.changePercent)}` : "Waiting on the tape"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid grid-cols-2 gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs text-muted",
					children: "Market cap"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "font-mono",
					children: formatCap(listing.cap)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
					className: "text-xs text-muted",
					children: ["In ", book.name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "font-mono",
					children: held ? `${round1(held.weight)}%` : "Not held"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-5 block text-xs font-medium text-muted",
				htmlFor: "weight",
				children: ["Weight in ", book.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "weight",
					inputMode: "decimal",
					value: weight,
					onChange: (event) => setWeight(event.target.value),
					className: "h-12 w-28 rounded-xl border border-line bg-bg px-3 font-mono text-base"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-12 flex-1 rounded-xl bg-fg font-semibold text-bg",
					onClick: () => {
						const next = Number(weight);
						if (!Number.isFinite(next)) return;
						upsert(symbol, next);
						onClose();
					},
					children: held ? "Update weight" : "Add to book"
				})]
			}),
			held ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-3 h-11 w-full text-sm font-medium text-down",
				onClick: () => {
					removeLine(symbol);
					onClose();
				},
				children: "Remove from book"
			}) : null,
			canDrill ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mt-2 h-11 w-full text-sm font-medium text-fg",
				onClick: () => onDrill(sector),
				children: ["Open ", sectorLabel(sector)]
			}) : null
		]
	});
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function BookSheet({ onClose }) {
	const books = useBooks((s) => s.books);
	const book = activeBook({
		books,
		activeId: useBooks((s) => s.activeId)
	});
	const rename = useBooks((s) => s.rename);
	const setNotional = useBooks((s) => s.setNotional);
	const upsert = useBooks((s) => s.upsert);
	const removeLine = useBooks((s) => s.removeLine);
	const equalize = useBooks((s) => s.equalize);
	const normalize = useBooks((s) => s.normalize);
	const newBook = useBooks((s) => s.newBook);
	const removeActive = useBooks((s) => s.removeActive);
	const setActive = useBooks((s) => s.setActive);
	const [draft, setDraft] = (0, import_react.useState)("");
	const ideas = suggestListings(draft);
	const sum = book.lines.reduce((total, line) => total + line.weight, 0);
	const add = (raw) => {
		const symbol = normalizeSymbol(raw);
		if (!symbol) return;
		const exists = book.lines.some((line) => line.symbol === symbol);
		upsert(symbol, exists ? book.lines.find((line) => line.symbol === symbol)?.weight ?? 5 : book.lines.length ? 5 : 100);
		setDraft("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "Portfolio",
		onClose,
		children: [
			books.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex gap-2 overflow-x-auto",
				children: books.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(item.id),
					className: `h-9 shrink-0 rounded-full border px-3 text-sm ${item.id === book.id ? "border-up bg-surface-2" : "border-line text-muted"}`,
					children: item.name
				}, item.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-medium text-muted",
				htmlFor: "book-name",
				children: "Name"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "book-name",
				value: book.name,
				onChange: (event) => rename(event.target.value),
				className: "mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 text-base"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `mt-3 font-mono text-sm ${Math.abs(sum - 100) < .2 ? "text-muted" : "text-fg"}`,
				children: [
					"Weights sum to ",
					sum.toFixed(1),
					"%",
					Math.abs(sum - 100) >= .2 ? " · map uses relative size" : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: equalize,
					className: "h-11 flex-1 rounded-xl border border-line text-sm font-medium",
					children: "Equal weight"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: normalize,
					className: "h-11 flex-1 rounded-xl border border-line text-sm font-medium",
					children: "Scale to 100%"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-col gap-2",
				children: book.lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: line.symbol
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted",
								children: findListing(line.symbol)?.name ?? "Custom ticker"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							"aria-label": `${line.symbol} weight`,
							defaultValue: String(round1(line.weight)),
							onBlur: (event) => {
								const next = Number(event.target.value);
								if (Number.isFinite(next)) upsert(line.symbol, next);
							},
							className: "h-11 w-20 rounded-xl border border-line bg-bg px-2 text-right font-mono"
						}, `${line.symbol}-${round1(line.weight)}`),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Remove ${line.symbol}`,
							onClick: () => removeLine(line.symbol),
							className: "grid size-11 place-items-center rounded-xl text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				}, line.symbol))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-xs font-medium text-muted",
				htmlFor: "add-ticker",
				children: "Add ticker"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "add-ticker",
					value: draft,
					onChange: (event) => setDraft(event.target.value.toUpperCase()),
					onKeyDown: (event) => {
						if (event.key === "Enter") add(draft);
					},
					placeholder: "NVDA",
					className: "h-12 min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 font-mono uppercase"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => add(draft),
					className: "h-12 rounded-xl bg-fg px-4 font-semibold text-bg",
					children: "Add"
				})]
			}),
			ideas.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-col",
				children: ideas.map((idea) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => add(idea.symbol),
					className: "flex h-11 items-center justify-between text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: idea.symbol
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate pl-3 text-muted",
						children: idea.name
					})]
				}, idea.symbol))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-4 block text-xs font-medium text-muted",
				htmlFor: "notional",
				children: "Book size, optional $"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "notional",
				inputMode: "decimal",
				defaultValue: book.notional ?? "",
				placeholder: "100000",
				onBlur: (event) => {
					const raw = event.target.value.trim();
					if (!raw) {
						setNotional(null);
						return;
					}
					const next = Number(raw.replace(/,/g, ""));
					setNotional(Number.isFinite(next) && next > 0 ? next : null);
				},
				className: "mt-1 h-12 w-full rounded-xl border border-line bg-bg px-3 font-mono"
			}, book.id),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: "Used only to turn the weighted % into dollars. Nothing is sent anywhere."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: newBook,
					className: "h-11 text-sm font-medium text-fg",
					children: "New book"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: removeActive,
					className: "h-11 text-sm font-medium text-down",
					children: books.length === 1 ? "Clear book" : "Delete book"
				})]
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function parseSymbols(input) {
	const obj = input && typeof input === "object" ? input : {};
	const raw = Array.isArray(obj.symbols) ? obj.symbols : [];
	return {
		symbols: Array.from(new Set(raw.map((s) => String(s).trim().toUpperCase().replace(/\./g, "-")).filter((s) => /^[A-Z0-9-]{1,10}$/.test(s)))).slice(0, 600),
		fresh: obj.fresh === true
	};
}
var fetchQuotes = createServerFn({ method: "POST" }).validator((input) => parseSymbols(input)).handler(createSsrRpc("ffeab3a1fc1a85f5586c5acce8307b924aead8df42092b0e1e44869a676aba2b"));
var STORAGE = "lattice-quotes-v1";
function useQuotes(symbols, refreshToken) {
	const key = symbols.filter(Boolean).join("|");
	const [quotes, setQuotes] = (0, import_react.useState)({});
	const [asOf, setAsOf] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	(0, import_react.useEffect)(() => {
		try {
			const raw = sessionStorage.getItem(STORAGE);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (!parsed.quotes || !parsed.at || Date.now() - parsed.at > 6e5) return;
			setQuotes(parsed.quotes);
			setAsOf(parsed.at);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!key) {
			setStatus("idle");
			return;
		}
		const list = key.split("|");
		let cancel = false;
		const pull = async (batch, fresh) => {
			if (!batch.length || cancel) return;
			const res = await fetchQuotes({ data: {
				symbols: batch,
				fresh
			} });
			if (cancel) return;
			setQuotes((prev) => {
				const next = { ...prev };
				for (const quote of res.quotes) next[quote.symbol] = quote;
				try {
					sessionStorage.setItem(STORAGE, JSON.stringify({
						at: res.asOf,
						quotes: next
					}));
				} catch {}
				return next;
			});
			setAsOf(res.asOf);
			setStatus("live");
		};
		const load = async (fresh) => {
			setStatus((current) => current === "live" ? "live" : "loading");
			const batches = [
				list.slice(0, 40),
				list.slice(40, 180),
				list.slice(180)
			];
			let any = false;
			let failed = false;
			for (const batch of batches) {
				if (cancel || !batch.length) continue;
				try {
					await pull(batch, fresh && !any);
					any = true;
				} catch {
					failed = true;
				}
			}
			if (!cancel && !any && failed) setStatus("error");
		};
		load(refreshToken > 0);
		const timer = window.setInterval(() => void load(false), 45e3);
		return () => {
			cancel = true;
			window.clearInterval(timer);
		};
	}, [key, refreshToken]);
	return {
		quotes,
		asOf,
		status
	};
}
function formatDollars(n) {
	return `${n > 0 ? "+" : n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
function Lattice() {
	const [boardId, setBoardId] = (0, import_react.useState)("spx");
	const [drill, setDrill] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [sheet, setSheet] = (0, import_react.useState)(null);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [refreshToken, setRefreshToken] = (0, import_react.useState)(0);
	const [clock, setClock] = (0, import_react.useState)(null);
	const searchRef = (0, import_react.useRef)(null);
	const book = activeBook({
		books: useBooks((s) => s.books),
		activeId: useBooks((s) => s.activeId)
	});
	const board = boardById(boardId);
	const bookMode = boardId === "book";
	const baseNodes = (0, import_react.useMemo)(() => {
		if (bookMode) return book.lines.filter((line) => line.weight > 0).map((line) => {
			const listing = findListing(line.symbol) ?? syntheticListing(line.symbol);
			return {
				symbol: listing.symbol,
				name: listing.name,
				sector: listing.sector,
				industry: listing.industry,
				cap: listing.cap,
				weight: line.weight
			};
		});
		return boardNodes(board);
	}, [
		bookMode,
		book.lines,
		board
	]);
	const { quotes, status } = useQuotes((0, import_react.useMemo)(() => [...baseNodes].sort((a, b) => b.weight - a.weight).map((node) => node.symbol), [baseNodes]), refreshToken);
	const visible = (0, import_react.useMemo)(() => {
		return baseNodes.filter((node) => {
			if (drill && node.sector !== drill) return false;
			if (!matchesQuery(node, query)) return false;
			return matchesMove(quotes[node.symbol]?.changePercent ?? null, filter);
		});
	}, [
		baseNodes,
		drill,
		query,
		filter,
		quotes
	]);
	const sectorCount = (0, import_react.useMemo)(() => new Set(visible.map((node) => node.sector)).size, [visible]);
	const grouped = !bookMode && board.grouped && !drill && !query && sectorCount > 1 && visible.length > 24;
	const move = weightedChange(visible.length ? visible : baseNodes, quotes);
	const quoted = visible.filter((node) => quotes[node.symbol]);
	const ups = quoted.filter((node) => (quotes[node.symbol]?.changePercent ?? 0) > .05).length;
	const downs = quoted.filter((node) => (quotes[node.symbol]?.changePercent ?? 0) < -.05).length;
	const title = bookMode ? book.name : drill ? sectorLabel(drill) : board.title;
	const subtitle = bookMode ? "Your weights" : drill ? board.title : board.name !== board.title ? board.name : "";
	(0, import_react.useEffect)(() => {
		const tick = () => setClock(marketClock());
		tick();
		const timer = window.setInterval(tick, 1e3);
		return () => window.clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		document.title = `${title} · LATTICE`;
	}, [title]);
	(0, import_react.useEffect)(() => {
		if (searchOpen) searchRef.current?.focus();
	}, [searchOpen]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const tag = event.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (event.key === "Escape") {
				if (sheet) setSheet(null);
				else if (drill) setDrill(null);
				else if (searchOpen) setSearchOpen(false);
			} else if (event.key === "/" && !sheet) {
				event.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		sheet,
		drill,
		searchOpen
	]);
	const onSelect = (0, import_react.useCallback)((symbol) => {
		setSelected(symbol);
		setSheet("stock");
	}, []);
	const onDrill = (0, import_react.useCallback)((sector) => {
		setDrill(sector);
		setSheet(null);
	}, []);
	const session = clock?.session ?? "closed";
	const pnl = bookMode && book.notional && move != null ? book.notional * move / 100 : null;
	const showMap = visible.length > 0;
	const bookEmpty = bookMode && book.lines.filter((line) => line.weight > 0).length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "safe-t shrink-0 px-2 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							drill ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDrill(null),
								className: "grid size-11 shrink-0 place-items-center rounded-xl",
								"aria-label": "Back to full map",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRefreshToken((n) => n + 1),
								className: "flex h-11 shrink-0 items-center gap-2 rounded-xl px-2",
								"aria-label": "Refresh quotes",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${session === "open" ? "bg-up" : "bg-muted"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-mono text-sm ${session === "open" ? "text-up" : "text-muted"}`,
									children: clock?.label ?? "--:--:--"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 text-center",
								children: [drill ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-base font-semibold tracking-tight",
									children: title
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSheet("boards"),
									className: "inline-flex max-w-full items-center justify-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-base font-semibold tracking-tight",
										children: title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-muted" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `font-mono text-sm font-medium ${move == null ? "text-muted" : move >= 0 ? "text-up" : "text-down"}`,
									children: [move == null ? status === "error" ? "Tape delayed" : "Loading tape" : formatPct(move), pnl != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-fg",
										children: [" · ", formatDollars(pnl)]
									}) : null]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Search",
								"aria-pressed": searchOpen,
								onClick: () => setSearchOpen((open) => !open),
								className: "grid size-11 shrink-0 place-items-center rounded-xl bg-surface",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": "Filter",
								onClick: () => setSheet("filter"),
								className: "relative grid size-11 shrink-0 place-items-center rounded-xl bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-5" }), filter !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 size-1.5 rounded-full bg-up" }) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate px-2 text-center text-xs text-muted",
						children: [
							subtitle ? `${subtitle} · ` : "",
							sessionLabel(session),
							quoted.length ? ` · ${ups} up · ${downs} down` : "",
							bookMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-medium text-fg",
								onClick: () => setSheet("book"),
								children: "Edit weights"
							})] }) : null
						]
					}),
					searchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: searchRef,
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Ticker, name, or industry",
							"aria-label": "Search the map",
							className: "h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 text-sm"
						}), query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-2 text-sm text-muted",
							onClick: () => setQuery(""),
							children: "Clear"
						}) : null]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1",
				children: bookEmpty ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center gap-3 px-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold",
							children: "Build a book"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-xs text-sm leading-relaxed text-muted",
							children: "Add tickers and a weight for each. Tile size follows the weight. Color is today’s move."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSheet("book"),
							className: "h-12 rounded-xl bg-fg px-5 font-semibold text-bg",
							children: "Add positions"
						})
					]
				}) : showMap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heatmap, {
					nodes: visible,
					quotes,
					grouped,
					selected: sheet === "stock" ? selected : null,
					onSelect,
					onDrill
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center gap-3 px-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold",
							children: "Nothing in this cut"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Try another filter or a shorter search."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-xl border border-line px-4 text-sm font-medium",
							onClick: () => {
								setFilter("all");
								setQuery("");
							},
							children: "Clear filters"
						})
					]
				})
			}),
			sheet === "boards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardSheet, {
				boardId,
				bookName: book.name,
				bookCount: book.lines.length,
				onPick: (id) => {
					setBoardId(id);
					setDrill(null);
					setSheet(null);
				},
				onBook: () => {
					setBoardId("book");
					setDrill(null);
					setSheet(null);
				},
				onInfo: () => setSheet("info"),
				onClose: () => setSheet(null)
			}) : null,
			sheet === "filter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterSheet, {
				filter,
				onChange: setFilter,
				onClose: () => setSheet(null)
			}) : null,
			sheet === "info" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoSheet, { onClose: () => setSheet(null) }) : null,
			sheet === "book" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookSheet, { onClose: () => setSheet(null) }) : null,
			sheet === "stock" && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockSheet, {
				symbol: selected,
				quote: quotes[selected],
				node: baseNodes.find((node) => node.symbol === selected) ?? visible.find((node) => node.symbol === selected),
				book,
				canDrill: !bookMode && board.grouped && !drill,
				onDrill,
				onClose: () => setSheet(null)
			}, selected) : null
		]
	});
}
var SplitComponent = Lattice;
//#endregion
export { SplitComponent as component };
