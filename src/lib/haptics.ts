// Light haptics for the quick wheel. Android app: the Capacitor Haptics
// plugin. Android browsers: a few milliseconds of vibration. iOS Safari and
// desktops have no haptics API, so these quietly do nothing there.
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

function vibrate(ms: number) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function")
      navigator.vibrate(ms);
  } catch {
    /* not allowed here */
  }
}

function native(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

function ignore(promise: Promise<unknown>) {
  promise.catch(() => undefined);
}

/** The wheel appeared: a light tap, and start selection ticks. */
export function hapticOpen() {
  if (native()) {
    ignore(Haptics.impact({ style: ImpactStyle.Light }));
    ignore(Haptics.selectionStart());
  } else vibrate(12);
}

/** The centred item changed. */
export function hapticTick() {
  if (native()) ignore(Haptics.selectionChanged());
  else vibrate(5);
}

/** The wheel closed (switched or cancelled). */
export function hapticClose() {
  if (native()) ignore(Haptics.selectionEnd());
}
