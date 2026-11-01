import { rotate } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";
import { boundedCount, boundedDetail, boundedWarp } from "./logo-shapes";

export const curveFan: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency, 1);
  const variant = boundedDetail(detail) - 1;
  const bend = 0.25 + (variant % 4) * 0.22;
  const focal = 0.2 + boundedWarp(warp) * 0.7;
  const paths: ShapePath[] = [];
  for (let index = 0; index < count; index++) {
    const u = count === 1 ? 0.5 : index / (count - 1);
    const start: Point = [-0.98 + u * 1.3, -0.98];
    const end: Point = [0.98, 0.1 + u * 0.88];
    const a: Point = [start[0], bend];
    const b: Point = [focal, end[1]];
    paths.push({
      points: Array.from({ length: 81 }, (_, sample): Point => {
        const t = sample / 80;
        const s = 1 - t;
        return [
          s ** 3 * start[0] + 3 * s * s * t * a[0] + 3 * s * t * t * b[0] + t ** 3 * end[0],
          s ** 3 * start[1] + 3 * s * s * t * a[1] + 3 * s * t * t * b[1] + t ** 3 * end[1],
        ];
      }),
      closed: false,
    });
  }
  if (variant < 8) {
    // Open paths keep frames unfilled even when Solid is selected.
    paths.push({
      points: [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ],
      closed: false,
    });
  }
  const mirrored = variant >= 4 && variant < 8;
  return paths.map((path) => ({
    ...path,
    points: path.points.map((point) => rotate(mirrored ? [point[1], point[0]] : point, (phase * Math.PI) / 180)),
  }));
};
