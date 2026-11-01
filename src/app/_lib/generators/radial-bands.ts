import { TAU } from "../geometry";
import type { ShapeGenerator, ShapePath } from "../types";
import { arc, boundedCount, boundedDetail, boundedWarp, polar } from "./logo-shapes";

export const radialBands: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency);
  const variant = boundedDetail(detail) - 1;
  const bands = 1 + (variant % 4);
  const motif = Math.floor(variant / 4);
  const step = TAU / count;
  const gap = step * (0.14 + boundedWarp(warp) * 0.25);
  const thickness = 0.6 / (bands * 1.65);
  const turn = (phase * Math.PI) / 180;
  const paths: ShapePath[] = [];
  for (let band = 0; band < bands; band++) {
    const outer = 1 - band * thickness * 1.65;
    const inner = outer - thickness;
    for (let index = 0; index < count; index++) {
      const from = index * step + gap / 2 + turn;
      const to = (index + 1) * step - gap / 2 + turn;
      const points =
        motif === 1
          ? [polar(inner, from), polar(outer, from), polar(outer, to), polar(inner, to)]
          : [
              ...arc(outer, from, to),
              ...(motif === 2 ? [polar((outer + inner) / 2, to + gap * 0.25)] : []),
              ...arc(inner, to, from),
            ];
      // Straight chords compress wall and gutter widths near the middle of
      // wide sectors. Include that projection in the stroke clearance limit.
      const projection = motif === 1 ? Math.cos((to - from) / 2) : 1;
      paths.push({
        points,
        closed: true,
        clearance: Math.min(thickness * 0.6 * projection, inner * gap * (motif === 2 ? 0.55 : 0.8)),
      });
    }
  }
  return paths;
};
