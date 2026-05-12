import type { CrochetGroup } from "./groupStore";

export function getGroupElementIds(group: CrochetGroup) {
  return group.excalidrawElementIds;
}
