import { TAU } from "../geometry";
import type { ShapeGenerator, ShapePath } from "../types";
import { arc, boundedCount, boundedDetail, boundedWarp, polar } from "./logo-shapes";

export const splitDisc: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency);
  const variant = boundedDetail(detail) - 1;
  const step = TAU / count;
  const gap = step * (0.1 + boundedWarp(warp) * 0.3);
  const inner = 0.16 + (variant % 4) * 0.1;
  const curve = Math.floor(variant / 4);
  const turn = (phase * Math.PI) / 180;
  return Array.from({ length: count }, (_, index): ShapePath => {
    const from = index * step + gap / 2 + turn;
    const to = (index + 1) * step - gap / 2 + turn;
    const inside = Array.from({ length: 33 }, (_, sample) => {
      const t = sample / 32;
      const radius = inner + (curve === 1 ? 0.2 : curve === 2 ? -0.1 : 0) * Math.sin(t * Math.PI);
      return polar(radius, to + (from - to) * t);
    });
    return {
      points: [...arc(1, from, to), ...inside],
      closed: true,
      clearance: Math.min((inner - (curve === 2 ? 0.1 : 0)) * gap * 0.9, 1 - inner - 0.2),
    };
  });
};
