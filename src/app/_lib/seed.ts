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
  const frequency =
    family === "weave"
      ? 2 + Math.floor(random() * 4)
      : family === "hex"
        ? 3 + Math.floor(random() * 4)
        : family === "cubes"
          ? 1 + Math.floor(random() * 6)
          : 3 + Math.floor(random() * 10);

  return {
    frequency,
    detail: 1 + Math.floor(random() * (family === "hex" ? 2 : 6)),
    phase: Math.floor(random() * 360),
    warp: Math.round(random() * 70) / 100,
  };
}

export function newSeed(): string {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return `abz-${values[0].toString(36)}`;
}
