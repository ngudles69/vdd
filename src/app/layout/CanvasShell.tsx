import { ExcalidrawHost } from "../../editor/ExcalidrawHost";
import { useAppStore } from "../../state/appStore";

export function CanvasShell() {
  const artboard = useAppStore((state) => state.artboard);

  return (
    <section className="relative min-h-0 overflow-hidden bg-slate-200">
      <div className="absolute left-4 top-4 z-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
        {artboard.name}
      </div>
      <div className="h-full min-h-0">
        <ExcalidrawHost />
      </div>
    </section>
  );
}
