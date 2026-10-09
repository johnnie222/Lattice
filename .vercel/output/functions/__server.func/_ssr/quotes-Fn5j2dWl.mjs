import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotes-Fn5j2dWl.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var cache = /* @__PURE__ */ new Map();
var TTL_MS = 2e4;
var CHUNK = 20;
function parseSymbols(input) {
	const obj = input && typeof input === "object" ? input : {};
	const raw = Array.isArray(obj.symbols) ? obj.symbols : [];
	return {
		symbols: Array.from(new Set(raw.map((s) => String(s).trim().toUpperCase().replace(/\./g, "-")).filter((s) => /^[A-Z0-9-]{1,10}$/.test(s)))).slice(0, 600),
		fresh: obj.fresh === true
	};
}
function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
async function fetchChunk(symbols) {
	const url = `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols.join(",")}&range=1d&interval=1d`;
	let last = "quote failed";
	for (let attempt = 0; attempt < 3; attempt++) {
		const res = await fetch(url, {
			headers: {
				"User-Agent": "Mozilla/5.0",
				Accept: "application/json"
			},
			signal: AbortSignal.timeout(12e3)
		});
		if (res.status === 429 || res.status >= 500) {
			last = `upstream ${res.status}`;
			await sleep(350 * (attempt + 1));
			continue;
		}
		if (!res.ok) throw new Error(`upstream ${res.status}`);
		const data = await res.json();
		if (!data || typeof data !== "object" || "spark" in data) throw new Error("unexpected quote payload");
		const out = [];
		for (const symbol of symbols) {
			const row = data[symbol];
			if (!row || typeof row !== "object") continue;
			const rec = row;
			const price = Number(rec.fulldayPrice);
			const change = Number(rec.fulldayChange);
			const changePercent = Number(rec.fulldayChangePercent);
			if (!Number.isFinite(price)) continue;
			out.push({
				symbol,
				price,
				change: Number.isFinite(change) ? change : 0,
				changePercent: Number.isFinite(changePercent) ? changePercent : 0
			});
		}
		return out;
	}
	throw new Error(last);
}
var fetchQuotes_createServerFn_handler = createServerRpc({
	id: "ffeab3a1fc1a85f5586c5acce8307b924aead8df42092b0e1e44869a676aba2b",
	name: "fetchQuotes",
	filename: "src/lib/quotes.ts"
}, (opts) => fetchQuotes.__executeServer(opts));
var fetchQuotes = createServerFn({ method: "POST" }).validator((input) => parseSymbols(input)).handler(fetchQuotes_createServerFn_handler, async ({ data }) => {
	const now = Date.now();
	const quotes = [];
	const need = [];
	for (const symbol of data.symbols) {
		const hit = cache.get(symbol);
		if (!data.fresh && hit && now - hit.at < TTL_MS) quotes.push(hit.q);
		else need.push(symbol);
	}
	const chunks = [];
	for (let i = 0; i < need.length; i += CHUNK) chunks.push(need.slice(i, i + CHUNK));
	let failures = 0;
	for (let i = 0; i < chunks.length; i += 2) {
		const pair = chunks.slice(i, i + 2);
		const results = await Promise.all(pair.map(async (chunk) => {
			try {
				return await fetchChunk(chunk);
			} catch {
				failures += 1;
				return [];
			}
		}));
		const stamped = Date.now();
		for (const batch of results) for (const q of batch) {
			cache.set(q.symbol, {
				at: stamped,
				q
			});
			quotes.push(q);
		}
		if (i + 2 < chunks.length) await sleep(80);
	}
	if (!quotes.length && failures) throw new Error("Quotes are delayed. Try again in a moment.");
	return {
		quotes,
		asOf: Date.now()
	};
});
//#endregion
export { fetchQuotes_createServerFn_handler };
