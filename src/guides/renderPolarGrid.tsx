import type { SVGProps } from "react";
import type { PolarGridConfig } from "./guideTypes";

type PolarGridRenderOptions = {
  color: string;
  config: PolarGridConfig;
  strokeWidth: number;
};

const MAX_RINGS = 100;
const MAX_SPOKES = 360;

function lineProps(color: string, strokeWidth: number): SVGProps<SVGLineElement> {
  return {
    stroke: color,
    strokeLinecap: "round",
    strokeOpacity: 0.65,
    strokeWidth,
    vectorEffect: "non-scaling-stroke",
  };
}

function circleProps(color: string, strokeWidth: number, major = false): SVGProps<SVGCircleElement> {
  return {
    fill: "none",
    stroke: color,
    strokeOpacity: major ? 0.9 : 0.55,
    strokeWidth: major ? strokeWidth * 1.5 : strokeWidth,
    vectorEffect: "non-scaling-stroke",
  };
}

function arcPath(radius: number, startAngle: number, sweepAngle: number) {
  const startRadians = (startAngle * Math.PI) / 180;
  const endRadians = ((startAngle + sweepAngle) * Math.PI) / 180;
  const startX = Math.cos(startRadians) * radius;
  const startY = Math.sin(startRadians) * radius;
  const endX = Math.cos(endRadians) * radius;
  const endY = Math.sin(endRadians) * radius;
  const largeArcFlag = Math.abs(sweepAngle) > 180 ? 1 : 0;
  const sweepFlag = sweepAngle >= 0 ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
}

function pathProps(color: string, strokeWidth: number, major = false): SVGProps<SVGPathElement> {
  return {
    fill: "none",
    stroke: color,
    strokeOpacity: major ? 0.9 : 0.55,
    strokeWidth: major ? strokeWidth * 1.5 : strokeWidth,
    vectorEffect: "non-scaling-stroke",
  };
}

export function renderPolarGrid({ color, config, strokeWidth }: PolarGridRenderOptions) {
  const rings = Math.min(MAX_RINGS, Math.max(1, Math.round(config.rings)));
  const ringSpacing = Math.min(400, Math.max(8, config.ringSpacing));
  const angleStep = Math.min(90, Math.max(1, config.angleStep));
  const radius = rings * ringSpacing;
  const startAngle = config.startAngle ?? 0;
  const sweepAngle = Math.min(360, Math.max(1, Math.abs(config.sweepAngle ?? 360)));
  const fullCircle = sweepAngle >= 360;
  const spokes = Math.min(MAX_SPOKES, Math.floor(sweepAngle / angleStep));
  const elements = [];

  for (let ring = 1; ring <= rings; ring += 1) {
    if (fullCircle) {
      elements.push(
        <circle
          cx={0}
          cy={0}
          data-guide-part="polar-ring"
          key={`ring-${ring}`}
          r={ring * ringSpacing}
          {...circleProps(color, strokeWidth, ring % 5 === 0)}
        />,
      );
    } else {
      elements.push(
        <path
          d={arcPath(ring * ringSpacing, startAngle, sweepAngle)}
          data-guide-part="polar-ring"
          key={`ring-${ring}`}
          {...pathProps(color, strokeWidth, ring % 5 === 0)}
        />,
      );
    }
  }

  for (let index = 0; index <= spokes; index += 1) {
    const angle = ((startAngle + Math.min(index * angleStep, sweepAngle)) * Math.PI) / 180;
    elements.push(
      <line
        data-guide-part="polar-spoke"
        key={`spoke-${index}`}
        x1={0}
        x2={Math.cos(angle) * radius}
        y1={0}
        y2={Math.sin(angle) * radius}
        {...lineProps(color, strokeWidth)}
      />,
    );
  }

  return elements;
}
