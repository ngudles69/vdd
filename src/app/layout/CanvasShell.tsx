import { ExcalidrawHost } from "../../editor/ExcalidrawHost";
import { useAppStore } from "../../state/appStore";

export function CanvasShell() {
  const artboard = useAppStore((state) => state.artboard);
  const scale = Math.min(1, 720 / Math.max(artboard.width, artboard.height));

  return (
    <section className="relative min-h-0 overflow-hidden bg-slate-200">
      <div className="absolute left-4 top-4 z-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
        {artboard.name}
      </div>

      <div className="flex h-full items-center justify-center overflow-auto p-8">
        <div
          className="relative overflow-hidden border border-slate-300 bg-white shadow-xl"
          style={{
            width: artboard.width * scale,
            height: artboard.height * scale,
          }}
        >
          <ExcalidrawHost />
        </div>
      </div>
    </section>
  );
}
