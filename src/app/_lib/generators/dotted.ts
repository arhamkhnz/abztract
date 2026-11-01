import { polygon, rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";
import { boundedCount, boundedDetail, boundedWarp } from "./logo-shapes";

type Edge = readonly [Point, Point];

export const dotted: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const intervals = boundedCount(frequency, 1);
  const variant = boundedDetail(detail) - 1;
  const mode = Math.floor(variant / 4);
  const points = new Map<string, Point>();
  const add = (point: Point) => points.set(`${Math.round(point[0] * 1e6)},${Math.round(point[1] * 1e6)}`, point);
  const edges: Edge[] = [];
  if (mode < 2) {
    if (mode === 0) {
      const vertices = Array.from({ length: 8 }, (_, index): Point => {
        const x = index & 1 ? 1 : 0;
        const y = index & 2 ? 1 : 0;
        const z = index & 4 ? 1 : 0;
        return [((x - y) * Math.sqrt(3)) / 2, (x + y) / 2 - z];
      });
      for (let index = 0; index < 8; index++) {
        for (const axis of [1, 2, 4]) {
          if (!(index & axis)) edges.push([vertices[index], vertices[index | axis]]);
        }
      }
    } else {
      // Nested hexagons retain a central opening and distinct inner vertices,
      // unlike the cube projection, which has six spokes meeting at its centre.
      const rim = polygon(0, 0, 1, 6, -Math.PI / 2).points;
      const inner = polygon(0, 0, 0.5, 6, -Math.PI / 2).points;
      for (let index = 0; index < 6; index++) {
        const next = (index + 1) % 6;
        edges.push([rim[index], rim[next]], [inner[index], inner[next]], [rim[index], inner[index]]);
      }
    }
    // Use the same physical spacing across unequal projected edge lengths.
    const spacing = 1 / intervals;
    for (const [from, to] of edges) {
      const steps = Math.max(1, Math.ceil(Math.hypot(to[0] - from[0], to[1] - from[1]) / spacing - 1e-9));
      for (let index = 0; index <= steps; index++) {
        const t = index / steps;
        add([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
      }
    }
  } else {
    const count = intervals * 2 + 4;
    for (let index = 0; index < count; index++) {
      const angle = (TAU * index) / count;
      add([Math.cos(angle), Math.sin(angle)]);
    }
    const innerCount = 1 + (variant % 4);
    for (let index = 0; index < innerCount; index++) {
      const angle = (TAU * index) / innerCount;
      add(innerCount === 1 ? [0, 0] : [0.35 * Math.cos(angle), 0.35 * Math.sin(angle)]);
    }
  }
  const centers = [...points.values()].map((point) => rotate(point, (phase * Math.PI) / 180));
  let nearest = Infinity;
  for (let index = 0; index < centers.length; index++) {
    for (let next = index + 1; next < centers.length; next++) {
      const distance = Math.hypot(centers[index][0] - centers[next][0], centers[index][1] - centers[next][1]);
      if (distance > 0.00001) nearest = Math.min(nearest, distance);
    }
  }
  const radius = nearest * (0.12 + boundedWarp(warp) * 0.22);
  return centers.map(([x, y]): ShapePath => ({
    points: Array.from({ length: [24, 4, 4, 6][variant % 4] }, (_, index): Point => {
      const sides = [24, 4, 4, 6][variant % 4];
      const angle = (TAU * index) / sides + (variant % 4 === 1 ? Math.PI / 4 : 0);
      return [x + radius * Math.cos(angle), y + radius * Math.sin(angle)];
    }),
    closed: true,
    clearance: Math.min(radius, nearest - radius * 2),
  }));
};
