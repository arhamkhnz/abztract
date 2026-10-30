import type { ShapePath, ShapeSettings } from "./types";

// Work in fitted viewBox units so the limit also follows aspect ratio and layers.
export function panelStrokeWidth(paths: ShapePath[], settings: ShapeSettings): number {
  const boxes = paths.map(({ points }) => ({
    left: Math.min(...points.map(([x]) => x)),
    right: Math.max(...points.map(([x]) => x)),
    top: Math.min(...points.map(([, y]) => y)),
    bottom: Math.max(...points.map(([, y]) => y)),
  }));
  let clearance = Infinity;
  for (let index = 0; index < boxes.length; index++) {
    const a = boxes[index];
    for (let next = index + 1; next < boxes.length; next++) {
      const b = boxes[next];
      const dx = Math.max(a.left - b.right, b.left - a.right, 0);
      const dy = Math.max(a.top - b.bottom, b.top - a.bottom, 0);
      clearance = Math.min(clearance, Math.hypot(dx, dy));
    }
  }
  const shortest = Math.min(...boxes.map((box) => Math.min(box.right - box.left, box.bottom - box.top)));
  const outerLimit = Math.min(clearance * 0.8, shortest * 0.4);
  const capMultiplier = settings.style === "dashed" && settings.cap === "square" ? Math.SQRT2 : 1;
  const multiplier = settings.style === "double" ? 3 : capMultiplier;
  const requested = settings.style === "woven" ? Math.max(4, settings.stroke) : settings.stroke;
  return Math.min(requested, outerLimit / multiplier);
}
