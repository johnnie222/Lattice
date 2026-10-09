import { useState } from "react";

export function Mark({ symbol, size }: { symbol: string; size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        className="grid place-items-center rounded-full bg-surface-2 font-semibold text-ink"
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34) }}
      >
        {symbol.slice(0, 1)}
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
      className="rounded-full bg-bg object-cover"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
