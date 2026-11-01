import { polygon, rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";
import { boundedCount, boundedDetail, boundedWarp, polar } from "./logo-shapes";

export const arcMotifs: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency, 3);
  const variant = boundedDetail(detail) - 1;
  const paths: ShapePath[] = [];
  const turn = (phase * Math.PI) / 180;
  const sector = TAU / count;
  if (variant < 4) {
    const bands = variant + 1;
    const thickness = 0.16 / bands;
    // Constrain the projected arc to its own sector, rather than just limiting
    // the angle around its displaced circle centre. Leave a gap on both sides.
    const halfSector = sector * 0.42;
    const sectorLimit = halfSector >= Math.asin(0.7) ? Infinity : Math.asin(Math.sin(halfSector) / 0.7) - halfSector;
    const maximumSpread = Math.min(sector * 0.396, sectorLimit);
    const minimumSpread = Math.min(sector * 0.3, maximumSpread * 0.72);
    const spread = minimumSpread + ((maximumSpread - minimumSpread) * boundedWarp(warp)) / 0.8;
    const neighborGap = 0.6 * Math.sin(sector * 0.08);
    for (let repeat = 0; repeat < count; repeat++) {
      for (let band = 0; band < bands; band++) {
        const outer = 0.7 - band * thickness * 1.8;
        const inner = outer - thickness;
        const points: Point[] = [];
        for (const [radius, reverse] of [
          [outer, false],
          [inner, true],
        ] as const) {
          for (let sample = 0; sample <= 32; sample++) {
            const t = reverse ? 1 - sample / 32 : sample / 32;
            const angle = Math.PI - spread + spread * 2 * t;
            points.push(rotate([1 + radius * Math.cos(angle), radius * Math.sin(angle)], turn + repeat * sector));
          }
        }
        paths.push({ points, closed: true, clearance: Math.min(thickness * 0.65, neighborGap) });
      }
    }
  } else {
    const points: Point[] = [];
    const tipWidth = sector * (0.055 + boundedWarp(warp) * 0.035);
    const inset = 0.08 + (variant % 4) * 0.04 + boundedWarp(warp) * 0.4;
    for (let index = 0; index < count; index++) {
      const start = polar(0.68, turn - Math.PI / 2 + index * sector + tipWidth);
      const end = polar(0.68, turn - Math.PI / 2 + (index + 1) * sector - tipWidth);
      const control = polar(inset, turn - Math.PI / 2 + (index + 0.5) * sector);
      for (let sample = 0; sample <= 40; sample++) {
        const t = sample / 40;
        points.push([
          (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0],
          (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1],
        ]);
      }
    }
    paths.push({ points, closed: true, clearance: 0.08 });
    if (variant < 8) {
      const wall = 0.025 + (variant % 4) * 0.01;
      paths.push({
        ...polygon(0, 0, 1, count * 2, turn),
        holes: [polygon(0, 0, 1 - wall, count * 2, turn).points],
        clearance: wall * 0.9,
      });
    }
  }
  return paths;
};
