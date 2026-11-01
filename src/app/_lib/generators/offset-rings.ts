import { circle } from "../geometry";
import type { ShapeGenerator, ShapePath } from "../types";
import { boundedCount, boundedDetail, boundedWarp, polar } from "./logo-shapes";

export const offsetRings: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency, 1);
  const drift = 0.2 + ((boundedDetail(detail) - 1) / 11) * 0.74;
  const step = 0.9 / count;
  const thickness = step * (0.28 + boundedWarp(warp) * 0.45);
  const direction = (phase * Math.PI) / 180;
  const paths: ShapePath[] = [];
  for (let index = 0; index < count; index++) {
    const radius = 0.1 + step * (index + 1);
    const inner = radius - thickness;
    const center = polar((1 - radius) * drift, direction);
    const holeCenter = polar((1 - inner) * drift, direction);
    const path: ShapePath = {
      ...circle(center[0], center[1], radius),
      holes: [circle(holeCenter[0], holeCenter[1], inner).points],
      clearance: Math.min(thickness, step - thickness) * (1 - drift),
    };
    paths.push(path);
  }
  return paths;
};
