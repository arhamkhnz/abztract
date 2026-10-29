import { TAU } from "../geometry";
import { seededRandom } from "../seed";
import type { Point, ShapeGenerator, ShapePath } from "../types";

const key = ([x, y]: Point) => `${x},${y}`;

// Every row contains the same central cells: one connected region, no holes or
// diagonal-only contacts. Its boundary is a simple loop without rejection sampling.
function gridBoundary(rows: number, layout: number, random: () => number): Point[] {
  const width = 2 + ((layout - 1) % 4);
  const mirrored = layout > 4;
  const profiles = Array.from({ length: rows }, () => {
    const left = 1 + Math.floor(random() * width);
    return [left, mirrored ? left : 1 + Math.floor(random() * width)];
  });
  if (layout > 8) {
    for (let row = 0; row < Math.floor(rows / 2); row++) profiles[rows - row - 1] = profiles[row];
  }

  const edges = new Map<string, { start: Point; end: Point }>();
  for (let row = 0; row < rows; row++) {
    const [left, right] = profiles[row];
    for (let column = -left; column < right; column++) {
      const corners: Point[] = [
        [column, row],
        [column + 1, row],
        [column + 1, row + 1],
        [column, row + 1],
      ];
      for (let side = 0; side < 4; side++) {
        const start = corners[side];
        const end = corners[(side + 1) % 4];
        const reverse = `${key(end)}:${key(start)}`;
        if (edges.has(reverse)) edges.delete(reverse);
        else edges.set(`${key(start)}:${key(end)}`, { start, end });
      }
    }
  }

  const links = new Map([...edges.values()].map(({ start, end }) => [key(start), end]));
  const first = edges.values().next().value!.start;
  const points: Point[] = [];
  let point = first;
  do {
    points.push(point);
    point = links.get(key(point))!;
  } while (key(point) !== key(first) && points.length <= edges.size);

  // Keep only corners, so tangent arcs never introduce seams along straight runs.
  return points.filter(([x, y], index) => {
    const previous = points[(index + points.length - 1) % points.length];
    const next = points[(index + 1) % points.length];
    return (x - previous[0]) * (next[1] - y) !== (y - previous[1]) * (next[0] - x);
  });
}

// Wrap a circle at every corner. Convex and concave pins turn in opposite
// directions; connecting opposite turns uses an internal circle tangent.
function wrapPins(pins: Point[], radius: number): ShapePath {
  const turns = pins.map(([x, y], index) => {
    const previous = pins[(index + pins.length - 1) % pins.length];
    const next = pins[(index + 1) % pins.length];
    return Math.sign((x - previous[0]) * (next[1] - y) - (y - previous[1]) * (next[0] - x));
  });
  const tangents = pins.map(([x, y], index) => {
    const nextIndex = (index + 1) % pins.length;
    const next = pins[nextIndex];
    const distance = Math.hypot(next[0] - x, next[1] - y);
    const angle =
      Math.atan2(next[1] - y, next[0] - x) + Math.asin(((turns[index] - turns[nextIndex]) * radius) / distance);
    const normal: Point = [-Math.sin(angle), Math.cos(angle)];
    return {
      start: [x - turns[index] * radius * normal[0], y - turns[index] * radius * normal[1]] as Point,
      end: [next[0] - turns[nextIndex] * radius * normal[0], next[1] - turns[nextIndex] * radius * normal[1]] as Point,
    };
  });

  const points: Point[] = [];
  for (let index = 0; index < pins.length; index++) {
    const [x, y] = pins[index];
    const entry = tangents[(index + pins.length - 1) % pins.length].end;
    const exit = tangents[index].start;
    const start = Math.atan2(entry[1] - y, entry[0] - x);
    const end = Math.atan2(exit[1] - y, exit[0] - x);
    let sweep = (end - start + TAU) % TAU;
    if (turns[index] < 0 && sweep > 0) sweep -= TAU;
    // The existing SVG pipeline uses sampled points. Bound the angular step to
    // keep circular arcs smooth without adding another rendering/export path.
    const segments = Math.max(1, Math.ceil(Math.abs(sweep) * 24));
    for (let step = 0; step <= segments; step++) {
      const angle = start + (sweep * step) / segments;
      points.push([x + radius * Math.cos(angle), y + radius * Math.sin(angle)]);
    }
  }
  return { points, closed: true };
}

export const rubberBand: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const rows = Math.max(1, Math.min(16, Math.round(frequency)));
  const layout = Math.max(1, Math.min(12, Math.round(detail)));
  const random = seededRandom(`rubber-band:${rows}:${layout}:${phase}`);
  const boundary = gridBoundary(rows, layout, random);
  // Grid edges are at least one unit apart. Keep pins below a quarter unit
  // so non-adjacent edges and pin circles retain clearance at every setting.
  return [wrapPins(boundary, 0.06 + warp * 0.22)];
};
