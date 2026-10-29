import { createLogoSvg } from "./_lib/brand-icon";

export const dynamic = "force-static";
export const contentType = "image/svg+xml";

export default function Icon() {
  return new Response(createLogoSvg(), {
    headers: { "Content-Type": contentType },
  });
}
