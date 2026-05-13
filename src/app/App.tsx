import { CanvasShell } from "./layout/CanvasShell";
import { LeftPanel } from "./layout/LeftPanel";
import { LeftToolbar } from "./layout/LeftToolbar";
import { RightPanel } from "./layout/RightPanel";
import { TopBar } from "./layout/TopBar";
import { getFloatingPanelKind } from "../editor/floatingPanels";
import { useSelectionStore } from "../editor/selectionStore";
import { useAppStore } from "../state/appStore";

function hasOverlayDrawer(activePanel: string) {
  return activePanel === "Symbols" || activePanel === "Guides";
}

export function App() {
  const activePanel = useAppStore((state) => state.activePanel);
  const selectedElement = useSelectionStore((state) => state.selectedElement);
  const floatingPanelKind = getFloatingPanelKind(activePanel, selectedElement);
  const customFloatingPanelActive =
    floatingPanelKind === "stitch" || floatingPanelKind === "guide";

  return (
    <main
      className={`grid h-full min-h-0 grid-rows-[56px_1fr] bg-slate-100 text-slate-900 ${
        hasOverlayDrawer(activePanel) ? "vdd-drawer-open" : ""
      } ${floatingPanelKind === "guide" ? "vdd-guide-panel-active" : ""} ${
        customFloatingPanelActive ? "vdd-custom-floating-panel-active" : ""
      }`}
    >
      <TopBar />
      <div className="relative min-h-0 border-t border-slate-200">
        <div className="grid h-full min-h-0 grid-cols-[72px_minmax(0,1fr)_300px]">
          <LeftToolbar />
          <CanvasShell />
          <RightPanel />
        </div>
        <LeftPanel />
      </div>
    </main>
  );
}
