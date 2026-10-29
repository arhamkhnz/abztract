import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDialKitController } from "dialkit";
import { DIAL_CONFIG, toShapeSettings } from "../_lib/dial-config";
import { FAMILIES, getFamily } from "../_lib/families";
import { newSeed, seededRandom, settingsFromSeed } from "../_lib/seed";
import { createShareUrl, readGeneratorQuery } from "../_lib/url-state";
import type { FamilyId } from "../_lib/types";

export function useGenerator(onAction?: (action: string) => void) {
  const query = useSearchParams().toString();
  const lastQuery = useRef<string | null>(null);
  const pendingRestore = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const dial = useDialKitController("Abztract", DIAL_CONFIG, {
    id: "abztract-generator",
    defaultCollapsed: false,
    onAction(action) {
      if (action === "randomize") vary();
      else onAction?.(action);
    },
  });
  const { values, setValues } = dial;
  const previous = useRef({ seed: values.seed, family: values.shape.family });
  const settings = useMemo(() => toShapeSettings(values), [values]);

  function selectFamily(id: FamilyId, seed = values.seed) {
    const family = getFamily(id);
    previous.current = { seed, family: id };
    setValues({
      seed,
      shape: { family: id, style: family.style, ...settingsFromSeed(seed, id) },
      finish: { stroke: family.stroke },
      composition: { layers: 1, copies: 1, rotation: 0, aspect: 1, overlay: "none" },
    });
  }

  function vary() {
    const seed = newSeed();
    const family = values.keepFamily
      ? settings.family
      : FAMILIES[Math.floor(seededRandom(seed)() * FAMILIES.length)].id;
    selectFamily(family, seed);
  }

  useEffect(() => {
    // Restore explicit URL settings before deriving anything from the seed. This also handles navigation.
    if (lastQuery.current !== query) {
      lastQuery.current = query;
      const restored = readGeneratorQuery(new URLSearchParams(query));
      pendingRestore.current = createShareUrl(window.location.href, restored).search;
      previous.current = { seed: restored.seed, family: restored.shape.family };
      setValues(restored);
      setReady(true);
      return;
    }

    // Wait for the controller to apply the full snapshot, including Strict Mode effect replays.
    if (pendingRestore.current !== null) {
      if (createShareUrl(window.location.href, values).search !== pendingRestore.current) return;
      pendingRestore.current = null;
    }

    const familyChanged = previous.current.family !== values.shape.family;
    const seedChanged = previous.current.seed !== values.seed;
    if (familyChanged || seedChanged) {
      previous.current = { seed: values.seed, family: values.shape.family };
      const family = getFamily(values.shape.family);
      const nextFamily =
        familyChanged || values.keepFamily
          ? family
          : FAMILIES[Math.floor(seededRandom(values.seed)() * FAMILIES.length)];
      previous.current.family = nextFamily.id;
      setValues({
        shape: {
          family: nextFamily.id,
          ...settingsFromSeed(values.seed, nextFamily.id),
          ...(familyChanged || nextFamily.id !== family.id ? { style: nextFamily.style } : {}),
        },
        ...(familyChanged
          ? {
              finish: { stroke: family.stroke },
              composition: { layers: 1, copies: 1, rotation: 0, aspect: 1, overlay: "none" },
            }
          : {}),
      });
      return;
    }

    // Replace rather than push so dragging sliders does not fill the browser history.
    const timeout = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).toString() !== query) return;
      const url = createShareUrl(window.location.href, values);
      const nextQuery = url.searchParams.toString();
      if (nextQuery === query) return;
      lastQuery.current = nextQuery;
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [query, values, setValues]);

  return { values, settings, ready };
}
