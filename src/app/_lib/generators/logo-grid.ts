import type { Point, ShapePath } from "../types";

type Cell = readonly [number, number];
const key = ([x, y]: Cell) => `${x},${y}`;

// Cancel shared edges to obtain a single silhouette, without internal seams.
// Reject holes and corner-only junctions rather than exporting ambiguous contours.
export function gridOutline(cells: Cell[]): Point[] | null {
  const occupied = new Set(cells.map(key));
  const edges = new Map<string, Point>();
  let count = 0;
  for (const [x, y] of cells) {
    const sides: [Cell, Point, Point][] = [
      [
        [x, y - 1],
        [x, y],
        [x + 1, y],
      ],
      [
        [x + 1, y],
        [x + 1, y],
        [x + 1, y + 1],
      ],
      [
        [x, y + 1],
        [x + 1, y + 1],
        [x, y + 1],
      ],
      [
        [x - 1, y],
        [x, y + 1],
        [x, y],
      ],
    ];
    for (const [neighbor, from, to] of sides) {
      if (occupied.has(key(neighbor))) continue;
      if (edges.has(key(from))) return null;
      edges.set(key(from), to);
      count++;
    }
  }
  const first = edges.keys().next().value;
  if (!first) return null;
  const points: Point[] = [];
  let cursor = first;
  do {
    const end = edges.get(cursor);
    if (!end) return null;
    points.push(cursor.split(",").map(Number) as [number, number]);
    edges.delete(cursor);
    cursor = key(end);
  } while (cursor !== first && points.length <= count);
  if (edges.size || cursor !== first) return null;
  // Remove collinear vertices before rounding so straight edges stay straight.
  return points.filter((point, index) => {
    const prev = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    return (point[0] - prev[0]) * (next[1] - point[1]) !== (point[1] - prev[1]) * (next[0] - point[0]);
  });
}

// Authored growth orders give the layouts a clear gesture: a stair, fork,
// open arch, or cross. Phase selects and turns the layout, not arbitrary noise.
const LAYOUTS: Cell[][] = [
  [
    [-1, -1],
    [0, -1],
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [0, -1],
    [-1, -1],
    [-1, -2],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 2],
  ],
  [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [-1, 1],
    [1, 1],
  ],
  [
    [0, 0],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -2],
    [2, 0],
    [0, 2],
    [-2, 0],
  ],
  [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 1],
    [-1, 1],
    [1, -2],
    [-2, 1],
  ],
  [
    [0, 0],
    [0, -1],
    [-1, -1],
    [1, 0],
    [1, 1],
    [2, 1],
    [-1, -2],
  ],
];

export function gridCells(count: number, layout: number, phase: number): Cell[] {
  const variant = Math.floor((((Math.round(phase) % 360) + 360) % 360) / 45);
  const template = LAYOUTS[(layout * 2 + variant) % LAYOUTS.length];
  const cells: Cell[] = [];
  for (const cell of template) {
    if (cells.length === count) break;
    const outline = gridOutline([...cells, cell]);
    if (outline && (cells.length < 2 || outline.length > 4)) cells.push(cell);
  }
  const occupied = new Set(cells.map(key));
  // Larger manual counts extend the chosen layout in balanced, valid steps.
  while (cells.length < count) {
    const candidates = new Map<string, Cell>();
    for (const [x, y] of cells) {
      for (const cell of [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ] as Cell[]) {
        if (!occupied.has(key(cell)) && Math.abs(cell[0]) <= 2 && Math.abs(cell[1]) <= 2) {
          candidates.set(key(cell), cell);
        }
      }
    }
    const ranked = [...candidates.values()].sort(
      (a, b) => a[0] ** 2 + a[1] ** 2 - (b[0] ** 2 + b[1] ** 2) || a[1] - b[1] || a[0] - b[0],
    );
    const next = ranked.find((cell) => {
      const outline = gridOutline([...cells, cell]);
      return outline !== null && outline.length > 4;
    });
    if (!next) break;
    cells.push(next);
    occupied.add(key(next));
  }
  const turns = Math.floor(variant / 2);
  return cells.map(([x, y]): Cell => {
    for (let turn = 0; turn < turns; turn++) [x, y] = [-y, x];
    return [x, y];
  });
}

export function roundedContour(vertices: Point[], radius: number): ShapePath {
  if (radius <= 0) return { points: vertices, closed: true };
  const points: Point[] = [];
  for (let index = 0; index < vertices.length; index++) {
    const corner = vertices[index];
    const prev = vertices[(index + vertices.length - 1) % vertices.length];
    const next = vertices[(index + 1) % vertices.length];
    const incoming = Math.hypot(prev[0] - corner[0], prev[1] - corner[1]);
    const outgoing = Math.hypot(next[0] - corner[0], next[1] - corner[1]);
    const distance = Math.min(radius, incoming * 0.45, outgoing * 0.45);
    const start: Point = [
      corner[0] + ((prev[0] - corner[0]) * distance) / incoming,
      corner[1] + ((prev[1] - corner[1]) * distance) / incoming,
    ];
    const end: Point = [
      corner[0] + ((next[0] - corner[0]) * distance) / outgoing,
      corner[1] + ((next[1] - corner[1]) * distance) / outgoing,
    ];
    for (let step = 0; step <= 12; step++) {
      const t = step / 12;
      points.push([
        (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * corner[0] + t * t * end[0],
        (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * corner[1] + t * t * end[1],
      ]);
    }
  }
  return { points, closed: true };
}
