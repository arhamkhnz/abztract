import type { FamilyId, ShapeGenerator, ShapeSettings } from "../types";
import { lissajous, orbit, rose, spiro, superShape, wave } from "./curves";
import { cross, cubes, hex, maze, polygonRing } from "./geometric";
import { panels } from "./panels";
import { rubberBand } from "./rubber-band";
import { offset, cutout } from "./marks";
import { lattice } from "./lattice";
import { pinwheel, shards, star, sun } from "./radial";
import { spiral, swirl, harmonograph } from "./spirals";
import { beads, chords, rings, stripes } from "./textures";
import { knot, petals, weave } from "./woven";

const generators: Record<FamilyId, ShapeGenerator> = {
  lissajous,
  spiro,
  spiral,
  swirl,
  harmonograph,
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
  "rubber-band": rubberBand,
  panels,
  offset,
  cutout,
  polygon: polygonRing,
  cross,
  maze,
  lattice,
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
