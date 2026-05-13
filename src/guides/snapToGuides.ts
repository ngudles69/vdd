import { newElementWith } from "@excalidraw/excalidraw";
import type {
  ExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import { OBJECT_LAYER_ROLE } from "../editor/sceneLayers";
import type { GuideLayer, SquareGridConfig } from "./guideTypes";

type Point = {
  x: number;
  y: number;
};

function isSquareGridConfig(config: GuideLayer["config"]): config is SquareGridConfig {
  return "horizontalSpacing" in config;
}

export function getActiveSquareSnapGuide(guides: GuideLayer[]) {
  return guides.find(
    (guide) =>
      guide.type === "square-grid" &&
      guide.visible &&
      guide.snapEnabled &&
      isSquareGridConfig(guide.config),
  );
}

function snapPointToSquareGuide(point: Point, guide: GuideLayer): Point {
  if (!isSquareGridConfig(guide.config)) {
    return point;
  }

  const scale = Math.max(0.1, Math.abs(guide.scale));
  const radians = (-guide.rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const translatedX = point.x - guide.position.x;
  const translatedY = point.y - guide.position.y;
  const localX = (translatedX * cos - translatedY * sin) / scale;
  const localY = (translatedX * sin + translatedY * cos) / scale;
  const spacingX = Math.max(1, guide.config.horizontalSpacing);
  const spacingY = Math.max(
    1,
    guide.config.linkedSpacing ? guide.config.horizontalSpacing : guide.config.verticalSpacing,
  );
  const snappedLocalX = Math.round(localX / spacingX) * spacingX;
  const snappedLocalY = Math.round(localY / spacingY) * spacingY;
  const forwardRadians = (guide.rotation * Math.PI) / 180;
  const forwardCos = Math.cos(forwardRadians);
  const forwardSin = Math.sin(forwardRadians);
  const scaledX = snappedLocalX * scale;
  const scaledY = snappedLocalY * scale;

  return {
    x: scaledX * forwardCos - scaledY * forwardSin + guide.position.x,
    y: scaledX * forwardSin + scaledY * forwardCos + guide.position.y,
  };
}

function shouldSnapElement(element: ExcalidrawElement) {
  return (
    !element.isDeleted &&
    !element.locked &&
    element.customData?.role === OBJECT_LAYER_ROLE
  );
}

export function snapObjectElementsToGuide(
  elements: readonly OrderedExcalidrawElement[],
  guide: GuideLayer | undefined,
) {
  if (!guide) {
    return { changed: false, elements };
  }

  let changed = false;
  const snappedElements = elements.map((element) => {
    if (!shouldSnapElement(element)) {
      return element;
    }

    const center = {
      x: element.x + element.width / 2,
      y: element.y + element.height / 2,
    };
    const snappedCenter = snapPointToSquareGuide(center, guide);
    const nextX = snappedCenter.x - element.width / 2;
    const nextY = snappedCenter.y - element.height / 2;

    if (Math.abs(nextX - element.x) < 0.01 && Math.abs(nextY - element.y) < 0.01) {
      return element;
    }

    changed = true;

    return newElementWith(element, {
      x: nextX,
      y: nextY,
    });
  });

  return { changed, elements: snappedElements };
}
