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

export const DEFAULT_SYMBOL_COLOR = "#172033";

function encodeSvgDataUrl(svg: string, color = DEFAULT_SYMBOL_COLOR): DataURL {
  const normalizedSvg = svg.replace(/currentColor/g, color);
  const encoded = btoa(unescape(encodeURIComponent(normalizedSvg)));

  return `data:image/svg+xml;base64,${encoded}` as DataURL;
}

export function createSymbolFileId(symbol: CrochetSymbol): FileId {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `crochet-symbol-${symbol.id}-${random}` as FileId;
}

export function createSymbolFile(
  symbol: CrochetSymbol,
  color = DEFAULT_SYMBOL_COLOR,
  fileId = createSymbolFileId(symbol),
): BinaryFileData {
  return {
    id: fileId,
    dataURL: encodeSvgDataUrl(symbol.svg, color),
    mimeType: "image/svg+xml",
    created: Date.now(),
  };
}

export function insertCrochetSymbol(symbol: CrochetSymbol) {
  const api = getExcalidrawApi();

  if (!api) {
    return;
  }

  const appState = api.getAppState();
  const elements = api.getSceneElementsIncludingDeleted();
  const fileId = createSymbolFileId(symbol);
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
        symbolColor: DEFAULT_SYMBOL_COLOR,
      },
    },
  ]);

  const file = createSymbolFile(symbol, DEFAULT_SYMBOL_COLOR, fileId);

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
