import { SymbolLibrary } from "../../symbols/SymbolLibrary";
import { useAppStore } from "../../state/appStore";

export function LeftPanel() {
  const activePanel = useAppStore((state) => state.activePanel);

  if (activePanel !== "Symbols") {
    return null;
  }

  return (
    <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white shadow-sm">
      <SymbolLibrary />
    </aside>
  );
}
