import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { sectorLabel, type SectorId } from "@/data/universe";
import { formatPct, formatPrice, heatClass } from "@/lib/format";
import type { MapNode } from "@/lib/market";
import type { Quote } from "@/lib/quote-core";
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

const GAP = 1;

let measureCtx: CanvasRenderingContext2D | null | undefined;
let measureFamily = "";

// Width of `text` at 1px in the tile's semibold face, measured once per string.
const emWidth = new Map<string, number>();
function textEm(text: string): number {
  const hit = emWidth.get(text);
  if (hit) return hit;
  if (measureCtx === undefined && typeof document !== "undefined") {
    measureCtx = document.createElement("canvas").getContext("2d");
    measureFamily = getComputedStyle(document.body).fontFamily || "sans-serif";
  }
  let em = text.length * 0.66;
  if (measureCtx) {
    measureCtx.font = `600 100px ${measureFamily}`;
    em = measureCtx.measureText(text).width / 100;
  }
  if (typeof document !== "undefined" && document.fonts?.status === "loaded") emWidth.set(text, em);
  return em;
}

function fitSize(text: string, width: number, preferred: number): number {
  const cap = Math.floor((width - 8) / Math.max(textEm(text), 0.5));
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
  const short = Math.min(w, h);
  const radius = Math.max(2, Math.min(12, short * 0.09));
  const pct = quote ? formatPct(quote.changePercent, w < 70 ? 1 : 2) : null;

  // Large tiles get the Apple card layout: logo top-left, figures bottom-left.
  const card = w >= 104 && h >= 96;
  if (card) {
    const pad = Math.max(8, Math.min(14, short * 0.08));
    const logo = Math.max(24, Math.min(44, short * 0.24));
    const tickerSize = fitSize(node.symbol, w - pad * 2 + 8, Math.min(30, h * 0.17));
    const showPrice = Boolean(quote) && h >= 128;
    return (
      <button
        type="button"
        aria-label={`${node.symbol} ${node.name}${quote ? ` ${formatPrice(quote.price)} ${formatPct(quote.changePercent)}` : ""}`}
        onClick={() => onSelect(node.symbol)}
        className={`tile absolute flex flex-col justify-between overflow-hidden text-left ${heatClass(quote?.changePercent ?? null)} ${selected ? "tile-selected" : ""}`}
        style={{ left: rect.x + GAP, top: rect.y + GAP, width: w, height: h, borderRadius: radius, padding: pad }}
      >
        <Mark symbol={node.symbol} size={logo} onTile />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold leading-none tracking-tight" style={{ fontSize: tickerSize }}>
            {node.symbol}
          </span>
          {pct ? (
            <span
              className="tabular mt-1 font-medium leading-none"
              style={{ fontSize: Math.max(12, Math.min(20, tickerSize * 0.62)) }}
            >
              {pct}
            </span>
          ) : null}
          {showPrice && quote ? (
            <span
              className="tabular mt-1 leading-none opacity-75"
              style={{ fontSize: Math.max(11, Math.min(14, tickerSize * 0.46)) }}
            >
              {formatPrice(quote.price)}
            </span>
          ) : null}
        </span>
      </button>
    );
  }

  const wide = w > h * 1.65 && h < 64;
  const showPct = Boolean(quote) && w >= 38 && h >= (wide ? 22 : 34);
  // In the wide layout the % shares the row, so the ticker gets ~55% of it.
  const tickerSize = fitSize(node.symbol, wide && showPct ? w * 0.55 : w, Math.min(20, Math.max(h, 12) * 0.32));
  const showTicker = tickerSize >= 8;
  const pctSize = pct ? Math.max(8, fitSize(pct, wide ? w * 0.45 : w, Math.min(14, tickerSize * 0.8))) : 0;

  return (
    <button
      type="button"
      tabIndex={w >= 64 && h >= 48 ? 0 : -1}
      aria-label={`${node.symbol}${quote ? ` ${formatPrice(quote.price)} ${formatPct(quote.changePercent)}` : ""}`}
      onClick={() => onSelect(node.symbol)}
      className={`tile absolute overflow-hidden ${heatClass(quote?.changePercent ?? null)} ${selected ? "tile-selected" : ""}`}
      style={{ left: rect.x + GAP, top: rect.y + GAP, width: w, height: h, borderRadius: radius }}
    >
      <span
        className={`flex h-full w-full items-center justify-center px-1 ${wide ? "flex-row gap-1.5" : "flex-col gap-0.5"}`}
      >
        {showTicker ? (
          <span className="max-w-full truncate font-semibold leading-none tracking-tight" style={{ fontSize: tickerSize }}>
            {node.symbol}
          </span>
        ) : null}
        {showPct && pct && pctSize >= 8 ? (
          <span className="tabular font-medium leading-none opacity-90" style={{ fontSize: pctSize }}>
            {pct}
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
          className={`absolute z-10 flex items-center gap-0.5 truncate px-1 text-left text-[10px] font-semibold uppercase tracking-[0.08em] ${header.overlay ? "text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]" : "text-muted"}`}
          style={{ left: header.x, top: header.y, width: header.w, height: header.h }}
        >
          <span className="truncate">{sectorLabel(header.id as SectorId)}</span>
          <ChevronRight className="size-3 shrink-0 opacity-70" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
});
