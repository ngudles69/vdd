import type { SVGProps } from "react";
import type { SquareGridConfig } from "./guideTypes";

type SquareGridRenderOptions = {
  artboardHeight: number;
  artboardWidth: number;
  color: string;
  config: SquareGridConfig;
  strokeWidth: number;
};

const MAX_GRID_LINES_PER_AXIS = 220;

function clampSpacing(value: number) {
  return Math.min(400, Math.max(8, value));
}

function lineProps(color: string, strokeWidth: number, major = false): SVGProps<SVGLineElement> {
  return {
    stroke: color,
    strokeLinecap: "square",
    strokeOpacity: major ? 0.95 : 0.55,
    strokeWidth: major ? strokeWidth * 1.75 : strokeWidth,
    vectorEffect: "non-scaling-stroke",
  };
}

export function renderSquareGrid({
  artboardHeight,
  artboardWidth,
  color,
  config,
  strokeWidth,
}: SquareGridRenderOptions) {
  const horizontalSpacing = clampSpacing(config.horizontalSpacing);
  const verticalSpacing = clampSpacing(
    config.linkedSpacing ? config.horizontalSpacing : config.verticalSpacing,
  );
  const majorEvery = Math.max(0, config.majorEvery ?? 0);
  const halfWidth = artboardWidth / 2;
  const halfHeight = artboardHeight / 2;
  const verticalLineCount = Math.min(
    MAX_GRID_LINES_PER_AXIS,
    Math.ceil(halfWidth / horizontalSpacing),
  );
  const horizontalLineCount = Math.min(
    MAX_GRID_LINES_PER_AXIS,
    Math.ceil(halfHeight / verticalSpacing),
  );
  const lines = [];

  for (let index = -verticalLineCount; index <= verticalLineCount; index += 1) {
    const x = index * horizontalSpacing;
    const major = majorEvery > 0 && index % majorEvery === 0;
    lines.push(
      <line
        data-guide-part="square-vertical"
        key={`v-${index}`}
        x1={x}
        x2={x}
        y1={-halfHeight}
        y2={halfHeight}
        {...lineProps(color, strokeWidth, major)}
      />,
    );
  }

  for (let index = -horizontalLineCount; index <= horizontalLineCount; index += 1) {
    const y = index * verticalSpacing;
    const major = majorEvery > 0 && index % majorEvery === 0;
    lines.push(
      <line
        data-guide-part="square-horizontal"
        key={`h-${index}`}
        x1={-halfWidth}
        x2={halfWidth}
        y1={y}
        y2={y}
        {...lineProps(color, strokeWidth, major)}
      />,
    );
  }

  return lines;
}
