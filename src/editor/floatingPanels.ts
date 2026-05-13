import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export type FloatingPanelKind = "stitch" | "guide" | "native" | null;

export function isSelectedSymbol(
  element: ExcalidrawElement | null,
): element is ExcalidrawElement & { type: "image" } {
  return element?.type === "image" && Boolean(element.customData?.symbolId);
}

export function getFloatingPanelKind(
  activePanel: string,
  selectedElement: ExcalidrawElement | null,
): FloatingPanelKind {
  if (isSelectedSymbol(selectedElement)) {
    return "stitch";
  }

  if (selectedElement) {
    return "native";
  }

  if (activePanel === "Guides") {
    return "guide";
  }

  return null;
}
