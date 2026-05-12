import type { CrochetProject } from "../types/projectTypes";

export function createEmptyProject(name: string, artboard: CrochetProject["artboard"]): CrochetProject {
  const now = new Date().toISOString();

  return {
    version: 1,
    name,
    createdAt: now,
    updatedAt: now,
    artboard,
    excalidraw: {
      elements: [],
      appState: {},
      files: {},
    },
    guides: [],
    groups: [],
    metadata: {},
  };
}
