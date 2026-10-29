export type Point = readonly [number, number];

export interface ShapePath {
  points: Point[];
  closed: boolean;
}

export type FamilyId =
  | "lissajous"
  | "spiro"
  | "spiral"
  | "swirl"
  | "harmonograph"
  | "rose"
  | "orbit"
  | "wave"
  | "super"
  | "knot"
  | "weave"
  | "petals"
  | "pinwheel"
  | "shards"
  | "star"
  | "sun"
  | "polygon"
  | "cross"
  | "maze"
  | "lattice"
  | "hex"
  | "cubes"
  | "rings"
  | "stripes"
  | "beads"
  | "chords";

export type ShapeStyle = "outline" | "solid" | "double" | "woven" | "dashed";
export type FamilyCategory = "curves" | "woven" | "radial" | "geometry" | "texture";

export interface ShapeSettings {
  family: FamilyId;
  style: ShapeStyle;
  frequency: number;
  detail: number;
  phase: number;
  warp: number;
  stroke: number;
  aspect: number;
  layers: number;
  spacing: number;
  copies: number;
  rotation: number;
  overlay: FamilyId | "none";
  overlayScale: number;
  overlayRotation: number;
  cap: "round" | "butt" | "square";
  color: string;
  background: string;
}

export interface FamilyDefinition {
  id: FamilyId;
  name: string;
  category: FamilyCategory;
  description: string;
  labels: readonly [string, string];
  frequency: number;
  detail: number;
  phase: number;
  warp: number;
  style: ShapeStyle;
  stroke: number;
}

export type ShapeGenerator = (settings: ShapeSettings) => ShapePath[];
