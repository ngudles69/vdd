import { CaptureUpdateAction, Excalidraw } from "@excalidraw/excalidraw";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { useAppStore } from "../state/appStore";
import { GuideFloatingPanel } from "../guides/GuideFloatingPanel";
import { GuideOverlay } from "../guides/GuideOverlay";
import { useGuideStore } from "../guides/guideStore";
import { getActiveSquareSnapGuide, snapObjectElementsToGuide } from "../guides/snapToGuides";
import { useSelectionStore } from "./selectionStore";
import { ArtboardOverlay } from "./ArtboardOverlay";
import {
  centerArtboardViewport,
  getArtboardViewport,
  type ArtboardViewport,
} from "./artboardViewport";
import { setExcalidrawApi } from "./excalidrawApi";
import { SymbolFloatingPanel } from "./SymbolFloatingPanel";

export function ExcalidrawHost() {
  const artboard = useAppStore((state) => state.artboard);
  const guides = useGuideStore((state) => state.guides);
  const syncSelection = useSelectionStore((state) => state.syncSelection);
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [viewport, setViewport] = useState<ArtboardViewport | null>(null);
  const snapUpdateInProgress = useRef(false);
  const activeSnapGuide = useMemo(() => getActiveSquareSnapGuide(guides), [guides]);
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

  const snapSceneToGuide = useCallback(() => {
    if (!api || snapUpdateInProgress.current) {
      return;
    }

    const { changed, elements } = snapObjectElementsToGuide(
      api.getSceneElementsIncludingDeleted(),
      activeSnapGuide,
    );

    if (!changed) {
      return;
    }

    snapUpdateInProgress.current = true;
    api.updateScene({
      elements,
      captureUpdate: CaptureUpdateAction.EVENTUALLY,
    });
    window.requestAnimationFrame(() => {
      snapUpdateInProgress.current = false;
    });
  }, [activeSnapGuide, api]);

  useEffect(() => {
    snapSceneToGuide();
  }, [snapSceneToGuide]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-200">
      <ArtboardOverlay artboard={artboard} viewport={viewport} />
      <GuideOverlay artboard={artboard} viewport={viewport} />
      <div className="absolute inset-0">
        <Excalidraw
          excalidrawAPI={handleApi}
          initialData={initialData}
          onChange={(elements, appState) => {
            syncSelection(elements, appState);
            snapSceneToGuide();
          }}
          onScrollChange={() => {
            if (api) {
              updateViewport(api);
            }
          }}
        />
      </div>
      <GuideFloatingPanel />
      <SymbolFloatingPanel />
    </div>
  );
}
