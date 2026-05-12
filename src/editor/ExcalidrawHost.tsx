import { Excalidraw } from "@excalidraw/excalidraw";
import { useCallback, useEffect, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useAppStore } from "../state/appStore";
import { createArtboardPageElement, syncArtboardPage } from "./artboardPage";
import { setExcalidrawApi } from "./excalidrawApi";

export function ExcalidrawHost() {
  const artboard = useAppStore((state) => state.artboard);
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);

  const handleApi = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawApi(api);
    setApi(api);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    syncArtboardPage(api, artboard);
  }, [api, artboard]);

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={handleApi}
        initialData={{
          elements: [createArtboardPageElement(artboard)],
          appState: {
            viewBackgroundColor: "#e2e8f0",
            currentItemStrokeColor: "#172033",
          },
        }}
      />
    </div>
  );
}
