import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import { LargeTitle } from "@/components/chrome";
import { hapticClose, hapticOpen, hapticTick } from "@/lib/haptics";
import { markWheelUsed } from "@/lib/quick-wheel-hint";
import { useDismissible } from "@/lib/use-dismissible";
import type { Universe } from "@/lib/universes";

// The universe title: tap opens the Markets menu (browse); press and hold
// opens the quick wheel (switch fast). Two ways to finish a hold:
// - drag and release: switch to the centred universe right away;
// - release without dragging: the wheel stays open to scroll and tap, and a
//   tap outside, Escape or Back cancels.

const HOLD_MS = 450;
/** Movement that turns a press into a drag instead of a hold. */
const SLOP = 10;
const ITEM = 44;
const VISIBLE = 7;
const PAD = ITEM * Math.floor(VISIBLE / 2);

type WheelHandle = { drag: (dy: number) => void; release: () => void };

const Wheel = forwardRef<
  WheelHandle,
  {
    items: Universe[];
    current: string;
    dragging: boolean;
    onCommit: (id: string) => void;
    onCancel: () => void;
    /** A tap on the backdrop (may be the ghost click of the opening hold). */
    onDismiss: () => void;
  }
>(function Wheel({ items, current, dragging, onCommit, onCancel, onDismiss }, ref) {
  const scroller = useRef<HTMLDivElement>(null);
  const start = useRef(0);
  const centred = useRef(
    Math.max(
      0,
      items.findIndex((item) => item.id === current),
    ),
  );
  const [active, setActive] = useState(centred.current);
  const reduced = useRef(false);

  // Android Back cancels the wheel like a tap outside.
  useDismissible(onCancel);

  const indexAt = (top: number) => Math.min(items.length - 1, Math.max(0, Math.round(top / ITEM)));

  // Opacity and scale fall off away from the centre; a tick when it changes.
  const paint = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const top = el.scrollTop;
    el.querySelectorAll<HTMLElement>("[data-wheel-item]").forEach((node, i) => {
      const d = Math.min(3, Math.abs(i * ITEM - top) / ITEM);
      node.style.opacity = String(Math.max(0.16, 1 - d * 0.3));
      node.style.transform = `scale(${1 - d * 0.07})`;
    });
    const index = indexAt(top);
    if (index !== centred.current) {
      centred.current = index;
      setActive(index);
      hapticTick();
    }
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    reduced.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    el.scrollTop = centred.current * ITEM;
    start.current = el.scrollTop;
    paint();
    el.focus({ preventScroll: true });
  }, [paint]);

  useImperativeHandle(
    ref,
    () => ({
      // Follows the finger that opened the wheel: drag up for the next item.
      drag(dy) {
        const el = scroller.current;
        if (!el) return;
        el.scrollTop = Math.max(0, Math.min((items.length - 1) * ITEM, start.current - dy));
        paint();
      },
      release() {
        const el = scroller.current;
        if (el) onCommit(items[indexAt(el.scrollTop)]!.id);
      },
    }),
    [items, onCommit, paint], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // After a drag ends without switching, snap the nearest item to the centre.
  useEffect(() => {
    const el = scroller.current;
    if (!el || dragging) return;
    el.scrollTo({ top: centred.current * ITEM, behavior: reduced.current ? "auto" : "smooth" });
  }, [dragging]);

  const move = useCallback(
    (step: number) => {
      const el = scroller.current;
      if (!el) return;
      const next = Math.min(items.length - 1, Math.max(0, centred.current + step));
      el.scrollTo({ top: next * ITEM, behavior: reduced.current ? "auto" : "smooth" });
    },
    [items.length],
  );

  // The wheel is modal: its keys work wherever focus ended up.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") move(1);
      else if (event.key === "ArrowUp") move(-1);
      else if (event.key === "Enter") onCommit(items[centred.current]!.id);
      else if (event.key === "Escape") onCancel();
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [items, move, onCommit, onCancel]);

  return (
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        className="scrim absolute inset-0"
        aria-label="Cancel"
        onClick={onDismiss}
      />
      <div
        className="sheet-panel glass glass-sheet absolute left-1/2 w-[min(340px,calc(100vw-32px))] -translate-x-1/2 rounded-[28px] px-2 py-3"
        style={{ top: "calc(env(safe-area-inset-top) + 64px)" }}
      >
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-1 rounded-2xl bg-[var(--seg-thumb)]/70"
            style={{ top: PAD, height: ITEM }}
          />
          <div
            ref={scroller}
            role="listbox"
            aria-label="Quick switch"
            aria-activedescendant={`wheel-${items[active]?.id}`}
            tabIndex={0}
            onScroll={paint}
            className="relative overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              height: ITEM * VISIBLE,
              paddingBlock: PAD,
              scrollSnapType: dragging ? "none" : "y mandatory",
            }}
          >
            {items.map((item, i) => (
              <button
                key={item.id}
                id={`wheel-${item.id}`}
                type="button"
                role="option"
                aria-selected={i === active}
                data-wheel-item
                onClick={() => onCommit(item.id)}
                className="flex w-full flex-col items-center justify-center text-center will-change-transform"
                style={{ height: ITEM, scrollSnapAlign: "center" }}
              >
                <span
                  className={`max-w-full truncate leading-tight ${i === active ? "text-[19px] font-bold" : "text-[16px] font-semibold"}`}
                >
                  {item.title}
                  {item.id === current ? <span className="text-accent"> •</span> : null}
                </span>
                <span className="text-[11px] leading-tight text-muted">{item.detail}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="pt-1 text-center text-xs text-muted">
          {dragging ? "Release to switch" : "Tap to switch"}
        </p>
      </div>
    </div>
  );
});

export function UniverseTitle({
  title,
  current,
  items,
  hint,
  onTap,
  onSwitch,
}: {
  title: string;
  /** Id of the universe on screen ("book" for the portfolio). */
  current: string;
  items: Universe[];
  /** Show the one-time "hold" hint. */
  hint: boolean;
  onTap: () => void;
  onSwitch: (id: string) => void;
}) {
  const [wheel, setWheel] = useState<{ dragging: boolean } | null>(null);
  const press = useRef<{
    id: number;
    x: number;
    y: number;
    timer: number;
    opened: boolean;
    moved: boolean;
  } | null>(null);
  const swallowClick = useRef(false);
  // When the opening hold ends, a touch browser sends its click to whatever is
  // under the finger (the backdrop), which must not cancel the wheel.
  const releasedAt = useRef(0);
  const wheelRef = useRef<WheelHandle>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!hint) return;
    setShowHint(true);
    const timer = window.setTimeout(() => setShowHint(false), 4500);
    return () => window.clearTimeout(timer);
  }, [hint]);

  const close = useCallback(() => {
    hapticClose();
    setWheel(null);
  }, []);
  const dismiss = useCallback(() => {
    if (performance.now() - releasedAt.current > 400) close();
  }, [close]);
  const commit = useCallback(
    (id: string) => {
      close();
      markWheelUsed();
      if (id !== current) onSwitch(id);
    },
    [close, current, onSwitch],
  );

  const endPress = () => {
    if (press.current) window.clearTimeout(press.current.timer);
    press.current = null;
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || wheel) return;
    const target = event.currentTarget;
    const pointerId = event.pointerId;
    try {
      target.setPointerCapture(pointerId);
    } catch {
      /* not capturable */
    }
    press.current = {
      id: pointerId,
      x: event.clientX,
      y: event.clientY,
      opened: false,
      moved: false,
      timer: window.setTimeout(() => {
        if (!press.current) return;
        press.current.opened = true;
        swallowClick.current = true;
        setShowHint(false);
        hapticOpen();
        setWheel({ dragging: true });
      }, HOLD_MS),
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p || event.pointerId !== p.id) return;
    const dy = event.clientY - p.y;
    if (!p.opened) {
      // Moving before the hold completes means it isn't a hold.
      if (Math.hypot(event.clientX - p.x, dy) > SLOP) window.clearTimeout(p.timer);
      return;
    }
    if (Math.abs(dy) > 6) p.moved = true;
    wheelRef.current?.drag(dy);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p || event.pointerId !== p.id) return;
    if (p.opened) {
      releasedAt.current = performance.now();
      if (p.moved) wheelRef.current?.release();
      else setWheel({ dragging: false });
    }
    endPress();
  };

  const onPointerCancel = () => {
    if (press.current?.opened) {
      releasedAt.current = performance.now();
      setWheel({ dragging: false });
    }
    endPress();
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          if (swallowClick.current) {
            swallowClick.current = false;
            event.preventDefault();
            return;
          }
          onTap();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onContextMenu={(event) => event.preventDefault()}
        aria-haspopup="dialog"
        aria-label={`${title}. Choose a market. Press and hold to switch quickly.`}
        className="relative flex w-full min-w-0 touch-none select-none items-center gap-1 text-left [-webkit-touch-callout:none]"
      >
        <LargeTitle>{title}</LargeTitle>
        <ChevronDown className="mt-1 size-5 shrink-0 text-muted" strokeWidth={2.5} />
      </button>
      <span
        aria-hidden={!showHint}
        className={`glass pointer-events-none absolute left-3 top-[calc(env(safe-area-inset-top)+50px)] z-20 rounded-full px-3 py-1.5 text-[12px] font-medium transition-opacity duration-300 ${showHint ? "opacity-100" : "opacity-0"}`}
      >
        Hold the title to quick switch
      </span>
      {wheel ? (
        <Wheel
          ref={wheelRef}
          items={items}
          current={current}
          dragging={wheel.dragging}
          onCommit={commit}
          onCancel={close}
          onDismiss={dismiss}
        />
      ) : null}
    </>
  );
}
