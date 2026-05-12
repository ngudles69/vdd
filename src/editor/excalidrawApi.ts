import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

let api: ExcalidrawImperativeAPI | null = null;

export function setExcalidrawApi(nextApi: ExcalidrawImperativeAPI) {
  api = nextApi;

  if (typeof window !== "undefined") {
    window.__VDD_EXCALIDRAW_API__ = nextApi;
  }
}

export function getExcalidrawApi() {
  return api;
}
