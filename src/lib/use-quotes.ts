import { useEffect, useState } from "react";
import { fetchQuotes, type Quote } from "@/lib/quotes";

const STORAGE = "lattice-quotes-v1";

export function useQuotes(symbols: string[], refreshToken: number) {
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

    const pull = async (batch: string[], fresh: boolean) => {
      if (!batch.length || cancel) return;
      const res = await fetchQuotes({ data: { symbols: batch, fresh } });
      if (cancel) return;
      setQuotes((prev) => {
        const next = { ...prev };
        for (const quote of res.quotes) next[quote.symbol] = quote;
        try {
          sessionStorage.setItem(STORAGE, JSON.stringify({ at: res.asOf, quotes: next }));
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

    void load(refreshToken > 0);
    const timer = window.setInterval(() => void load(false), 45_000);
    return () => {
      cancel = true;
      window.clearInterval(timer);
    };
  }, [key, refreshToken]);

  return { quotes, asOf, status };
}
