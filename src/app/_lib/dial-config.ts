import type { DialConfig, ResolvedValues } from "dialkit";
import { DEFAULT_SETTINGS, FAMILIES, getFamily } from "./families";
import type { ShapeSettings, ShapeStyle } from "./types";

export const STYLE_OPTIONS: { value: ShapeStyle; label: string }[] = [
  { value: "outline", label: "Outline" },
  { value: "solid", label: "Solid" },
  { value: "double", label: "Double line" },
  { value: "woven", label: "Ribbon" },
  { value: "dashed", label: "Dashed" },
];

const INITIAL_SEED = "abztract";

export const DIAL_CONFIG = {
  randomize: { type: "action", label: "Randomize" },
  reset: { type: "action", label: "Reset" },
  copyLink: { type: "action", label: "Copy link" },
  copySVG: { type: "action", label: "Copy SVG" },
  seed: { type: "text", default: INITIAL_SEED, placeholder: "A word, name, or anything…" },
  keepFamily: true as boolean,
  shape: {
    family: {
      type: "select",
      options: FAMILIES.map(({ id, name }) => ({ value: id, label: name })),
      default: DEFAULT_SETTINGS.family,
    },
    style: { type: "select", options: STYLE_OPTIONS, default: DEFAULT_SETTINGS.style },
    frequency: [DEFAULT_SETTINGS.frequency, 1, 16, 1],
    detail: [DEFAULT_SETTINGS.detail, 1, 12, 1],
    phase: [DEFAULT_SETTINGS.phase, 0, 360, 1],
    warp: [DEFAULT_SETTINGS.warp, 0, 0.8, 0.01],
  },
  finish: {
    stroke: [DEFAULT_SETTINGS.stroke, 0.5, 14, 0.1],
    color: { type: "color", default: DEFAULT_SETTINGS.color },
    background: { type: "color", default: DEFAULT_SETTINGS.background },
    lineEnds: { type: "select", options: ["round", "butt", "square"], default: DEFAULT_SETTINGS.cap },
  },
  composition: {
    _collapsed: true,
    layers: [1, 1, 4, 1],
    spacing: [0.14, 0.05, 0.28, 0.01],
    copies: [1, 1, 6, 1],
    rotation: [DEFAULT_SETTINGS.rotation, 0, 360, 1],
    aspect: [1, 0.4, 1.6, 0.01],
    overlay: {
      type: "select",
      options: [{ value: "none", label: "None" }, ...FAMILIES.map(({ id, name }) => ({ value: id, label: name }))],
      default: "none",
    },
    overlayScale: [0.62, 0.1, 1, 0.01],
    overlayRotation: [0, 0, 360, 1],
  },
  export: {
    _collapsed: false,
    transparent: true as boolean,
    pngSize: { type: "select", options: ["1024", "2048", "4096"], default: "2048" },
    downloadSVG: { type: "action", label: "Download SVG" },
    downloadPNG: { type: "action", label: "Download PNG" },
  },
} satisfies DialConfig;

export type GeneratorValues = ResolvedValues<typeof DIAL_CONFIG>;

export function toShapeSettings(values: GeneratorValues): ShapeSettings {
  const cap = values.finish.lineEnds;
  return {
    family: getFamily(values.shape.family).id,
    style: STYLE_OPTIONS.find(({ value }) => value === values.shape.style)?.value ?? "outline",
    frequency: Math.round(values.shape.frequency),
    detail: Math.round(values.shape.detail),
    phase: values.shape.phase,
    warp: values.shape.warp,
    stroke: values.finish.stroke,
    aspect: values.composition.aspect,
    layers: Math.round(values.composition.layers),
    spacing: values.composition.spacing,
    copies: Math.round(values.composition.copies),
    rotation: values.composition.rotation,
    overlay: values.composition.overlay === "none" ? "none" : getFamily(values.composition.overlay).id,
    overlayScale: values.composition.overlayScale,
    overlayRotation: values.composition.overlayRotation,
    cap: cap === "butt" || cap === "square" ? cap : "round",
    color: values.finish.color,
    background: values.finish.background,
  };
}
