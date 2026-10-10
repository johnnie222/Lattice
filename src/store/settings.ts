import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePref = "system" | "light" | "dark";
export type PaletteId = "classic" | "eastern" | "access";
export type RefreshPref = "auto" | "30" | "60" | "300" | "manual";

type SettingsState = {
  theme: ThemePref;
  palette: PaletteId;
  refresh: RefreshPref;
  setTheme: (theme: ThemePref) => void;
  setPalette: (palette: PaletteId) => void;
  setRefresh: (refresh: RefreshPref) => void;
};

export const SETTINGS_KEY = "lattice-settings-v1";

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      palette: "classic",
      refresh: "auto",
      setTheme: (theme) => set({ theme }),
      setPalette: (palette) => set({ palette }),
      setRefresh: (refresh) => set({ refresh }),
    }),
    { name: SETTINGS_KEY },
  ),
);
