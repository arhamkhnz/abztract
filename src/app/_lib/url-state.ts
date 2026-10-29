import type { SelectConfig } from "dialkit";
import { DIAL_CONFIG, type GeneratorValues } from "./dial-config";
import { getFamily } from "./families";
import { settingsFromSeed } from "./seed";

type SharedGeneratorState = Pick<GeneratorValues, "seed" | "keepFamily" | "shape" | "finish"> & {
  composition: Omit<GeneratorValues["composition"], "_collapsed">;
  export: Omit<GeneratorValues["export"], "_collapsed">;
};

type SliderConfig = readonly [number, number, number, number?];

function readNumber(params: URLSearchParams, key: string, config: SliderConfig, fallback = config[0]): number {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  const [, min, max, step = 1] = config;
  const clamped = Math.max(min, Math.min(max, value));
  return Number(Math.max(min, Math.min(max, min + Math.round((clamped - min) / step) * step)).toFixed(5));
}

function readSelect(params: URLSearchParams, key: string, config: SelectConfig, fallback = config.default ?? ""): string {
  const value = params.get(key);
  return value !== null && config.options.some((option) => (typeof option === "string" ? option : option.value) === value)
    ? value : fallback;
}

function readBoolean(params: URLSearchParams, key: string, fallback: boolean): boolean {
  const value = params.get(key);
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return fallback;
}

function readColor(params: URLSearchParams, key: string, fallback: string): string {
  const value = params.get(key);
  if (!value || value.length > 160) return fallback;
  const supportedFormat = /^(?:#[\da-f]{3,8}$|(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\()/i.test(value);
  return supportedFormat && CSS.supports("color", value) ? value : fallback;
}

export function readGeneratorQuery(params: URLSearchParams): SharedGeneratorState {
  const seed = params.get("seed") ?? DIAL_CONFIG.seed.default;
  const family = getFamily(readSelect(params, "family", DIAL_CONFIG.shape.family));
  const geometry = settingsFromSeed(seed, family.id);

  return {
    seed,
    keepFamily: readBoolean(params, "keepFamily", DIAL_CONFIG.keepFamily),
    shape: {
      family: family.id,
      style: readSelect(params, "style", DIAL_CONFIG.shape.style, family.style),
      frequency: readNumber(params, "frequency", DIAL_CONFIG.shape.frequency, geometry.frequency),
      detail: readNumber(params, "detail", DIAL_CONFIG.shape.detail, geometry.detail),
      phase: readNumber(params, "phase", DIAL_CONFIG.shape.phase, geometry.phase),
      warp: readNumber(params, "warp", DIAL_CONFIG.shape.warp, geometry.warp),
    },
    finish: {
      stroke: readNumber(params, "stroke", DIAL_CONFIG.finish.stroke, family.stroke),
      color: readColor(params, "color", DIAL_CONFIG.finish.color.default),
      background: readColor(params, "background", DIAL_CONFIG.finish.background.default),
      lineEnds: readSelect(params, "cap", DIAL_CONFIG.finish.lineEnds),
    },
    composition: {
      layers: readNumber(params, "layers", DIAL_CONFIG.composition.layers),
      spacing: readNumber(params, "spacing", DIAL_CONFIG.composition.spacing),
      copies: readNumber(params, "copies", DIAL_CONFIG.composition.copies),
      rotation: readNumber(params, "rotation", DIAL_CONFIG.composition.rotation),
      aspect: readNumber(params, "aspect", DIAL_CONFIG.composition.aspect),
      overlay: readSelect(params, "overlay", DIAL_CONFIG.composition.overlay),
    },
    export: {
      transparent: readBoolean(params, "transparent", DIAL_CONFIG.export.transparent),
      pngSize: readSelect(params, "size", DIAL_CONFIG.export.pngSize),
    },
  };
}

export function createShareUrl(href: string, values: SharedGeneratorState): URL {
  const url = new URL(href);
  const fields = {
    seed: values.seed,
    family: values.shape.family,
    style: values.shape.style,
    frequency: values.shape.frequency,
    detail: values.shape.detail,
    phase: values.shape.phase,
    warp: values.shape.warp,
    stroke: values.finish.stroke,
    color: values.finish.color,
    background: values.finish.background,
    cap: values.finish.lineEnds,
    layers: values.composition.layers,
    spacing: values.composition.spacing,
    copies: values.composition.copies,
    rotation: values.composition.rotation,
    aspect: values.composition.aspect,
    overlay: values.composition.overlay,
    keepFamily: values.keepFamily ? "1" : "0",
    transparent: values.export.transparent ? "1" : "0",
    size: values.export.pngSize,
  };

  for (const [key, value] of Object.entries(fields)) url.searchParams.set(key, String(value));
  return url;
}
