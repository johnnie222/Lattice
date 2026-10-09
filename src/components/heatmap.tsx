import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { sectorLabel, type SectorId } from "@/data/universe";
import { formatPct, formatPrice, heatClass } from "@/lib/format";
import type { MapNode } from "@/lib/market";
import type { Quote } from "@/lib/quotes";
import { treemap, treemapGrouped, type TileRect } from "@/lib/treemap";
import { Mark } from "@/components/mark";

type Props = {
  nodes: MapNode[];
  quotes: Record<string, Quote>;
  grouped: boolean;
  selected: string | null;
  onSelect: (symbol: string) => void;
  onDrill: (sector: SectorId) => void;
};

const GAP = 1.5;

let measureCtx: CanvasRenderingContext2D | null | undefined;

// Width of `text` at 1px in the tile's semibold sans, measured once per string.
const emWidth = new Map<string, number>();
function textEm(text: string): number {
  const hit = emWidth.get(text);
  if (hit) return hit;
  if (measureCtx === undefined && typeof document !== "undefined") {
    measureCtx = document.createElement("canvas").getContext("2d");
  }
  let em = text.length * 0.68;
  if (measureCtx) {
    measureCtx.font = '600 100px "IBM Plex Sans", "Segoe UI", sans-serif';
    em = measureCtx.measureText(text).width / 100;
  }
  if (typeof document !== "undefined" && document.fonts?.status === "loaded") emWidth.set(text, em);
  return em;
}

function fitSize(text: string, width: number, preferred: number): number {
  // px-1 padding plus a little slack so truncate never kicks in.
  const cap = Math.floor((width - 10) / Math.max(textEm(text), 0.5));
  return Math.max(0, Math.min(preferred, cap));
}

function Tile({
  rect,
  node,
  quote,
  selected,
  onSelect,
}: {
  rect: TileRect;
  node: MapNode;
  quote: Quote | undefined;
  selected: boolean;
  onSelect: (symbol: string) => void;
}) {
  const w = rect.w - GAP * 2;
  const h = rect.h - GAP * 2;
  if (w < 2 || h < 2) return null;
  const wide = w > h * 1.65 && h < 72;
  const showLogo = !wide && w >= 74 && h >= 108;
  const showPrice = Boolean(quote) && w >= 58 && h >= (showLogo ? 96 : 64);
  const showPct = Boolean(quote) && w >= 40 && h >= 36;
  const tickerPreferred = showLogo ? Math.min(26, h * 0.16) : Math.min(22, Math.max(h, 12) * 0.34);
  const tickerSize = fitSize(node.symbol, w, tickerPreferred);
  const showTicker = tickerSize >= 8;
  const priceSize = Math.max(10, Math.min(16, tickerSize * 0.72));
  const pctSize = Math.max(10, Math.min(15, showPrice ? priceSize : tickerSize * 0.86));
  const logo = Math.max(28, Math.min(64, Math.min(w * 0.42, h * 0.28)));

  return (
    <button
      type="button"
      tabIndex={w >= 64 && h >= 48 ? 0 : -1}
      aria-label={`${node.symbol}${quote ? ` ${formatPrice(quote.price)} ${formatPct(quote.changePercent)}` : ""}`}
      onClick={() => onSelect(node.symbol)}
      className={`tile-ink absolute overflow-hidden text-ink ${heatClass(quote?.changePercent ?? null)} ${selected ? "tile-selected" : ""}`}
      style={{ left: rect.x + GAP, top: rect.y + GAP, width: w, height: h }}
    >
      <span
        className={`flex h-full w-full items-center justify-center px-1 ${wide ? "flex-row gap-1.5" : "flex-col gap-0.5"}`}
      >
        {showLogo ? <Mark symbol={node.symbol} size={logo} /> : null}
        {showTicker ? (
          <span className="max-w-full truncate font-semibold leading-none tracking-tight" style={{ fontSize: tickerSize }}>
            {node.symbol}
          </span>
        ) : null}
        {showPrice && quote ? (
          <span className="font-mono leading-none opacity-80" style={{ fontSize: priceSize }}>
            {formatPrice(quote.price)}
          </span>
        ) : null}
        {showPct && quote ? (
          <span className="font-mono leading-none" style={{ fontSize: pctSize }}>
            {formatPct(quote.changePercent, w < 70 ? 1 : 2)}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export const Heatmap = memo(function Heatmap({
  nodes,
  quotes,
  grouped,
  selected,
  onSelect,
  onDrill,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [, setFontsReady] = useState(false);

  // Ticker sizing measures text, so re-fit once the web font has arrived.
  useEffect(() => {
    let live = true;
    void document.fonts?.ready.then(() => {
      if (live) setFontsReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    if (size.w < 2 || size.h < 2 || !nodes.length) {
      return { tiles: [] as TileRect[], headers: [] as { id: string; x: number; y: number; w: number; h: number; overlay: boolean }[] };
    }
    const bounds = { x: 0, y: 0, w: size.w, h: size.h };
    if (!grouped) {
      return {
        tiles: treemap(
          nodes.map((node) => ({ id: node.symbol, value: node.weight })),
          bounds,
        ),
        headers: [],
      };
    }
    const groups = new Map<SectorId, { id: string; value: number }[]>();
    for (const node of nodes) {
      const list = groups.get(node.sector) ?? [];
      list.push({ id: node.symbol, value: node.weight });
      groups.set(node.sector, list);
    }
    return treemapGrouped(
      [...groups.entries()].map(([id, children]) => ({ id, children })),
      bounds,
    );
  }, [nodes, size.w, size.h, grouped]);

  const bySymbol = useMemo(() => new Map(nodes.map((node) => [node.symbol, node])), [nodes]);

  return (
    <div ref={ref} className="relative h-full w-full">
      {layout.tiles.map((rect) => {
        const node = bySymbol.get(rect.id);
        if (!node) return null;
        return (
          <Tile
            key={rect.id}
            rect={rect}
            node={node}
            quote={quotes[rect.id]}
            selected={selected === rect.id}
            onSelect={onSelect}
          />
        );
      })}
      {layout.headers.map((header) => (
        <button
          key={header.id}
          type="button"
          onClick={() => onDrill(header.id as SectorId)}
          className={`absolute z-10 flex items-center gap-0.5 truncate px-1 text-left text-xs font-semibold tracking-wide text-fg ${header.overlay ? "tile-ink" : ""}`}
          style={{ left: header.x, top: header.y, width: header.w, height: header.h }}
        >
          <span className="truncate">{sectorLabel(header.id as SectorId)}</span>
          <ChevronRight className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
});
