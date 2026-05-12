import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export const GUIDE_LAYER_ROLE = "vdd-guide";
export const GRID_LAYER_ROLE = "vdd-grid";
export const OBJECT_LAYER_ROLE = "vdd-object";

function isGuideOrGridElement(element: ExcalidrawElement) {
  return (
    element.customData?.role === GUIDE_LAYER_ROLE ||
    element.customData?.role === GRID_LAYER_ROLE
  );
}

function getLayerRank(element: ExcalidrawElement) {
  if (isGuideOrGridElement(element)) {
    return 0;
  }

  return 1;
}

export function orderSceneElements<T extends ExcalidrawElement>(elements: readonly T[]) {
  return [...elements].sort((left, right) => getLayerRank(left) - getLayerRank(right));
}
