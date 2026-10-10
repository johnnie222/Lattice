#!/usr/bin/env node
// Deterministic browser regressions for #2/#17. Start npm run dev first.
// Uses fixture quotes, not live-market validation. No portfolio data leaves loopback.
// CHROMIUM_PATH=/usr/bin/chromium node scripts/portfolio-smoke.mjs
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { checkedUrl } from "./browser-guard.mjs";

const url = checkedUrl(process.argv[2] || "http://127.0.0.1:8080/");
const origin = new URL(url).origin;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
const quote = (symbol, price, previousClose) => ({
  symbol,
  price,
  previousClose,
  change: price - previousClose,
  changePercent: (price / previousClose - 1) * 100,
});
const allQuotes = [quote("AAPL", 110, 100), quote("XOM", 180, 200), quote("^GSPC", 6060, 6000)];
const book = {
  id: "main",
  name: "Main",
  holdings: [
    { symbol: "AAPL", quantity: 2.5, averageCost: 80 },
    { symbol: "XOM", quantity: 0.75, averageCost: 150 },
  ],
  lines: [],
  notional: null,
};
let passed = 0;
async function scenario(name, state, run, version = 1, width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 844 } });
  const page = await context.newPage();
  let quotes = allQuotes;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.addInitScript(
    ({ state, version }) => {
      if (!localStorage.getItem("lattice-books-v1"))
        localStorage.setItem(
          "lattice-books-v1",
          JSON.stringify({ state, ...(version == null ? {} : { version }) }),
        );
    },
    { state, version },
  );
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (!request.url().startsWith(origin + "/")) {
      // Controlled external assets: quote behavior is tested independently.
      return route.fulfill({
        status: 200,
        contentType: request.resourceType() === "image" ? "image/svg+xml" : "text/plain",
        body: request.resourceType() === "image" ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : "",
      });
    }
    if (request.method() === "POST") {
      const body = request.postData() || "";
      assert.doesNotMatch(
        body,
        /quantity|averageCost|costBasis|dayChange|pricedValue|notional|holdings/,
      );
      if (quotes === null)
        return route.fulfill({
          status: 503,
          contentType: "text/plain",
          body: "fixture upstream unavailable",
        });
      return route.fulfill({ json: { result: { quotes, asOf: Date.now() }, context: {} } });
    }
    return route.continue();
  });
  await page.goto(`${origin}/?board=book`);
  try {
    await run(page, (value) => {
      quotes = value;
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
const persisted = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("lattice-books-v1")).state);
const closeSheet = (page) =>
  page.getByRole("dialog").getByRole("button", { name: "Close", exact: true }).click();
const expectText = async (page, text) => {
  await page.getByText(text, { exact: true }).first().waitFor();
};

try {
  await scenario(
    "fractional daily math, benchmark, partial refresh, local-only persistence",
    { books: [book], activeId: "main" },
    async (page, setQuotes) => {
      await expectText(page, "+$10.00");
      await page.getByRole("button", { name: "Open My Portfolio Today" }).click();
      await expectText(page, "+2.50%");
      await expectText(page, "+1.50 pts");
      await expectText(page, "+$97.50 (+31.20%)");
      await page.screenshot({ path: "/workspace/screenshots/pr22-today-mobile.png" });
      await closeSheet(page);
      setQuotes(allQuotes.filter((q) => q.symbol !== "XOM"));
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await expectText(page, "Partial data");
      await page.getByRole("button", { name: "Open My Portfolio Today" }).click();
      await expectText(page, "+$25.00");
      await expectText(page, "Needs every holding priced");
      assert.doesNotMatch(await page.getByRole("dialog").innerText(), /\+2\.50%|\+1\.50 pts/);
      await closeSheet(page);
      await page.getByRole("button", { name: "Edit book", exact: true }).click();
      await page.getByLabel("AAPL average cost", { exact: true }).fill("invalid");
      await page.getByLabel("AAPL average cost", { exact: true }).blur();
      assert.equal((await persisted(page)).books[0].holdings[0].averageCost, 80);
      await page.reload();
      await page.getByRole("button", { name: "Edit book", exact: true }).click();
      assert.equal(await page.getByLabel("AAPL shares", { exact: true }).inputValue(), "2.5");
      assert.equal(await page.getByLabel("AAPL average cost", { exact: true }).inputValue(), "80");
    },
  );

  await scenario(
    "missing benchmark, unknown close and total quote outage never fake full returns",
    { books: [book], activeId: "main" },
    async (page, setQuotes) => {
      await expectText(page, "+$10.00");
      setQuotes(allQuotes.filter((q) => q.symbol !== "^GSPC"));
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await page.getByRole("button", { name: "Open My Portfolio Today" }).click();
      await expectText(page, "S&P 500 not loaded");
      await expectText(page, "+2.50%");
      assert.doesNotMatch(await page.getByRole("dialog").innerText(), /\+1\.50 pts/);
      await closeSheet(page);
      setQuotes([
        { ...allQuotes[0], previousClose: null, change: null, changePercent: null },
        ...allQuotes.slice(1),
      ]);
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await expectText(page, "Partial data");
      await page.getByRole("button", { name: "Open My Portfolio Today" }).click();
      await expectText(page, "−$15.00");
      await expectText(page, "Needs every holding priced");
      await closeSheet(page);
      setQuotes(null);
      await page.getByRole("button", { name: "Refresh quotes" }).click();
      await expectText(page, "Tape delayed");
      await expectText(page, "Waiting for prices");
      assert.doesNotMatch(await page.locator("body").innerText(), /\+0\.00%|\+2\.50%|\+1\.50 pts/);
    },
  );

  const legacy = {
    books: [
      {
        id: "one",
        name: "One",
        lines: [
          { symbol: "AAPL", weight: 100 },
          { symbol: "XOM", weight: 0 },
        ],
        notional: 1000,
      },
      { id: "two", name: "Two", lines: [{ symbol: "AAPL", weight: 100 }], notional: 2000 },
    ],
    activeId: "one",
  };
  await scenario(
    "legacy open/reload, cross-book draft isolation, zero-weight preservation, conversion",
    legacy,
    async (page) => {
      await page.getByRole("button", { name: "Edit book", exact: true }).click();
      assert.deepEqual((await persisted(page)).books[0].lines, legacy.books[0].lines);
      await page.getByLabel("AAPL shares", { exact: true }).fill("0.000012345");
      await page.getByRole("button", { name: "Two", exact: true }).click();
      assert.equal(await page.getByLabel("AAPL shares", { exact: true }).inputValue(), "");
      assert.equal(
        await page.getByRole("button", { name: "Convert to holdings" }).isDisabled(),
        true,
      );
      await page.getByRole("button", { name: "One", exact: true }).click();
      await page.getByLabel("AAPL shares", { exact: true }).fill("0.000012345");
      assert.equal(
        await page.getByRole("button", { name: "Convert to holdings" }).isDisabled(),
        true,
      );
      await page.getByLabel("XOM shares", { exact: true }).fill("0.25");
      await page.getByRole("button", { name: "Convert to holdings" }).click();
      let saved = await persisted(page);
      assert.equal(saved.books[0].holdings[0].quantity, 0.000012345);
      assert.deepEqual(saved.books[1].lines, legacy.books[1].lines);
      await page.reload();
      await page.getByRole("button", { name: "Edit book", exact: true }).click();
      saved = await persisted(page);
      assert.equal(saved.books[0].holdings[1].quantity, 0.25);
      assert.equal(saved.books[1].notional, 2000);
    },
    0,
  );

  for (const version of [1, null]) {
    await scenario(
      `legacy snapshot with ${version == null ? "absent" : "matching"} version opens safely`,
      { books: [legacy.books[1]], activeId: "two" },
      async (page) => {
        await page.getByRole("button", { name: "Edit book", exact: true }).click();
        await page.getByText("Switch Two to real holdings", { exact: true }).waitFor();
        await page.getByLabel("AAPL shares", { exact: true }).fill("3.125");
        await page.getByRole("button", { name: "Convert to holdings" }).click();
        assert.equal((await persisted(page)).books[0].holdings[0].quantity, 3.125);
      },
      version,
    );
  }

  for (const width of [390, 1280]) {
    await scenario(
      `market map and portfolio layout at ${width}px`,
      { books: [book], activeId: "main" },
      async (page) => {
        await expectText(page, "+$10.00");
        await page.goto(origin + "/");
        await page.getByRole("button", { name: /^AAPL \$/ }).waitFor();
        assert.equal(
          await page.getByRole("button", { name: "Open My Portfolio Today" }).count(),
          0,
        );
        await page.screenshot({ path: `/workspace/screenshots/pr22-market-${width}.png` });
        await page.getByRole("button", { name: /^AAPL \$/ }).click();
        await page.getByRole("dialog", { name: "AAPL", exact: true }).waitFor();
        await expectText(page, "2.5 shares");
        await closeSheet(page);
        await page.goto(origin + "/?board=dow");
        await page.getByRole("button", { name: /^AAPL \$/ }).waitFor();
      },
      1,
      width,
    );
  }
  console.log(`${passed} browser scenarios passed`);
} finally {
  await browser.close();
}
