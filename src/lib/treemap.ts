export type Box = { x: number; y: number; w: number; h: number };
export type TileRect = Box & { id: string };

type Node = { id: string; area: number };

function worst(row: Node[], side: number): number {
  if (!row.length || side <= 0) return Infinity;
  let sum = 0;
  let max = 0;
  let min = Infinity;
  for (const n of row) {
    sum += n.area;
    if (n.area > max) max = n.area;
    if (n.area < min) min = n.area;
  }
  if (sum <= 0) return Infinity;
  const sum2 = sum * sum;
  const side2 = side * side;
  return Math.max((side2 * max) / sum2, sum2 / (side2 * min));
}

/** Squarified treemap. `value` is a weight, not a pixel area. */
export function treemap(
  items: { id: string; value: number }[],
  bounds: Box,
): TileRect[] {
  if (bounds.w < 1 || bounds.h < 1) return [];
  const clean = items.filter((i) => i.value > 0);
  const total = clean.reduce((s, i) => s + i.value, 0);
  if (!total) return [];
  const field = bounds.w * bounds.h;
  const nodes: Node[] = clean
    .map((i) => ({ id: i.id, area: (i.value / total) * field }))
    .sort((a, b) => b.area - a.area);

  const rects: TileRect[] = [];
  let cx = bounds.x;
  let cy = bounds.y;
  let cw = bounds.w;
  let ch = bounds.h;
  let rest = nodes;

  while (rest.length && cw > 0.5 && ch > 0.5) {
    const side = Math.min(cw, ch);
    const row: Node[] = [];
    let rowArea = 0;
    for (const n of rest) {
      const next = row.concat(n);
      if (row.length === 0 || worst(next, side) <= worst(row, side)) {
        row.push(n);
        rowArea += n.area;
      } else {
        break;
      }
    }
    if (!row.length) break;
    rest = rest.slice(row.length);

    if (cw >= ch) {
      const width = Math.min(cw, rowArea / ch);
      let y = cy;
      for (let i = 0; i < row.length; i++) {
        const n = row[i]!;
        const h = i === row.length - 1 ? cy + ch - y : n.area / width;
        rects.push({ id: n.id, x: cx, y, w: width, h: Math.max(0, h) });
        y += h;
      }
      cx += width;
      cw -= width;
    } else {
      const height = Math.min(ch, rowArea / cw);
      let x = cx;
      for (let i = 0; i < row.length; i++) {
        const n = row[i]!;
        const w = i === row.length - 1 ? cx + cw - x : n.area / height;
        rects.push({ id: n.id, x, y: cy, w: Math.max(0, w), h: height });
        x += w;
      }
      cy += height;
      ch -= height;
    }
  }
  return rects;
}

export type GroupLayout = {
  tiles: TileRect[];
  headers: (Box & { id: string; overlay: boolean })[];
};

/** Sector blocks, each with its own squarified children and a label strip. */
export function treemapGrouped(
  groups: { id: string; children: { id: string; value: number }[] }[],
  bounds: Box,
): GroupLayout {
  const parents = groups
    .map((g) => ({
      id: g.id,
      value: g.children.reduce((s, c) => s + Math.max(0, c.value), 0),
      children: g.children,
    }))
    .filter((g) => g.value > 0);

  const sectorRects = treemap(
    parents.map((g) => ({ id: g.id, value: g.value })),
    bounds,
  );
  const byId = new Map(parents.map((g) => [g.id, g]));
  const tiles: TileRect[] = [];
  const headers: GroupLayout["headers"] = [];
  const gutter = 3;

  for (const sr of sectorRects) {
    const g = byId.get(sr.id);
    if (!g) continue;
    const inner: Box = {
      x: sr.x + gutter / 2,
      y: sr.y + gutter / 2,
      w: Math.max(0, sr.w - gutter),
      h: Math.max(0, sr.h - gutter),
    };
    const show = inner.w >= 52 && inner.h >= 28;
    const reserve = show && inner.h >= 52 && inner.w >= 68;
    const headH = reserve ? Math.min(22, inner.h * 0.28) : 0;
    if (show) {
      headers.push({
        id: g.id,
        x: inner.x,
        y: inner.y,
        w: inner.w,
        h: reserve ? headH : Math.min(18, inner.h),
        overlay: !reserve,
      });
    }
    const childBox: Box = reserve
      ? { x: inner.x, y: inner.y + headH, w: inner.w, h: Math.max(0, inner.h - headH) }
      : inner;
    tiles.push(...treemap(g.children, childBox));
  }
  return { tiles, headers };
}
