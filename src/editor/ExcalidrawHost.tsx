import { Excalidraw } from "@excalidraw/excalidraw";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useAppStore } from "../state/appStore";
import { ArtboardOverlay } from "./ArtboardOverlay";
import {
  centerArtboardViewport,
  getArtboardViewport,
  type ArtboardViewport,
} from "./artboardViewport";
import { setExcalidrawApi } from "./excalidrawApi";

export function ExcalidrawHost() {
  const artboard = useAppStore((state) => state.artboard);
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [viewport, setViewport] = useState<ArtboardViewport | null>(null);
  const initialData = useMemo(
    () => ({
      appState: {
        viewBackgroundColor: "transparent",
        currentItemStrokeColor: "#172033",
      },
    }),
    [],
  );

  const handleApi = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawApi(api);
    setApi(api);
  }, []);

  const updateViewport = useCallback((api: ExcalidrawImperativeAPI) => {
    setViewport(getArtboardViewport(api));
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      centerArtboardViewport(api, artboard);
      updateViewport(api);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [api, artboard, updateViewport]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200">
      <ArtboardOverlay artboard={artboard} viewport={viewport} />
      <div className="absolute inset-0">
        <Excalidraw
          excalidrawAPI={handleApi}
          initialData={initialData}
          onScrollChange={() => {
            if (api) {
              updateViewport(api);
            }
          }}
        />
      </div>
    </div>
  );
}
