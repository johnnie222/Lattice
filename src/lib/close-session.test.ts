import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, it } from "node:test";
import type { Session } from "./format.ts";

// Explicit UTC instants and independently specified NYSE sessions. Browser
// clock pinning must not turn a host-timezone mistake into a passing test.
const cases: [string, Session, string][] = [
  ["2026-10-07T13:29:59Z", "pre", "09:29:59"],
  ["2026-10-07T13:30:00Z", "open", "09:30:00"],
  ["2026-10-07T19:59:59Z", "open", "15:59:59"],
  ["2026-10-07T20:00:00Z", "post", "16:00:00"],
  ["2026-10-08T00:00:00Z", "closed", "20:00:00"],
  ["2026-10-10T15:00:00Z", "closed", "11:00:00"],
  ["2026-10-11T15:00:00Z", "closed", "11:00:00"],
  ["2026-10-12T02:00:00Z", "closed", "22:00:00"], // Still Sunday in NY
  ["2026-10-10T02:00:00Z", "closed", "22:00:00"], // Still Friday in NY
  ["2026-03-06T14:29:59Z", "pre", "09:29:59"], // Before US DST
  ["2026-03-06T14:30:00Z", "open", "09:30:00"],
  ["2026-03-09T13:30:00Z", "open", "09:30:00"], // After US DST
  ["2026-11-02T14:30:00Z", "open", "09:30:00"], // After fall-back
  ["2026-11-02T21:00:00Z", "post", "16:00:00"],
  ["2026-01-01T16:00:00Z", "holiday", "11:00:00"],
  ["2026-04-03T15:00:00Z", "holiday", "11:00:00"], // Good Friday
  ["2026-06-19T15:00:00Z", "holiday", "11:00:00"],
  ["2026-07-03T15:00:00Z", "holiday", "11:00:00"], // Observed Independence Day
  ["2026-11-26T16:00:00Z", "holiday", "11:00:00"],
  ["2026-11-27T17:59:59Z", "open", "12:59:59"],
  ["2026-11-27T18:00:00Z", "post", "13:00:00"], // Early close
  ["2026-12-24T18:00:00Z", "post", "13:00:00"],
  ["2026-12-25T16:00:00Z", "holiday", "11:00:00"],
  ["2021-12-31T16:00:00Z", "open", "11:00:00"], // NYSE New Year's Saturday exception
];

describe("Lattice Close uses New York's session, independent of the host timezone", () => {
  for (const timezone of ["UTC", "Asia/Jerusalem", "America/Los_Angeles"]) {
    it(`checks session boundaries, weekends, holidays and early closes under ${timezone}`, () => {
      const moduleUrl = new URL("./format.ts", import.meta.url).href;
      const source = `import { marketClock } from ${JSON.stringify(moduleUrl)};
        console.log(JSON.stringify(${JSON.stringify(cases)}.map(([at]) => marketClock(new Date(at)))));`;
      const results = JSON.parse(
        execFileSync(
          process.execPath,
          ["--experimental-strip-types", "--input-type=module", "-e", source],
          {
            env: { ...process.env, TZ: timezone },
            encoding: "utf8",
          },
        ),
      );
      for (const [index, [at, session, label]] of cases.entries())
        assert.deepEqual(results[index], { session, label }, `${timezone}: ${at}`);
    });
  }
});
