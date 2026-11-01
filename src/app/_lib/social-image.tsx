import { ImageResponse } from "next/og";
import { DEFAULT_SETTINGS, familySettings } from "./families";
import { renderSymbol } from "./render-symbol";
import type { FamilyId, ShapeSettings } from "./types";

const WIDTH = 1200;
const HEIGHT = 630;
const SIDE_MARGIN = 54;
const VERTICAL_MARGIN = 36;
const ROWS = 4;
const MARK_SIZE = 128;

type Specimen = readonly [family: FamilyId, settings: Partial<ShapeSettings>];

// Explicit compositions keep the public preview stable as seed tuning evolves.
// Alternate 12 original curve/radial examples with 12 newer logo constructions.
const specimens: Specimen[] = [
  ["harmonograph", { frequency: 3, detail: 2, phase: 60, warp: 0.3, stroke: 4 }],
  ["joined", { style: "solid", stroke: 0.5, frequency: 6, detail: 2, phase: 0, warp: 0.38 }],
  ["sun", { style: "solid", stroke: 0.5, frequency: 9, detail: 4, phase: 20, warp: 0.35 }],
  ["offset-rings", { style: "solid", stroke: 0.5, frequency: 8, detail: 8, phase: 225, warp: 0.4 }],
  ["spiral", { frequency: 5, detail: 1, phase: 0, warp: 0.35, stroke: 4 }],
  ["badge", { frequency: 6, detail: 3, phase: 60, warp: 0.55, centerSize: 0.72, frameThickness: 0.8 }],
  ["modules", { frequency: 4, detail: 7, phase: 0, warp: 0.1 }],
  ["hex", { frequency: 6, detail: 2, phase: 0, warp: 0.12 }],
  ["bloom", { frequency: 6, detail: 6, phase: 0, warp: 0.45 }],
  ["petals", { frequency: 6, detail: 3, phase: 15, warp: 0.3 }],
  ["dotted", { style: "solid", stroke: 0.5, frequency: 5, detail: 1, phase: 0, warp: 0.55 }],
  ["cubes", { frequency: 3, detail: 2, phase: 0, warp: 0.55 }],
  ["pinwheel", { frequency: 7, detail: 5, phase: 60, warp: 0.25 }],
  ["crescents", { style: "solid", stroke: 0.5, frequency: 3, detail: 3, phase: 0, warp: 0.6 }],
  ["super", { frequency: 6, detail: 5, phase: 0, warp: 0.25, stroke: 4 }],
  ["layered", { style: "solid", stroke: 0.5, frequency: 3, detail: 5, phase: 180, warp: 0.2 }],
  ["rings", { frequency: 5, detail: 1, phase: 0, warp: 0, stroke: 4 }],
  ["perforated", { frequency: 3, detail: 3, phase: 0, warp: 0.65 }],
  ["curve-fan", { frequency: 10, detail: 2, phase: 0, warp: 0.45 }],
  ["weave", { frequency: 3, detail: 5, phase: 20, warp: 0.35 }],
  ["radial-bands", { frequency: 3, detail: 2, phase: 30, warp: 0.3 }],
  ["lissajous", { frequency: 3, detail: 4, phase: 90, warp: 0, stroke: 4 }],
  ["split-disc", { frequency: 6, detail: 2, phase: 15, warp: 0.3 }],
  ["chords", { frequency: 5, detail: 2, phase: 0, warp: 0, stroke: 2.5 }],
];

const COLUMNS = Math.ceil(specimens.length / ROWS);
const CELL_WIDTH = (WIDTH - SIDE_MARGIN * 2) / COLUMNS;
const CELL_HEIGHT = (HEIGHT - VERTICAL_MARGIN * 2) / ROWS;

function specimenSheet() {
  const grid: string[] = [];
  for (let column = 0; column <= COLUMNS; column++) {
    const x = SIDE_MARGIN + column * CELL_WIDTH;
    grid.push(`<path d="M${x} ${VERTICAL_MARGIN}V${HEIGHT - VERTICAL_MARGIN}"/>`);
  }
  for (let row = 0; row <= ROWS; row++) {
    const y = VERTICAL_MARGIN + row * CELL_HEIGHT;
    grid.push(`<path d="M${SIDE_MARGIN} ${y}H${WIDTH - SIDE_MARGIN}"/>`);
  }

  const marks = specimens
    .map(([family, configuration], index) => {
      const settings: ShapeSettings = {
        ...familySettings(family),
        style: "outline",
        stroke: 3.5,
        rotation: 0,
        aspect: 1,
        layers: 1,
        copies: 1,
        overlay: "none",
        ...configuration,
      };
      const x = SIDE_MARGIN + (index % COLUMNS) * CELL_WIDTH + (CELL_WIDTH - MARK_SIZE) / 2;
      const y = VERTICAL_MARGIN + Math.floor(index / COLUMNS) * CELL_HEIGHT + (CELL_HEIGHT - MARK_SIZE) / 2;
      return `<g transform="translate(${x} ${y}) scale(${MARK_SIZE / 500})">${renderSymbol(settings, `specimen-${index}`)}</g>`;
    })
    .join("");

  // Clear the background around the main mark with the same silhouette.
  const halo = renderSymbol({ ...DEFAULT_SETTINGS, stroke: 32 }, "hero-halo");
  const hero = renderSymbol(DEFAULT_SETTINGS, "hero");
  const heroSize = 440;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <rect width="${WIDTH}" height="${HEIGHT}" fill="#000000"/>
    <g stroke="#202020" stroke-width="1" fill="none">${grid.join("")}</g>
    <g color="#a3a3a3">${marks}</g>
    <g transform="translate(${(WIDTH - heroSize) / 2} ${(HEIGHT - heroSize) / 2}) scale(${heroSize / 500})">
      <g color="#000000">${halo}</g>
      <g color="#ffffff">${hero}</g>
    </g>
  </svg>`;
}

export function createSocialImage() {
  const source = `data:image/svg+xml;base64,${Buffer.from(specimenSheet()).toString("base64")}`;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000000" }}>
      <img src={source} width={WIDTH} height={HEIGHT} alt="" />
    </div>,
    { width: WIDTH, height: HEIGHT },
  );
}
