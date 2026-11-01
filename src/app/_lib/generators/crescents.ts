import { rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";
import { boundedCount, boundedDetail, boundedWarp } from "./logo-shapes";

export const crescents: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const columns = boundedCount(frequency, 1);
  const rows = boundedDetail(detail);
  const shift = 0.25 + boundedWarp(warp) * 0.9;
  const alpha = Math.acos(shift / 2);
  // Follow the actual circle intersections. An oversized SVG hole would XOR
  // the part outside the disc back into the artwork.
  const outer = Array.from({ length: 33 }, (_, index): Point => {
    const angle = alpha + ((TAU - alpha * 2) * index) / 32;
    return [Math.cos(angle), Math.sin(angle)];
  });
  const inner = Array.from({ length: 33 }, (_, index): Point => {
    const angle = Math.PI + alpha - (alpha * 2 * index) / 32;
    return [shift + Math.cos(angle), Math.sin(angle)];
  });
  const paths: ShapePath[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const turn = (phase * Math.PI) / 180 + (row % 2) * Math.PI;
      paths.push({
        points: [...outer, ...inner].map((point): Point => {
          const [x, y] = rotate(point, turn);
          return [x + column * 2.5 + (row % 2) * 0.3, y + row * 2.5];
        }),
        closed: true,
        clearance: Math.min(0.4, shift * 0.5),
      });
    }
  }
  return paths;
};
