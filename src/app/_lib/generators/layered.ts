import type { Point, ShapeGenerator, ShapePath } from "../types";
import { boundedDetail, boundedWarp } from "./logo-shapes";
import { roundedContour } from "./logo-grid";

function cubic(start: Point, a: Point, b: Point, end: Point): Point[] {
  return Array.from({ length: 33 }, (_, index): Point => {
    const t = index / 32;
    const s = 1 - t;
    return [
      s ** 3 * start[0] + 3 * s * s * t * a[0] + 3 * s * t * t * b[0] + t ** 3 * end[0],
      s ** 3 * start[1] + 3 * s * s * t * a[1] + 3 * s * t * t * b[1] + t ** 3 * end[1],
    ];
  });
}

// Each construction has its own topology. Profile controls weight and softness;
// Warp controls the separating channel, and Phase adjusts the internal balance.
export const layered: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const motif = Math.max(1, Math.min(4, Math.round(frequency)));
  const profile = (boundedDetail(detail) - 1) / 11;
  const gap = 0.045 + boundedWarp(warp) * 0.16;
  const weight = 0.32 + profile * 0.16;
  const bias = (Math.max(0, Math.min(360, phase)) / 360 - 0.5) * 0.16;
  const radius = 0.035 + profile * 0.105;
  const opposite = (points: Point[]) => points.map(([x, y]): Point => [-x, -y]);
  let contours: Point[][];

  if (motif === 1) {
    const height = 0.65 + profile * 0.2;
    const wave = 0.45 + profile * 0.15;
    const seam = cubic([0.85, -gap / 2 + bias], [0.2, -wave], [-0.2, wave], [-0.85, -gap / 2 - bias]);
    contours = [
      [[-0.85, -height], [0.85, -height], ...seam],
      [...seam.toReversed().map(([x, y]): Point => [x, y + gap]), [0.85, height], [-0.85, height]],
    ];
  } else if (motif === 2) {
    const inset = -0.85 + weight;
    const end = 0.85 - weight - gap;
    const bend = 0.18 + profile * 0.08 + bias;
    const corner: Point[] = [
      [-0.85, -0.85],
      [end, -0.85],
      [end, inset],
      [inset + bend, inset],
      ...cubic([inset + bend, inset], [inset, inset], [inset, inset], [inset, inset + bend]).slice(1),
      [inset, end],
      [-0.85, end],
    ];
    contours = [corner, opposite(corner)];
  } else if (motif === 3) {
    const bottom = 0.55 + profile * 0.2;
    const cut = cubic([-gap / 2, bottom], [-0.35, bottom - weight], [-0.5, -0.15 + bias], [-0.85, -0.15 + bias]);
    const plane: Point[] = [[-0.85, -0.75], [-gap / 2, -0.75], ...cut];
    contours = [plane, opposite(plane)];
  } else {
    const shoulder = -0.3;
    const outside = cubic([-0.85, shoulder], [-0.85, -1.1 + bias], [0.85, -1.1 + bias], [0.85, shoulder]);
    const inside = cubic(
      [0.85 - weight, shoulder],
      [0.85 - weight, -1.1 + bias + weight / 0.75],
      [-0.85 + weight, -1.1 + bias + weight / 0.75],
      [-0.85 + weight, shoulder],
    );
    const arch: Point[] = [
      [-0.85, -gap / 2],
      ...outside,
      [0.85, -gap / 2],
      [0.85 - weight, -gap / 2],
      ...inside,
      [-0.85 + weight, -gap / 2],
    ];
    contours = [arch, opposite(arch)];
  }
  return contours.map((points): ShapePath => ({
    ...roundedContour(points, radius),
    clearance: gap * 0.45,
  }));
};
