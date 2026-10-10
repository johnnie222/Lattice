import { useEffect, useState } from "react";
import { fetchReferenceCloses } from "@/lib/history";
import { isLookback, referenceDate, type Period, type ReferenceClose } from "@/lib/periods";

// Reference closes don't move during a session, so they're cached per
// period + anchor session for the browser session and never polled. The live
// quote path (useQuotes) is separate and keeps its own cadence.
const STORAGE = "lattice-refs-v1";

type Stored = Record<string, ReferenceClose>;

function storageKey(period: Period, anchor: string) {
  return `${STORAGE}:${period}:${anchor}`;
}

function validReferences(raw: unknown, period: Exclude<Period, "1d">, anchor: string): Stored {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const date = referenceDate(period, anchor);
  return Object.fromEntries(
    Object.entries(raw).filter(([, value]) => {
      if (!value || typeof value !== "object") return false;
      const ref = value as ReferenceClose;
      return (
        ref.date === date &&
        (ref.close === null ||
          (typeof ref.close === "number" && Number.isFinite(ref.close) && ref.close > 0))
      );
    }),
  );
}

function readStored(key: string, period: Exclude<Period, "1d">, anchor: string): Stored {
  try {
    return validReferences(JSON.parse(sessionStorage.getItem(key) ?? "{}"), period, anchor);
  } catch {
    return {};
  }
}

export function useReferenceCloses(
  symbols: readonly string[],
  period: Period,
  anchor: string,
  refreshToken = 0,
) {
  const key = isLookback(period) ? symbols.filter(Boolean).join("|") : "";
  const [state, setState] = useState<{
    id: string;
    references: Stored;
    status: "idle" | "loading" | "ready" | "error";
  }>({
    id: "",
    references: {},
    status: "idle",
  });
  const id = `${period}:${anchor}:${key}:${refreshToken}`;

  useEffect(() => {
    if (!key || !isLookback(period)) {
      setState({ id, references: {}, status: "idle" });
      return;
    }
    let cancel = false;
    const storage = storageKey(period, anchor);
    const cached = readStored(storage, period, anchor);
    const list = key.split("|");
    const need = list.filter((symbol) => !cached[symbol]);
    setState({ id, references: cached, status: need.length ? "loading" : "ready" });
    if (!need.length) return;

    void (async () => {
      const batches = [need.slice(0, 40), need.slice(40, 180), need.slice(180)];
      let failed = false;
      let merged = { ...cached };
      for (const batch of batches) {
        if (cancel || !batch.length) continue;
        try {
          const res: Awaited<ReturnType<typeof fetchReferenceCloses>> = await fetchReferenceCloses({
            data: { symbols: batch, period, anchor },
          });
          if (cancel) return;
          // The server may have corrected the anchor; only keep matching answers.
          if (res.anchor !== anchor || res.period !== period) {
            failed = true;
            continue;
          }
          // Unavailable symbols stay out of the cache so the next view retries them.
          if (res.unavailable.length) failed = true;
          merged = { ...merged, ...validReferences(res.references, period, anchor) };
          setState({ id, references: merged, status: "loading" });
        } catch {
          failed = true;
        }
      }
      if (cancel) return;
      setState({ id, references: merged, status: failed ? "error" : "ready" });
      try {
        sessionStorage.setItem(storage, JSON.stringify(merged));
      } catch {
        /* quota */
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id, key, period, anchor]);

  // Never hand out references from a previous period/session while switching.
  return state.id === id
    ? state
    : { id, references: {}, status: isLookback(period) ? "loading" : "idle" };
}
