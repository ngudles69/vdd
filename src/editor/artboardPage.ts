import {
  CaptureUpdateAction,
  convertToExcalidrawElements,
} from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { Artboard } from "../types/projectTypes";

export const ARTBOARD_PAGE_ROLE = "vdd-artboard-page";

export function isArtboardPage(element: ExcalidrawElement) {
  return element.customData?.role === ARTBOARD_PAGE_ROLE;
}

function hasMatchingArtboardPage(element: ExcalidrawElement, artboard: Artboard) {
  return (
    isArtboardPage(element) &&
    !element.isDeleted &&
    element.x === -artboard.width / 2 &&
    element.y === -artboard.height / 2 &&
    element.width === artboard.width &&
    element.height === artboard.height &&
    element.backgroundColor === artboard.backgroundColor &&
    element.locked
  );
}

export function createArtboardPageElement(artboard: Artboard, id?: ExcalidrawElement["id"]) {
  const [pageElement] = convertToExcalidrawElements([
    {
      type: "rectangle",
      id,
      x: -artboard.width / 2,
      y: -artboard.height / 2,
      width: artboard.width,
      height: artboard.height,
      angle: 0,
      backgroundColor: artboard.backgroundColor,
      fillStyle: "solid",
      strokeColor: "#94a3b8",
      strokeStyle: "solid",
      strokeWidth: 1,
      roughness: 0,
      opacity: 100,
      locked: true,
      customData: {
        role: ARTBOARD_PAGE_ROLE,
        preset: artboard.id,
      },
    },
  ]);

  return pageElement;
}

export function syncArtboardPage(api: ExcalidrawImperativeAPI, artboard: Artboard) {
  const elements = api.getSceneElementsIncludingDeleted();
  const currentPage = elements.find(isArtboardPage);

  if (currentPage && hasMatchingArtboardPage(currentPage, artboard)) {
    return;
  }

  const pageElement = createArtboardPageElement(artboard, currentPage?.id);
  const userElements = elements.filter((element) => !isArtboardPage(element));

  api.updateScene({
    elements: [pageElement, ...userElements],
    captureUpdate: CaptureUpdateAction.NEVER,
  });
  api.scrollToContent(pageElement, {
    fitToContent: true,
    animate: false,
  });
}
