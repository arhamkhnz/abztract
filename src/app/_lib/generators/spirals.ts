import { rotate, sampleCurve, TAU } from "../geometry";
import type { ShapeGenerator } from "../types";

// Budget the points serialized across all layers. Rotated copies reuse SVG definitions.
const MAX_LAYERED_POINTS = 96_000;

function sampleCount(requested: number, arms: number, layers: number) {
  return Math.max(2, Math.min(requested, Math.floor(MAX_LAYERED_POINTS / (arms * layers)) - 1));
}

// Equally spaced Archimedean arms; warp changes the radial growth law.
export const spiral: ShapeGenerator = ({ frequency, detail, phase, warp, layers }) => {
  const turns = Math.max(1, frequency);
  const arms = Math.max(1, detail);
  const samples = sampleCount(Math.max(240, turns * 120), arms, layers);
  return Array.from({ length: arms }, (_, arm) =>
    sampleCurve(
      (t) => {
        const radius = 0.025 + 0.975 * Math.pow(t, 0.65 + warp);
        const angle = TAU * turns * t + (TAU * arm) / arms + (phase * Math.PI) / 180;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
      },
      samples,
      1,
      false,
    ),
  );
};

// Offset loops grow outwards while their centres follow a slower circular motion.
export const swirl: ShapeGenerator = ({ frequency, detail, phase, warp, layers }) => {
  const turns = Math.max(1, frequency);
  const arms = Math.max(1, detail);
  const samples = sampleCount(Math.max(360, turns * 160), arms, layers);
  return Array.from({ length: arms }, (_, arm) =>
    sampleCurve(
      (t) => {
        const angle = TAU * turns * t;
        const radius = 0.04 + 0.76 * t;
        const drift = warp * 0.42 * t;
        const orbit = angle / (2 + warp * 3);
        return rotate(
          [radius * Math.cos(angle) + drift * Math.cos(orbit), radius * Math.sin(angle) + drift * Math.sin(orbit)],
          (TAU * arm) / arms + (phase * Math.PI) / 180,
        );
      },
      samples,
      1,
      false,
    ),
  );
};

// Two damped oscillators draw a continuous pendulum-like trace.
export const harmonograph: ShapeGenerator = ({ frequency, detail, phase, warp, layers }) => {
  const duration = TAU * (3 + detail);
  const offset = (phase * Math.PI) / 180;
  const detune = 0.015 + warp * 0.12;
  return [
    sampleCurve(
      (t) => {
        const fade = Math.exp(-(0.008 + warp * 0.035) * t);
        return [
          fade * (Math.sin(frequency * t + offset) + 0.3 * Math.sin((detail + detune) * t)),
          fade * (Math.sin(detail * t) + 0.3 * Math.cos((frequency - detune) * t + offset)),
        ];
      },
      sampleCount(Math.min(16000, Math.ceil(duration * Math.max(frequency, detail) * 32)), 1, layers),
      duration,
      false,
    ),
  ];
};
