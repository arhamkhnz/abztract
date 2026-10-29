import { greatestCommonDivisor } from "./geometry";
import { RANDOM_RANGES } from "./random-ranges";
import type { FamilyId } from "./types";

function hashText(text: string): number {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed: string) {
  let value = hashText(seed);
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function settingsFromSeed(seed: string, family: FamilyId) {
  const random = seededRandom(`${family}:${seed}`);
  const ranges = RANDOM_RANGES[family];
  const integer = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  const frequency = integer(...ranges.frequency);
  let details = Array.from({ length: ranges.detail[1] - ranges.detail[0] + 1 }, (_, index) => ranges.detail[0] + index);

  // Coprime rhythms avoid repeatedly tracing the same simpler curve.
  if (family === "lissajous" || family === "spiro" || family === "harmonograph") {
    details = details.filter((detail) => detail !== frequency && greatestCommonDivisor(frequency, detail) === 1);
  }

  return {
    frequency,
    detail: details[integer(0, details.length - 1)],
    phase: integer(0, 359),
    warp: integer(0, 80) / 100,
  };
}

export function newSeed(): string {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return `abz-${values[0].toString(36)}`;
}
