export type GuideType = "square-grid" | "polar-grid" | "radial-guide" | "custom-svg-guide";

export type SquareGridConfig = {
  horizontalSpacing: number;
  verticalSpacing: number;
  linkedSpacing: boolean;
  majorEvery?: number;
};

export type PolarGridConfig = {
  rings: number;
  ringSpacing: number;
  angleStep: number;
  startAngle: number;
  sweepAngle: number;
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
  role: "guide";
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
