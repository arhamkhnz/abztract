import { createSocialImage } from "./_lib/social-image";

export const dynamic = "force-static";
export const alt = "Abztract: a bold white mark over a grid of 24 abstract symbols and geometric patterns.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createSocialImage();
}
