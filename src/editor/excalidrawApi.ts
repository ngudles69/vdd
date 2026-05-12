import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

let api: ExcalidrawImperativeAPI | null = null;

export function setExcalidrawApi(nextApi: ExcalidrawImperativeAPI) {
  api = nextApi;
}

export function getExcalidrawApi() {
  return api;
}
