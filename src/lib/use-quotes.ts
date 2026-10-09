import { useEffect, useState } from "react";
import { marketClock, type Session } from "@/lib/format";
import type { Period, Quote } from "@/lib/quote-core";
import { loadQuotes } from "@/lib/quote-source";
import { useSettings } from "@/store/settings";

const STORAGE = "lattice-quotes-v1";

// One cache per window; the day keeps the original key.
function storageKey(period: Period): string {
  return period === "1d" ? STORAGE : `${STORAGE}:${period}`;
}

// Prices only move fast while the cash session is open.
const POLL_MS: Record<Session, number> = {
  open: 45_000,
  pre: 120_000,
  post: 120_000,
  closed: 15 * 60_000,
  holiday: 15 * 60_000,
};

/** Milliseconds until the next poll, or null when the user chose manual refresh. */
export function pollInterval(session: Session): number | null {
  const pref = useSettings.getState().refresh;
  if (pref === "manual") return null;
  if (pref === "auto") return POLL_MS[session];
  return Number(pref) * 1000;
}

export function useQuotes(symbols: string[], refreshToken: number, period: Period = "1d") {
  const key = symbols.filter(Boolean).join("|");
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [asOf, setAsOf] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "live" | "error">("idle");

  useEffect(() => {
    try {
      setQuotes({});
      setAsOf(null);
      const raw = sessionStorage.getItem(storageKey(period));
      if (!raw) return;
      const parsed = JSON.parse(raw) as { at?: number; quotes?: Record<string, Quote> };
      if (!parsed.quotes || !parsed.at || Date.now() - parsed.at > 10 * 60_000) return;
      setQuotes(parsed.quotes);
      setAsOf(parsed.at);
    } catch {
      /* ignore broken cache */
    }
  }, [period]);

  useEffect(() => {
    if (!key) {
      setStatus("idle");
      return;
    }
    const list = key.split("|");
    let cancel = false;

    const pull = async (batch: string[], fresh: boolean) => {
      if (!batch.length || cancel) return;
      const res = await loadQuotes(batch, fresh, period);
      if (cancel) return;
      setQuotes((prev) => {
        const next = { ...prev };
        for (const quote of res.quotes) next[quote.symbol] = quote;
        try {
          sessionStorage.setItem(storageKey(period), JSON.stringify({ at: res.asOf, quotes: next }));
        } catch {
          /* quota */
        }
        return next;
      });
      setAsOf(res.asOf);
      setStatus("live");
    };

    const load = async (fresh: boolean) => {
      setStatus((current) => (current === "live" ? "live" : "loading"));
      const batches = [list.slice(0, 40), list.slice(40, 180), list.slice(180)];
      let any = false;
      let failed = false;
      for (const batch of batches) {
        if (cancel || !batch.length) continue;
        try {
          await pull(batch, fresh && !any);
          any = true;
        } catch {
          failed = true;
        }
      }
      if (!cancel && !any && failed) setStatus("error");
    };

    // Poll on a timer that adapts to the session, and stop entirely while the
    // tab is hidden. Coming back to a stale tab refreshes right away.
    let timer: number | undefined;
    let lastPull = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (cancel || document.visibilityState === "hidden") return;
      const every = pollInterval(marketClock().session);
      if (every == null) return;
      const wait = Math.max(0, lastPull + every - Date.now());
      timer = window.setTimeout(() => {
        lastPull = Date.now();
        void load(false).finally(schedule);
      }, wait);
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
      else window.clearTimeout(timer);
    };

    lastPull = Date.now();
    void load(refreshToken > 0).finally(schedule);
    document.addEventListener("visibilitychange", onVisibility);
    const unsubscribe = useSettings.subscribe((state, prev) => {
      if (state.refresh !== prev.refresh) schedule();
    });
    return () => {
      cancel = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      unsubscribe();
    };
  }, [key, refreshToken, period]);

  return { quotes, asOf, status };
}
