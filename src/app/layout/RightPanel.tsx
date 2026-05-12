import { useAppStore } from "../../state/appStore";

export function RightPanel() {
  const artboard = useAppStore((state) => state.artboard);

  return (
    <aside className="min-h-0 overflow-y-auto border-l border-slate-200 bg-white p-4">
      <div className="space-y-4">
        <section>
          <h2 className="text-sm font-semibold text-slate-900">Properties</h2>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <dt className="text-slate-500">Artboard</dt>
            <dd className="text-right font-medium text-slate-800">{artboard.name}</dd>
            <dt className="text-slate-500">Width</dt>
            <dd className="text-right font-medium text-slate-800">
              {artboard.width} {artboard.unit}
            </dd>
            <dt className="text-slate-500">Height</dt>
            <dd className="text-right font-medium text-slate-800">
              {artboard.height} {artboard.unit}
            </dd>
          </dl>
        </section>

        <section className="border-t border-slate-200 pt-4">
          <h2 className="text-sm font-semibold text-slate-900">Next Panels</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-500">
            <p>Templates</p>
            <p>Guides</p>
            <p>Groups</p>
            <p>Export</p>
          </div>
        </section>
      </div>
    </aside>
  );
}
