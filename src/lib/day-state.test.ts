import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dayState } from "./day-state.ts";

// Explicit UTC instants; October 2026 is EDT (UTC−4), March 6 is EST (UTC−5).
const at = (iso: string) => dayState(new Date(iso));

describe("dayState", () => {
  it("TODAY only while the regular session is open", () => {
    assert.deepEqual(at("2026-10-07T13:30:00Z"), {
      kind: "today",
      session: "2026-10-07",
      label: "Today",
    });
    assert.equal(at("2026-10-07T19:59:00Z").kind, "today");
    assert.equal(at("2026-03-06T14:30:00Z").kind, "today"); // 9:30 EST
  });

  it("CLOSE after the same day's close, including after hours and late evening", () => {
    assert.deepEqual(at("2026-10-07T20:00:00Z"), {
      kind: "close",
      session: "2026-10-07",
      label: "Close",
    });
    assert.equal(at("2026-10-08T03:30:00Z").kind, "close"); // 23:30 ET
  });

  it("early closes end at 1pm", () => {
    assert.equal(at("2026-11-27T17:59:00Z").kind, "today");
    assert.deepEqual(at("2026-11-27T18:00:00Z"), {
      kind: "close",
      session: "2026-11-27",
      label: "Close",
    });
  });

  it("LAST CLOSE before the open, labelled with the previous session", () => {
    // Wed 9:29 ET and Wed 4am pre-market: Tuesday's session.
    assert.deepEqual(at("2026-10-07T13:29:00Z"), {
      kind: "last-close",
      session: "2026-10-06",
      label: "Last close · Tue",
    });
    assert.equal(at("2026-10-07T08:00:00Z").label, "Last close · Tue");
    // Monday before the open: Friday.
    assert.equal(at("2026-10-12T12:00:00Z").label, "Last close · Fri");
  });

  it("LAST CLOSE on weekends and holidays", () => {
    assert.deepEqual(at("2026-10-10T15:00:00Z"), {
      kind: "last-close",
      session: "2026-10-09",
      label: "Last close · Fri",
    });
    assert.equal(at("2026-10-11T23:00:00Z").label, "Last close · Fri"); // Sunday evening
    // Good Friday 2026-04-03: Thursday's session.
    assert.deepEqual(at("2026-04-03T16:00:00Z"), {
      kind: "last-close",
      session: "2026-04-02",
      label: "Last close · Thu",
    });
    // Labor Day Monday 2026-09-07: the Friday before.
    assert.equal(at("2026-09-07T16:00:00Z").session, "2026-09-04");
  });
});
