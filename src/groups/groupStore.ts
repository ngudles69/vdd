import { create } from "zustand";

export type CrochetGroup = {
  id: string;
  name: string;
  excalidrawElementIds: string[];
  visible?: boolean;
  locked?: boolean;
  exportSettings: {
    format: "png" | "svg" | "webm" | "gif" | "apng";
    includeGuides: boolean;
    transparentBackground: boolean;
    padding: number;
  };
  effect?: {
    type: "none" | "blink" | "pulse-opacity" | "highlight-outline";
    durationMs: number;
    loop: boolean;
    opacityFrom?: number;
    opacityTo?: number;
  };
};

type GroupStore = {
  groups: CrochetGroup[];
};

export const useGroupStore = create<GroupStore>(() => ({
  groups: [],
}));
