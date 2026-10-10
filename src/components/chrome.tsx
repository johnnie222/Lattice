import { useLayoutEffect, useRef, type ReactNode } from "react";
import { BriefcaseBusiness, ChartNoAxesColumn, LayoutGrid } from "lucide-react";

export function GlassButton({
  label,
  onClick,
  pressed,
  dot,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`glass glass-pressable relative grid size-11 shrink-0 place-items-center rounded-full ${pressed ? "text-accent" : "text-fg"}`}
    >
      {children}
      {dot ? <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" /> : null}
    </button>
  );
}

/**
 * Large title that steps its size down to fit beside the header buttons
 * instead of truncating ("Communication" stays whole).
 */
export function LargeTitle({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (const size of [28, 25, 22, 20]) {
      el.style.fontSize = `${size}px`;
      if (el.scrollWidth <= el.clientWidth + 1) break;
    }
  }, [children]);
  return (
    <h1 ref={ref} className="min-w-0 truncate text-[28px] font-bold leading-tight tracking-tight">
      {children}
    </h1>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  compact,
  size = "md",
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
  compact?: boolean;
  /** "sm" for dense headers (the map). */
  size?: "md" | "sm";
}) {
  const sm = size === "sm";
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`glass rounded-full ${sm ? "p-0.5" : "p-1"} ${compact ? "flex" : "inline-flex"}`}
    >
      {options.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(option.id)}
            className={`rounded-full font-semibold transition-colors ${sm ? "h-6" : "h-7"} ${compact ? "min-w-0 flex-1 px-1 text-[12px]" : sm ? "w-9 text-[12px]" : "w-11 text-[13px]"} ${on ? "bg-[var(--seg-thumb)] text-fg shadow-[0_1px_4px_rgb(0_0_0/0.25)]" : "text-muted"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export type TabId = "map" | "sectors" | "portfolio";

const TABS: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "map", label: "Map", icon: LayoutGrid },
  { id: "sectors", label: "Sectors", icon: ChartNoAxesColumn },
  { id: "portfolio", label: "Portfolio", icon: BriefcaseBusiness },
];

/**
 * Floating glass tab bar. It sits in its own strip under the content rather
 * than over it, so it never hides tiles.
 */
export function TabBar({ tab, onChange }: { tab: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav className="shrink-0 px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5" aria-label="Sections">
      <div className="glass mx-auto flex max-w-sm rounded-full p-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const on = id === tab;
          return (
            <button
              key={id}
              type="button"
              aria-current={on ? "page" : undefined}
              onClick={() => onChange(id)}
              className={`glass-pressable flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-semibold transition-colors ${on ? "bg-[var(--seg-thumb)]/70 text-accent" : "text-muted"}`}
            >
              <Icon className="size-5" strokeWidth={on ? 2.4 : 2} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
