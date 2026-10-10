#!/usr/bin/env node
// Browser regressions for the app shell: Map → Sectors → Portfolio → Today /
// Close → 1D/1W/1M/YTD, plus saved-portfolio migration. Start `npm run dev`
// (or `npm run preview:restart`) first. Fixture quotes and reference closes,
// pinned clocks, loopback only.
// CHROMIUM_PATH=/opt/pw-browsers/chromium SCREENSHOT_DIR=screenshots node scripts/app-smoke.mjs [url]
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { checkedUrl } from "./browser-guard.mjs";

const url = checkedUrl(process.argv[2] || "http://127.0.0.1:8080/");
const origin = new URL(url).origin;
const shots = process.env.SCREENSHOT_DIR || "screenshots";
mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});

// Wed 2026-10-07: 11:00 ET (session open) and 17:00 ET (after the close).
// 1W → Sep 30, 1M → Sep 4 (Sep 7 is Labor Day), YTD → Dec 31 2025.
const OPEN = new Date("2026-10-07T15:00:00Z");
const AFTER_CLOSE = new Date("2026-10-07T21:00:00Z");

function hash(s) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 2 ** 32;
}
const quote = (symbol, previousClose, price) => ({
  symbol,
  price,
  previousClose,
  change: price - previousClose,
  changePercent: (price / previousClose - 1) * 100,
});
// [previous close, price]
const FIXED = {
  AAPL: [100, 110],
  XOM: [200, 180],
  JPM: [200, 202],
  MSFT: [455, 450],
  NVDA: [190, 200],
  CVX: [200, 180],
  "^GSPC": [4000, 4040],
  "^DJI": [40000, 40400],
  "^NDX": [18000, 18180],
  XLK: [100, 102],
  XLF: [100, 101.5],
  XLE: [100, 99],
  XLV: [100, 100.5],
  XLY: [100, 99.5],
  XLP: [100, 100.2],
  XLI: [100, 101.2],
  XLB: [100, 99.7],
  XLRE: [100, 100.8],
  XLU: [100, 98.8],
  XLC: [100, 101.1],
};
/** ZZZZ never gets a quote: a position without a price. */
const NO_QUOTE = new Set(["ZZZZ"]);
function quoteFor(symbol) {
  if (NO_QUOTE.has(symbol)) return null;
  const fixed = FIXED[symbol];
  if (fixed) return quote(symbol, fixed[0], fixed[1]);
  const prev = 20 + hash(symbol + "p") * 480;
  return quote(symbol, prev, prev * (1 + (hash(symbol) - 0.45) * 0.06));
}
const REF_DATE = { "1w": "2026-09-30", "1m": "2026-09-04", ytd: "2025-12-31" };
// Reference closes; null = no close on the reference date (missing, not 0%).
const REFS = {
  "1w": { AAPL: 105, XOM: 200, JPM: 202, MSFT: 450, NVDA: 160, CVX: null, "^GSPC": 3900, XLK: 98 },
  "1m": { AAPL: 125, XOM: 170, JPM: 190, MSFT: 430, NVDA: 250, CVX: 170, "^GSPC": 4100, XLK: 104 },
  ytd: { AAPL: 88, XOM: 150, JPM: null, MSFT: 400, NVDA: 100, CVX: 150, "^GSPC": 3500, XLK: 80 },
};
function referenceFor(period, symbol) {
  if (symbol in REFS[period]) return REFS[period][symbol];
  const q = quoteFor(symbol);
  return q ? q.previousClose * (1 - (hash(symbol + period) - 0.5) * 0.08) : null;
}

const shares = (symbol, n, entry = null) => ({
  symbol,
  kind: "shares",
  shares: n,
  entry,
  since: null,
  added: "2026-09-01",
  anchor: null,
});
const HOLDINGS = [shares("AAPL", 2.5, 80), shares("XOM", 0.75, 150), shares("JPM", 1)];
const v4 = (positions) => ({
  state: { books: [{ id: "main", name: "Main", positions }], activeId: "main" },
  version: 4,
});

let passed = 0;
async function scenario(
  name,
  path,
  run,
  { at = OPEN, width = 390, saved = v4(HOLDINGS), history = "ok" } = {},
) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    colorScheme: "dark",
  });
  await context.clock.setFixedTime(at);
  const page = await context.newPage();
  const errors = [];
  const historyBodies = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript((snapshot) => {
    if (snapshot && !sessionStorage.getItem("seeded")) {
      localStorage.setItem("lattice-books-v1", JSON.stringify(snapshot));
      sessionStorage.setItem("seeded", "1");
    }
  }, saved);
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (!request.url().startsWith(origin + "/")) {
      return route.fulfill({
        status: 200,
        contentType: request.resourceType() === "image" ? "image/svg+xml" : "text/plain",
        body: request.resourceType() === "image" ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : "",
      });
    }
    if (request.method() !== "POST") return route.continue();
    const body = request.postData() || "";
    // Positions, sizes and costs never leave the device: only symbols do.
    assert.doesNotMatch(
      body,
      /quantity|averageCost|shares|entry|percent|notional|positions|holdings|"since"/,
    );
    const strings = [...body.matchAll(/"s":"([^"]+)"/g)].map((m) => m[1]);
    const symbols = strings.filter(
      (s) => /^\^?[A-Z0-9-]{1,10}$/.test(s) && !/^\d{4}-\d{2}-\d{2}$/.test(s),
    );
    if (!/"period","anchor"/.test(body)) {
      const quotes = symbols.map(quoteFor).filter(Boolean);
      return route.fulfill({ json: { result: { quotes, asOf: at.getTime() }, context: {} } });
    }
    historyBodies.push(body);
    if (history === "fail")
      return route.fulfill({ status: 503, contentType: "text/plain", body: "down" });
    if (history === "slow") await new Promise((resolve) => setTimeout(resolve, 1500));
    const period = strings.find((s) => s === "1w" || s === "1m" || s === "ytd");
    const anchor = strings.find((s) => /^\d{4}-\d{2}-\d{2}$/.test(s));
    const references = Object.fromEntries(
      symbols.map((symbol) => [
        symbol,
        { date: REF_DATE[period], close: referenceFor(period, symbol) },
      ]),
    );
    return route.fulfill({
      json: { result: { period, anchor, references, unavailable: [] }, context: {} },
    });
  });
  await page.goto(origin + path);
  // Clicks before hydration land on server-rendered markup with no handlers.
  await page.waitForLoadState("networkidle");
  try {
    await run(page, { historyBodies });
    assert.deepEqual(errors, []);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    console.log(`PASS ${name}`);
    passed++;
  } finally {
    await context.close();
  }
}

const tab = (page, name) =>
  page.getByRole("navigation", { name: "Sections" }).getByRole("button", { name });
const pick = (page, label) => page.getByRole("radio", { name: label, exact: true }).first().click();
const tile = (page, symbol) => page.locator(`button.tile[aria-label^="${symbol} "]`).first();
const waitLabel = (page, symbol, text) =>
  page.waitForFunction(
    ([s, t]) =>
      [...document.querySelectorAll("button.tile[aria-label]")].some(
        (b) =>
          b.getAttribute("aria-label").startsWith(`${s} `) &&
          b.getAttribute("aria-label").endsWith(t),
      ),
    [symbol, text],
  );
const text = (page, value) => page.getByText(value, { exact: true }).first().waitFor();
const change = (page) => page.getByTestId("portfolio-change").innerText();
const waitChange = (page, pattern) =>
  page.waitForFunction(
    (source) =>
      new RegExp(source).test(
        document.querySelector('[data-testid="portfolio-change"]')?.textContent ?? "",
      ),
    pattern.source,
  );

try {
  await scenario(
    "Map 1D: index level, breadth, tabs; no history request",
    "/",
    async (page, { historyBodies }) => {
      await text(page, "4,040.00");
      await text(page, "▲ 40.00 (1.00%)");
      await page.getByText(/^Index · today$/).waitFor();
      await waitLabel(page, "AAPL", "+10.00%");
      await page.getByText(/^\d+ up$/).waitFor();
      for (const name of ["Map", "Sectors", "Portfolio"]) await tab(page, name).waitFor();
      assert.equal(historyBodies.length, 0);
      await page.screenshot({ path: `${shots}/app-map-1d.png` });
    },
  );

  await scenario(
    "Map periods: index and tiles from reference closes; missing stays missing",
    "/?board=dow",
    async (page, { historyBodies }) => {
      await waitLabel(page, "AAPL", "+10.00%");
      await pick(page, "1W");
      await page.waitForURL(
        (u) => u.searchParams.get("board") === "dow" && u.searchParams.get("t") === "1w",
      );
      await waitLabel(page, "AAPL", "+4.76%");
      // CVX has no 1W reference close: shown as waiting, never as 0%.
      assert.match((await tile(page, "CVX").getAttribute("aria-label")) ?? "", /—$/);
      assert.match((await tile(page, "CVX").getAttribute("class")) ?? "", /heat-wait/);
      // JPM's reference equals its price: a real flat move.
      await waitLabel(page, "JPM", "0.00%");
      assert.match((await tile(page, "JPM").getAttribute("class")) ?? "", /heat-flat/);
      for (const body of historyBodies) assert.match(body, /2026-10-07/);
      await page.screenshot({ path: `${shots}/app-map-dow-1w.png` });
      await pick(page, "YTD");
      await waitLabel(page, "AAPL", "+25.00%");
      await waitLabel(page, "CVX", "+20.00%");
      await pick(page, "1D");
      await waitLabel(page, "AAPL", "+10.00%");
      await page.waitForURL(
        (u) => !u.searchParams.has("t") && u.searchParams.get("board") === "dow",
      );
    },
  );

  await scenario(
    "S&P index pill over 1W, and a sector drill keeps its context",
    "/?t=1w",
    async (page) => {
      await text(page, "4,040.00");
      // (4040 − 3900) / 3900
      await text(page, "▲ 140.00 (3.59%)");
      await page.getByText(/^Index · past week$/).waitFor();
      await page
        .getByRole("button", { name: /^Technology/ })
        .first()
        .click();
      await page.waitForURL(/sector=tech/);
      await waitLabel(page, "MSFT", "0.00%");
      await pick(page, "1M");
      await page.waitForURL(
        (u) => u.searchParams.get("sector") === "tech" && u.searchParams.get("t") === "1m",
      );
      await waitLabel(page, "MSFT", "+4.65%");
    },
  );

  await scenario(
    "Sectors: ranking, S&P divider, YOU row from the engine; lookback is labelled",
    "/",
    async (page) => {
      await tab(page, "Sectors").click();
      await page.waitForURL(/tab=sectors/);
      await text(page, "S&P 500 · the market");
      const you = page.getByRole("button", { name: /Main\s*You/ });
      await you.getByText("+2.00%").waitFor();
      await you.getByText("Your portfolio", { exact: true }).waitFor();
      await page.screenshot({ path: `${shots}/app-sectors-1d.png` });
      await pick(page, "1W");
      await page.waitForURL(
        (u) => u.searchParams.get("tab") === "sectors" && u.searchParams.get("t") === "1w",
      );
      // (2.5 × 5 + 0.75 × −20 + 0) / (2.5 × 105 + 0.75 × 200 + 202)
      await you.getByText("-0.41%").waitFor();
      await you.getByText("Current-holdings lookback").waitFor();
      await page.getByText("+3.59%", { exact: true }).waitFor();
      await pick(page, "YTD");
      // JPM has no YTD close, so there is no full figure.
      await you.getByText("—").waitFor();
    },
  );

  await scenario(
    "Portfolio 1D: value, P&L and return; Today card and sheet",
    "/?tab=portfolio",
    async (page) => {
      await text(page, "$612.00");
      await waitChange(page, /▲ \$12\.00 \(2\.00%\) · today/);
      const card = page.getByRole("button", { name: "Open My Portfolio Today" });
      await card.getByText("+$12.00").waitFor();
      assert.match(
        await card.innerText(),
        /\+2\.00% · \+1\.00 pts vs S&P 500 · 2 of 3 holdings up/,
      );
      await page.screenshot({ path: `${shots}/app-portfolio-1d.png` });
      await card.click();
      const sheet = page.getByRole("dialog", { name: "My Portfolio Today" });
      await sheet.getByText("Day P&L").waitFor();
      const body = await sheet.innerText();
      assert.match(body, /\+\$12\.00/);
      assert.match(body, /\+2\.00%/);
      assert.match(body, /\+1\.00 pts/);
      assert.match(body, /Top contributors[\s\S]*AAPL[\s\S]*\+\$25\.00/i);
      assert.match(body, /Top detractors[\s\S]*XOM[\s\S]*−\$15\.00/i);
      assert.match(body, /Since entry[\s\S]*\+\$97\.50 \(\+31\.20%\)/i);
      await page.screenshot({ path: `${shots}/app-today-sheet.png` });
    },
  );

  await scenario(
    "Portfolio periods: current-holdings lookback, per-position moves, since entry",
    "/?tab=portfolio",
    async (page) => {
      await text(page, "$612.00");
      await pick(page, "1W");
      await waitChange(page, /▼ 0\.41% · current holdings, past week/);
      await pick(page, "1M");
      // (2.5 × −15 + 0.75 × 10 + 12) / (2.5 × 125 + 0.75 × 170 + 190)
      await waitChange(page, /▼ 2\.86% · current holdings, past month/);
      await pick(page, "YTD");
      await waitChange(page, /^2 of 3 have a YTD close$/);
      await page.getByRole("radio", { name: "List" }).click();
      const list = await page.locator("main").innerText();
      // Per-position price moves only; no invented dollar history.
      assert.match(list, /AAPL[\s\S]*\+25\.00%/);
      assert.doesNotMatch(list, /AAPL[^\n]*\n[^\n]*\n[^\n]*\$[\d,.]+ · \+25\.00%/);
      assert.match(list, /not your account’s past return/);
      await pick(page, "All");
      await waitChange(page, /▲ \$97\.50 \(31\.20%\) · since entry · 2 of 3 with a cost/);
      await page.screenshot({ path: `${shots}/app-portfolio-all.png` });
    },
  );

  await scenario(
    "Partial coverage never reads as a full return",
    "/?tab=portfolio",
    async (page) => {
      await page.getByText("Priced value · 3 of 4", { exact: false }).waitFor();
      await waitChange(page, /▲ \$12\.00 known · 3 of 4 priced/);
      assert.doesNotMatch(await change(page), /%/);
      await page.getByRole("button", { name: "Open My Portfolio Today" }).click();
      const body = await page.getByRole("dialog", { name: "My Portfolio Today" }).innerText();
      assert.match(body, /Partial data\./);
      assert.match(body, /missing ZZZZ/);
      assert.match(body, /Known P&L/);
      assert.match(body, /Needs every holding priced/);
      await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
      await tab(page, "Sectors").click();
      const you = page.getByRole("button", { name: /Main\s*You/ });
      await you.getByText("Your portfolio · partial").waitFor();
      await you.getByText("—").waitFor();
      await tab(page, "Map").click();
    },
    { saved: v4([...HOLDINGS, shares("ZZZZ", 1)]) },
  );

  await scenario(
    "Portfolio on the map: engine figures, partial flagged",
    "/?board=book",
    async (page) => {
      await page.getByText(/^Your portfolio · today · 3 of 4 priced/).waitFor();
      await text(page, "+$12 known");
      await text(page, "—");
    },
    { saved: v4([...HOLDINGS, shares("ZZZZ", 1)]) },
  );

  await scenario(
    "Lattice Close after the bell",
    "/?tab=portfolio",
    async (page) => {
      const card = page.getByRole("button", { name: "Open Lattice Close" });
      await card.getByText("+$12.00").waitFor();
      await card.click();
      const sheet = page.getByRole("dialog", { name: "Lattice Close" });
      await sheet.getByText(/^After the close/).waitFor();
      const body = await sheet.innerText();
      assert.match(body, /Your portfolio returned \+2\.00%, 1\.00 pts ahead of the S&P 500\./);
      assert.match(
        body,
        /AAPL was the largest contributor; 2 up · 1 down · 0 flat among 3 priced holdings\./,
      );
      assert.match(body, /Market[\s\S]*S&P 500[\s\S]*\+1\.00%/i);
      assert.match(body, /Led · Technology[\s\S]*\+2\.00%/);
      assert.match(body, /Lagged · Utilities[\s\S]*-1\.20%/);
      await page.screenshot({ path: `${shots}/app-close-sheet.png` });
      await sheet.getByRole("button", { name: "Full details in My Portfolio Today" }).click();
      await page.getByRole("dialog", { name: "My Portfolio Today" }).waitFor();
    },
    { at: AFTER_CLOSE },
  );

  await scenario(
    "Partial Lattice Close: known dollars, no return",
    "/?tab=portfolio",
    async (page) => {
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      const body = await page.getByRole("dialog", { name: "Lattice Close" }).innerText();
      assert.match(body, /Partial close: \+\$12\.00 from 3 of 4 holdings with prices\./);
      assert.match(body, /Known P&L/);
      assert.doesNotMatch(body, /Your portfolio returned/);
    },
    { at: AFTER_CLOSE, saved: v4([...HOLDINGS, shares("ZZZZ", 1)]) },
  );

  await scenario(
    "Percent portfolio: % only, exact daily return",
    "/?tab=portfolio",
    async (page) => {
      await page.getByText(/^Percent-based portfolio/).waitFor();
      // 60% of AAPL (+10%) and 40% of XOM (−10%), both anchored at their previous close.
      await waitChange(page, /▲ 2\.00% · today/);
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      const body = await page.getByRole("dialog", { name: "Lattice Close" }).innerText();
      assert.match(body, /covers share portfolios/);
      assert.doesNotMatch(body, /\$/);
    },
    {
      at: AFTER_CLOSE,
      saved: v4([
        { symbol: "AAPL", kind: "percent", percent: 60, added: "2026-09-01", anchor: 100 },
        { symbol: "XOM", kind: "percent", percent: 40, added: "2026-09-01", anchor: 200 },
      ]),
    },
  );

  await scenario(
    "Migration: a holdings-build snapshot keeps every holding, and a raw backup",
    "/?tab=portfolio",
    async (page) => {
      await text(page, "$612.00");
      await waitChange(page, /▲ \$12\.00 \(2\.00%\) · today/);
      const backup = await page.evaluate(() => localStorage.getItem("lattice-books-backup"));
      assert.match(backup ?? "", /averageCost/);
      const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("lattice-books-v1")));
      assert.equal(saved.version, 4);
      assert.deepEqual(
        saved.state.books[0].positions.map((p) => [p.symbol, p.kind, p.shares, p.entry]),
        [
          ["AAPL", "shares", 2.5, 80],
          ["XOM", "shares", 0.75, 150],
          ["JPM", "shares", 1, null],
        ],
      );
    },
    {
      saved: {
        state: {
          books: [
            {
              id: "main",
              name: "Main",
              holdings: [
                { symbol: "AAPL", quantity: 2.5, averageCost: 80 },
                { symbol: "XOM", quantity: 0.75, averageCost: 150 },
                { symbol: "JPM", quantity: 1, averageCost: null },
              ],
              lines: [],
              notional: null,
            },
          ],
          activeId: "main",
        },
        version: 1,
      },
    },
  );

  await scenario(
    "Migration: an original weight book becomes percent positions and keeps its size",
    "/?tab=portfolio",
    async (page) => {
      await page.getByText(/^Percent-based portfolio/).waitFor();
      // No anchors yet: each position is pinned to the first price seen ($110,
      // $180), so the book is 60/40 now. Units 60/110 and 40/180 give
      // (60/110 × 10 − 40/180 × 20) / (60/110 × 100 + 40/180 × 200).
      await waitChange(page, /▲ 1\.02% · today/);
      const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("lattice-books-v1")));
      assert.equal(saved.state.books[0].notional, 10_000);
      assert.deepEqual(
        saved.state.books[0].positions.map((p) => p.anchor),
        [110, 180],
      );
      assert.deepEqual(
        saved.state.books[0].positions.map((p) => [p.symbol, p.kind, p.percent]),
        [
          ["AAPL", "percent", 60],
          ["XOM", "percent", 40],
        ],
      );
    },
    {
      saved: {
        state: {
          books: [
            {
              id: "main",
              name: "Main",
              lines: [
                { symbol: "AAPL", weight: 60 },
                { symbol: "XOM", weight: 40 },
              ],
              notional: 10_000,
            },
          ],
          activeId: "main",
        },
        version: 0,
      },
    },
  );

  await scenario(
    "Slow history never flashes fake 0% tiles",
    "/?board=dow",
    async (page) => {
      await waitLabel(page, "AAPL", "+10.00%");
      await pick(page, "1W");
      await page.getByText(/loading past week/).waitFor();
      for (const symbol of ["AAPL", "JPM", "MSFT"]) {
        assert.match((await tile(page, symbol).getAttribute("aria-label")) ?? "", /—$/);
        assert.match((await tile(page, symbol).getAttribute("class")) ?? "", /heat-wait/);
      }
      await waitLabel(page, "AAPL", "+4.76%");
    },
    { history: "slow" },
  );

  await scenario(
    "History failure reads unavailable, never 0%",
    "/?board=dow&t=1m",
    async (page) => {
      await page.getByText(/past month unavailable/).waitFor();
      for (const symbol of ["AAPL", "CVX", "JPM"]) {
        assert.match((await tile(page, symbol).getAttribute("aria-label")) ?? "", /—$/);
      }
      await pick(page, "1D");
      await waitLabel(page, "AAPL", "+10.00%");
    },
    { history: "fail" },
  );

  await scenario(
    "Desktop width",
    "/?t=1w",
    async (page) => {
      await text(page, "▲ 140.00 (3.59%)");
      await page.screenshot({ path: `${shots}/app-map-1w-desktop.png` });
      await tab(page, "Portfolio").click();
      await text(page, "$612.00");
    },
    { width: 1280 },
  );

  console.log(`${passed} browser scenarios passed`);
} finally {
  await browser.close();
}
