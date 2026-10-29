import { rotate, sampleCurve, TAU } from "../geometry";
import type { ShapeGenerator, ShapePath } from "../types";

export const knot: ShapeGenerator = ({ frequency, phase, warp }) => {
  const rhythm = Math.max(2, frequency) - 1;
  const depth = 0.45 + warp * 0.45;
  const offset = (phase * Math.PI) / 180;

  return [
    sampleCurve(
      (angle) => [
        (1 - depth) * Math.sin(angle) + depth * Math.sin(rhythm * angle + offset),
        (1 - depth) * Math.cos(angle) - depth * Math.cos(rhythm * angle + offset),
      ],
      480,
    ),
  ];
};

export const weave: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const bands = Math.min(5, Math.max(2, frequency));
  const power = 0.22 + warp * 0.6 + detail * 0.025;

  return Array.from({ length: bands }, (_, index) =>
    sampleCurve(
      (angle) =>
        rotate(
          [
            Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), power) * 0.72,
            Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), power) * 0.92,
          ],
          (index * Math.PI) / bands + (phase * Math.PI) / 180,
        ),
      200,
    ),
  );
};

export const petals: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const paths: ShapePath[] = [];

  for (let index = 0; index < frequency; index++) {
    const angle = (TAU * index) / frequency;
    paths.push(
      sampleCurve((pointAngle) => {
        const [x, y] = rotate(
          [(0.18 + warp * 0.38) * Math.cos(pointAngle), (0.08 + detail * 0.025) * Math.sin(pointAngle)],
          angle + (phase * Math.PI) / 180,
        );
        return [0.69 * Math.cos(angle) + x, 0.69 * Math.sin(angle) + y];
      }, 96),
    );
  }

  return paths;
};
