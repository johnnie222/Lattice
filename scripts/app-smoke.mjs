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
  { at = OPEN, width = 390, saved = v4(HOLDINGS), history = "ok", touch = false } = {},
) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    colorScheme: "dark",
    hasTouch: touch,
    isMobile: touch,
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
const day = (page) => page.getByTestId("day-section");
const pill = (page) => page.getByTestId("map-pill");
const waitText = (locator, pattern) => locator.filter({ hasText: pattern }).first().waitFor();
const SATURDAY = new Date("2026-10-10T15:00:00Z");
const PRE_MARKET = new Date("2026-10-07T12:00:00Z"); // Wed 08:00 ET
const PARTIAL = v4([...HOLDINGS, shares("ZZZZ", 1)]);

/** Hold the universe title with real touch events (the phone's path). */
async function touchHold(page, dy, release = true) {
  const box = await page.getByRole("button", { name: /Choose a market/ }).boundingBox();
  const x = box.x + 50;
  const y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await page.waitForTimeout(650);
  for (let step = 1; step <= 6; step++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y + (dy * step) / 6 }],
    });
  if (release) await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}

try {
  await scenario(
    "Map header: title, Search and controls; level with a compact pill; no history at 1D",
    "/",
    async (page, { historyBodies }) => {
      await text(page, "4,040.00");
      await waitText(pill(page), /^▲ 1\.00%$/);
      await waitLabel(page, "AAPL", "+10.00%");
      await page.getByText(/^\d+ up$/).waitFor();
      for (const name of ["Map", "Sectors", "Portfolio"]) await tab(page, name).waitFor();
      const header = page.locator("header").first();
      await header.getByRole("button", { name: "Search" }).waitFor();
      await header.getByRole("button", { name: "Map controls" }).waitFor();
      assert.equal(await header.getByRole("button", { name: "Settings" }).count(), 0);
      assert.equal(await page.getByText(/^Index · /).count(), 0);
      // The heatmap starts well above where the golden header ended (~205px).
      const first = await page.locator("button.tile").first().boundingBox();
      assert.ok(first.y < 175, `heatmap starts at ${first.y}px`);
      assert.equal(historyBodies.length, 0);
      await page.screenshot({ path: `${shots}/app-map-1d.png` });
    },
  );

  await scenario(
    "Map periods: index pill and tiles from reference closes; missing stays missing",
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
    "S&P pill over 1W, and a sector drill keeps its context",
    "/?t=1w",
    async (page) => {
      await text(page, "4,040.00");
      // (4040 − 3900) / 3900
      await waitText(pill(page), /^▲ 3\.59%$/);
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
    "Map controls: filter with a visible dot, data status, Settings",
    "/",
    async (page) => {
      await waitLabel(page, "XOM", "-10.00%");
      await page.getByRole("button", { name: "Map controls" }).click();
      const sheet = page.getByRole("dialog", { name: "Map Controls" });
      await sheet.getByText("Last update").waitFor();
      await sheet.getByText("Market Open").waitFor();
      await sheet.getByRole("button", { name: /Advancers/ }).click();
      await page.getByRole("button", { name: "Map controls, filter on" }).waitFor();
      await waitLabel(page, "AAPL", "+10.00%");
      assert.equal(await tile(page, "XOM").count(), 0);
      await page.getByRole("button", { name: "Map controls, filter on" }).click();
      await page
        .getByRole("dialog", { name: "Map Controls" })
        .getByRole("button", { name: "Settings" })
        .click();
      await page.getByRole("dialog", { name: "Settings" }).waitFor();
    },
  );

  await scenario("Quick wheel: tap browses, hold-drag-release switches", "/", async (page) => {
    const title = page.getByRole("button", { name: /Choose a market/ });
    await title.click();
    const menu = page.getByRole("dialog", { name: "Markets" });
    await menu.getByText("Tip: press and hold the title to switch quickly.").waitFor();
    await menu.getByRole("button", { name: "Close" }).click();
    const box = await title.boundingBox();
    const x = box.x + 50;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.waitForTimeout(650);
    await page.getByRole("listbox", { name: "Quick switch" }).waitFor();
    // Two rows down the list: S&P 500 → Nasdaq 100 → Dow 30.
    await page.mouse.move(x, y - 40, { steps: 4 });
    await page.mouse.move(x, y - 88, { steps: 4 });
    await page.screenshot({ path: `${shots}/app-wheel.png` });
    await page.mouse.up();
    await page.waitForURL(/board=dow/);
    assert.equal(await page.getByRole("listbox", { name: "Quick switch" }).count(), 0);
    assert.equal(await page.getByRole("dialog", { name: "Markets" }).count(), 0);
  });

  await scenario(
    "Quick wheel by touch: hold and release stays open; Escape cancels; tap switches",
    "/",
    async (page) => {
      await touchHold(page, 0);
      const wheel = page.getByRole("listbox", { name: "Quick switch" });
      await wheel.waitFor();
      await page.getByText("Tap to switch").waitFor();
      assert.equal(await page.getByRole("dialog", { name: "Markets" }).count(), 0);
      await page.keyboard.press("Escape");
      await wheel.waitFor({ state: "detached" });
      assert.doesNotMatch(page.url(), /board=/);
      await touchHold(page, -44);
      await page.waitForURL(/board=ndx/);
      await touchHold(page, 0);
      await page.getByRole("option", { name: /Technology/ }).click();
      await page.waitForURL(/board=xlk/);
    },
    { touch: true },
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
      await you.getByText("-0.41%").waitFor();
      await you.getByText("Current-holdings lookback").waitFor();
      await pick(page, "YTD");
      await you.getByText("—").waitFor();
    },
  );

  await scenario(
    "Portfolio: value card, TODAY section, positions; the day's P&L shows once",
    "/?tab=portfolio",
    async (page) => {
      const card = page.getByTestId("value-card");
      await card.getByText("$612.00").waitFor();
      // JPM has no average cost: no since-entry aggregate, just what's missing.
      await card.getByText("Since entry: average cost on 2 of 3 positions").waitFor();
      assert.doesNotMatch(await card.innerText(), /\+\$12\.00|today/i);
      await day(page)
        .getByText(/^Today$/i)
        .waitFor();
      await waitText(page.getByTestId("day-headline"), /^\+\$12\.00$/);
      assert.match(
        await page.getByTestId("day-line").innerText(),
        /^\+2\.00% · \+1\.00 pts vs S&P 500$/,
      );
      const body = await day(page).innerText();
      assert.match(body, /AAPL[\s\S]*\+\$25\.00/);
      assert.match(body, /XOM[\s\S]*−\$15\.00/);
      assert.match(body, /2 of 3 up · 1 down/);
      assert.match(body, /Technology[\s\S]*\+\$25\.00/);
      // Live TODAY is lighter: no summary sentence, no market context.
      assert.equal(await page.getByTestId("day-market").count(), 0);
      const screen = await page.locator("main").innerText();
      assert.equal(screen.split("+$12.00").length - 1, 1, "the day's P&L appears exactly once");
      assert.equal(await page.locator("button.tile").count(), 0, "no heatmap on Portfolio");
      assert.equal(await page.getByRole("radiogroup", { name: "Time frame" }).count(), 0);
      assert.match(screen, /3 positions[\s\S]*XOM[\s\S]*−\$15\.00 · -10\.00%/i);
      assert.match(screen, /2\.5 shares · \+37\.50% since entry/);
      await page.screenshot({ path: `${shots}/app-portfolio-today.png`, fullPage: true });
      await day(page).getByRole("button", { name: "Show more" }).click();
      await day(page).getByText("Financials").waitFor();
    },
  );

  await scenario(
    "Portfolio: since entry only when every position has a cost",
    "/?tab=portfolio",
    async (page) => {
      // (2.5 × 30 + 0.75 × 30 + 22) / (200 + 112.5 + 180)
      await waitText(page.getByTestId("since-entry"), /▲ \$119\.50 \(24\.26%\) · since entry/);
    },
    { saved: v4([shares("AAPL", 2.5, 80), shares("XOM", 0.75, 150), shares("JPM", 1, 180)]) },
  );

  await scenario(
    "Show heatmap opens the portfolio map; Back returns",
    "/?tab=portfolio",
    async (page) => {
      await page.getByTestId("value-card").getByText("$612.00").waitFor();
      await page.getByRole("button", { name: "Show heatmap" }).click();
      await page.waitForURL(
        (u) => u.searchParams.get("board") === "book" && !u.searchParams.has("tab"),
      );
      await waitLabel(page, "AAPL", "+10.00%");
      await waitText(pill(page), /^\+\$12$/);
      await page.goBack();
      await page.waitForURL(/tab=portfolio/);
      await page.getByTestId("value-card").waitFor();
    },
  );

  await scenario(
    "CLOSE: one-line summary without repeating the P&L, plus market context",
    "/?tab=portfolio",
    async (page) => {
      await day(page)
        .getByText(/^Close$/i)
        .waitFor();
      await waitText(page.getByTestId("day-headline"), /^\+\$12\.00$/);
      assert.equal(
        await page.getByTestId("day-line").innerText(),
        "Up 2.00%, 1.00 pts ahead of the S&P 500. AAPL led.",
      );
      assert.equal(
        await page.getByTestId("day-market").innerText(),
        "Market · S&P 500 +1.00% · Technology led, Utilities lagged · mixed day",
      );
      assert.equal((await page.locator("main").innerText()).split("+$12.00").length - 1, 1);
      assert.equal(
        await page.getByRole("button", { name: /Lattice Close|Portfolio Today/ }).count(),
        0,
      );
      await page.screenshot({ path: `${shots}/app-portfolio-close.png`, fullPage: true });
    },
    { at: AFTER_CLOSE },
  );

  await scenario(
    "LAST CLOSE · FRI on a Saturday",
    "/?tab=portfolio",
    async (page) => {
      await day(page)
        .getByText(/^Last close · Fri$/i)
        .waitFor();
      await page.getByTestId("day-market").waitFor();
      await page.screenshot({ path: `${shots}/app-portfolio-last-close.png`, fullPage: true });
    },
    { at: SATURDAY },
  );

  await scenario(
    "LAST CLOSE · TUE before Wednesday's open",
    "/?tab=portfolio",
    async (page) => {
      await day(page)
        .getByText(/^Last close · Tue$/i)
        .waitFor();
    },
    { at: PRE_MARKET },
  );

  await scenario(
    "Partial coverage never reads as a full return",
    "/?tab=portfolio",
    async (page) => {
      await page
        .getByTestId("value-card")
        .getByText(/^Priced value · 3 of 4/)
        .waitFor();
      await waitText(page.getByTestId("day-headline"), /^\+\$12\.00$/);
      assert.equal(
        await page.getByTestId("day-line").innerText(),
        "Known P&L · 3 of 4 priced · return once every position is priced",
      );
      assert.doesNotMatch(await page.getByTestId("day-line").innerText(), /%/);
      await day(page)
        .getByText(/Movers · priced positions/i)
        .waitFor();
      await tab(page, "Sectors").click();
      const you = page.getByRole("button", { name: /Main\s*You/ });
      await you.getByText("Your portfolio · partial").waitFor();
      await you.getByText("—").waitFor();
    },
    { saved: PARTIAL },
  );

  await scenario(
    "Portfolio on the map: engine figures, partial flagged in the pill",
    "/?board=book",
    async (page) => {
      await waitText(pill(page), /^\+\$12 known · 3 of 4$/);
      await page.getByTestId("map-headline").getByText("—").waitFor();
    },
    { saved: PARTIAL },
  );

  await scenario(
    "Partial CLOSE: known dollars, no return",
    "/?tab=portfolio",
    async (page) => {
      await day(page)
        .getByText(/^Close$/i)
        .waitFor();
      assert.equal(
        await page.getByTestId("day-line").innerText(),
        "3 of 4 holdings priced, so no full return. AAPL led among priced holdings.",
      );
    },
    { at: AFTER_CLOSE, saved: PARTIAL },
  );

  await scenario(
    "Percent portfolio: % only, exact daily return",
    "/?tab=portfolio",
    async (page) => {
      await page
        .getByTestId("value-card")
        .getByText(/^Percent-based portfolio/)
        .waitFor();
      // 60% of AAPL (+10%) and 40% of XOM (−10%), both anchored at their previous close.
      await waitText(page.getByTestId("day-headline"), /^\+2\.00%$/);
      await page.getByTestId("day-market").waitFor();
      assert.doesNotMatch(await day(page).innerText(), /\$/);
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
      await page.getByTestId("value-card").getByText("$612.00").waitFor();
      await waitText(page.getByTestId("day-headline"), /^\+\$12\.00$/);
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
      await page
        .getByTestId("value-card")
        .getByText(/^Percent-based portfolio/)
        .waitFor();
      // No anchors yet: each position is pinned to the first price seen ($110,
      // $180), so the book is 60/40 now. Units 60/110 and 40/180 give
      // (60/110 × 10 − 40/180 × 20) / (60/110 × 100 + 40/180 × 200).
      await waitText(page.getByTestId("day-headline"), /^\+1\.02%$/);
      const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("lattice-books-v1")));
      assert.equal(saved.state.books[0].notional, 10_000);
      assert.deepEqual(
        saved.state.books[0].positions.map((p) => [p.symbol, p.kind, p.percent, p.anchor]),
        [
          ["AAPL", "percent", 60, 110],
          ["XOM", "percent", 40, 180],
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
      await waitText(pill(page), /^Loading 1W$/);
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
      await waitText(pill(page), /^1M unavailable$/);
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
      await waitText(pill(page), /^▲ 3\.59%$/);
      await page.screenshot({ path: `${shots}/app-map-1w-desktop.png` });
      await tab(page, "Portfolio").click();
      await page.getByTestId("value-card").getByText("$612.00").waitFor();
    },
    { width: 1280 },
  );

  console.log(`${passed} browser scenarios passed`);
} finally {
  await browser.close();
}
