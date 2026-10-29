import type { FamilyDefinition, FamilyId, ShapeSettings } from "./types";

export const FAMILIES = [
  {
    "id": "lissajous",
    "name": "Lissajous",
    "category": "curves",
    "description": "Crossing sine waves",
    "labels": [
      "Horizontal frequency",
      "Vertical frequency"
    ],
    "frequency": 3,
    "detail": 4,
    "phase": 90,
    "warp": 0,
    "style": "outline",
    "stroke": 2.5
  },
  {
    "id": "spiro",
    "name": "Spirograph",
    "category": "curves",
    "description": "Rolling-circle loops",
    "labels": [
      "Outer rhythm",
      "Inner rhythm"
    ],
    "frequency": 7,
    "detail": 3,
    "phase": 20,
    "warp": 0.65,
    "style": "outline",
    "stroke": 2.5
  },
  {
    "id": "rose",
    "name": "Rosette",
    "category": "curves",
    "description": "Flowing petal curves",
    "labels": [
      "Petals",
      "Ripple frequency"
    ],
    "frequency": 6,
    "detail": 2,
    "phase": 0,
    "warp": 0.32,
    "style": "outline",
    "stroke": 3
  },
  {
    "id": "orbit",
    "name": "Orbit",
    "category": "curves",
    "description": "Elliptical globe lines",
    "labels": [
      "Meridians",
      "Parallels"
    ],
    "frequency": 4,
    "detail": 3,
    "phase": 90,
    "warp": 0,
    "style": "outline",
    "stroke": 2.5
  },
  {
    "id": "wave",
    "name": "Soft star",
    "category": "curves",
    "description": "Soft repeating waves",
    "labels": [
      "Lobes",
      "Ripple frequency"
    ],
    "frequency": 6,
    "detail": 2,
    "phase": 0,
    "warp": 0.35,
    "style": "outline",
    "stroke": 5
  },
  {
    "id": "super",
    "name": "Soft polygon",
    "category": "curves",
    "description": "Rounded geometric outlines",
    "labels": [
      "Sides",
      "Corner shape"
    ],
    "frequency": 6,
    "detail": 3,
    "phase": 0,
    "warp": 0.45,
    "style": "outline",
    "stroke": 4
  },
  {
    "id": "knot",
    "name": "Knot",
    "category": "woven",
    "description": "Crossed continuous loops",
    "labels": [
      "Loops",
      "Inner rhythm"
    ],
    "frequency": 3,
    "detail": 2,
    "phase": 0,
    "warp": 0.42,
    "style": "woven",
    "stroke": 10
  },
  {
    "id": "weave",
    "name": "Weave",
    "category": "woven",
    "description": "Interlaced rounded bands",
    "labels": [
      "Bands",
      "Corner shape"
    ],
    "frequency": 2,
    "detail": 4,
    "phase": 45,
    "warp": 0.25,
    "style": "woven",
    "stroke": 7
  },
  {
    "id": "petals",
    "name": "Loop wreath",
    "category": "woven",
    "description": "Overlapping loop wreaths",
    "labels": [
      "Loops",
      "Loop shape"
    ],
    "frequency": 8,
    "detail": 4,
    "phase": 70,
    "warp": 0.6,
    "style": "double",
    "stroke": 2.5
  },
  {
    "id": "pinwheel",
    "name": "Pinwheel",
    "category": "radial",
    "description": "Twisted radial blades",
    "labels": [
      "Blades",
      "Blade width"
    ],
    "frequency": 12,
    "detail": 3,
    "phase": 24,
    "warp": 0.35,
    "style": "solid",
    "stroke": 2.5
  },
  {
    "id": "shards",
    "name": "Diamonds",
    "category": "radial",
    "description": "Repeated diamond shapes",
    "labels": [
      "Diamonds",
      "Width"
    ],
    "frequency": 6,
    "detail": 2,
    "phase": 20,
    "warp": 0.45,
    "style": "outline",
    "stroke": 4
  },
  {
    "id": "star",
    "name": "Star",
    "category": "radial",
    "description": "Sharp alternating points",
    "labels": [
      "Points",
      "Inset depth"
    ],
    "frequency": 8,
    "detail": 3,
    "phase": 0,
    "warp": 0.4,
    "style": "outline",
    "stroke": 4
  },
  {
    "id": "sun",
    "name": "Sunburst",
    "category": "radial",
    "description": "Radial pointed rays",
    "labels": [
      "Rays",
      "Ray width"
    ],
    "frequency": 16,
    "detail": 3,
    "phase": 0,
    "warp": 0.35,
    "style": "solid",
    "stroke": 3
  },
  {
    "id": "polygon",
    "name": "Polygon ring",
    "category": "geometry",
    "description": "A ring of polygons",
    "labels": [
      "Repeats",
      "Polygon sides"
    ],
    "frequency": 8,
    "detail": 3,
    "phase": 10,
    "warp": 0.3,
    "style": "outline",
    "stroke": 3
  },
  {
    "id": "cross",
    "name": "Cross",
    "category": "geometry",
    "description": "Connected radial arms",
    "labels": [
      "Arms",
      "Arm width"
    ],
    "frequency": 4,
    "detail": 3,
    "phase": 0,
    "warp": 0.45,
    "style": "double",
    "stroke": 3
  },
  {
    "id": "maze",
    "name": "Steps",
    "category": "geometry",
    "description": "Stepped angular outlines",
    "labels": [
      "Sides",
      "Step depth"
    ],
    "frequency": 4,
    "detail": 3,
    "phase": 45,
    "warp": 0.3,
    "style": "outline",
    "stroke": 4
  },
  {
    "id": "hex",
    "name": "Honeycomb",
    "category": "geometry",
    "description": "Hexagonal cell clusters",
    "labels": [
      "Surrounding cells",
      "Cell rings"
    ],
    "frequency": 6,
    "detail": 1,
    "phase": 0,
    "warp": 0.22,
    "style": "outline",
    "stroke": 4
  },
  {
    "id": "cubes",
    "name": "Cubes",
    "category": "geometry",
    "description": "Isometric cube outlines",
    "labels": [
      "Cubes",
      "Cube size"
    ],
    "frequency": 3,
    "detail": 2,
    "phase": 0,
    "warp": 0.2,
    "style": "outline",
    "stroke": 3
  },
  {
    "id": "rings",
    "name": "Rings",
    "category": "texture",
    "description": "Nested circles and arcs",
    "labels": [
      "Rings",
      "Arc segments"
    ],
    "frequency": 6,
    "detail": 1,
    "phase": 0,
    "warp": 0.12,
    "style": "outline",
    "stroke": 4
  },
  {
    "id": "stripes",
    "name": "Line disc",
    "category": "texture",
    "description": "Parallel lines in a disc",
    "labels": [
      "Lines",
      "Line repeats"
    ],
    "frequency": 14,
    "detail": 1,
    "phase": 45,
    "warp": 0.05,
    "style": "outline",
    "stroke": 3
  },
  {
    "id": "beads",
    "name": "Beads",
    "category": "texture",
    "description": "Circular bead patterns",
    "labels": [
      "Beads",
      "Rows"
    ],
    "frequency": 9,
    "detail": 1,
    "phase": 0,
    "warp": 0.3,
    "style": "outline",
    "stroke": 3
  },
  {
    "id": "chords",
    "name": "String art",
    "category": "texture",
    "description": "Modular circle connections",
    "labels": [
      "Point density",
      "Multiplier"
    ],
    "frequency": 12,
    "detail": 3,
    "phase": 0,
    "warp": 0.2,
    "style": "outline",
    "stroke": 1.2
  }
] satisfies FamilyDefinition[];

export const DEFAULT_SETTINGS: ShapeSettings = {
  family: "pinwheel",
  style: "solid",
  frequency: 12,
  detail: 3,
  phase: 24,
  warp: 0.35,
  stroke: 2.5,
  aspect: 1,
  layers: 1,
  spacing: 0.14,
  copies: 1,
  rotation: 0,
  overlay: "none",
  cap: "round",
  color: "#d4d4d4",
  background: "#000000",
};

export function getFamily(id: string): FamilyDefinition {
  return FAMILIES.find((family) => family.id === id) ?? FAMILIES[0];
}

export function familySettings(id: FamilyId): ShapeSettings {
  const family = getFamily(id);
  return {
    ...DEFAULT_SETTINGS,
    family: family.id,
    style: family.style,
    frequency: family.frequency,
    detail: family.detail,
    phase: family.phase,
    warp: family.warp,
    stroke: family.stroke,
  };
}
