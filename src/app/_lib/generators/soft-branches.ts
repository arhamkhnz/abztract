import type { ShapeGenerator } from "../types";
import { boundedCount, boundedDetail, boundedWarp, radialContour } from "./logo-shapes";

export const softBranches: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency, 3);
  const width = 0.55 + (boundedDetail(detail) - 1) * 0.13;
  const root = 0.22 + boundedWarp(warp) * 0.3;
  const points = radialContour(
    count,
    (angle) => {
      const lobe = (1 + Math.cos(count * angle)) / 2;
      return root + (1 - root) * lobe ** width;
    },
    (phase * Math.PI) / 180 - Math.PI / 2,
  );
  return [{ points, closed: true, clearance: root * 0.5 }];
};
