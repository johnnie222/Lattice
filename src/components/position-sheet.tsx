import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ListGroup, ListRow, Sheet } from "@/components/sheets";
import { Segmented } from "@/components/chrome";
import { Mark } from "@/components/mark";
import { formatMoney } from "@/lib/format";
import { findListing, normalizeSymbol, suggestListings, syntheticListing } from "@/lib/market";
import { activeBook, useBooks } from "@/store/books";

type Mode = "shares" | "percent";

const MODES: { id: Mode; label: string }[] = [
  { id: "shares", label: "Shares" },
  { id: "percent", label: "% of portfolio" },
];

function num(raw: string): number {
  return Number(raw.replace(/[,$%\s]/g, ""));
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <label htmlFor={id} className="flex min-h-12 items-center gap-3 px-4">
      <span className="flex-1 text-[15px]">{label}</span>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="tabular w-32 bg-transparent text-right text-[15px] outline-none placeholder:text-muted/70"
      />
      {suffix ? <span className="text-[15px] text-muted">{suffix}</span> : null}
    </label>
  );
}

/**
 * Add or edit one position: a number of shares (with an optional average
 * cost, for total gain) or, for more privacy, just a percentage.
 */
export function PositionSheet({
  symbol: initial,
  price,
  onClose,
}: {
  symbol: string | null;
  price?: number;
  onClose: () => void;
}) {
  const books = useBooks((s) => s.books);
  const activeId = useBooks((s) => s.activeId);
  const book = activeBook({ books, activeId });
  const savePosition = useBooks((s) => s.savePosition);
  const removePosition = useBooks((s) => s.removePosition);

  const [symbol, setSymbol] = useState<string | null>(initial ? normalizeSymbol(initial) : null);
  const [draft, setDraft] = useState("");
  const existing = symbol ? book.positions.find((p) => p.symbol === symbol) : undefined;
  const [mode, setMode] = useState<Mode>(existing?.kind ?? "shares");
  const [shares, setShares] = useState(existing?.kind === "shares" ? String(existing.shares) : "");
  const [entry, setEntry] = useState(existing?.kind === "shares" && existing.entry != null ? String(existing.entry) : "");
  const [percent, setPercent] = useState(existing?.kind === "percent" ? String(existing.percent) : "");

  const ideas = useMemo(() => suggestListings(draft, 6), [draft]);
  const listing = symbol ? (findListing(symbol) ?? syntheticListing(symbol)) : null;

  const sharesN = num(shares);
  const entryN = entry.trim() ? num(entry) : null;
  const percentN = num(percent);
  const valid =
    symbol != null &&
    (mode === "shares"
      ? Number.isFinite(sharesN) && sharesN > 0 && (entryN == null || (Number.isFinite(entryN) && entryN > 0))
      : Number.isFinite(percentN) && percentN > 0 && percentN <= 100);
  const unit = price ?? entryN ?? null;
  const preview = mode === "shares" && Number.isFinite(sharesN) && sharesN > 0 && unit ? sharesN * unit : null;

  const save = () => {
    if (!valid || !symbol) return;
    savePosition(
      mode === "shares"
        ? { symbol, kind: "shares", shares: sharesN, entry: entryN }
        : { symbol, kind: "percent", percent: percentN },
    );
    onClose();
  };

  return (
    <Sheet title={existing ? "Edit Position" : "Add Position"} onClose={onClose}>
      {symbol == null ? (
        <>
          <div className="glass mb-3 flex h-11 items-center gap-2 rounded-full px-4">
            <Search className="size-4 shrink-0 text-muted" />
            <input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && normalizeSymbol(draft)) setSymbol(normalizeSymbol(draft));
              }}
              placeholder="Ticker or company"
              aria-label="Ticker or company"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] uppercase outline-none placeholder:normal-case placeholder:text-muted"
            />
          </div>
          {ideas.length ? (
            <ListGroup>
              {ideas.map((idea) => (
                <ListRow
                  key={idea.symbol}
                  leading={<Mark symbol={idea.symbol} size={32} />}
                  title={<span className="font-semibold">{idea.symbol}</span>}
                  subtitle={idea.name}
                  chevron
                  onClick={() => setSymbol(idea.symbol)}
                />
              ))}
            </ListGroup>
          ) : draft.trim() ? (
            <ListGroup>
              <ListRow
                title={
                  <>
                    Use <span className="font-semibold">{normalizeSymbol(draft)}</span>
                  </>
                }
                chevron
                onClick={() => setSymbol(normalizeSymbol(draft))}
              />
            </ListGroup>
          ) : (
            <p className="px-1 text-sm text-muted">Any US-listed stock or fund works, like AAPL, QQQ or VOO.</p>
          )}
        </>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <Mark symbol={symbol} size={52} />
            <div className="min-w-0">
              <p className="text-xl font-semibold tracking-tight">{symbol}</p>
              <p className="truncate text-sm text-muted">{listing?.name !== symbol ? listing?.name : " "}</p>
            </div>
          </div>
          <div className="mb-4">
            <Segmented label="Position type" value={mode} options={MODES} onChange={setMode} compact />
          </div>
          {mode === "shares" ? (
            <ListGroup
              footer={
                preview != null
                  ? `Worth about ${formatMoney(preview)} at ${price ? "today's price" : "your cost"}. Average cost is optional and only used for your total gain.`
                  : "Average cost is optional and only used for your total gain."
              }
            >
              <Field id="shares" label="Shares" value={shares} onChange={setShares} placeholder="10" />
              <Field
                id="entry"
                label="Average cost"
                value={entry}
                onChange={setEntry}
                placeholder={price ? price.toFixed(2) : "Optional"}
                suffix="$"
              />
            </ListGroup>
          ) : (
            <ListGroup footer="No amounts are stored. The tile is sized as this share of your portfolio, and returns are shown in % only.">
              <Field id="percent" label="Share of portfolio" value={percent} onChange={setPercent} placeholder="10" suffix="%" />
            </ListGroup>
          )}
          <button
            type="button"
            disabled={!valid}
            onClick={save}
            className="glass-pressable h-12 w-full rounded-full bg-accent font-semibold text-white disabled:opacity-40"
          >
            {existing ? "Save" : "Add to Portfolio"}
          </button>
          {existing ? (
            <button
              type="button"
              className="mt-2 h-11 w-full text-[15px] font-medium text-down"
              onClick={() => {
                removePosition(symbol);
                onClose();
              }}
            >
              Remove from Portfolio
            </button>
          ) : initial == null ? (
            <button type="button" className="mt-2 h-11 w-full text-[15px] text-accent" onClick={() => setSymbol(null)}>
              Choose another ticker
            </button>
          ) : null}
        </>
      )}
    </Sheet>
  );
}
