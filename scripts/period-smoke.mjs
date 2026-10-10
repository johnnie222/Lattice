#!/usr/bin/env node
// Deterministic browser regressions for historical periods (#4). Start npm run dev first.
// Fixture quotes and reference closes, a pinned clock, loopback only.
// CHROMIUM_PATH=/usr/bin/chromium SCREENSHOT_DIR=screenshots node scripts/period-smoke.mjs
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { checkedUrl } from "./browser-guard.mjs";

const url = checkedUrl(process.argv[2] || "http://127.0.0.1:8080/");
const origin = new URL(url).origin;
const shots = process.env.SCREENSHOT_DIR || "screenshots";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});

// Wed 2026-10-07 11:00 ET: the latest session is Oct 7, so
// 1W → Sep 30, 1M → Sep 4 (Sep 7 is Labor Day), YTD → Dec 31 2025.
const NOW = new Date("2026-10-07T15:00:00Z");
const EXPECTED_ANCHOR = "2026-10-07";
const quote = (symbol, price, previousClose) => ({
  symbol,
  price,
  previousClose,
  change: price - previousClose,
  changePercent: (price / previousClose - 1) * 100,
});
const quotes = [
  quote("AAPL", 110, 100),
  quote("XOM", 180, 200),
  quote("CVX", 180, 200),
  quote("JPM", 202, 200),
  quote("MSFT", 450, 455),
  quote("NVDA", 200, 190),
];
// AAPL: 1W 105 (+4.76%), 1M 125 (−12.00%), YTD 88 (+25.00%).
// XOM and CVX (its Dow stand-in): 1W missing (null), YTD 150 (+20%). JPM: 1W 202 (a genuine 0.00%).
// NVDA: 1W 160 (+25%), 1M 250 (−20%), YTD 100 (+100%).
const REFS = {
  "1w": {
    date: "2026-09-30",
    closes: { AAPL: 105, XOM: null, CVX: null, JPM: 202, MSFT: 450, NVDA: 160 },
  },
  "1m": {
    date: "2026-09-04",
    closes: { AAPL: 125, XOM: 170, CVX: 170, JPM: 190, MSFT: 430, NVDA: 250 },
  },
  ytd: {
    date: "2025-12-31",
    closes: { AAPL: 88, XOM: 150, CVX: 150, JPM: 180, MSFT: 400, NVDA: 100 },
  },
};
const book = {
  id: "main",
  name: "Main",
  holdings: [
    { symbol: "AAPL", quantity: 2.5, averageCost: 80 },
    { symbol: "XOM", quantity: 0.75, averageCost: 150 },
    { symbol: "JPM", quantity: 1, averageCost: null },
  ],
  lines: [],
  notional: null,
};

let passed = 0;
async function scenario(
  name,
  path,
  run,
  { width = 390, history = "ok", now = NOW, stored = null } = {},
) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    timezoneId: "Asia/Jerusalem",
  });
  await context.clock.setFixedTime(now);
  const page = await context.newPage();
  const errors = [];
  const historyBodies = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript(
    (s) => {
      if (!localStorage.getItem("lattice-books-v1"))
        localStorage.setItem("lattice-books-v1", JSON.stringify({ state: s, version: 1 }));
    },
    { books: [book], activeId: "main" },
  );
  if (stored !== null)
    await context.addInitScript((value) => {
      sessionStorage.setItem("lattice-refs-v1:1w:2026-10-07", value);
    }, stored);
  let historyMode = history;
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
    assert.doesNotMatch(
      body,
      /quantity|averageCost|costBasis|dayChange|pricedValue|notional|holdings/,
    );
    if (!/"period","anchor"/.test(body)) {
      return route.fulfill({ json: { result: { quotes, asOf: NOW.getTime() }, context: {} } });
    }
    historyBodies.push(body);
    if (historyMode === "fail")
      return route.fulfill({ status: 503, contentType: "text/plain", body: "down" });
    if (historyMode === "slow") await new Promise((resolve) => setTimeout(resolve, 1500));
    const period = body.match(/"s":"(1w|1m|ytd)"/)[1];
    const anchor = body.match(/"s":"(\d{4}-\d{2}-\d{2})"/)[1];
    const ref = REFS[period];
    const references = Object.fromEntries(
      Object.entries(ref.closes).map(([symbol, close]) => [
        symbol,
        {
          date: period === "ytd" ? `${Number(anchor.slice(0, 4)) - 1}-12-31` : ref.date,
          close: historyMode === "missing" ? null : close,
        },
      ]),
    );
    // "outage": the provider couldn't fetch AAPL this time.
    const unavailable = historyMode === "outage" ? ["AAPL"] : [];
    for (const symbol of unavailable) delete references[symbol];
    return route.fulfill({
      json: { result: { period, anchor, references, unavailable }, context: {} },
    });
  });
  await page.goto(origin + path);
  try {
    await run(page, {
      historyBodies,
      recover: () => {
        historyMode = "ok";
      },
    });
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
const tile = (page, symbol) => page.getByRole("button", { name: new RegExp(`^${symbol} \\$`) });
const tileLabel = async (page, symbol) =>
  (await tile(page, symbol).getAttribute("aria-label")) ?? "";
const tileClass = async (page, symbol) => (await tile(page, symbol).getAttribute("class")) ?? "";
const pick = (page, label) => page.getByRole("radio", { name: label, exact: true }).click();
const waitLabel = (page, symbol, text) =>
  page.waitForFunction(
    ([s, t]) =>
      [...document.querySelectorAll("button[aria-label]")].some(
        (b) =>
          b.getAttribute("aria-label").startsWith(`${s} $`) &&
          b.getAttribute("aria-label").endsWith(t),
      ),
    [symbol, text],
  );

try {
  await scenario(
    "market map: 1D unchanged, lookbacks recolour, missing stays missing",
    "/?board=dow",
    async (page, { historyBodies }) => {
      await waitLabel(page, "AAPL", "+10.00%");
      assert.equal(historyBodies.length, 0, "1D makes no history request");
      await pick(page, "1W");
      await waitLabel(page, "AAPL", "+4.76%");
      assert.match(page.url(), /board=dow/);
      assert.match(page.url(), /t=1w/);
      // CVX has no reference close for 1W: shown as waiting, never as 0%.
      assert.match(await tileLabel(page, "CVX"), /—$/);
      assert.match(await tileClass(page, "CVX"), /bg-heat-wait/);
      // JPM's reference equals its price: a real flat move.
      assert.match(await tileLabel(page, "JPM"), /\+?0\.00%$/);
      assert.match(await tileClass(page, "JPM"), /bg-heat-flat/);
      // Price-weighted by reference close over the 4 names that have one:
      // (0 + 0 + 40 + 5) / (450 + 202 + 160 + 105). Labelled partial, since most
      // of the Dow has no fixture data.
      await page.getByText("+4.91% · 1W · partial", { exact: true }).waitFor();
      await page.getByText("Price-weighted basket · 4 of 30 priced", { exact: true }).waitFor();
      for (const body of historyBodies) assert.match(body, new RegExp(EXPECTED_ANCHOR));
      await page.screenshot({ path: `${shots}/pr4-market-1w-mobile.png` });
      await pick(page, "1M");
      await waitLabel(page, "AAPL", "-12.00%");
      await pick(page, "YTD");
      await waitLabel(page, "AAPL", "+25.00%");
      await waitLabel(page, "CVX", "+20.00%");
      await pick(page, "1D");
      await waitLabel(page, "AAPL", "+10.00%");
      assert.doesNotMatch(page.url(), /t=/);
    },
  );

  await scenario(
    "sector drill keeps its context across periods",
    "/?board=spx&sector=tech",
    async (page) => {
      await waitLabel(page, "MSFT", "-1.10%");
      await pick(page, "1M");
      await waitLabel(page, "MSFT", "+4.65%");
      await waitLabel(page, "AAPL", "-12.00%");
      assert.match(page.url(), /sector=tech/);
      assert.match(page.url(), /t=1m/);
      // Only tech names are on screen; the drill survived the switch.
      assert.equal(await tile(page, "XOM").count(), 0);
      await page.screenshot({ path: `${shots}/pr4-sector-1m-mobile.png` });
    },
  );

  await scenario(
    "thematic board opens straight into a shared period link",
    "/?board=smh&t=ytd",
    async (page, { historyBodies }) => {
      await waitLabel(page, "NVDA", "+100.00%");
      assert.match(historyBodies[0], /"s":"ytd"/);
      assert.match(page.url(), /board=smh/);
      await pick(page, "1W");
      await waitLabel(page, "NVDA", "+25.00%");
      assert.match(page.url(), /board=smh/);
    },
  );

  await scenario(
    "holdings map: per-holding moves, no aggregate, Today stays 1D",
    "/?board=book",
    async (page) => {
      const strip = page.getByRole("button", { name: "Open My Portfolio Today" });
      await page.waitForFunction(() => document.body.innerText.includes("+$12.00"));
      assert.match(await strip.innerText(), /\+\$12\.00/);
      assert.match(await strip.innerText(), /\+2\.00%/);
      await pick(page, "1W");
      await waitLabel(page, "AAPL", "+4.76%");
      assert.match(await tileLabel(page, "XOM"), /—$/);
      await page.getByText("1W price moves", { exact: true }).waitFor();
      // The strip is still today's dollar move, not a lookback.
      assert.match(await strip.innerText(), /\+\$12\.00/);
      assert.match(await strip.innerText(), /\+2\.00%/);
      // Nothing claims a 1W portfolio return.
      assert.doesNotMatch(await page.locator("header").innerText(), /[+-]\d+\.\d+% · 1W/);
      await pick(page, "YTD");
      await waitLabel(page, "AAPL", "+25.00%");
      await page.getByText("YTD price moves", { exact: true }).waitFor();
      await page.screenshot({ path: `${shots}/pr4-book-ytd-mobile.png` });
    },
  );

  await scenario(
    "slow history never flashes fake 0% tiles",
    "/?board=dow",
    async (page) => {
      await waitLabel(page, "AAPL", "+10.00%");
      await pick(page, "1W");
      await page.getByText("Loading 1W", { exact: true }).waitFor();
      for (const symbol of ["AAPL", "JPM", "MSFT"]) {
        assert.match(await tileLabel(page, symbol), /—$/);
        assert.match(await tileClass(page, symbol), /bg-heat-wait/);
      }
      await waitLabel(page, "AAPL", "+4.76%");
    },
    { history: "slow" },
  );

  await scenario(
    "history failure is shown as unavailable, never 0%",
    "/?board=dow&t=1m",
    async (page) => {
      await page.getByText("1M unavailable", { exact: true }).waitFor();
      for (const symbol of ["AAPL", "CVX", "JPM"]) {
        assert.match(await tileLabel(page, symbol), /—$/);
        assert.match(await tileClass(page, symbol), /bg-heat-wait/);
      }
      await pick(page, "1D");
      await waitLabel(page, "AAPL", "+10.00%");
    },
    { history: "fail" },
  );

  await scenario(
    "a provider outage for some names is partial, not 0%",
    "/?board=dow&t=1w",
    async (page) => {
      await waitLabel(page, "NVDA", "+25.00%");
      assert.match(await tileLabel(page, "AAPL"), /—$/);
      assert.match(await tileClass(page, "AAPL"), /bg-heat-wait/);
      // (0 + 0 + 40) / (450 + 202 + 160) over the names that answered.
      await page.getByText("+4.93% · 1W · partial", { exact: true }).waitFor();
      // The outage isn't remembered as missing history.
      const cached = await page.evaluate(() =>
        sessionStorage.getItem("lattice-refs-v1:1w:2026-10-07"),
      );
      assert.doesNotMatch(cached ?? "", /AAPL/);
    },
    { history: "outage" },
  );

  await scenario(
    "desktop width",
    "/?board=dow&t=1w",
    async (page) => {
      await waitLabel(page, "AAPL", "+4.76%");
      await page.screenshot({ path: `${shots}/pr4-market-1w-desktop.png` });
    },
    { width: 1280 },
  );

  await scenario(
    "missing bars finish loading with an explicit missing label",
    "/?board=dow&t=1w",
    async (page) => {
      await page.getByText("No 1W reference closes", { exact: true }).waitFor();
      assert.match(await tileLabel(page, "AAPL"), /—$/);
    },
    { history: "missing" },
  );

  for (const stored of ["null", JSON.stringify({ AAPL: { date: "2026-09-29", close: 1 } })]) {
    await scenario(
      "invalid cached references cannot supply a wrong-date return",
      "/?board=dow&t=1w",
      async (page, { historyBodies }) => {
        await waitLabel(page, "AAPL", "+4.76%");
        assert.ok(historyBodies.length > 0);
      },
      { stored },
    );
  }

  await scenario(
    "manual refresh retries an unavailable history without changing the view",
    "/?board=dow&t=1w",
    async (page, { historyBodies, recover }) => {
      await page.getByText("1W unavailable", { exact: true }).waitFor();
      const before = historyBodies.length;
      recover();
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await waitLabel(page, "AAPL", "+4.76%");
      assert.ok(historyBodies.length > before);
      assert.match(page.url(), /t=1w/);
    },
    { history: "fail" },
  );

  for (const [instant, anchor, period] of [
    ["2026-10-07T13:00:00Z", "2026-10-07", "1w"],
    ["2026-01-02T13:00:00Z", "2026-01-02", "ytd"],
    ["2026-01-01T16:00:00Z", "2026-01-01", "ytd"],
    ["2026-10-10T16:00:00Z", "2026-10-10", "ytd"],
    ["2026-11-02T14:00:00Z", "2026-11-02", "ytd"],
  ]) {
    await scenario(
      `lookback anchor at ${instant}`,
      `/?board=dow&t=${period}`,
      async (page, { historyBodies }) => {
        await waitLabel(page, "AAPL", period === "1w" ? "+4.76%" : "+25.00%");
        for (const body of historyBodies) assert.match(body, new RegExp(anchor));
      },
      { now: new Date(instant) },
    );
  }
  await scenario(
    "YTD changes year while the session remains closed",
    "/?board=dow&t=ytd",
    async (page, { historyBodies }) => {
      await waitLabel(page, "AAPL", "+25.00%");
      assert.ok(historyBodies.some((body) => body.includes("2025-12-31")));
      await page.clock.setFixedTime(new Date("2026-01-01T05:00:01Z"));
      await page.waitForFunction(() => document.body.innerText.includes("00:00:01"));
      await page.waitForTimeout(100);
      assert.ok(historyBodies.some((body) => body.includes("2026-01-01")));
      await waitLabel(page, "AAPL", "+25.00%");
    },
    { now: new Date("2026-01-01T04:59:59Z") },
  );
  await scenario(
    "stock drill, back navigation and search preserve the period URL",
    "/?board=spx&t=1m",
    async (page) => {
      await waitLabel(page, "AAPL", "-12.00%");
      await tile(page, "AAPL").click();
      await page.getByRole("button", { name: "Open Technology", exact: true }).click();
      await waitLabel(page, "MSFT", "+4.65%");
      assert.match(page.url(), /sector=tech/);
      assert.match(page.url(), /t=1m/);
      await page.getByRole("button", { name: "Back to full map" }).click();
      await waitLabel(page, "AAPL", "-12.00%");
      assert.doesNotMatch(page.url(), /sector=/);
      assert.match(page.url(), /t=1m/);
    },
  );
  await scenario(
    "an empty search never displays the whole board's return",
    "/?board=dow&t=1w&q=NOSUCHNAME",
    async (page) => {
      await page.getByText("No 1W reference closes", { exact: true }).waitFor();
      assert.doesNotMatch(await page.locator("header").innerText(), /\+4\.91%/);
      assert.match(page.url(), /q=NOSUCHNAME/);
      await pick(page, "YTD");
      assert.match(page.url(), /q=NOSUCHNAME/);
      assert.match(page.url(), /t=ytd/);
    },
  );
  console.log(`${passed} browser scenarios passed`);
} finally {
  await browser.close();
}
