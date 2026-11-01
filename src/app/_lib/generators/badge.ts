import { circle, polygon, TAU } from "../geometry";
import type { Point, ShapeGenerator } from "../types";
import { boundedDetail, boundedWarp, polar } from "./logo-shapes";
import { roundedContour } from "./logo-grid";

export const badge: ShapeGenerator = ({ frequency, detail, phase, warp, centerSize = 0.6, frameThickness = 1 }) => {
  const sides = Math.max(3, Math.min(12, Math.round(frequency)));
  const points = Math.max(3, boundedDetail(detail));
  const softness = boundedWarp(warp);
  const apothem = Math.cos(Math.PI / sides);
  // Keep the circular opening inside the polygon even at three sides. Corner
  // rounding stays well short of the edge midpoint, where clearance is smallest.
  const thickness = Math.max(0.4, Math.min(1.5, frameThickness));
  const opening = apothem * (1 - (0.18 + softness * 0.12) * thickness);
  const rounding = Math.sin(Math.PI / sides) * (0.14 + softness * 0.56);
  const outer = roundedContour(polygon(0, 0, 1, sides, -Math.PI / 2).points, rounding);
  const starRadius = opening * Math.max(0.25, Math.min(0.9, centerSize));
  const curvature = Math.max(0, Math.min(360, phase)) / 360;
  const threeArm = points === 3;
  const inset = starRadius * (threeArm ? 0.18 + curvature * 0.32 : 0.02 + curvature * 0.5);
  // The three-arm centre follows Arc motifs: flat tips and a left-facing arm.
  const orientation = threeArm ? -Math.PI / 3 : -Math.PI / 2;
  const tipWidth = threeArm ? (TAU / points) * 0.055 : 0;
  const star: Point[] = [];
  for (let index = 0; index < points; index++) {
    const angle = (TAU * index) / points + orientation;
    const start = polar(starRadius, angle + tipWidth);
    const end = polar(starRadius, angle + TAU / points - tipWidth);
    const control = polar(inset, angle + Math.PI / points);
    for (let sample = 0; sample < (threeArm ? 33 : 32); sample++) {
      const t = sample / 32;
      star.push([
        (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0],
        (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1],
      ]);
    }
  }
  const clearance = Math.min(apothem - opening, opening - starRadius) * 0.7;
  return [
    { ...outer, holes: [circle(0, 0, opening).points], clearance },
    { points: star, closed: true, clearance },
  ];
};
