import { generatePaths } from "./generators";
import { fitPaths, mapPathPoints, toPathData } from "./geometry";
import { panelStrokeWidth } from "./panel-stroke";
import type { ShapePath, ShapeSettings } from "./types";

function renderPaths(paths: ShapePath[], settings: ShapeSettings, id: string): string {
  const requestedWidth = settings.style === "woven" ? Math.max(4, settings.stroke) : settings.stroke;
  const separated = settings.family === "panels" || settings.family === "modules";
  const clearance = Math.min(...paths.map((path) => path.clearance ?? Infinity));
  const bounded = separated || Number.isFinite(clearance);
  const capScale = settings.style === "dashed" && settings.cap === "square" ? Math.SQRT2 : 1;
  const multiplier = settings.style === "double" ? 3 : capScale;
  const width = separated
    ? panelStrokeWidth(paths, settings)
    : Math.min(requestedWidth, (clearance * 0.4) / multiplier);
  const attributes = `stroke="currentColor" stroke-width="${width.toFixed(2)}" stroke-linecap="${settings.cap}" stroke-linejoin="round"`;

  if (settings.style === "double") {
    const outer = bounded ? width * 3 : Math.max(5, width * 3);
    const inner = bounded ? width : Math.max(0.7, outer - width * 2);
    const definitions = paths.map((path, index) => `<path id="${id}-path-${index}" d="${toPathData(path)}"/>`).join("");
    const mask = paths
      .map(
        (
          _,
          index,
        ) => `<use href="#${id}-path-${index}" fill="none" stroke="white" stroke-width="${outer}" stroke-linecap="${settings.cap}" stroke-linejoin="round"/>
        <use href="#${id}-path-${index}" fill="none" stroke="black" stroke-width="${inner}" stroke-linecap="${settings.cap}" stroke-linejoin="round"/>`,
      )
      .join("");
    return `<defs>${definitions}<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="500"><rect width="500" height="500" fill="black"/>${mask}</mask></defs>
      <rect width="500" height="500" fill="currentColor" mask="url(#${id})"/>`;
  }

  return paths
    .map((path) => {
      const fill = settings.style === "solid" && path.closed ? "currentColor" : "none";
      const dash = settings.style === "dashed" ? `stroke-dasharray="${width * 4} ${width * 3}"` : "";
      return `<path d="${toPathData(path)}" fill="${fill}" fill-rule="evenodd" ${attributes} ${dash}/>`;
    })
    .join("");
}

export function renderSymbol(settings: ShapeSettings, id: string): string {
  const paths = generatePaths(settings);
  let markup = "";

  let layers = "";
  for (let layer = 0; layer < settings.layers; layer++) {
    layers += renderPaths(fitPaths(paths, settings, layer), settings, `${id}-layer-${layer}`);
  }

  if (settings.copies === 1) {
    markup = `<g transform="rotate(${settings.rotation} 250 250)">${layers}</g>`;
  } else {
    markup = `<defs><g id="${id}-layers">${layers}</g></defs>`;
    for (let copy = 0; copy < settings.copies; copy++) {
      markup += `<use href="#${id}-layers" transform="rotate(${settings.rotation + (360 * copy) / settings.copies} 250 250)"/>`;
    }
  }

  if (settings.overlay !== "none") {
    const overlay: ShapeSettings = {
      ...settings,
      family: settings.overlay,
      frequency: ["spiral", "swirl", "harmonograph"].includes(settings.overlay)
        ? settings.frequency
        : Math.max(3, Math.min(10, settings.frequency)),
      detail: Math.min(3, settings.detail),
      style: "outline",
    };
    const overlayFit = { ...overlay, rotation: settings.overlayRotation, copies: 1 };
    const overlayPaths = fitPaths(generatePaths(overlay), overlayFit).map((path): ShapePath => ({
      ...mapPathPoints(path, ([x, y]) => [
        250 + (x - 250) * settings.overlayScale,
        250 + (y - 250) * settings.overlayScale,
      ]),
      ...(path.clearance !== undefined ? { clearance: path.clearance * settings.overlayScale } : {}),
    }));
    markup += `<g transform="rotate(${settings.overlayRotation} 250 250)">${renderPaths(overlayPaths, overlay, `${id}-overlay`)}</g>`;
  }

  return markup;
}
