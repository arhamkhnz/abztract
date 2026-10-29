import { ImageResponse } from "next/og";
import { DEFAULT_SETTINGS, familySettings } from "./families";
import { renderSymbol } from "./render-symbol";
import { seededRandom, settingsFromSeed } from "./seed";
import type { FamilyId, ShapeSettings, ShapeStyle } from "./types";

const SIDE_MARGIN = 54;
const VERTICAL_MARGIN = 36;
const GRID_HEIGHT = 630 - VERTICAL_MARGIN * 2;
const GRID_TOP = VERTICAL_MARGIN;
const ROWS = 4;

type Specimen = readonly [family: FamilyId, seed: string, style?: ShapeStyle];

const specimens: Specimen[] = [
  ["harmonograph", "after-hours"],
  ["sun", "confetti", "solid"],
  ["spiral", "vinyl"],
  ["hex", "hive"],
  ["petals", "paperclips", "double"],
  ["cubes", "playblocks"],
  ["chords", "cat-cradle"],
  ["pinwheel", "whirligig", "solid"],
  ["super", "pillow"],
  ["weave", "tangled"],
  ["rose", "wildflower", "solid"],
  ["knot", "pretzel", "double"],
  ["lattice", "crystal"],
  ["rings", "echo"],
  ["lissajous", "swing"],
  ["wave", "puddle", "solid"],
  ["shards", "sprinkles", "solid"],
  ["swirl", "whirlpool"],
  ["cross", "snowflake", "double"],
  ["beads", "bubbles"],
  ["maze", "detour"],
  ["orbit", "satellite"],
  ["polygon", "origami"],
  ["star", "stardust", "solid"],
];

const COLUMNS = Math.ceil(specimens.length / ROWS);
const CELL_WIDTH = (1200 - SIDE_MARGIN * 2) / COLUMNS;

function specimenSheet() {
  const grid: string[] = [];
  for (let column = 0; column <= COLUMNS; column++) {
    const x = SIDE_MARGIN + column * CELL_WIDTH;
    grid.push(`<path d="M${x} ${GRID_TOP}V${GRID_TOP + GRID_HEIGHT}"/>`);
  }
  for (let row = 0; row <= ROWS; row++) {
    const y = GRID_TOP + row * (GRID_HEIGHT / ROWS);
    grid.push(`<path d="M${SIDE_MARGIN} ${y}H${1200 - SIDE_MARGIN}"/>`);
  }

  const marks = specimens
    .map(([family, seed, style = "outline"], index) => {
      const random = seededRandom(`specimen:${seed}`);
      const fineLines = ["spiral", "swirl", "harmonograph", "lattice", "chords"].includes(family);
      const settings: ShapeSettings = {
        ...familySettings(family),
        ...settingsFromSeed(seed, family),
        style,
        stroke: style === "solid" ? 1 : style === "double" ? 2 : fineLines ? 2.5 : 4,
        rotation: Math.floor(random() * 360),
        aspect: Math.round((0.8 + random() * 0.4) * 100) / 100,
        layers: ["wave", "super", "maze"].includes(family) ? 1 + Math.floor(random() * 2) : 1,
      };
      const x = SIDE_MARGIN + (index % COLUMNS) * CELL_WIDTH + (CELL_WIDTH - 128) / 2;
      const y = GRID_TOP + (GRID_HEIGHT / ROWS - 128) / 2 + Math.floor(index / COLUMNS) * (GRID_HEIGHT / ROWS);
      return `<g transform="translate(${x} ${y}) scale(0.256)" color="#a3a3a3">${renderSymbol(settings, `specimen-${index}`)}</g>`;
    })
    .join("");

  // A black halo clears the grid around the white mark without adding a rectangular tile.
  const halo = renderSymbol({ ...DEFAULT_SETTINGS, stroke: 32 }, "hero-halo");
  const hero = renderSymbol(DEFAULT_SETTINGS, "hero");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#000000"/>
    <g stroke="#202020" stroke-width="1" fill="none">${grid.join("")}</g>
    ${marks}
    <g transform="translate(380 ${GRID_TOP + GRID_HEIGHT / 2 - 220}) scale(0.88)">
      <g color="#000000">${halo}</g>
      <g color="#ffffff">${hero}</g>
    </g>
  </svg>`;
}

export function createSocialImage() {
  const source = `data:image/svg+xml;base64,${Buffer.from(specimenSheet()).toString("base64")}`;
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000000", color: "#ffffff" }}>
      <img src={source} width={1200} height={630} alt="" />
    </div>,
    { width: 1200, height: 630 },
  );
}
