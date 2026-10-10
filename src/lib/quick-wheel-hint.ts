// One-time discoverability hint for the quick wheel, kept on this device.

const HINT_KEY = "lattice-quick-wheel-hint";

function readHint(): { picks: number; done: boolean } {
  try {
    const raw = JSON.parse(localStorage.getItem(HINT_KEY) ?? "{}") as {
      picks?: number;
      done?: boolean;
    };
    return { picks: Number(raw.picks) || 0, done: raw.done === true };
  } catch {
    return { picks: 0, done: true };
  }
}

function writeHint(value: { picks: number; done: boolean }) {
  try {
    localStorage.setItem(HINT_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}

/**
 * Count switches made through the Markets menu; on the third, if the wheel
 * was never used, return true once so the title can show a one-time hint.
 */
export function noteMenuSwitch(): boolean {
  const hint = readHint();
  if (hint.done) return false;
  const picks = hint.picks + 1;
  writeHint({ picks, done: picks >= 3 });
  return picks >= 3;
}

/** The wheel was used: no hint needed any more. */
export function markWheelUsed() {
  writeHint({ picks: 3, done: true });
}
