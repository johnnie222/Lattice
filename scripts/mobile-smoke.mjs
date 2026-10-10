#!/usr/bin/env node
// Smoke test for the Android (Capacitor) bundle without an Android SDK.
// Serves dist-mobile and runs it in Chromium. In a browser Capacitor's native
// HTTP falls back to fetch, so Yahoo is answered here with fixture payloads in
// Yahoo's own shapes: this exercises the phone's quote and history parsing,
// the reference-close rules and the on-device cache, with no app server.
// npm run build:mobile && CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/mobile-smoke.mjs
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const ROOT = new URL("../dist-mobile/", import.meta.url).pathname;
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  try {
    const body = await readFile(join(ROOT, path === "/" ? "index.html" : path));
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Wed 2026-10-07, 11:00 ET.
const NOW = new Date("2026-10-07T15:00:00Z");
// [previous close, price]
const LIVE = { AAPL: [100, 110], XOM: [200, 180], JPM: [200, 202], "^GSPC": [4000, 4040] };
// Daily closes by New York date (the 1W, 1M and YTD reference dates).
const BARS = {
  AAPL: { "2025-12-31": 88, "2026-09-04": 125, "2026-09-30": 105, "2026-10-06": 100 },
  XOM: { "2025-12-31": 150, "2026-09-04": 170, "2026-09-30": 200, "2026-10-06": 200 },
  JPM: { "2025-12-31": 180, "2026-09-04": 190, "2026-09-30": 202, "2026-10-06": 200 },
  "^GSPC": { "2025-12-31": 3500, "2026-09-04": 4100, "2026-09-30": 3900, "2026-10-06": 4000 },
};
// A 4pm-ET timestamp (seconds) for a New York date.
const at4pm = (date) => Date.parse(`${date}T20:00:00Z`) / 1000;

function yahoo(url) {
  const params = new URL(url).searchParams;
  const symbols = (params.get("symbols") ?? "").split(",").map(decodeURIComponent);
  const out = {};
  for (const symbol of symbols) {
    const live = LIVE[symbol] ?? [50, 51];
    if (params.get("range") === "1d") {
      const [prev, price] = live;
      out[symbol] = {
        symbol,
        fulldayPrice: price,
        fulldayChange: price - prev,
        chartPreviousClose: prev,
        previousClose: prev,
        timestamp: [at4pm("2026-10-07")],
        close: [price],
      };
    } else {
      const bars = BARS[symbol] ?? {
        "2025-12-31": 40,
        "2026-09-04": 45,
        "2026-09-30": 48,
        "2026-10-06": 50,
      };
      const dates = Object.keys(bars).sort();
      out[symbol] = { symbol, timestamp: dates.map(at4pm), close: dates.map((d) => bars[d]) };
    }
  }
  return out;
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
let passed = 0;
async function scenario(name, hash, run) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "dark",
  });
  await context.clock.setFixedTime(NOW);
  // An Android user's saved portfolio from the APK build (v3 positions).
  await context.addInitScript(() => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    const p = (symbol, shares, entry) => ({
      symbol,
      kind: "shares",
      shares,
      entry,
      since: null,
      added: "2026-09-01",
      anchor: null,
    });
    localStorage.setItem(
      "lattice-books-v1",
      JSON.stringify({
        state: {
          books: [
            {
              id: "main",
              name: "Main",
              positions: [p("AAPL", 2.5, 80), p("XOM", 0.75, 150), p("JPM", 1, null)],
            },
          ],
          activeId: "main",
        },
        version: 3,
      }),
    );
  });
  const page = await context.newPage();
  const errors = [];
  const yahooRanges = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const request = route.request();
    const target = request.url();
    if (target.startsWith(origin)) {
      // The phone has no app server: nothing but the bundle comes from here.
      assert.equal(request.method(), "GET", `unexpected ${request.method()} ${target}`);
      return route.continue();
    }
    if (target.startsWith("https://query2.finance.yahoo.com/v8/finance/spark")) {
      yahooRanges.push(new URL(target).searchParams.get("range"));
      return route.fulfill({
        json: yahoo(target),
        headers: { "access-control-allow-origin": "*" },
      });
    }
    const image = request.resourceType() === "image";
    return route.fulfill({
      status: 200,
      contentType: image ? "image/svg+xml" : "text/plain",
      body: image ? '<svg xmlns="http://www.w3.org/2000/svg"/>' : "",
    });
  });
  await page.goto(`${origin}/index.html${hash}`);
  try {
    await run(page, { yahooRanges });
    assert.deepEqual(errors, []);
    console.log(`PASS ${name}`);
    passed++;
  } finally {
    await context.close();
  }
}

const tile = (page, symbol, text) =>
  page.waitForFunction(
    ([s, t]) =>
      [...document.querySelectorAll("button.tile[aria-label]")].some(
        (b) =>
          b.getAttribute("aria-label").startsWith(`${s} `) &&
          b.getAttribute("aria-label").endsWith(t),
      ),
    [symbol, text],
  );

try {
  await scenario("Map: live quotes parsed on the phone", "#/", async (page, { yahooRanges }) => {
    await page.getByText("4,040.00", { exact: true }).waitFor();
    await page.getByTestId("map-pill").getByText("▲ 1.00%", { exact: true }).waitFor();
    await tile(page, "AAPL", "+10.00%");
    assert.ok(yahooRanges.every((range) => range === "1d"));
  });

  await scenario(
    "1W and YTD from Yahoo daily history, computed on the phone",
    "#/?t=1w",
    async (page, { yahooRanges }) => {
      await tile(page, "AAPL", "+4.76%");
      await page.getByTestId("map-pill").getByText("▲ 3.59%", { exact: true }).waitFor();
      assert.ok(yahooRanges.includes("1y"));
      await page.getByRole("radio", { name: "YTD", exact: true }).click();
      await tile(page, "AAPL", "+25.00%");
    },
  );

  await scenario(
    "Portfolio: an APK v3 portfolio survives, its day from the engine",
    "#/?tab=portfolio",
    async (page) => {
      await page.getByTestId("value-card").getByText("$612.00", { exact: true }).waitFor();
      await page.getByTestId("day-headline").getByText("+$12.00", { exact: true }).waitFor();
      assert.match(
        await page.getByTestId("day-line").innerText(),
        /^\+2\.00% · \+1\.00 pts vs S&P 500$/,
      );
      const saved = JSON.parse(await page.evaluate(() => localStorage.getItem("lattice-books-v1")));
      assert.equal(saved.version, 4);
      assert.equal(saved.state.books[0].positions.length, 3);
    },
  );

  console.log(`${passed} mobile scenarios passed`);
} finally {
  await browser.close();
  server.close();
}
