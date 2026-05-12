import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

declare global {
  interface Window {
    __VDD_EXCALIDRAW_API__?: ExcalidrawImperativeAPI;
  }
}

export {};
