import type { FamilyId, ShapeGenerator, ShapeSettings } from "../types";
import { lissajous, orbit, rose, spiro, superShape, wave } from "./curves";
import { cross, cubes, hex, maze, polygonRing } from "./geometric";
import { modules } from "./modules";
import { joined } from "./joined";
import { spokes } from "./spokes";
import { splitDisc } from "./split-disc";
import { radialBands } from "./radial-bands";
import { softBranches } from "./soft-branches";
import { bloom } from "./bloom";
import { offsetRings } from "./offset-rings";
import { dotted } from "./dotted";
import { crescents } from "./crescents";
import { curveFan } from "./curve-fan";
import { perforated } from "./perforated";
import { arcMotifs } from "./arc-motifs";
import { badge } from "./badge";
import { layered } from "./layered";
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
  modules,
  joined,
  spokes,
  "split-disc": splitDisc,
  "radial-bands": radialBands,
  "soft-branches": softBranches,
  bloom: bloom,
  "offset-rings": offsetRings,
  dotted: dotted,
  crescents: crescents,
  "curve-fan": curveFan,
  perforated: perforated,
  "arc-motifs": arcMotifs,
  badge,
  layered,
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
