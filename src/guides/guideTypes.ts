export type GuideType = "square-grid" | "polar-grid" | "radial-guide" | "custom-svg-guide";

export type SquareGridConfig = {
  spacing: number;
  majorEvery?: number;
};

export type PolarGridConfig = {
  rings: number;
  ringSpacing: number;
  angleStep: number;
};

export type RadialGuideConfig = {
  spokes: number;
  radius: number;
};

export type CustomSvgGuideConfig = {
  svg: string;
  width: number;
  height: number;
};

export type GuideLayer = {
  id: string;
  name: string;
  type: GuideType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  color: string;
  strokeWidth: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  snapEnabled: boolean;
  exportable: boolean;
  config: SquareGridConfig | PolarGridConfig | RadialGuideConfig | CustomSvgGuideConfig;
};
