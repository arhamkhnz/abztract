import { createSocialImage } from "./_lib/social-image";

export const dynamic = "force-static";
export const alt = "Abztract: a grid of geometric specimens interrupted by a bold white splat.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createSocialImage();
}
