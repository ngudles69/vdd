import {
  CaptureUpdateAction,
  convertToExcalidrawElements,
  viewportCoordsToSceneCoords,
} from "@excalidraw/excalidraw";
import type { BinaryFileData, DataURL } from "@excalidraw/excalidraw/types";
import type { FileId } from "@excalidraw/excalidraw/element/types";
import type { CrochetSymbol } from "../symbols/crochetSymbols";
import { getExcalidrawApi } from "./excalidrawApi";
import { OBJECT_LAYER_ROLE, orderSceneElements } from "./sceneLayers";

function encodeSvgDataUrl(svg: string): DataURL {
  const normalizedSvg = svg.replace(/currentColor/g, "#172033");
  const encoded = btoa(unescape(encodeURIComponent(normalizedSvg)));

  return `data:image/svg+xml;base64,${encoded}` as DataURL;
}

function createFileId(symbol: CrochetSymbol): FileId {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `crochet-symbol-${symbol.id}-${random}` as FileId;
}

export function insertCrochetSymbol(symbol: CrochetSymbol) {
  const api = getExcalidrawApi();

  if (!api) {
    return;
  }

  const appState = api.getAppState();
  const elements = api.getSceneElementsIncludingDeleted();
  const fileId = createFileId(symbol);
  const size = 96;
  const center = viewportCoordsToSceneCoords(
    {
      clientX: appState.offsetLeft + appState.width / 2,
      clientY: appState.offsetTop + appState.height / 2,
    },
    appState,
  );

  const [element] = convertToExcalidrawElements([
    {
      type: "image",
      x: center.x - size / 2,
      y: center.y - size / 2,
      width: size,
      height: size,
      fileId,
      status: "saved",
      scale: [1, 1],
      frameId: null,
      groupIds: [],
      customData: {
        role: OBJECT_LAYER_ROLE,
        symbolId: symbol.id,
      },
    },
  ]);

  const file: BinaryFileData = {
    id: fileId,
    dataURL: encodeSvgDataUrl(symbol.svg),
    mimeType: "image/svg+xml",
    created: Date.now(),
  };

  api.addFiles([file]);
  api.updateScene({
    elements: orderSceneElements([...elements, element]),
    appState: {
      selectedElementIds: {
        [element.id]: true,
      },
    },
    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
  });
  api.setToast({
    message: `Inserted ${symbol.name}`,
  });
}
