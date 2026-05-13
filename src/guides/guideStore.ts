import { create } from "zustand";
import type { GuideLayer } from "./guideTypes";

type GuidePreset = "square-grid" | "polar-grid" | "half-polar-grid" | "quarter-polar-grid";

let nextGuideId = 1;

function createGuideId(type: GuidePreset) {
  nextGuideId += 1;
  return `guide-${type}-${nextGuideId}`;
}

function createDuplicateGuideId(type: GuideLayer["type"]) {
  nextGuideId += 1;
  return `guide-${type}-copy-${nextGuideId}`;
}

function createSquareGridGuide(name: string, id: string): GuideLayer {
  return {
    role: "guide",
    id,
    name,
    type: "square-grid",
    visible: true,
    locked: false,
    opacity: 0.2,
    color: "#0f766e",
    strokeWidth: 1,
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: 0.5,
    snapEnabled: false,
    exportable: false,
    config: {
      horizontalSpacing: 48,
      verticalSpacing: 48,
      linkedSpacing: true,
      majorEvery: 5,
    },
  };
}

function createPolarGridGuide(
  name: string,
  id: string,
  sweepAngle = 360,
): GuideLayer {
  return {
    role: "guide",
    id,
    name,
    type: "polar-grid",
    visible: true,
    locked: false,
    opacity: 0.45,
    color: sweepAngle === 360 ? "#7c3aed" : "#dc2626",
    strokeWidth: 1,
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: 1,
    snapEnabled: false,
    exportable: false,
    config: {
      rings: 8,
      ringSpacing: 48,
      angleStep: 15,
      startAngle: sweepAngle === 360 ? 0 : 180,
      sweepAngle,
    },
  };
}

const defaultGuides: GuideLayer[] = [
  createSquareGridGuide("Square grid", "guide-square-grid"),
];

type GuideStore = {
  guides: GuideLayer[];
  selectedGuideId: string;
  addGuide: (preset: GuidePreset) => void;
  duplicateGuide: (id: string) => void;
  removeGuide: (id: string) => void;
  selectGuide: (id: string) => void;
  updateGuide: (id: string, patch: Partial<GuideLayer>) => void;
  updateGuideConfig: (id: string, patch: Partial<GuideLayer["config"]>) => void;
};

export const useGuideStore = create<GuideStore>((set) => ({
  guides: defaultGuides,
  selectedGuideId: defaultGuides[0].id,
  addGuide: (preset) =>
    set(({ guides }) => {
      const sameTypeCount =
        preset === "square-grid"
          ? guides.filter((guide) => guide.type === "square-grid").length
          : guides.filter(
              (guide) =>
                guide.type === "polar-grid" &&
                "sweepAngle" in guide.config &&
                (preset === "half-polar-grid"
                  ? guide.config.sweepAngle === 180
                  : preset === "quarter-polar-grid"
                    ? guide.config.sweepAngle === 90
                    : guide.config.sweepAngle === 360),
            ).length;
      const nextIndex = sameTypeCount + 1;
      const guide =
        preset === "square-grid"
          ? createSquareGridGuide(`Square grid ${nextIndex}`, createGuideId(preset))
          : createPolarGridGuide(
              preset === "half-polar-grid"
                ? `Half polar grid ${nextIndex}`
                : preset === "quarter-polar-grid"
                  ? `Quarter polar grid ${nextIndex}`
                  : `Polar grid ${nextIndex}`,
              createGuideId(preset),
              preset === "half-polar-grid" ? 180 : preset === "quarter-polar-grid" ? 90 : 360,
            );

      return {
        guides: [...guides, guide],
        selectedGuideId: guide.id,
      };
    }),
  duplicateGuide: (id) =>
    set(({ guides, selectedGuideId }) => {
      const guide = guides.find((guide) => guide.id === id);

      if (!guide) {
        return { guides, selectedGuideId };
      }

      const duplicate: GuideLayer = {
        ...guide,
        id: createDuplicateGuideId(guide.type),
        name: `${guide.name} copy`,
        locked: false,
        position: {
          x: guide.position.x + 32,
          y: guide.position.y + 32,
        },
        config: { ...guide.config } as GuideLayer["config"],
      };

      return {
        guides: [...guides, duplicate],
        selectedGuideId: duplicate.id,
      };
    }),
  removeGuide: (id) =>
    set(({ guides, selectedGuideId }) => {
      if (guides.length <= 1) {
        return { guides, selectedGuideId };
      }

      const nextGuides = guides.filter((guide) => guide.id !== id);
      return {
        guides: nextGuides,
        selectedGuideId:
          selectedGuideId === id ? nextGuides[0]?.id ?? selectedGuideId : selectedGuideId,
      };
    }),
  selectGuide: (id) =>
    set(({ guides, selectedGuideId }) => ({
      selectedGuideId: guides.some((guide) => guide.id === id) ? id : selectedGuideId,
    })),
  updateGuide: (id, patch) => set(({ guides }) => ({
    guides: guides.map((guide) => (guide.id === id ? { ...guide, ...patch } : guide)),
  })),
  updateGuideConfig: (id, patch) => set(({ guides }) => ({
    guides: guides.map((guide) =>
      guide.id === id
        ? {
            ...guide,
            config: {
              ...guide.config,
              ...patch,
            } as GuideLayer["config"],
          }
        : guide,
    ),
  })),
}));
