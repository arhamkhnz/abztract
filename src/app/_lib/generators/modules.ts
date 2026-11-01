import { circle } from "../geometry";
import type { Point, ShapeGenerator } from "../types";
import { gridCells, roundedContour } from "./logo-grid";

// Discrete tiles on one shared grid. Warp changes gutters, never tile alignment.
export const modules: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(1, Math.min(16, Math.round(frequency)));
  const variant = Math.max(0, Math.min(11, Math.round(detail) - 1));
  const motif = Math.floor(variant / 3);
  const cells = gridCells(count, variant % 3, phase);
  const gap = 0.16 + Math.max(0, Math.min(0.8, warp)) * 0.45;
  const half = (1 - gap) / 2;
  const centerX = cells.reduce((sum, [x]) => sum + x, 0) / cells.length;
  const centerY = cells.reduce((sum, [, y]) => sum + y, 0) / cells.length;
  return cells.map(([x, y]) => {
    if (motif === 1) return circle(x + 0.5, y + 0.5, half);
    let points: Point[] = [
      [-half, -half],
      [half, -half],
      [half, half],
      [-half, half],
    ];
    if (motif === 2) {
      const curvedTile = variant % 3;
      const arc = (radius: number, reverse = false): Point[] =>
        Array.from({ length: 33 }, (_, step): Point => {
          const t = reverse ? 1 - step / 32 : step / 32;
          const angle = (t * Math.PI) / (curvedTile === 2 ? 1 : 2);
          const origin = curvedTile === 2 ? 0 : -half;
          return [origin + radius * Math.cos(angle), origin + radius * Math.sin(angle)];
        });
      if (curvedTile === 0) points = [[-half, -half], ...arc(half * 2)];
      else if (curvedTile === 1) points = [...arc(half * 2), ...arc(half, true)];
      else points = arc(half);
    }
    // Coordinate curved tiles around the layout instead of rotating each
    // tile independently. The curved faces follow one shared visual direction.
    const outward = Math.atan2(y - centerY, x - centerX) - Math.PI / 4;
    const turn = motif === 2 ? (Math.round(outward / (Math.PI / 2)) * Math.PI) / 2 : 0;
    const path = roundedContour(points, motif === 0 ? 0.04 : motif === 3 ? half * 0.85 : 0);
    return {
      ...path,
      points: path.points.map(([px, py]): Point => [
        x + 0.5 + px * Math.cos(turn) - py * Math.sin(turn),
        y + 0.5 + px * Math.sin(turn) + py * Math.cos(turn),
      ]),
    };
  });
};
