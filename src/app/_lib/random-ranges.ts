import type { FamilyId } from "./types";

type Range = readonly [min: number, max: number];

// Match the parameters each generator actually uses, avoiding clamped duplicate results.
export const RANDOM_RANGES: Record<FamilyId, { frequency: Range; detail: Range }> = {
  lissajous: { frequency: [1, 9], detail: [1, 9] },
  spiro: { frequency: [2, 12], detail: [1, 8] },
  spiral: { frequency: [1, 16], detail: [1, 8] },
  swirl: { frequency: [2, 16], detail: [1, 8] },
  harmonograph: { frequency: [1, 8], detail: [1, 8] },
  rose: { frequency: [3, 12], detail: [1, 12] },
  orbit: { frequency: [1, 8], detail: [1, 8] },
  wave: { frequency: [3, 12], detail: [1, 12] },
  super: { frequency: [3, 12], detail: [1, 12] },
  knot: { frequency: [3, 10], detail: [1, 1] },
  weave: { frequency: [2, 5], detail: [1, 12] },
  petals: { frequency: [3, 12], detail: [1, 10] },
  pinwheel: { frequency: [3, 16], detail: [1, 9] },
  shards: { frequency: [3, 14], detail: [1, 12] },
  star: { frequency: [3, 12], detail: [1, 12] },
  sun: { frequency: [4, 16], detail: [1, 9] },
  polygon: { frequency: [3, 12], detail: [3, 10] },
  cross: { frequency: [3, 12], detail: [1, 9] },
  maze: { frequency: [3, 12], detail: [1, 12] },
  lattice: { frequency: [1, 6], detail: [2, 12] },
  hex: { frequency: [3, 6], detail: [1, 2] },
  cubes: { frequency: [1, 8], detail: [1, 8] },
  rings: { frequency: [1, 12], detail: [1, 10] },
  stripes: { frequency: [3, 16], detail: [1, 3] },
  beads: { frequency: [3, 14], detail: [1, 4] },
  chords: { frequency: [1, 16], detail: [2, 12] },
};
