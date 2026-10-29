import type { FamilyId, ShapeGenerator, ShapeSettings } from "../types";
import { lissajous, orbit, rose, spiro, superShape, wave } from "./curves";
import { cross, cubes, hex, maze, polygonRing } from "./geometric";
import { pinwheel, shards, star, sun } from "./radial";
import { beads, chords, rings, stripes } from "./textures";
import { knot, petals, weave } from "./woven";

const generators: Record<FamilyId, ShapeGenerator> = {
  lissajous,
  spiro,
  rose,
  orbit,
  wave,
  super: superShape,
  knot,
  weave,
  petals,
  pinwheel,
  shards,
  star,
  sun,
  polygon: polygonRing,
  cross,
  maze,
  hex,
  cubes,
  rings,
  stripes,
  beads,
  chords,
};

export function generatePaths(settings: ShapeSettings) {
  return generators[settings.family](settings);
}
