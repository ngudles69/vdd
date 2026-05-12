import { create } from "zustand";
import type { GuideLayer } from "./guideTypes";

type GuideStore = {
  guides: GuideLayer[];
};

export const useGuideStore = create<GuideStore>(() => ({
  guides: [],
}));
