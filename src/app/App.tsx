import { CanvasShell } from "./layout/CanvasShell";
import { LeftPanel } from "./layout/LeftPanel";
import { LeftToolbar } from "./layout/LeftToolbar";
import { RightPanel } from "./layout/RightPanel";
import { TopBar } from "./layout/TopBar";

export function App() {
  return (
    <main className="grid h-full min-h-0 grid-rows-[56px_1fr] bg-slate-100 text-slate-900">
      <TopBar />
      <div className="relative min-h-0 border-t border-slate-200">
        <div className="grid h-full min-h-0 grid-cols-[72px_minmax(0,1fr)_280px]">
          <LeftToolbar />
          <CanvasShell />
          <RightPanel />
        </div>
        <LeftPanel />
      </div>
    </main>
  );
}
