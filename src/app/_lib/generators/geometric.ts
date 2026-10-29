import { polygon, rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";

export const polygonRing: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const sides = Math.max(3, Math.min(10, detail));
  return Array.from({ length: frequency }, (_, index) => {
    const angle = TAU * index / frequency;
    return polygon(0.62 * Math.cos(angle), 0.62 * Math.sin(angle), 0.16 + warp * 0.35, sides, angle + phase * Math.PI / 180);
  });
};

export const cross: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const offset = phase * Math.PI / 180;
  if (frequency === 4) {
    const halfWidth = 0.12 + detail * 0.025 + warp * 0.1;
    const points: Point[] = [
      [-halfWidth, -1], [halfWidth, -1], [halfWidth, -halfWidth], [1, -halfWidth],
      [1, halfWidth], [halfWidth, halfWidth], [halfWidth, 1], [-halfWidth, 1],
      [-halfWidth, halfWidth], [-1, halfWidth], [-1, -halfWidth], [-halfWidth, -halfWidth],
    ];
    return [{ points: points.map((point) => rotate(point, offset)), closed: true }];
  }

  const arms = Math.max(3, frequency);
  const width = Math.min(0.82, 0.18 + detail * 0.045) * Math.PI / arms;
  const inner = 0.25 + warp * 0.5;
  const points: Point[] = [];
  for (let index = 0; index < arms; index++) {
    const angle = index * TAU / arms + offset;
    for (const [radius, pointAngle] of [[inner, angle - width], [1, angle - width], [1, angle + width], [inner, angle + width]]) {
      points.push([radius * Math.cos(pointAngle), radius * Math.sin(pointAngle)]);
    }
  }
  return [{ points, closed: true }];
};

export const maze: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const sides = Math.max(3, frequency);
  const inner = 0.5 + warp * 0.24;
  const step = 0.05 + detail * 0.012;
  const points: Point[] = [];

  for (let index = 0; index < sides; index++) {
    const angle = index * TAU / sides + phase * Math.PI / 180;
    for (const [progress, radius] of [[0, 0.96], [0.32, 0.96], [0.32, inner], [0.6, inner], [0.6, inner + step], [0.82, inner + step], [0.82, 0.96]]) {
      const pointAngle = angle + TAU / sides * progress;
      points.push([radius * Math.cos(pointAngle), radius * Math.sin(pointAngle)]);
    }
  }
  return [{ points, closed: true }];
};

export const hex: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const rings = Math.min(2, detail);
  const radius = 0.8 / (rings + 1.2);
  const count = Math.min(6, frequency);
  const centers: Point[] = [];

  if (count === 6) {
    for (let q = -rings; q <= rings; q++) {
      for (let r = -rings; r <= rings; r++) {
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= rings) {
          centers.push([Math.sqrt(3) * radius * (q + r / 2), 1.5 * radius * r]);
        }
      }
    }
  } else {
    centers.push([0, 0]);
    for (let ring = 1; ring <= rings; ring++) {
      for (let index = 0; index < count * ring; index++) {
        const angle = TAU * index / (count * ring);
        centers.push([Math.sqrt(3) * radius * ring * Math.cos(angle), Math.sqrt(3) * radius * ring * Math.sin(angle)]);
      }
    }
  }

  return centers.map((center) => {
    const [x, y] = rotate(center, phase * Math.PI / 180);
    return polygon(x, y, radius * (1 - warp * 0.42), 6, phase * Math.PI / 180 + Math.PI / 6);
  });
};

export const cubes: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.min(8, frequency);
  const size = 0.25 + detail * 0.025;
  const radius = count === 1 ? 0 : 0.36 + warp * 0.5;
  const paths: ShapePath[] = [];

  for (let index = 0; index < count; index++) {
    const angle = TAU * index / count - Math.PI / 2;
    const center: Point = [radius * Math.cos(angle), radius * Math.sin(angle)];
    const vertices = Array.from({ length: 6 }, (_, vertex): Point => {
      const [x, y] = rotate([
        size * Math.cos(Math.PI / 6 + vertex * TAU / 6),
        size * Math.sin(Math.PI / 6 + vertex * TAU / 6),
      ], phase * Math.PI / 180 * 0.35);
      return [center[0] + x, center[1] + y];
    });
    paths.push({ points: vertices, closed: true });
    for (const vertex of [0, 2, 4]) paths.push({ points: [center, vertices[vertex]], closed: false });
  }

  return paths;
};
