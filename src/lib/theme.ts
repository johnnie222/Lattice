import { useEffect } from "react";
import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { SETTINGS_KEY, useSettings, type ThemePref } from "@/store/settings";

const META_COLOR = { dark: "#000000", light: "#f2f2f7" } as const;

/**
 * Runs before first paint (inlined into <head>) so a light-theme user never
 * sees a dark flash. Mirrors resolveTheme() below.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var s=(JSON.parse(localStorage.getItem(${JSON.stringify(
  SETTINGS_KEY,
)})||"{}").state)||{};var t=s.theme||"system";if(t==="system")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";var d=document.documentElement;d.dataset.theme=t;d.dataset.palette=s.palette||"classic";}catch(e){}})();`;

function resolveTheme(pref: ThemePref): "light" | "dark" {
  if (pref !== "system") return pref;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Keeps <html data-theme / data-palette>, theme-color and Android bars in sync. */
export function useApplyTheme() {
  const theme = useSettings((s) => s.theme);
  const palette = useSettings((s) => s.palette);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => {
      const resolved = resolveTheme(theme);
      const root = document.documentElement;
      root.dataset.theme = resolved;
      root.dataset.palette = palette;
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = META_COLOR[resolved];
      if (Capacitor.isNativePlatform()) {
        void SystemBars.setStyle({
          style: resolved === "dark" ? SystemBarsStyle.Dark : SystemBarsStyle.Light,
        }).catch(() => undefined);
      }
    };
    apply();
    if (theme !== "system") return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme, palette]);
}
