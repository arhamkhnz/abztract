import { createPngIcon } from "../../_lib/brand-icon";

export const dynamic = "force-static";

export function GET() {
  return createPngIcon(128);
}
