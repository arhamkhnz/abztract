import { rotate, TAU } from "../geometry";
import type { Point, ShapeGenerator, ShapePath } from "../types";

export const pinwheel: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const radius = 0.22 + warp * 0.58;
  const sector = TAU / frequency;
  const width = Math.min(0.94, 0.22 + detail * 0.075);
  const twist = 0.15 + (phase / 360) * 0.95;

  return Array.from({ length: frequency }, (_, index): ShapePath => {
    const angle = (TAU * index) / frequency;
    return {
      points: [
        [radius * Math.cos(angle), radius * Math.sin(angle)],
        [Math.cos(angle + twist * sector), Math.sin(angle + twist * sector)],
        [0.87 * Math.cos(angle + (twist + width) * sector), 0.87 * Math.sin(angle + (twist + width) * sector)],
      ],
      closed: true,
    };
  });
};

export const shards: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const radius = 0.45 + warp * 0.4;
  const width = 0.04 + detail * 0.025;
  const diamond: Point[] = [
    [0.27, 0],
    [0, width],
    [-0.27, 0],
    [0, -width],
  ];

  return Array.from({ length: frequency }, (_, index): ShapePath => {
    const angle = (TAU * index) / frequency;
    return {
      points: diamond.map((point): Point => {
        const [x, y] = rotate(point, angle + (phase * Math.PI) / 180);
        return [x + radius * Math.cos(angle), y + radius * Math.sin(angle)];
      }),
      closed: true,
    };
  });
};

export const star: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(3, frequency);
  const inner = Math.max(0.12, 0.85 - warp * 0.7 - detail * 0.015);

  return [
    {
      points: Array.from({ length: count * 2 }, (_, index): Point => {
        const angle = (TAU * index) / (count * 2) + (phase * Math.PI) / 180 - Math.PI / 2;
        const radius = index % 2 ? inner : 1;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
      }),
      closed: true,
    },
  ];
};

export const sun: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const radius = 0.3 + warp * 0.52;
  const width = (Math.min(0.9, 0.18 + detail * 0.075) * TAU) / frequency;

  return Array.from({ length: frequency }, (_, index): ShapePath => {
    const angle = (index * TAU) / frequency;
    const twist = angle + ((phase * Math.PI) / 180) * 0.1;
    return {
      points: [
        [radius * Math.cos(angle - width / 2), radius * Math.sin(angle - width / 2)],
        [Math.cos(twist), Math.sin(twist)],
        [radius * Math.cos(angle + width / 2), radius * Math.sin(angle + width / 2)],
      ],
      closed: true,
    };
  });
};
