import { CanvasShell } from "./layout/CanvasShell";
import { LeftPanel } from "./layout/LeftPanel";
import { LeftToolbar } from "./layout/LeftToolbar";
import { RightPanel } from "./layout/RightPanel";
import { TopBar } from "./layout/TopBar";
import { useAppStore } from "../state/appStore";

export function App() {
  const activePanel = useAppStore((state) => state.activePanel);
  const gridColumns =
    activePanel === "Symbols"
      ? "72px 320px minmax(0,1fr) 280px"
      : "72px minmax(0,1fr) 280px";

  return (
    <main className="grid h-full min-h-0 grid-rows-[56px_1fr] bg-slate-100 text-slate-900">
      <TopBar />
      <div className="grid min-h-0 border-t border-slate-200" style={{ gridTemplateColumns: gridColumns }}>
        <LeftToolbar />
        {activePanel === "Symbols" ? <LeftPanel /> : null}
        <CanvasShell />
        <RightPanel />
      </div>
    </main>
  );
}
