import type { Point, ShapeGenerator, ShapePath } from "../types";

interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
}

function roundedPanel(panel: Panel, gap: number, roundness: number): ShapePath {
  const x = panel.x + gap / 2;
  const y = panel.y + gap / 2;
  const width = panel.width - gap;
  const height = panel.height - gap;
  const radius = Math.min(width, height) * roundness;
  if (radius === 0) {
    return {
      points: [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
      ],
      closed: true,
    };
  }

  const centers: Point[] = [
    [x + width - radius, y + radius],
    [x + width - radius, y + height - radius],
    [x + radius, y + height - radius],
    [x + radius, y + radius],
  ];
  const points = centers.flatMap(([cx, cy], corner) =>
    Array.from({ length: 17 }, (_, step): Point => {
      const angle = ((corner - 1) * Math.PI) / 2 + (step * Math.PI) / 32;
      return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
    }),
  );
  return { points, closed: true };
}

export const panels: ShapeGenerator = ({ frequency, detail, phase, warp }) => {
  const count = Math.max(1, Math.min(16, Math.round(frequency)));
  const balance = Math.max(0, Math.min(360, phase)) / 360;
  const sidebarWidth = 2 * (0.24 + balance * 0.12);
  const sidebar: Panel = { x: -1, y: -1, width: sidebarWidth, height: 2 };
  const content: Panel[] =
    count === 1
      ? [{ x: -1, y: -1, width: 2, height: 2 }]
      : [{ x: -1 + sidebarWidth, y: -1, width: 2 - sidebarWidth, height: 2 }];

  // Keep one full-height sidebar. Subdivide the largest content pane to create
  // dashboard layouts with exactly the requested number of non-overlapping panels.
  while (content.length < count - 1) {
    let largest = 0;
    for (let index = 1; index < content.length; index++) {
      if (content[index].width * content[index].height > content[largest].width * content[largest].height) {
        largest = index;
      }
    }
    const panel = content[largest];
    const vertical = panel.width > panel.height;
    const ratio = 0.35 + balance * 0.3;
    const first: Panel = vertical
      ? { ...panel, width: panel.width * ratio }
      : { ...panel, height: panel.height * ratio };
    const second: Panel = vertical
      ? { ...panel, x: panel.x + first.width, width: panel.width - first.width }
      : { ...panel, y: panel.y + first.height, height: panel.height - first.height };
    content.splice(largest, 1, first, second);
  }

  const layout = count === 1 ? content : [sidebar, ...content];
  const shortest = Math.min(...layout.map(({ width, height }) => Math.min(width, height)));
  // Preserve usable panel areas even at maximum count and gutter settings.
  const gap = shortest * (0.08 + Math.max(0, Math.min(0.8, warp)) * 0.3);
  const roundness = ((Math.max(1, Math.min(12, detail)) - 1) / 11) * 0.34;
  return layout.map((panel) => roundedPanel(panel, gap, roundness));
};
