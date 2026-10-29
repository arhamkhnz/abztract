import { useId, useMemo } from "react";
import type { Ref } from "react";
import { getFamily } from "../_lib/families";
import { renderSymbol } from "../_lib/render-symbol";
import type { ShapeSettings } from "../_lib/types";

interface ArtworkProps {
  settings: ShapeSettings;
  svgRef?: Ref<SVGSVGElement>;
  className?: string;
  thumbnail?: boolean;
}

export function Artwork({ settings, svgRef, className, thumbnail = false }: ArtworkProps) {
  const id = useId().replace(/[^a-z0-9_-]/gi, "");
  const markup = useMemo(() => renderSymbol(settings, `symbol-${id}`), [settings, id]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      className={className}
      style={{ color: settings.color }}
      role={thumbnail ? undefined : "img"}
      aria-hidden={thumbnail || undefined}
      aria-label={thumbnail ? undefined : `${getFamily(settings.family).name} symbol`}
    >
      {!thumbnail && <rect data-background="true" width="500" height="500" fill={settings.background} />}
      {/* The engine emits numeric geometry and fixed attributes; user text never enters this markup. */}
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  );
}
