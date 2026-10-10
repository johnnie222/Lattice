/**
 * Android Back for the Capacitor app (pure, so the order is unit-tested):
 * 1. a dismissible overlay is open (a sheet, the quick wheel): close the
 *    topmost one and do nothing else;
 * 2. otherwise, if the WebView can go back: window.history.back();
 * 3. otherwise, at the app root: exit the app.
 * Overlays register here while open; they never add history entries. Only
 * the Android entry point listens for the button, so web and PWA Back are
 * the browser's own.
 */

export type OverlayStack = {
  /** Register an open overlay; returns the function that unregisters it. */
  push: (dismiss: () => void) => () => void;
  /** Close the most recently opened overlay. False when none is open. */
  closeTop: () => boolean;
  size: () => number;
};

export function createOverlayStack(): OverlayStack {
  const stack: { dismiss: () => void }[] = [];
  return {
    push(dismiss) {
      const entry = { dismiss };
      stack.push(entry);
      return () => {
        const at = stack.lastIndexOf(entry);
        if (at >= 0) stack.splice(at, 1);
      };
    },
    closeTop() {
      // Taken off before dismissing, so a second Back before the overlay
      // has unmounted moves on instead of closing it again.
      const top = stack.pop();
      if (!top) return false;
      top.dismiss();
      return true;
    },
    size: () => stack.length,
  };
}

/** The app's overlays: every Sheet and the quick wheel register here. */
export const overlays = createOverlayStack();

export type BackAction = "overlay" | "history" | "exit";

export function handleBack(
  canGoBack: boolean,
  deps: { overlays: OverlayStack; historyBack: () => void; exitApp: () => void },
): BackAction {
  if (deps.overlays.closeTop()) return "overlay";
  if (canGoBack) {
    deps.historyBack();
    return "history";
  }
  deps.exitApp();
  return "exit";
}

type BackButtonApp = {
  addListener: (event: "backButton", listener: (event: { canGoBack: boolean }) => void) => unknown;
  exitApp: () => unknown;
};

/**
 * Take over Android's Back button. A registered listener replaces
 * Capacitor's default (go back, else exit), so all three cases live here.
 */
export function installBackButton(
  app: BackButtonApp,
  deps: { overlays?: OverlayStack; historyBack?: () => void } = {},
): void {
  const stack = deps.overlays ?? overlays;
  const historyBack = deps.historyBack ?? (() => window.history.back());
  void app.addListener("backButton", ({ canGoBack }) => {
    handleBack(canGoBack, {
      overlays: stack,
      historyBack,
      exitApp: () => void app.exitApp(),
    });
  });
}
