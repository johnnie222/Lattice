import { useMemo, type ReactNode } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { BOARDS, sectorLabel, type SectorId } from "@/data/universe";
import { formatCap, formatPct, formatPrice } from "@/lib/format";
import {
  boardNodes,
  findListing,
  syntheticListing,
  type FilterId,
  type MapNode,
} from "@/lib/market";
import type { Quote } from "@/lib/quote-core";
import { UNIVERSE_GROUPS } from "@/lib/universes";
import { useDismissible } from "@/lib/use-dismissible";
import type { Book } from "@/store/books";
import { Mark } from "@/components/mark";

export type SheetId = "boards" | "controls" | "info" | "position" | "stock" | "settings";

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  // Android Back closes the topmost sheet.
  useDismissible(onClose);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <button type="button" className="scrim absolute inset-0" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-panel glass glass-sheet relative flex max-h-[min(86dvh,760px)] w-full max-w-lg flex-col rounded-[30px]"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-9 rounded-full bg-muted/40" />
        </div>
        <div className="grid grid-cols-[40px_1fr_40px] items-center px-3 pb-2 pt-1">
          <span />
          <h2 className="truncate text-center text-[17px] font-semibold tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="glass-pressable grid size-9 place-items-center rounded-full bg-surface-2/80 text-muted"
            aria-label="Close"
          >
            <X className="size-4" strokeWidth={2.5} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

/** iOS-style inset grouped list. */
export function ListGroup({ title, footer, children }: { title?: string; footer?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-5">
      {title ? <h3 className="px-4 pb-1.5 text-[13px] font-medium uppercase tracking-wide text-muted">{title}</h3> : null}
      <div className="divide-y divide-line/70 overflow-hidden rounded-2xl bg-surface/80">{children}</div>
      {footer ? <p className="px-4 pt-1.5 text-xs leading-relaxed text-muted">{footer}</p> : null}
    </section>
  );
}

export function ListRow({
  title,
  subtitle,
  detail,
  checked,
  chevron,
  tone,
  wrap,
  leading,
  onClick,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  detail?: ReactNode;
  checked?: boolean;
  chevron?: boolean;
  tone?: "danger";
  wrap?: boolean;
  leading?: ReactNode;
  onClick?: () => void;
}) {
  const body = (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[15px] ${tone === "danger" ? "text-down" : ""}`}>{title}</span>
        {subtitle ? (
          <span className={`block text-xs leading-snug text-muted ${wrap ? "" : "truncate"}`}>{subtitle}</span>
        ) : null}
      </span>
      {detail ? <span className="tabular shrink-0 text-right text-[15px] text-muted">{detail}</span> : null}
      {checked ? <Check className="size-[18px] shrink-0 text-accent" strokeWidth={2.75} /> : null}
      {chevron ? <ChevronRight className="size-4 shrink-0 text-muted/70" strokeWidth={2.5} /> : null}
    </>
  );
  const cls = "flex min-h-12 w-full items-center gap-3 px-4 py-2 text-left";
  return onClick ? (
    <button type="button" onClick={onClick} className={`${cls} active:bg-surface-2/60`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

const FILTERS: { id: FilterId; label: string; hint: string }[] = [
  { id: "all", label: "All names", hint: "Full map" },
  { id: "up", label: "Advancers", hint: "Today is green" },
  { id: "down", label: "Decliners", hint: "Today is red" },
  { id: "m1", label: "Move ≥ 1%", hint: "Either direction" },
  { id: "m2", label: "Move ≥ 2%", hint: "The loud ones" },
];

/**
 * Map controls: what's shown (filter) and how fresh it is, plus the way to
 * the guide and Settings. Choosing a universe stays on the title.
 */
export function ControlsSheet({
  filter,
  onFilter,
  status,
  updated,
  delayed,
  onRefresh,
  onInfo,
  onSettings,
  onClose,
}: {
  filter: FilterId;
  onFilter: (filter: FilterId) => void;
  /** e.g. "Market Open" */
  status: string;
  /** e.g. "11:00", "Delayed 10:52", "Unavailable" */
  updated: string;
  delayed: boolean;
  onRefresh: () => void;
  onInfo: () => void;
  onSettings: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet title="Map Controls" onClose={onClose}>
      <ListGroup title="Filter">
        {FILTERS.map((item) => (
          <ListRow
            key={item.id}
            title={item.label}
            subtitle={item.hint}
            checked={item.id === filter}
            onClick={() => {
              onFilter(item.id);
              onClose();
            }}
          />
        ))}
      </ListGroup>
      <ListGroup
        title="Data"
        footer="Prices come from Yahoo Finance's public feed. It isn't an official exchange feed and may be delayed."
      >
        <ListRow title="Market" detail={status} />
        <ListRow title="Last update" detail={<span className={delayed ? "text-down" : undefined}>{updated}</span>} />
        <ListRow
          title={<span className="text-accent">Refresh Now</span>}
          onClick={() => {
            onRefresh();
            onClose();
          }}
        />
      </ListGroup>
      <ListGroup>
        <ListRow title="How to read the map" chevron onClick={onInfo} />
        <ListRow title="Settings" chevron onClick={onSettings} />
      </ListGroup>
    </Sheet>
  );
}

export function InfoSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="How to read LATTICE" onClose={onClose}>
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted">
        <p>
          <span className="text-fg">Color is today’s move.</span> Dark green is barely up, bright green is a
          strong up day. Rose is the same scale on the downside.
        </p>
        <p>
          <span className="text-fg">Size is weight.</span> On the S&P 500, Nasdaq 100, and the sector ETFs
          (XLK, XLF, XLE, and the rest), tile area is market cap. That is close to how the SPDR sector funds
          look, not a copy of the official daily basket file. The Dow is price-weighted, like the real index:
          tile area is each stock’s share price.
        </p>
        <p>
          <span className="text-fg">Thematic baskets are approximate.</span> SOXX, SMH, IGV, and KRE use a
          fixed weight mix. XBI and XRT are equal weight. IBB and ITA are sized by market cap inside the
          basket. Prices are live; the weights are not the fund’s latest official holdings.
        </p>
        <p>
          <span className="text-fg">Tap a sector name</span> on the S&P or Nasdaq map to open that sector
          full screen. Tap a stock for the print and to drop it into your book.
        </p>
        <p>
          <span className="text-fg">Your portfolio</span> is sized by each position’s value: shares × price, or
          the percentage you gave it. Everything is saved only on this device.
        </p>
      </div>
    </Sheet>
  );
}

export function BoardSheet({
  boardId,
  bookName,
  bookCount,
  onPick,
  onBook,
  onInfo,
  onClose,
}: {
  boardId: string;
  bookName: string;
  bookCount: number;
  onPick: (id: string) => void;
  onBook: () => void;
  onInfo: () => void;
  onClose: () => void;
}) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const board of BOARDS) map.set(board.id, boardNodes(board).length);
    return map;
  }, []);

  return (
    <Sheet title="Markets" onClose={onClose}>
      <ListGroup title="Your portfolio">
        <ListRow
          title={bookName}
          subtitle={
            bookCount === 0 ? "Empty · add positions" : `${bookCount} ${bookCount === 1 ? "position" : "positions"}`
          }
          checked={boardId === "book"}
          onClick={onBook}
        />
      </ListGroup>
      {UNIVERSE_GROUPS.map((group) => (
        <ListGroup key={group} title={group === "Sector ETF" ? "Sector funds" : group === "Index" ? "Indexes" : "Themes"}>
          {BOARDS.filter((board) => board.group === group).map((board) => (
            <ListRow
              key={board.id}
              title={
                <>
                  <span className="font-semibold">{board.title}</span>
                  {board.name !== board.title ? <span className="text-muted"> · {board.name}</span> : null}
                </>
              }
              detail={`${counts.get(board.id) ?? 0}`}
              checked={board.id === boardId}
              onClick={() => onPick(board.id)}
            />
          ))}
        </ListGroup>
      ))}
      <ListGroup footer="Tip: press and hold the title to switch quickly.">
        <ListRow title="How to read the map" chevron onClick={onInfo} />
      </ListGroup>
    </Sheet>
  );
}

export function StockSheet({
  symbol,
  quote,
  periodWords,
  node,
  book,
  onPosition,
  canDrill,
  onDrill,
  onClose,
}: {
  symbol: string;
  quote: Quote | undefined;
  periodWords: string;
  node: MapNode | undefined;
  book: Book;
  onPosition: () => void;
  canDrill: boolean;
  onDrill: (sector: SectorId) => void;
  onClose: () => void;
}) {
  const known = findListing(symbol);
  const listing = known ?? {
    ...syntheticListing(symbol),
    name: node?.name ?? symbol,
    sector: node?.sector ?? "other",
    industry: node?.industry ?? "",
    cap: node?.cap ?? 0,
  };
  const held = book.positions.find((p) => p.symbol === symbol);
  const sector = (node?.sector ?? listing.sector) as SectorId;
  const up = (quote?.changePercent ?? 0) >= 0;

  return (
    <Sheet title={symbol} onClose={onClose}>
      <div className="flex items-center gap-3">
        <Mark symbol={symbol} size={60} />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{listing.name}</p>
          <p className="truncate text-sm text-muted">
            {sectorLabel(sector)}
            {listing.industry ? ` · ${listing.industry}` : ""}
          </p>
        </div>
      </div>
      <p className="tabular mt-4 text-4xl font-semibold tracking-tight">
        {quote ? formatPrice(quote.price) : "—"}
      </p>
      <p className={`mt-1 font-mono text-sm ${quote?.changePercent != null ? (up ? "text-up" : "text-down") : "text-muted"}`}>
        {quote && quote.change != null && quote.changePercent != null ? (
          <>
            {`${quote.change > 0 ? "+" : ""}${quote.change.toFixed(2)}  ${formatPct(quote.changePercent)}`}
            <span className="text-muted"> · {periodWords}</span>
          </>
        ) : quote ? (
          `Move unavailable · ${periodWords}`
        ) : (
          "Waiting on the tape"
        )}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Market cap</dt>
          <dd className="font-mono">{formatCap(listing.cap)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">In {book.name}</dt>
          <dd className="font-mono">
            {held
              ? held.kind === "shares"
                ? `${held.shares.toLocaleString("en-US")} ${held.shares === 1 ? "share" : "shares"}`
                : `${round1(held.percent)}% of portfolio`
              : "Not held"}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        className="glass-pressable mt-5 h-12 w-full rounded-full bg-accent font-semibold text-white"
        onClick={onPosition}
      >
        {held ? "Edit Position" : "Add to Portfolio"}
      </button>
      {canDrill ? (
        <button
          type="button"
          className="mt-2 h-11 w-full text-sm font-medium text-fg"
          onClick={() => onDrill(sector)}
        >
          Open {sectorLabel(sector)}
        </button>
      ) : null}
    </Sheet>
  );
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
