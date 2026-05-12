import { Excalidraw } from "@excalidraw/excalidraw";
import { useCallback } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { setExcalidrawApi } from "./excalidrawApi";

export function ExcalidrawHost() {
  const handleApi = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawApi(api);
  }, []);

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={handleApi}
        initialData={{
          appState: {
            viewBackgroundColor: "#ffffff",
            currentItemStrokeColor: "#172033",
          },
        }}
      />
    </div>
  );
}
