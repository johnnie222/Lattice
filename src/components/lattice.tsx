import { MapView } from "@/components/map-view";
import { SectorsView } from "@/components/sectors-view";
import { PortfolioView } from "@/components/portfolio-view";
import { TabBar, type TabId } from "@/components/chrome";
import { useApplyTheme } from "@/lib/theme";
import { useView } from "@/lib/use-view";

/** App shell: one view at a time, the tab bar in its own strip below it. */
export function Lattice() {
  useApplyTheme();
  const { search, setView } = useView();
  const tab: TabId = search.tab ?? "map";

  return (
    <main className="flex h-dvh flex-col bg-bg text-fg">
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "map" ? <MapView /> : tab === "sectors" ? <SectorsView /> : <PortfolioView />}
      </div>
      <TabBar tab={tab} onChange={(next) => setView({ tab: next })} />
    </main>
  );
}
