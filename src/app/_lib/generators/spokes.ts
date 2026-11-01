import { rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator } from "../types";

// Lengths and angle offsets are composed together, rather than jittered independently.
const RHYTHMS = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0.72, 1, 0.72, 1, 0.72, 1, 0.72],
  [1, 0.84, 0.64, 0.84, 1, 0.84, 0.64, 0.84],
  [1, 0.68, 0.86, 0.68, 1, 0.68, 0.86, 0.68],
  [1, 0.64, 0.92, 0.48, 0.76, 0.56, 0.86, 0.64],
  [0.86, 0.58, 1, 0.72, 0.46, 0.82, 0.62, 0.94],
  [1, 0.76, 0.5, 0.88, 0.58, 0.94, 0.68, 0.48],
  [0.68, 1, 0.56, 0.82, 0.48, 0.94, 0.72, 0.88],
  [1, 0.7, 0.9, 0.52, 0.62, 0.8, 0.96, 0.58],
  [0.92, 0.56, 0.78, 1, 0.48, 0.68, 0.88, 0.6],
  [0.76, 1, 0.6, 0.86, 0.5, 0.68, 0.94, 0.56],
  [1, 0.58, 0.82, 0.68, 0.46, 0.92, 0.74, 0.54],
];
const ANGLE_OFFSETS = [0, 0.12, -0.16, 0.19, -0.2, -0.08, 0.16, -0.1];

// The outline is the union of flat-ended bars. Adjacent side intersections form
// the small central junction; no circle or stacked strokes thicken the centre.
export const spokes: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(2, Math.min(16, Math.round(frequency)));
  const variant = Math.max(0, Math.min(11, Math.round(detail) - 1));
  const halfWidth = 0.008 + Math.max(0, Math.min(0.8, warp)) * 0.04;
  const turn = (phase * Math.PI) / 180 - Math.PI / 2;
  const rhythm = RHYTHMS[variant];
  if (count === 2) {
    const points: Point[] = [
      [-rhythm[1], -halfWidth],
      [1, -halfWidth],
      [1, halfWidth],
      [-rhythm[1], halfWidth],
    ];
    return [{ points: points.map((point) => rotate(point, turn)), closed: true }];
  }

  const step = TAU / count;
  const angles = Array.from(
    { length: count },
    (_, index) => step * (index + (variant < 4 ? 0 : ANGLE_OFFSETS[(index + variant) % ANGLE_OFFSETS.length])),
  );
  const points: Point[] = [];
  for (let index = 0; index < count; index++) {
    const angle = angles[index];
    const next = index === count - 1 ? angles[0] + TAU : angles[index + 1];
    const length = rhythm[index % rhythm.length];
    points.push(
      rotate([length, -halfWidth], angle + turn),
      rotate([length, halfWidth], angle + turn),
      rotate([halfWidth / Math.sin((next - angle) / 2), 0], (angle + next) / 2 + turn),
    );
  }
  return [{ points, closed: true }];
};
