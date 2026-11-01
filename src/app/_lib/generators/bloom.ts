import { TAU } from "../geometry";
import type { Point, ShapeGenerator } from "../types";
import { boundedCount, boundedDetail, boundedWarp, polar, radialContour } from "./logo-shapes";

export const bloom: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = boundedCount(frequency, 3);
  const variant = boundedDetail(detail) - 1;
  const turn = (phase * Math.PI) / 180;
  const holeRadius = 0.25 + boundedWarp(warp) * 0.42;
  const outer = radialContour(count, (angle) => {
    const lobe = (1 + Math.cos(count * angle)) / 2;
    return 0.73 + 0.27 * lobe ** (0.55 + (variant % 4) * 0.3);
  });
  let hole: Point[];
  if (variant < 4) {
    hole = radialContour(1, () => holeRadius, turn);
  } else if (variant < 8) {
    hole = Array.from({ length: count * 2 }, (_, index) =>
      polar(holeRadius * (index % 2 ? 0.42 : 1), (TAU * index) / (count * 2) + turn),
    );
  } else {
    hole = radialContour(count, (angle) => holeRadius * (0.7 + 0.3 * Math.cos(count * angle)), turn);
  }
  // A real SVG subpath removes the centre even on a transparent background.
  return [{ points: outer, holes: [hole], closed: true, clearance: 0.73 - holeRadius }];
};
