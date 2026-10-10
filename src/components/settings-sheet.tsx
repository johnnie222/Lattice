import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { ListGroup, ListRow, Sheet } from "@/components/sheets";
import { formatAsOf } from "@/lib/format";
import { BOOKS_BACKUP_KEY, EMPTY_BOOK, useBooks } from "@/store/books";
import { useSettings, type PaletteId, type RefreshPref, type ThemePref } from "@/store/settings";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[11px] bg-surface-2/80 p-0.5">
      {options.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(option.id)}
            className={`h-8 flex-1 rounded-[9px] text-[13px] font-semibold transition-colors ${on ? "bg-[var(--seg-thumb)] text-fg shadow-[0_1px_4px_rgb(0_0_0/0.2)]" : "text-muted"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const THEMES: { id: ThemePref; label: string }[] = [
  { id: "system", label: "Automatic" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const REFRESH: { id: RefreshPref; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "30", label: "30s" },
  { id: "60", label: "1m" },
  { id: "300", label: "5m" },
  { id: "manual", label: "Off" },
];

const PALETTES: { id: PaletteId; title: string; subtitle: string; up: string; down: string }[] = [
  { id: "classic", title: "Green up, red down", subtitle: "The US and European convention", up: "green", down: "red" },
  { id: "eastern", title: "Red up, green down", subtitle: "As in China, Japan and Korea", up: "red", down: "green" },
  { id: "access", title: "Blue up, orange down", subtitle: "Clearer with color blindness", up: "blue", down: "orange" },
];

// Five-step preview of a palette: strongest down → strongest up.
function Swatch({ up, down }: { up: string; down: string }) {
  const steps = [`--${down}-5`, `--${down}-3`, `--${down}-1`, `--${up}-1`, `--${up}-3`, `--${up}-5`];
  return (
    <span className="flex h-7 w-16 shrink-0 overflow-hidden rounded-md" aria-hidden="true">
      {steps.map((step) => (
        <span key={step} className="flex-1" style={{ background: `var(${step})` }} />
      ))}
    </span>
  );
}

export function SettingsSheet({
  asOf,
  status,
  onInfo,
  onClose,
}: {
  asOf: number | null;
  status: "idle" | "loading" | "live" | "error";
  onInfo: () => void;
  onClose: () => void;
}) {
  const theme = useSettings((s) => s.theme);
  const palette = useSettings((s) => s.palette);
  const refresh = useSettings((s) => s.refresh);
  const setTheme = useSettings((s) => s.setTheme);
  const setPalette = useSettings((s) => s.setPalette);
  const setRefresh = useSettings((s) => s.setRefresh);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = window.setTimeout(() => setConfirmReset(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmReset]);

  const resetAll = () => {
    useBooks.setState({ books: [EMPTY_BOOK], activeId: "main" });
    useSettings.setState({ theme: "system", palette: "classic", refresh: "auto" });
    try {
      localStorage.removeItem(BOOKS_BACKUP_KEY);
      for (const key of Object.keys(sessionStorage)) {
        if (key.startsWith("lattice-quotes-") || key.startsWith("lattice-refs-")) sessionStorage.removeItem(key);
      }
    } catch {
      /* storage blocked */
    }
    setConfirmReset(false);
    onClose();
  };

  const platform = Capacitor.isNativePlatform() ? "Android" : "Web";

  return (
    <Sheet title="Settings" onClose={onClose}>
      <ListGroup title="Appearance">
        <div className="px-4 py-3">
          <Segmented label="Theme" value={theme} options={THEMES} onChange={setTheme} />
        </div>
        {PALETTES.map((item) => (
          <ListRow
            key={item.id}
            leading={<Swatch up={item.up} down={item.down} />}
            title={item.title}
            subtitle={item.subtitle}
            checked={item.id === palette}
            onClick={() => setPalette(item.id)}
          />
        ))}
      </ListGroup>

      <ListGroup
        title="Refresh"
        footer="Auto follows the market: every 45 seconds while it's open, every 2 minutes before and after hours, every 15 minutes when it's closed. Lattice never refreshes in the background."
      >
        <div className="px-4 py-3">
          <Segmented label="Refresh interval" value={refresh} options={REFRESH} onChange={setRefresh} />
        </div>
      </ListGroup>

      <ListGroup
        title="Data sources"
        footer="Prices come from Yahoo Finance's public feed. It isn't an official exchange feed and may be delayed or briefly unavailable."
      >
        <ListRow title="Prices" detail="Yahoo Finance" />
        <ListRow
          title="Last update"
          detail={
            <span className={status === "error" ? "text-down" : undefined}>
              {asOf ? `${formatAsOf(asOf)} ET` : status === "error" ? "Unavailable" : "—"}
            </span>
          }
        />
        <ListRow title="Index members & sizes" detail="Snapshot" subtitle="Updated with each app release" />
        <ListRow title="Company logos" detail="Parqet" />
        <ListRow title="How to read the map" chevron onClick={onInfo} />
      </ListGroup>

      <ListGroup title="About">
        <div className="flex items-center gap-3 px-4 py-3">
          <img src={LOGO} alt="" width={52} height={52} className="size-[52px] rounded-[14px]" />
          <div className="min-w-0">
            <p className="text-[17px] font-semibold tracking-tight">Lattice</p>
            <p className="text-xs text-muted">The whole market, at a glance.</p>
          </div>
        </div>
        <ListRow title="Version" detail={`${__APP_VERSION__} (${__APP_BUILD__})`} />
        <ListRow title="Platform" detail={platform} />
        <ListRow
          title="Privacy"
          wrap
          subtitle="Your portfolios and settings stay on this device. The only thing Lattice sends is price requests."
        />
        <ListRow title="Disclaimer" wrap subtitle="For information only. Not investment advice." />
      </ListGroup>

      <ListGroup footer="Removes your portfolios and resets every setting on this device.">
        <ListRow
          title={confirmReset ? "Tap again to reset everything" : "Reset All Data"}
          tone="danger"
          onClick={() => (confirmReset ? resetAll() : setConfirmReset(true))}
        />
      </ListGroup>
    </Sheet>
  );
}

// The app mark (same art as the launcher icon), inlined so it works offline.
const LOGO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#07080B"/><rect x="6" y="7" width="12" height="9" rx="2" fill="#30D158"/><rect x="20" y="7" width="6" height="9" rx="2" fill="#FF453A"/><rect x="6" y="18" width="6" height="8" rx="2" fill="#FF453A"/><rect x="14" y="18" width="12" height="8" rx="2" fill="#30D158"/></svg>',
)}`;
