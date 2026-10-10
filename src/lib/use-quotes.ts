import { useEffect, useState } from "react";
import { marketClock, type Session } from "@/lib/format";
import { fetchQuotes, type Quote } from "@/lib/quotes";

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

export function pollInterval(session: Session): number {
  return POLL_MS[session];
}

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
          const res = await fetchQuotes({ data: { symbols: batch, fresh } });
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
        sessionStorage.setItem(STORAGE, JSON.stringify({ at, quotes: next }));
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
      const wait = Math.max(0, lastPull + pollInterval(marketClock().session) - Date.now());
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
    return () => {
      cancel = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [key, refreshToken, waitForAll]);

  return { quotes, asOf, status };
}
