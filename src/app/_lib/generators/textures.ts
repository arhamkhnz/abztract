import { circle, rotate, sampleCurve, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";

export const rings: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const paths: ShapePath[] = [];
  for (let index = 1; index <= frequency; index++) {
    const radius = 0.1 + 0.9 * index / frequency;
    if (detail === 1 && warp < 0.18) {
      paths.push(circle(0, 0, radius));
      continue;
    }
    for (let segment = 0; segment < detail; segment++) {
      const span = TAU / detail;
      const gap = span * (0.05 + warp * 0.65);
      paths.push(sampleCurve((angle) => {
        const offset = segment * span + phase * Math.PI / 180 + (index % 2 ? 0.12 : 0) + gap / 2 + angle;
        return [radius * Math.cos(offset), radius * Math.sin(offset)];
      }, 100, span - gap, false));
    }
  }
  return paths;
};

export const stripes: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(3, frequency * 2);
  const repeats = Math.min(3, detail);
  const paths: ShapePath[] = [];

  for (let index = 0; index < count; index++) {
    const y = -0.97 + 1.94 * index / (count - 1);
    const halfWidth = Math.sqrt(1 - y * y);
    for (let repeat = 0; repeat < repeats; repeat++) {
      const points: Point[] = [];
      for (let point = 0; point <= 36; point++) {
        const x = -halfWidth + 2 * halfWidth * point / 36;
        const bend = y + warp * 0.15 * Math.sin((x + 1) * Math.PI * 2) * (1 - x * x - y * y);
        points.push(rotate([x, bend + (repeat - (repeats - 1) / 2) * 0.018], phase * Math.PI / 180));
      }
      paths.push({ points, closed: false });
    }
  }
  return paths;
};

export const beads: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const paths: ShapePath[] = [];
  for (let row = 0; row < Math.min(4, detail); row++) {
    const radius = 0.72 - row * 0.16;
    const size = Math.min(0.32, Math.PI * radius / frequency * (0.6 + warp * 0.65));
    for (let index = 0; index < frequency; index++) {
      const angle = TAU * index / frequency + phase * Math.PI / 180 + (row % 2 ? Math.PI / frequency : 0);
      paths.push(circle(radius * Math.cos(angle), radius * Math.sin(angle), size));
    }
  }
  return paths;
};

export const chords: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = 20 + frequency * 6;
  const multiplier = Math.max(2, detail);
  const offset = phase * Math.PI / 180;
  const paths: ShapePath[] = Array.from({ length: count }, (_, index): ShapePath => {
    const start = TAU * index / count + offset;
    const end = TAU * ((index * multiplier) % count) / count + offset;
    return { points: [[Math.cos(start), Math.sin(start)], [Math.cos(end), Math.sin(end)]], closed: false };
  });
  if (warp > 0.4) paths.push(circle(0, 0, 0.5 + warp * 0.4));
  return paths;
};
