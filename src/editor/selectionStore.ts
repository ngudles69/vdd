import { create } from "zustand";
import type { AppState } from "@excalidraw/excalidraw/types";
import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";

type SelectionStore = {
  selectedElement: ExcalidrawElement | null;
  clearSelection: () => void;
  syncSelection: (
    elements: readonly OrderedExcalidrawElement[],
    appState: AppState,
  ) => void;
};

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedElement: null,
  clearSelection: () => set({ selectedElement: null }),
  syncSelection: (elements, appState) => {
    const selectedId = Object.keys(appState.selectedElementIds).find(
      (id) => appState.selectedElementIds[id],
    );
    const selectedElement =
      elements.find((element) => element.id === selectedId && !element.isDeleted) ?? null;

    set({ selectedElement });
  },
}));
