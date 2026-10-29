import { circle, greatestCommonDivisor, sampleCurve, TAU } from "../geometry";
import type { ShapeGenerator, ShapePath } from "../types";

export const lissajous: ShapeGenerator = ({ frequency, detail, phase, warp }) => [
  sampleCurve((angle) => {
    const scale = 1 + warp * 0.36 * Math.cos(2 * angle);
    return [Math.sin(frequency * angle + (phase * Math.PI) / 180) * scale, Math.sin(detail * angle) * scale];
  }, 1200),
];

export const spiro: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const distance = detail * (0.2 + warp * 2.8);
  const radius = frequency + detail;
  const offset = (phase * Math.PI) / 180;
  const period = (TAU * detail) / greatestCommonDivisor(frequency, detail);

  return [
    sampleCurve(
      (angle) => [
        (frequency * Math.cos(angle) + distance * Math.cos((frequency / detail) * angle + offset)) / radius,
        (frequency * Math.sin(angle) - distance * Math.sin((frequency / detail) * angle + offset)) / radius,
      ],
      1400,
      period,
    ),
  ];
};

export const rose: ShapeGenerator = ({ frequency, detail, phase, warp }) => [
  sampleCurve((angle) => {
    const radius =
      0.6 + 0.34 * Math.cos(frequency * angle + (phase * Math.PI) / 180) + warp * 0.32 * Math.sin(detail * angle);
    const bend = angle + warp * 0.25 * Math.sin(frequency * angle);
    return [radius * Math.cos(bend), radius * Math.sin(bend)];
  }, 1000),
];

export const orbit: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const paths: ShapePath[] = [circle(0, 0, 1)];
  const tilt = Math.cos((phase * Math.PI) / 180) * 0.6;

  for (let index = 1; index <= frequency; index++) {
    const radius = Math.cos((Math.PI * index) / (frequency + 1));
    paths.push(sampleCurve((angle) => [radius * Math.cos(angle), Math.sin(angle) + tilt * Math.cos(angle)], 160));
  }

  for (let index = 1; index <= detail; index++) {
    const y = (2 * index) / (detail + 1) - 1;
    const radius = Math.sqrt(1 - y * y);
    paths.push(
      sampleCurve((angle) => [radius * Math.cos(angle), y + (0.1 + warp * 0.25) * radius * Math.sin(angle)], 160),
    );
  }

  return paths;
};

export const wave: ShapeGenerator = ({ frequency, detail, phase, warp }) => [
  sampleCurve((angle) => {
    const radius =
      0.78 +
      (0.06 + warp * 0.3) * Math.cos(frequency * angle + (phase * Math.PI) / 180) +
      warp * 0.055 * Math.sin(detail * angle);
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
  }, 900),
];

export const superShape: ShapeGenerator = ({ frequency, detail, phase, warp }) => [
  sampleCurve(
    (angle) => {
      const power = 0.35 + detail * 0.35;
      const exponent = 0.5 + warp * 5;
      const offset = (frequency * angle) / 4 + (phase * Math.PI) / 720;
      const radius = Math.pow(
        Math.pow(Math.abs(Math.cos(offset)), power) + Math.pow(Math.abs(Math.sin(offset)), power),
        -1 / exponent,
      );
      return [radius * Math.cos(angle), radius * Math.sin(angle)];
    },
    1200,
    TAU * 2,
  ),
];
