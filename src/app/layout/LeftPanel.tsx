import { SymbolLibrary } from "../../symbols/SymbolLibrary";
import { useAppStore } from "../../state/appStore";

export function LeftPanel() {
  const activePanel = useAppStore((state) => state.activePanel);

  if (activePanel !== "Symbols") {
    return null;
  }

  return (
    <aside
      aria-label="Elements drawer"
      className="absolute bottom-0 left-[72px] top-0 z-30 w-80 overflow-y-auto border-r border-slate-200 bg-white shadow-xl"
    >
      <SymbolLibrary />
    </aside>
  );
}
