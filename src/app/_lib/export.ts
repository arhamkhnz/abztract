import type { ShapeSettings } from "./types";

export type ExportFormat = "svg" | "png";

interface ExportOptions {
  svg: SVGSVGElement;
  seed: string;
  settings: ShapeSettings;
  transparent: boolean;
  size: number;
}

function serialize({ svg, seed, settings, transparent, size }: ExportOptions): string {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("width", String(size));
  copy.setAttribute("height", String(size));
  copy.setAttribute("color", settings.color);
  copy.style.color = settings.color;
  copy.removeAttribute("class");
  if (transparent) copy.querySelector("[data-background]")?.remove();
  const metadata = document.createElementNS("http://www.w3.org/2000/svg", "metadata");
  metadata.textContent = JSON.stringify({ generator: "abztract", version: 1, seed, settings });
  copy.append(metadata);
  return new XMLSerializer().serializeToString(copy);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function rasterize(source: string, size: number): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not create a PNG canvas.");
    context.drawImage(image, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed. Please try again."))),
        "image/png",
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadArtwork(format: ExportFormat, options: ExportOptions) {
  const source = serialize(options);
  const seed = options.seed.replace(/[^a-z0-9_-]/gi, "-").slice(0, 40) || "shape";
  const filename = `abztract-${options.settings.family}-${seed}.${format}`;
  const blob =
    format === "svg"
      ? new Blob([source], { type: "image/svg+xml;charset=utf-8" })
      : await rasterize(source, options.size);
  download(blob, filename);
}
