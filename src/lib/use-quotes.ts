import { useEffect, useState } from "react";
import { marketClock, type Session } from "@/lib/format";
import type { Quote } from "@/lib/quote-core";
import { loadQuotes } from "@/lib/quote-source";
import { useSettings } from "@/store/settings";

import { replaceQuoteBatch } from "./quote-data.ts";

// v1 cached synthetic zero moves and did not carry previousClose.
const STORAGE = "lattice-quotes-v2";

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

/**
 * Live quotes (price vs previous close) for `symbols`. Market maps fill in
 * batch by batch; portfolio figures pass `waitForAll` so one refresh is
 * committed at once and fresh and old prices are never mixed.
 */
export function useQuotes(symbols: string[], refreshToken: number, waitForAll = false) {
  const key = symbols.filter(Boolean).join("|");
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [asOf, setAsOf] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "live" | "error">("idle");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { at?: number; quotes?: Record<string, Quote> };
      if (!parsed.quotes || !parsed.at || Date.now() - parsed.at > 10 * 60_000) return;
      setQuotes(parsed.quotes);
      setAsOf(parsed.at);
    } catch {
      /* ignore broken cache */
    }
  }, []);

  useEffect(() => {
    if (!key) {
      setStatus("idle");
      return;
    }
    const list = key.split("|");
    let cancel = false;

    const load = async (fresh: boolean) => {
      setStatus((current) => (current === "live" ? "live" : "loading"));
      const batches = [list.slice(0, 40), list.slice(40, 180), list.slice(180)];
      const received: Quote[] = [];
      let at: number | null = null;
      let failed = false;
      for (const batch of batches) {
        if (cancel || !batch.length) continue;
        try {
          const res = await loadQuotes(batch, fresh);
          received.push(...res.quotes);
          at = res.asOf;
          // Market maps retain progressive rendering; portfolio totals wait
          // for every batch so fresh and old sessions cannot be mixed.
          if (!cancel && !waitForAll) {
            setQuotes((previous) => replaceQuoteBatch(previous, batch, res.quotes));
          }
        } catch {
          failed = true;
        }
      }
      if (cancel) return;
      // Commit one refresh atomically: never mix a new benchmark with old
      // holdings from another batch, and remove missing/failed batch quotes.
      const next = replaceQuoteBatch({}, list, received);
      setQuotes(next);
      setAsOf(at);
      setStatus(failed || !received.length ? "error" : "live");
      try {
        // Other tabs keep their own symbols in the same cache; merge, don't replace.
        const stored = JSON.parse(sessionStorage.getItem(STORAGE) ?? "{}") as {
          quotes?: Record<string, Quote>;
        };
        const merged = { ...stored.quotes };
        for (const symbol of list) delete merged[symbol];
        sessionStorage.setItem(STORAGE, JSON.stringify({ at, quotes: { ...merged, ...next } }));
      } catch {
        /* quota */
      }
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
  }, [key, refreshToken, waitForAll]);

  return { quotes, asOf, status };
}
