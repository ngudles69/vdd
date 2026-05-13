import { SymbolLibrary } from "../../symbols/SymbolLibrary";
import { GuidePanel } from "../../guides/GuidePanel";
import { useAppStore } from "../../state/appStore";

export function LeftPanel() {
  const activePanel = useAppStore((state) => state.activePanel);

  if (activePanel !== "Symbols" && activePanel !== "Guides") {
    return null;
  }

  return (
    <aside
      aria-label={activePanel === "Symbols" ? "Elements drawer" : "Guides drawer"}
      className="absolute bottom-0 left-[72px] top-0 z-[3] w-80 overflow-y-auto border-r border-slate-200 bg-white pt-12 shadow-xl"
    >
      {activePanel === "Symbols" ? <SymbolLibrary /> : <GuidePanel />}
    </aside>
  );
}
