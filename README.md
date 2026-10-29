# Abztract

A single-page playground for generating abstract symbols from text seeds and adjustable geometry.

## Development

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Select a family from the DialKit panel on the right, then adjust the shape, finish, and composition. A seed produces repeatable settings for the selected family; manual controls can refine them further. Disable **Keep family** to explore across families.

## Static deployment

```bash
npm run build
```

Next.js exports the site to `out/`. Deploy that folder to a static host; no Node.js server is needed. `next start` does not support static exports. URL settings, shape generation, and SVG/PNG downloads continue to run in the browser.

### Cloudflare Workers

The root `wrangler.jsonc` configures Workers Static Assets to serve `out/`.

For Git-connected Workers builds, use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

For a manual deployment, run the build command first, then the deploy command. No Worker script or OpenNext adapter is required.

## Features

- 22 families covering curves, radial marks, geometry, weaving, and textures.
- Outline, solid, double-line, ribbon, and dashed treatments.
- Nested layers, rotational copies, and optional overlays.
- Shareable URLs containing the seed, selected family, geometry, composition, colors, and export settings.
- Static SVG downloads and PNG downloads at 1024, 2048, or 4096 pixels.
- Transparent exports or the selected background. SVG files include the seed and settings in their metadata.

Generation and exports run in the browser. There are no accounts, uploads, animation controls, or server APIs.

## Sharing

Use **Copy link** in DialKit or copy the browser address. Changes update the query string after a short debounce, without reloading the page or adding a history entry for each slider movement. **Copy link** captures current values immediately, even during that debounce.

Links can start with just a seed and family, for example `/?seed=hello&family=knot`. Missing geometry is derived from that seed; explicit settings in the URL take precedence. Numeric inputs are clamped to the supported ranges, and invalid selections or colors fall back to valid defaults. Opening a link or navigating back/forward restores its settings.

## Structure

Everything for the single route is colocated under `src/app`:

- `_components`: minimal canvas, artwork, controller hook, and Tailwind layouts.
- `_lib/generators`: pure, typed generators grouped by shape category.
- `_lib`: family definitions, seed algorithms, geometry helpers, rendering, DialKit configuration, URL state, and export utilities.

`page.tsx` remains a Server Component. The generator is the client boundary. DialKit uses its native floating panel at the top right and stays available in production.

## Tooling

Oxlint rules and Oxfmt settings follow [TenderLayer](https://github.com/arhamkhnz/tenderlayer), with paths adapted for this Next.js app.

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

These scripts are available for manual use; creating this implementation does not run them.
