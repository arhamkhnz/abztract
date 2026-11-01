import type { Point, ShapeGenerator } from "../types";
import { gridCells, gridOutline, roundedContour } from "./logo-grid";

// Trace the union first, then round both inner and outer corners together.
export const joined: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(1, Math.min(16, Math.round(frequency)));
  const layout = (Math.max(1, Math.min(12, Math.round(detail))) - 1) % 3;
  const cells = gridCells(count, layout, phase + Math.floor((detail - 1) / 3) * 61);
  // gridCells only accepts additions whose outer boundary is a single loop.
  const outline: Point[] = gridOutline(cells) ?? [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const radius = 0.04 + Math.max(0, Math.min(0.8, warp)) * 0.5;
  return [roundedContour(outline, radius)];
};
