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

export function mapPathPoints(path: ShapePath, transform: (point: Point) => Point): ShapePath {
  return {
    ...path,
    points: path.points.map(transform),
    ...(path.holes ? { holes: path.holes.map((hole) => hole.map(transform)) } : {}),
  };
}

export function toPathData({ points, closed, holes }: ShapePath): string {
  return (
    points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("") +
    (closed ? "Z" : "") +
    (holes?.map((points) => toPathData({ points, closed: true })).join("") ?? "")
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
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const rotations = Array.from({ length: settings.copies }, (_, copy) => {
    const angle = (settings.rotation * Math.PI) / 180 + (TAU * copy) / settings.copies;
    return [Math.cos(angle), Math.sin(angle)] as const;
  });
  let rotatedExtent = 0;
  for (const { points } of paths) {
    for (const [x, y] of points) {
      const dx = x * settings.aspect - centerX;
      const dy = y - centerY;
      for (const [cos, sin] of rotations) {
        rotatedExtent = Math.max(rotatedExtent, Math.abs(dx * cos - dy * sin), Math.abs(dx * sin + dy * cos));
      }
    }
  }
  // Bound the requested stroke conservatively; clearance limits can only make
  // it thinner. Round joins extend by half the width; square caps need more.
  const width = settings.style === "woven" ? Math.max(4, settings.stroke) : settings.stroke;
  const outerWidth = settings.style === "double" ? Math.max(5, width * 3) : width;
  const strokeExtent = outerWidth * (settings.cap === "square" ? Math.SQRT1_2 : 0.5);
  const available = Math.max(1, CENTER - 1 - strokeExtent);
  const baseScale = Math.min(354 / size, available / Math.max(rotatedExtent, 0.005));
  const scale = baseScale * Math.max(0.1, 1 - layer * settings.spacing);

  return paths.map((path): ShapePath => ({
    ...mapPathPoints(path, ([x, y]) => [
      CENTER + (x * settings.aspect - centerX) * scale,
      CENTER + (y - centerY) * scale,
    ]),
    ...(path.clearance !== undefined ? { clearance: path.clearance * scale * Math.min(settings.aspect, 1) } : {}),
  }));
}
