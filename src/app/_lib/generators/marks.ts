import { polygon, rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";

// Every module stays inside its own angular sector, preserving gaps at every count.
export const offset: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(2, Math.min(8, frequency));
  const motif = Math.min(3, Math.floor((detail - 1) / 3));
  const inner = 0.22 + warp * 0.32;
  const halfWidth = Math.min(0.48, inner * Math.tan(Math.PI / count) * 0.78);
  const thickness = Math.min(halfWidth * 0.65, 0.08 + ((detail - 1) % 3) * 0.03 + warp * 0.08);
  const middle = (inner + 1) / 2;
  let modulePoints: Point[];

  if (motif === 0) {
    // Open corner.
    modulePoints = [
      [inner, -halfWidth],
      [1, -halfWidth],
      [1, -halfWidth + thickness],
      [inner + thickness, -halfWidth + thickness],
      [inner + thickness, halfWidth],
      [inner, halfWidth],
    ];
  } else if (motif === 1) {
    // Inward-facing bracket.
    modulePoints = [
      [inner, -halfWidth],
      [1, -halfWidth],
      [1, halfWidth],
      [inner, halfWidth],
      [inner, halfWidth - thickness],
      [1 - thickness, halfWidth - thickness],
      [1 - thickness, -halfWidth + thickness],
      [inner, -halfWidth + thickness],
    ];
  } else if (motif === 2) {
    // Chevron with a visible open centre.
    modulePoints = [
      [inner, -halfWidth],
      [1 - thickness, 0],
      [inner, halfWidth],
      [inner + thickness, halfWidth],
      [1, 0],
      [inner + thickness, -halfWidth],
    ];
  } else {
    // Stepped ribbon.
    modulePoints = [
      [inner, -halfWidth],
      [middle + thickness, -halfWidth],
      [middle + thickness, -thickness / 2],
      [1, -thickness / 2],
      [1, halfWidth],
      [1 - thickness, halfWidth],
      [1 - thickness, thickness / 2],
      [middle - thickness, thickness / 2],
      [middle - thickness, -halfWidth + thickness],
      [inner, -halfWidth + thickness],
    ];
  }

  return Array.from({ length: count }, (_, index): ShapePath => ({
    points: modulePoints.map((point) => rotate(point, (TAU * index) / count + (phase * Math.PI) / 180)),
    closed: true,
  }));
};

// Recesses stay in the triangle between an edge and the centre, avoiding self-intersections.
export const cutout: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const sides = Math.max(3, Math.min(12, frequency));
  const motif = Math.min(3, Math.floor((detail - 1) / 3));
  const vertices = polygon(0, 0, 1, sides, (phase * Math.PI) / 180 - Math.PI / 2).points;
  const width = 0.22 + ((detail - 1) % 3) * 0.07 + warp * 0.12;
  const depth = 0.24 + warp * 0.65;
  const points: Point[] = [];

  for (let index = 0; index < sides; index++) {
    const start = vertices[index];
    const end = vertices[(index + 1) % sides];
    const along = (t: number, inset = 0): Point => [
      (start[0] + (end[0] - start[0]) * t) * (1 - inset),
      (start[1] + (end[1] - start[1]) * t) * (1 - inset),
    ];
    const entry = 0.5 - width / 2;
    const exit = 0.5 + width / 2;
    points.push(start, along(entry));
    if (motif === 0) {
      points.push(along(0.5, depth));
    } else if (motif === 1) {
      points.push(along(entry, depth), along(exit, depth));
    } else if (motif === 2) {
      points.push(
        along(entry, depth * 0.45),
        along(0.5 - width * 0.22, depth * 0.45),
        along(0.5 - width * 0.22, depth),
        along(0.5 + width * 0.22, depth),
        along(0.5 + width * 0.22, depth * 0.45),
        along(exit, depth * 0.45),
      );
    } else {
      points.push(along(0.5 + width * 0.28, depth), along(exit, depth * 0.25));
    }
    points.push(along(exit));
  }
  return [{ points, closed: true }];
};
