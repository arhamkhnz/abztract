import { rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";

// Axial coordinates form an equilateral triangular grid inside a regular hexagon.
function gridPoint(q: number, r: number, divisions: number): Point {
  return [(q + r / 2) / divisions, (r * Math.sqrt(3)) / (2 * divisions)];
}

function cutOpening(start: Point, end: Point, radius: number): ShapePath[] {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-12) return [];
  const projection = -(start[0] * dx + start[1] * dy) / lengthSquared;
  const distanceSquared = (start[0] + projection * dx) ** 2 + (start[1] + projection * dy) ** 2;
  if (radius <= 0 || distanceSquared >= radius * radius) {
    return [{ points: [start, end], closed: false }];
  }

  const span = Math.sqrt((radius * radius - distanceSquared) / lengthSquared);
  const entry = Math.max(0, projection - span);
  const exit = Math.min(1, projection + span);
  if (entry >= exit) return [{ points: [start, end], closed: false }];
  const pointAt = (t: number): Point => [start[0] + t * dx, start[1] + t * dy];
  const paths: ShapePath[] = [];
  if (entry > 1e-6) paths.push({ points: [start, pointAt(entry)], closed: false });
  if (exit < 1 - 1e-6) paths.push({ points: [pointAt(exit), end], closed: false });
  return paths;
}

export const lattice: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const divisions = Math.max(1, Math.round(detail));
  const repeats = Math.max(1, Math.round(frequency));
  const grid: [Point, Point][] = [];

  // Three families of parallel lines produce triangles without duplicate cell edges.
  for (let row = -divisions; row <= divisions; row++) {
    const min = Math.max(-divisions, -divisions - row);
    const max = Math.min(divisions, divisions - row);
    grid.push([gridPoint(row, min, divisions), gridPoint(row, max, divisions)]);
    grid.push([gridPoint(min, row, divisions), gridPoint(max, row, divisions)]);
    const sumMin = Math.max(-divisions, row - divisions);
    const sumMax = Math.min(divisions, row + divisions);
    grid.push([gridPoint(sumMin, row - sumMin, divisions), gridPoint(sumMax, row - sumMax, divisions)]);
  }

  const paths: ShapePath[] = [];
  for (let index = 0; index < repeats; index++) {
    // A hexagonal grid repeats every 60 degrees; distribute copies within that sector.
    const angle = (phase * Math.PI) / 180 + (index * TAU) / (6 * repeats);
    for (const [start, end] of grid) {
      paths.push(...cutOpening(rotate(start, angle), rotate(end, angle), warp * 0.6));
    }
  }
  return paths;
};
