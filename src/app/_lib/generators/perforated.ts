import { circle, mapPathPoints, rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator } from "../types";
import { boundedCount, boundedDetail, boundedWarp } from "./logo-shapes";

export const perforated: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.min(6, boundedCount(frequency, 1));
  const variant = boundedDetail(detail) - 1;
  const radius = 0.27 + boundedWarp(warp) * 0.18;
  if (variant < 4) {
    const rows = variant + 1;
    const width = count + 1;
    const height = rows + 1;
    const holes: Point[][] = [];
    for (let row = 1; row <= rows; row++) {
      for (let column = 1; column <= count; column++) holes.push(circle(column, row, radius).points);
    }
    const points: Point[] = [];
    // Semicircular bites at each edge continue the internal grid rhythm.
    for (let side = 0; side < 4; side++) {
      const length = side % 2 ? height : width;
      const transform = ([x, y]: Point): Point =>
        side === 0 ? [x, y] : side === 1 ? [width - y, x] : side === 2 ? [width - x, height - y] : [y, height - x];
      points.push(transform([radius, 0]));
      for (let notch = 1; notch < length; notch++) {
        points.push(transform([notch - radius, 0]));
        for (let step = 0; step <= 24; step++) {
          const angle = Math.PI - (Math.PI * step) / 24;
          points.push(transform([notch + radius * Math.cos(angle), radius * Math.sin(angle)]));
        }
      }
      points.push(transform([length - radius, 0]));
      for (let step = 0; step <= 24; step++) {
        const angle = Math.PI - ((Math.PI / 2) * step) / 24;
        points.push(transform([length + radius * Math.cos(angle), radius * Math.sin(angle)]));
      }
    }
    return [
      mapPathPoints({ points, holes, closed: true, clearance: 1 - radius * 2 }, (point) =>
        rotate(point, (phase * Math.PI) / 180),
      ),
    ];
  }
  if (variant < 8) {
    const slots = Math.max(2, count);
    const halfHeight = (0.68 + (variant % 4) * 0.035) / slots;
    const holes = Array.from({ length: slots }, (_, index) => {
      const y = (((index + 0.5) / slots) * 2 - 1) * 0.86;
      const halfWidth = Math.sqrt(1 - y * y) * (0.55 + (variant % 4) * 0.02 + boundedWarp(warp) * 0.14);
      return Array.from({ length: 96 }, (_, step): Point => {
        const angle = (TAU * step) / 96;
        return [halfWidth * Math.cos(angle), y + halfHeight * Math.sin(angle)];
      });
    });
    const maxHoleRadius = Math.max(...holes.flat().map(([x, y]) => Math.hypot(x, y)));
    return [
      mapPathPoints(
        { ...circle(0, 0, 1), holes, clearance: Math.min(1 - maxHoleRadius, 1.72 / slots - halfHeight * 2) },
        (point) => rotate(point, (phase * Math.PI) / 180),
      ),
    ];
  }
  const holes = Array.from({ length: count + 2 }, (_, index) => {
    const angle = (TAU * index) / (count + 2);
    const orbit = 0.48 + (variant % 4) * 0.04;
    const size = Math.min(0.24, orbit * Math.sin(Math.PI / (count + 2)) * (0.55 + boundedWarp(warp) * 0.4));
    return circle(orbit * Math.cos(angle), orbit * Math.sin(angle), size).points;
  });
  return [
    mapPathPoints({ ...circle(0, 0, 1), holes, clearance: 0.1 }, (point) => rotate(point, (phase * Math.PI) / 180)),
  ];
};
