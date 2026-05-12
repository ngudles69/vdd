import { useEffect, useRef, useState } from "react";
import { ExcalidrawHost } from "../../editor/ExcalidrawHost";
import { useAppStore } from "../../state/appStore";

export function CanvasShell() {
  const artboard = useAppStore((state) => state.artboard);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [workspaceSize, setWorkspaceSize] = useState({ width: 0, height: 0 });
  const workspacePadding = 48;
  const availableWidth = Math.max(workspaceSize.width - workspacePadding * 2, 320);
  const availableHeight = Math.max(workspaceSize.height - workspacePadding * 2, 320);
  const scale = Math.min(
    1,
    availableWidth / artboard.width,
    availableHeight / artboard.height,
  );

  useEffect(() => {
    const workspace = workspaceRef.current;

    if (!workspace) {
      return;
    }

    const updateSize = () => {
      setWorkspaceSize({
        width: workspace.clientWidth,
        height: workspace.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(workspace);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-0 overflow-hidden bg-slate-200">
      <div className="absolute left-4 top-4 z-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
        {artboard.name}
      </div>

      <div
        className="flex h-full items-center justify-center overflow-auto p-12"
        ref={workspaceRef}
      >
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
