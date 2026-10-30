import { DEFAULT_SETTINGS, FAMILIES, getFamily } from "./families";
import { RANDOM_RANGES } from "./random-ranges";
import { newSeed, seededRandom, settingsFromSeed } from "./seed";
import type { FamilyId, ShapeSettings, ShapeStyle } from "./types";

const LINE_FAMILIES: FamilyId[] = [
  "lissajous",
  "spiro",
  "spiral",
  "swirl",
  "harmonograph",
  "orbit",
  "super",
  "knot",
  "weave",
  "lattice",
  "cubes",
  "rings",
  "stripes",
  "chords",
];
const LOGO_FAMILIES: FamilyId[] = ["offset", "cutout"];
const FINE_FAMILIES: FamilyId[] = ["spiral", "swirl", "harmonograph", "lattice", "chords"];

function density(settings: ShapeSettings) {
  const { family, frequency, detail } = settings;
  if (family === "spiral" || family === "swirl") return (frequency * detail) / 128;
  if (family === "lattice") return (frequency * detail) / 72;
  if (family === "harmonograph") return (frequency * detail) / 64;
  if (family === "panels") return frequency / 8;
  if (family === "rings") return (frequency * detail) / 120;
  if (family === "beads") return (frequency * detail) / 56;
  if (family === "stripes") return (frequency * detail) / 48;
  return (frequency / 16) * 0.65 + (detail / 12) * 0.35;
}

function geometryDifference(a: ShapeSettings, b: ShapeSettings) {
  if (a.family !== b.family) return 1;
  const ranges = RANDOM_RANGES[a.family];
  const frequency = Math.abs(a.frequency - b.frequency) / Math.max(1, ranges.frequency[1] - ranges.frequency[0]);
  const detail = Math.abs(a.detail - b.detail) / Math.max(1, ranges.detail[1] - ranges.detail[0]);
  const warp = Math.abs(a.warp - b.warp) / 0.8;
  if (a.family === "panels") {
    return frequency * 0.6 + detail * 0.1 + warp * 0.15 + (Math.abs(a.phase - b.phase) / 360) * 0.15;
  }
  if (LOGO_FAMILIES.includes(a.family)) {
    const changedMotif = Math.floor((a.detail - 1) / 3) !== Math.floor((b.detail - 1) / 3);
    return frequency * 0.35 + (changedMotif ? 0.4 : 0) + detail * 0.1 + warp * 0.15;
  }
  // Ignore rotation/phase: merely turning a similar silhouette should not qualify as new geometry.
  return frequency * 0.55 + detail * 0.2 + warp * 0.25;
}

function variationFromSeed(seed: string, family: FamilyId, current: ShapeSettings): ShapeSettings {
  const random = seededRandom(`appearance:${family}:${seed}`);
  const definition = getFamily(family);
  const logoFamily = LOGO_FAMILIES.includes(family) || family === "panels";
  const styles: ShapeStyle[] = logoFamily
    ? ["solid", "solid", "solid", "outline", "double"]
    : LINE_FAMILIES.includes(family)
      ? ["outline", "outline", "outline", "double", "dashed"]
      : ["outline", "outline", "solid", "solid", "double"];
  const style = random() < 0.45 ? definition.style : styles[Math.floor(random() * styles.length)];
  const geometry = settingsFromSeed(seed, family);
  const settings: ShapeSettings = {
    ...DEFAULT_SETTINGS,
    ...geometry,
    family,
    style,
    color: current.color,
    background: current.background,
    cap: current.cap,
    rotation: Math.floor(random() * 360),
    aspect: random() < 0.25 ? Math.round((0.85 + random() * 0.3) * 100) / 100 : 1,
  };
  if (logoFamily) {
    if (family !== "panels") settings.phase = 0;
    settings.rotation = family === "panels" ? 0 : Math.floor(random() * 8) * 45;
    settings.aspect = 1;
  }
  // Preserve the intended symmetry of these geometric layouts.
  if (family === "cubes" || family === "rubber-band") settings.aspect = 1;
  const complexity = density(settings);
  const baseStroke = FINE_FAMILIES.includes(family)
    ? Math.max(0.5, 1.8 - complexity * 1.2)
    : (logoFamily ? 5 : definition.stroke) * Math.max(0.6, 1.1 - complexity * 0.5);
  settings.stroke =
    Math.round(
      (style === "solid" ? 1 : style === "double" ? Math.min(3, baseStroke) : baseStroke * (0.75 + random() * 0.5)) *
        10,
    ) / 10;
  settings.stroke = Math.max(0.5, Math.min(14, settings.stroke));
  if (!logoFamily && family !== "rubber-band" && complexity < 0.4 && style !== "solid" && random() < 0.22) {
    settings.layers = 2;
    settings.spacing = Math.round((0.1 + random() * 0.12) * 100) / 100;
  }
  return settings;
}

export function randomVariation(current: ShapeSettings, keepFamily: boolean) {
  const firstSeed = newSeed();
  const random = seededRandom(`variation:${firstSeed}`);
  const families = FAMILIES.filter(({ id }) => id !== current.family);
  const family = keepFamily ? current.family : families[Math.floor(random() * families.length)].id;
  // Favor readable marks, while retaining occasional dense compositions.
  const pick = random();
  const targetDensity = pick < 0.4 ? 0.2 : pick < 0.85 ? 0.5 : 0.8;
  let best = { seed: firstSeed, settings: variationFromSeed(firstSeed, family, current) };
  let bestScore = -Infinity;

  for (let attempt = 0; attempt < 12; attempt++) {
    const seed = attempt === 0 ? firstSeed : newSeed();
    const settings = attempt === 0 ? best.settings : variationFromSeed(seed, family, current);
    const difference = geometryDifference(settings, current);
    const densityDistance = Math.abs(density(settings) - targetDensity);
    const score = difference - densityDistance;
    if (score > bestScore) {
      best = { seed, settings };
      bestScore = score;
    }
    if (difference >= 0.25 && densityDistance <= 0.2) return { seed, settings };
  }
  return best;
}
