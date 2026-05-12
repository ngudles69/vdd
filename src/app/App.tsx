import { CanvasShell } from "./layout/CanvasShell";
import { LeftToolbar } from "./layout/LeftToolbar";
import { RightPanel } from "./layout/RightPanel";
import { TopBar } from "./layout/TopBar";

export function App() {
  return (
    <main className="grid h-full min-h-0 grid-rows-[56px_1fr] bg-slate-100 text-slate-900">
      <TopBar />
      <div className="grid min-h-0 grid-cols-[72px_minmax(0,1fr)_280px] border-t border-slate-200">
        <LeftToolbar />
        <CanvasShell />
        <RightPanel />
      </div>
    </main>
  );
}
