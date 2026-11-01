import { TAU } from "../geometry";
import type { Point } from "../types";

export const boundedCount = (value: number, min = 2) => Math.max(min, Math.min(16, Math.round(value)));
export const boundedDetail = (value: number) => Math.max(1, Math.min(12, Math.round(value)));
export const boundedWarp = (value: number) => Math.max(0, Math.min(0.8, value));
export const polar = (radius: number, angle: number): Point => [radius * Math.cos(angle), radius * Math.sin(angle)];

export function radialContour(count: number, radius: (angle: number) => number, turn = 0): Point[] {
  // Fixed samples per lobe bound cost and retain smooth corners at every count.
  return Array.from({ length: count * 48 }, (_, index) => {
    const angle = (TAU * index) / (count * 48);
    return polar(radius(angle), angle + turn);
  });
}

export function arc(radius: number, from: number, to: number): Point[] {
  return Array.from({ length: 33 }, (_, index) => polar(radius, from + ((to - from) * index) / 32));
}
