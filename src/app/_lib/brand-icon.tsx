import { ImageResponse } from "next/og";
import { renderSymbol } from "./render-symbol";
import type { ShapeSettings } from "./types";

const logo: ShapeSettings = {
  family: "rose",
  style: "solid",
  frequency: 5,
  detail: 3,
  phase: 20,
  warp: 0.65,
  stroke: 1,
  aspect: 1,
  layers: 1,
  spacing: 0.14,
  copies: 1,
  rotation: 15,
  overlay: "none",
  overlayScale: 0.62,
  overlayRotation: 0,
  cap: "round",
  color: "#ffffff",
  background: "#000000",
};

export function createLogoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500" color="#ffffff" role="img" aria-label="Abztract"><rect width="500" height="500" fill="#000000"/>${renderSymbol(logo, "abztract-icon")}</svg>`;
}

export function createPngIcon(size: number) {
  const source = `data:image/svg+xml;base64,${Buffer.from(createLogoSvg()).toString("base64")}`;

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#000000" }}>
      <img src={source} alt="Abztract" width={size} height={size} />
    </div>,
    { width: size, height: size },
  );
}
