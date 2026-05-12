import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { NormalizedZoomValue } from "@excalidraw/excalidraw/types";
import type { Artboard } from "../types/projectTypes";

const ARTBOARD_VIEWPORT_PADDING = 80;

export type ArtboardViewport = {
  height: number;
  offsetLeft: number;
  offsetTop: number;
  scrollX: number;
  scrollY: number;
  width: number;
  zoom: number;
};

function getArtboardFitZoom(api: ExcalidrawImperativeAPI, artboard: Artboard) {
  const appState = api.getAppState();
  const availableWidth = Math.max(appState.width - ARTBOARD_VIEWPORT_PADDING * 2, 320);
  const availableHeight = Math.max(appState.height - ARTBOARD_VIEWPORT_PADDING * 2, 320);

  return Math.min(1, availableWidth / artboard.width, availableHeight / artboard.height);
}

export function centerArtboardViewport(api: ExcalidrawImperativeAPI, artboard: Artboard) {
  const appState = api.getAppState();
  const zoom = getArtboardFitZoom(api, artboard);

  api.updateScene({
    appState: {
      scrollX: appState.width / (2 * zoom),
      scrollY: appState.height / (2 * zoom),
      zoom: {
        value: zoom as NormalizedZoomValue,
      },
    },
  });
}

export function getArtboardViewport(api: ExcalidrawImperativeAPI): ArtboardViewport {
  const appState = api.getAppState();

  return {
    height: appState.height,
    offsetLeft: appState.offsetLeft,
    offsetTop: appState.offsetTop,
    scrollX: appState.scrollX,
    scrollY: appState.scrollY,
    width: appState.width,
    zoom: appState.zoom.value,
  };
}
