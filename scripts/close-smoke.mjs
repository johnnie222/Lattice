#!/usr/bin/env node
// Deterministic browser regressions for Lattice Close (#3). Start npm run dev first.
// Fixture quotes, a pinned clock, and loopback only; no portfolio data leaves the page.
// CHROMIUM_PATH=/usr/bin/chromium SCREENSHOT_DIR=screenshots node scripts/close-smoke.mjs
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

const AFTER_CLOSE = new Date("2026-10-07T21:30:00Z"); // Wed 17:30 ET
const DURING_SESSION = new Date("2026-10-07T15:00:00Z"); // Wed 11:00 ET
const SECTOR_FUNDS = ["XLK", "XLF", "XLE", "XLV", "XLY", "XLP", "XLI", "XLB", "XLRE", "XLU", "XLC"];

const quote = (symbol, price, previousClose) => ({
  symbol,
  price,
  previousClose,
  change: price - previousClose,
  changePercent: (price / previousClose - 1) * 100,
});
// AAPL +$25 (+10%), XOM −$15 (−10%), JPM +$2 (+1%): +$12 on $600 = +2.00%.
const holdingQuotes = [quote("AAPL", 110, 100), quote("XOM", 180, 200), quote("JPM", 202, 200)];
// S&P +1%; XLK leads at +2%, XLE lags at −1.5%; 9 of 11 sectors up: broad advance.
const marketQuotes = [
  quote("^GSPC", 6060, 6000),
  ...SECTOR_FUNDS.map((symbol, i) =>
    symbol === "XLK"
      ? quote(symbol, 102, 100)
      : symbol === "XLE"
        ? quote(symbol, 98.5, 100)
        : i === 10
          ? quote(symbol, 99.8, 100)
          : quote(symbol, 100.5, 100),
  ),
];
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
  state,
  run,
  { at = AFTER_CLOSE, width = 390, path = "/?board=book", timezoneId = "Asia/Jerusalem" } = {},
) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, timezoneId });
  await context.clock.setFixedTime(at);
  const page = await context.newPage();
  let quotes = [...holdingQuotes, ...marketQuotes];
  const requested = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript((s) => {
    if (!localStorage.getItem("lattice-books-v1"))
      localStorage.setItem("lattice-books-v1", JSON.stringify({ state: s, version: 1 }));
  }, state);
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (!request.url().startsWith(origin + "/")) {
      return route.fulfill({
        status: 200,
        contentType: request.resourceType() === "image" ? "image/svg+xml" : "text/plain",
        body: request.resourceType() === "image" ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : "",
      });
    }
    if (request.method() === "POST") {
      const body = request.postData() || "";
      // Only public tickers may leave the page.
      assert.doesNotMatch(
        body,
        /quantity|averageCost|costBasis|dayChange|pricedValue|notional|holdings/,
      );
      requested.push(body);
      return route.fulfill({ json: { result: { quotes, asOf: at.getTime() }, context: {} } });
    }
    return route.continue();
  });
  await page.goto(origin + path);
  try {
    const clockLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(at);
    await page
      .getByRole("button", { name: "Refresh quotes" })
      .getByText(clockLabel, { exact: true })
      .waitFor();
    await run(page, { setQuotes: (value) => (quotes = value), requested, context });
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
const expectText = (page, text) => page.getByText(text, { exact: true }).first().waitFor();
const dialogText = (page) => page.getByRole("dialog").innerText();

try {
  await scenario(
    "full close: result, drivers, breadth, sectors, market context",
    { books: [book], activeId: "main" },
    async (page) => {
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(
        page,
        "Your portfolio returned +2.00%, 1.00 pts ahead of the S&P 500. AAPL was the largest contributor; 2 up · 1 down · 0 flat among 3 priced holdings.",
      );
      await expectText(page, "+$12.00");
      await expectText(page, "+2.00%");
      await expectText(page, "+1.00 pts");
      const text = await dialogText(page);
      assert.match(text, /Top contributors[\s\S]*AAPL[\s\S]*\+\$25\.00[\s\S]*JPM[\s\S]*\+\$2\.00/i);
      assert.match(text, /Top detractors[\s\S]*XOM[\s\S]*−\$15\.00/i);
      assert.match(text, /2 up · 1 down · 0 flat/);
      assert.match(text, /Strongest · Technology[\s\S]*\+\$25\.00/);
      assert.match(text, /Weakest · Energy[\s\S]*−\$15\.00/);
      assert.match(text, /S&P 500\s+\+1\.00%/);
      assert.match(text, /Led · Technology \(XLK\)\s+\+2\.00%/);
      assert.match(text, /Lagged · Energy \(XLE\)\s+-1\.50%/);
      assert.match(text, /Broad advance · 9 of 11 sectors up/);
      await page.screenshot({ path: `${shots}/pr-close-full-mobile.png` });
      await page
        .getByRole("dialog")
        .evaluate((el) => el.querySelector(".overflow-y-auto").scrollTo(0, 1e6));
      await page.screenshot({ path: `${shots}/pr-close-full-mobile-bottom.png` });
      // The same facts are one tap from My Portfolio Today.
      await page.getByRole("button", { name: "Full details in My Portfolio Today" }).click();
      await page.getByRole("dialog", { name: "My Portfolio Today" }).waitFor();
      await expectText(page, "+2.00%");
    },
  );

  await scenario(
    "large portfolio P&L is readable at phone width",
    {
      books: [
        { ...book, holdings: book.holdings.map((h) => ({ ...h, quantity: h.quantity * 10000 })) },
      ],
      activeId: "main",
    },
    async (page) => {
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(page, "+$120,000.00");
      const clipped = await page
        .getByRole("dialog")
        .locator("dl")
        .first()
        .locator("dd")
        .evaluateAll((elements) =>
          elements.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
        );
      assert.deepEqual(clipped, [], "financial results must remain readable, not ellipsized");
      const clippedFacts = await page
        .getByRole("dialog")
        .locator("li span.font-mono")
        .evaluateAll((elements) =>
          elements.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
        );
      assert.deepEqual(clippedFacts, [], "sector facts must remain readable too");
      await page.screenshot({ path: `${shots}/pr-close-large-mobile.png` });
    },
  );

  await scenario(
    "partial close never shows a return or benchmark comparison",
    { books: [book], activeId: "main" },
    async (page, { setQuotes }) => {
      setQuotes([...holdingQuotes.filter((q) => q.symbol !== "XOM"), ...marketQuotes]);
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(
        page,
        "Partial close: +$27.00 from 2 of 3 holdings with prices. AAPL was the largest known contributor; 2 up · 0 down · 0 flat among 2 priced holdings.",
      );
      await expectText(page, "Known P&L");
      const text = await dialogText(page);
      assert.match(text, /missing XOM/);
      // No return, no benchmark comparison, no share-of-return figures.
      assert.match(text, /Return\s+—/);
      assert.match(text, /vs S&P 500\s+—/);
      assert.doesNotMatch(text, /pts ahead|pts behind|of return/);
      await page.screenshot({ path: `${shots}/pr-close-partial-mobile.png` });
    },
  );

  await scenario(
    "incomplete sector data never calls the day",
    { books: [book], activeId: "main" },
    async (page, { setQuotes }) => {
      setQuotes([...holdingQuotes, ...marketQuotes.filter((q) => q.symbol !== "XLU")]);
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(page, "Sector data incomplete · 10 of 11 priced");
      assert.doesNotMatch(await dialogText(page), /Led ·|Lagged ·/);
      assert.doesNotMatch(await dialogText(page), /Broad advance|Broad decline|Mixed/);
    },
  );

  await scenario(
    "during the session the strip stays My Portfolio Today",
    { books: [book], activeId: "main" },
    async (page) => {
      await page.getByRole("button", { name: "Open My Portfolio Today" }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Open Lattice Close" }).count(), 0);
    },
    { at: DURING_SESSION },
  );

  await scenario(
    "legacy weight book gets the market close and a conversion note",
    {
      books: [
        {
          id: "old",
          name: "Old",
          lines: [
            { symbol: "AAPL", weight: 60 },
            { symbol: "XOM", weight: 40 },
          ],
          notional: 1000,
        },
      ],
      activeId: "old",
    },
    async (page) => {
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(page, "The S&P 500 moved +1.00% in a broad advance.");
      assert.match(await dialogText(page), /Convert this book in Edit book/);
    },
  );

  await scenario(
    "missing benchmark agrees with Today and never implies relative performance",
    { books: [book], activeId: "main" },
    async (page, { setQuotes }) => {
      setQuotes([...holdingQuotes, ...marketQuotes.filter((q) => q.symbol !== "^GSPC")]);
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(
        page,
        "Your portfolio returned +2.00%. AAPL was the largest contributor; 2 up · 1 down · 0 flat among 3 priced holdings.",
      );
      const text = await dialogText(page);
      assert.match(text, /vs S&P 500\s+—/);
      assert.match(text, /Market[\s\S]*S&P 500\s+—/i);
      assert.doesNotMatch(text, /pts ahead|pts behind|in line with/);
      await page.getByRole("button", { name: "Full details in My Portfolio Today" }).click();
      await expectText(page, "S&P 500 not loaded");
      await expectText(page, "+2.00%");
    },
  );

  await scenario(
    "eight of eleven advancing sectors is mixed, not a broad advance",
    { books: [book], activeId: "main" },
    async (page, { setQuotes }) => {
      setQuotes([
        ...holdingQuotes,
        quote("^GSPC", 6060, 6000),
        ...SECTOR_FUNDS.map((symbol, i) => quote(symbol, i < 8 ? 101 : 99, 100)),
      ]);
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await expectText(page, "Mixed · 8 of 11 sectors up");
      assert.doesNotMatch(await dialogText(page), /Broad advance/);
    },
  );

  for (const [name, at, timezoneId, close, when] of [
    ["pre-market", "2026-10-07T13:29:59Z", "Asia/Jerusalem", true, "Before the open"],
    ["exact regular open", "2026-10-07T13:30:00Z", "Asia/Jerusalem", false, null],
    ["exact regular close", "2026-10-07T20:00:00Z", "America/Los_Angeles", true, "After the close"],
    ["Saturday", "2026-10-10T15:00:00Z", "UTC", true, "Market closed"],
    [
      "Sunday in NY but Monday in Jerusalem",
      "2026-10-12T02:00:00Z",
      "Asia/Jerusalem",
      true,
      "Market closed",
    ],
    [
      "observed Independence Day",
      "2026-07-03T15:00:00Z",
      "America/Los_Angeles",
      true,
      "Market holiday",
    ],
    ["Thanksgiving", "2026-11-26T16:00:00Z", "Asia/Jerusalem", true, "Market holiday"],
    ["early-close boundary", "2026-11-27T18:00:00Z", "Asia/Jerusalem", true, "After the close"],
    ["winter regular hours", "2026-11-02T14:30:00Z", "Asia/Jerusalem", false, null],
  ]) {
    await scenario(
      `session: ${name} (${timezoneId})`,
      { books: [book], activeId: "main" },
      async (page) => {
        const label = close ? "Open Lattice Close" : "Open My Portfolio Today";
        await page.getByRole("button", { name: label }).waitFor();
        assert.equal(
          await page
            .getByRole("button", {
              name: close ? "Open My Portfolio Today" : "Open Lattice Close",
              exact: true,
            })
            .count(),
          0,
        );
        if (close) {
          await page.getByRole("button", { name: label }).click();
          await page.getByRole("dialog", { name: "Lattice Close", exact: true }).waitFor();
          assert.match(await dialogText(page), new RegExp(when));
        }
      },
      { at: new Date(at), timezoneId },
    );
  }

  await scenario(
    "an open Close dialog becomes Today at the regular-session boundary",
    { books: [book], activeId: "main" },
    async (page, { context }) => {
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      await page.getByRole("dialog", { name: "Lattice Close", exact: true }).waitFor();
      await context.clock.setFixedTime(new Date("2026-10-07T13:30:00Z"));
      await page.getByRole("button", { name: "Open My Portfolio Today" }).waitFor();
      await page.getByRole("dialog", { name: "My Portfolio Today", exact: true }).waitFor();
      assert.equal(
        await page.getByRole("dialog", { name: "Lattice Close", exact: true }).count(),
        0,
      );
    },
    { at: new Date("2026-10-07T13:29:59Z") },
  );

  await scenario(
    "Today switches to Close at the 1pm early-close boundary",
    { books: [book], activeId: "main" },
    async (page, { context }) => {
      await page.getByRole("button", { name: "Open My Portfolio Today" }).waitFor();
      await context.clock.setFixedTime(new Date("2026-11-27T18:00:00Z"));
      await page.getByRole("button", { name: "Open Lattice Close" }).click();
      assert.match(await dialogText(page), /After the close/);
    },
    { at: new Date("2026-11-27T17:59:59Z") },
  );

  for (const width of [390, 1280]) {
    await scenario(
      `market map unchanged at ${width}px`,
      { books: [book], activeId: "main" },
      async (page, { requested }) => {
        await page.getByRole("button", { name: /^AAPL \$/ }).waitFor();
        assert.equal(
          await page
            .getByRole("button", { name: /Open Lattice Close|Open My Portfolio Today/ })
            .count(),
          0,
        );
        // The market map fetches no extra benchmark or sector-fund quotes.
        assert.ok(requested.length > 0);
        for (const body of requested) assert.doesNotMatch(body, /"\^GSPC"|"XLK"|"XLE"|"XLU"/);
      },
      { width, path: "/" },
    );
  }

  console.log(`${passed} browser scenarios passed`);
} finally {
  await browser.close();
}
