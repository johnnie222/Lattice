import { useState } from "react";

/**
 * Company logo as an app-icon squircle (continuous rounded square), not a
 * circle badge. Falls back to a frosted monogram when no logo exists.
 */
export function Mark({ symbol, size, onTile = false }: { symbol: string; size: number; onTile?: boolean }) {
  const [failed, setFailed] = useState(false);
  const radius = size * 0.26;
  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={`grid shrink-0 place-items-center font-semibold ${onTile ? "bg-white/22 text-white" : "bg-surface-2 text-fg"}`}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          fontSize: Math.max(10, size * 0.42),
          boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.25)",
          textShadow: "none",
        }}
      >
        {symbol.replace(/^\^/, "").slice(0, 1)}
      </span>
    );
  }
  return (
    <img
      src={`https://assets.parqet.com/logos/symbol/${encodeURIComponent(symbol)}`}
      alt=""
      width={size}
      height={size}
      decoding="async"
      loading="lazy"
      className="shrink-0 bg-white object-cover"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        boxShadow: "0 0 0 0.5px rgb(0 0 0 / 0.12), 0 2px 6px rgb(0 0 0 / 0.22)",
      }}
      onError={() => setFailed(true)}
    />
  );
}
