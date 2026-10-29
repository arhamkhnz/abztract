import type { Point, ShapePath, ShapeSettings } from "./types";

export const TAU = Math.PI * 2;
export const VIEWBOX_SIZE = 500;
export const CENTER = VIEWBOX_SIZE / 2;

export function rotate([x, y]: Point, angle: number): Point {
  return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
}

export function sampleCurve(getPoint: (angle: number) => Point, count = 600, end = TAU, closed = true): ShapePath {
  return {
    points: Array.from({ length: count + 1 }, (_, index) => getPoint((end * index) / count)),
    closed,
  };
}

export function circle(x: number, y: number, radius: number): ShapePath {
  return sampleCurve((angle) => [x + radius * Math.cos(angle), y + radius * Math.sin(angle)], 120);
}

export function polygon(x: number, y: number, radius: number, sides: number, angle = 0): ShapePath {
  return {
    points: Array.from({ length: sides }, (_, index): Point => [
      x + radius * Math.cos(angle + (TAU * index) / sides),
      y + radius * Math.sin(angle + (TAU * index) / sides),
    ]),
    closed: true,
  };
}

export function greatestCommonDivisor(a: number, b: number): number {
  return b ? greatestCommonDivisor(b, a % b) : a;
}

export function toPathData({ points, closed }: ShapePath): string {
  return (
    points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("") + (closed ? "Z" : "")
  );
}

export function fitPaths(paths: ShapePath[], settings: ShapeSettings, layer = 0): ShapePath[] {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const { points } of paths) {
    for (const [x, y] of points) {
      minX = Math.min(minX, x * settings.aspect);
      maxX = Math.max(maxX, x * settings.aspect);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  const size = Math.max(maxX - minX, maxY - minY, 0.01);
  const scale = (354 / size) * Math.max(0.1, 1 - layer * settings.spacing);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return paths.map((path): ShapePath => ({
    ...path,
    points: path.points.map(([x, y]): Point => [
      CENTER + (x * settings.aspect - centerX) * scale,
      CENTER + (y - centerY) * scale,
    ]),
  }));
}
