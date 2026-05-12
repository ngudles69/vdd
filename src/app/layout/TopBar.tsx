import { useAppStore } from "../../state/appStore";

export function TopBar() {
  const artboard = useAppStore((state) => state.artboard);
  const preset = useAppStore((state) => state.preset);
  const setPreset = useAppStore((state) => state.setPreset);
  const presets = useAppStore((state) => state.presets);

  return (
    <header className="flex items-center justify-between gap-4 bg-white px-4">
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold">Crochet Design Editor</h1>
        <p className="text-xs text-slate-500">Untitled project</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          Canvas
          <select
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            value={preset}
            onChange={(event) => setPreset(event.target.value)}
          >
            {presets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <div className="hidden rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-600 sm:block">
          {artboard.width} x {artboard.height} {artboard.unit}
        </div>
      </div>
    </header>
  );
}
