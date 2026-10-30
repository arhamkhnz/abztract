import type { MetadataRoute } from "next";
import { SITE } from "./_lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Preset query strings are variations of the same page, not separate pages.
  return [{ url: SITE.url }];
}
