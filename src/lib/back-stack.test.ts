import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createOverlayStack, handleBack, installBackButton } from "./back-stack.ts";

function harness() {
  const calls: string[] = [];
  const overlays = createOverlayStack();
  const deps = {
    overlays,
    historyBack: () => calls.push("history"),
    exitApp: () => calls.push("exit"),
  };
  const open = (name: string) => overlays.push(() => calls.push(`close ${name}`));
  return { calls, overlays, deps, open };
}

describe("Android Back priority: overlay → history → exit", () => {
  it("closes the open overlay and does nothing else, even when history could go back", () => {
    const { calls, deps, open } = harness();
    open("markets");
    assert.equal(handleBack(true, deps), "overlay");
    assert.deepEqual(calls, ["close markets"]);
  });

  it("closes the topmost overlay first, one per press", () => {
    const { calls, deps, open } = harness();
    open("controls");
    open("wheel");
    assert.equal(handleBack(true, deps), "overlay");
    assert.equal(handleBack(true, deps), "overlay");
    assert.equal(handleBack(true, deps), "history");
    assert.deepEqual(calls, ["close wheel", "close controls", "history"]);
  });

  it("ignores overlays that have already closed", () => {
    const { calls, deps, open } = harness();
    const unregister = open("position");
    unregister();
    assert.equal(handleBack(false, deps), "exit");
    assert.deepEqual(calls, ["exit"]);
  });

  it("a second press before the overlay unmounts moves on instead of closing it twice", () => {
    const { calls, deps, overlays } = harness();
    // The sheet unregisters only when React unmounts it, after the press.
    const unregister = overlays.push(() => calls.push("close sheet"));
    handleBack(true, deps);
    handleBack(true, deps);
    unregister();
    assert.deepEqual(calls, ["close sheet", "history"]);
  });

  it("with nothing open, goes back when the WebView can", () => {
    const { calls, deps } = harness();
    assert.equal(handleBack(true, deps), "history");
    assert.deepEqual(calls, ["history"]);
  });

  it("with nothing open at the app root, exits the app", () => {
    const { calls, deps } = harness();
    assert.equal(handleBack(false, deps), "exit");
    assert.deepEqual(calls, ["exit"]);
  });
});

describe("installBackButton", () => {
  it("listens for backButton and applies the same priority with the App plugin", () => {
    const calls: string[] = [];
    let listener: ((event: { canGoBack: boolean }) => void) | null = null;
    const app = {
      addListener: (event: "backButton", fn: (event: { canGoBack: boolean }) => void) => {
        assert.equal(event, "backButton");
        listener = fn;
        return Promise.resolve({ remove: async () => undefined });
      },
      exitApp: () => {
        calls.push("exit");
        return Promise.resolve();
      },
    };
    const overlays = createOverlayStack();
    installBackButton(app, { overlays, historyBack: () => calls.push("history") });
    assert.ok(listener, "registered a backButton listener");
    const press = (canGoBack: boolean) => listener!({ canGoBack });

    overlays.push(() => calls.push("close wheel"));
    press(true);
    press(true);
    press(false);
    assert.deepEqual(calls, ["close wheel", "history", "exit"]);
  });
});
