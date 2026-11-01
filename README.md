# Abztract

Create abstract shapes from a seed. Explore 45 shape families, fine-tune the geometry, and export SVG or PNG.

[Try Abztract](https://abztract.arhamkhnz.com) · [Report a bug](https://github.com/arhamkhnz/abztract/issues)

![Artwork generated with Abztract](https://abztract.arhamkhnz.com/opengraph-image)

Abztract started as an internal tool for exploring artwork during a project. It is now available for anyone to use and build on. The generator runs in your browser, with no account required.

## What you can make

Create abstract marks, geometric symbols, patterns, and line artwork. Start with a seed, explore variations, or adjust each setting yourself.

- **45 shape families** across curves, loops, radial shapes, geometry, and textures.
- **Five styles:** outline, solid, double line, ribbon, and dashed.
- **Live controls** for frequency, detail, phase, warp, stroke, colors, and line ends.
- **Composition controls** for layers, spacing, rotated copies, aspect ratio, and overlays.
- **Repeatable results** from seeds and saved settings.
- **Shareable links** that restore the artwork and export settings.
- **SVG downloads and clipboard copying**, plus PNG exports up to 4096 × 4096.
- **Transparent backgrounds** or your selected background color for either format.

## Using the playground

1. Choose a **Family** in the controls panel.
2. Enter a **Seed**, or click **Randomize** to explore a new variation.
3. Adjust **Shape**, **Finish**, and **Composition** to refine the result.
4. Use **Copy link** to share it, **Copy SVG** to copy the artwork, or the download buttons under **Export**.

Leave **Keep Family** on to explore the current family. Turn it off to let Randomize choose another family. **Reset** restores the default artwork and settings.

In **Export**, choose whether to include the background and select a PNG size: 1024, 2048, or 4096 pixels square. SVGs remain scalable and include the seed and shape settings in their metadata.

### Shape families

| Group    | Count | Families                                                                                                                                                                                        |
| -------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Curves   | 9     | Lissajous, Spirograph, Spiral, Swirl, Harmonograph, Rosette, Orbit, Soft star, Soft polygon                                                                                                     |
| Loops    | 3     | Knot, Weave, Loop wreath                                                                                                                                                                        |
| Radial   | 9     | Pinwheel, Diamonds, Star, Sunburst, Spokes, Split disc, Radial bands, Soft branches, Cutout bloom                                                                                               |
| Geometry | 20    | Badge, Layered, Offset rings, Dotted, Crescents, Curve fan, Perforated, Arc motifs, Modules, Joined, Panels, Rubber band, Offset, Cutout, Polygon ring, Cross, Steps, Lattice, Honeycomb, Cubes |
| Textures | 4     | Rings, Line disc, Beads, String art                                                                                                                                                             |

Frequency and Detail control different properties for each family. For example, they set turns and arms for Spiral, and rotated grids and grid density for Lattice.

For **Rubber band**, Frequency sets the number of grid rows. Detail 1–4 creates free layouts, 5–8 mirrors one axis, and 9–12 mirrors both axes. Phase changes the pin arrangement; Warp adjusts the pin radius.

For **Modules**, Frequency sets tile count (1–16), Detail selects squares, dots, quarter discs, quarter bands, half discs, or soft blocks and their layouts, Phase selects and turns composed layouts, and Warp changes the gaps. For **Joined**, the same grid becomes one continuous shape: Detail and Phase change its layout, and Warp rounds its corners. For **Spokes**, Frequency sets 2–16 rays, Detail selects composed ray lengths and angles, Phase turns the mark, and Warp controls ray thickness.

For **Split disc**, Frequency sets the segment count, Detail changes the inner contour, and Warp changes the radial openings. **Radial bands** uses Detail for band count and curved, angular, or arrow motifs. **Soft branches** uses Detail for lobe shape and Warp for the central junction. **Cutout bloom** uses Detail to select a circular, star, or curved cutout, Warp for its size, and Phase for its rotation. Cutouts remain transparent in SVG and PNG exports. These families limit stroke width to preserve their gaps and inner walls.

For **Offset rings**, Frequency sets ring count, Detail moves the shared focus, Warp changes band thickness, and Phase turns the focus. **Dotted** draws an isometric cube, nested hexagons, or a dot orbit; Frequency changes dot density and Warp changes dot size. **Crescents** uses Frequency for columns, Detail for rows, and Warp for crescent thickness. **Curve fan** controls curve count, bend, and focus; Detail 1–8 includes a square frame and 9–12 removes it. **Perforated** offers scalloped grids (Detail 1–4), stacked slots in a disc (5–8), and circular perforations (9–12). **Arc motifs** offers inward-facing arc bands (1–4), a framed concave mark (5–8), and an unframed mark (9–12).

For **Badge**, Frequency sets frame sides (3–12), Detail sets central star points (3–12), Phase changes the star curvature, and Warp adjusts frame rounding and thickness. Detail 3 uses a flat-tipped, left-facing three-arm centre; Detail 4 creates a curved four-point star. Center Size adjusts the central mark relative to the opening (0.25–0.9), and Frame Thickness scales the frame wall (0.4–1.5). Both controls appear only when Badge is the main family or overlay, and both are shared in the URL. Existing URLs default to 0.6 and 1, preserving their proportions. The circular opening stays transparent.

For **Layered**, Frequency selects four distinct constructions: curved sheets (1), paired corners (2), opposing planes (3), or paired arches (4). Detail controls weight and softness, Phase adjusts the internal balance, and Warp controls the separating gap. Randomize keeps these marks solid and upright, and chooses a different construction from the current one.

For **Panels**, Frequency sets the panel count from 1 to 16, Detail controls corner radius, Phase adjusts split proportions, and Warp sets the gap between panels. With two or more panels, it keeps one full-height sidebar and divides the content area into smaller panes. Gaps scale with panel size, and stroke widths adapt to keep neighboring panes separate. Randomize uses 3–7 panels and keeps the layout upright.

## Sharing artwork

Every setting is stored in the URL, including the seed, family, style, geometry, colors, composition, PNG size, and transparency.

A link can start with just a seed and family:

[Try a seeded knot](https://abztract.arhamkhnz.com/?seed=hello&family=knot)

```text
https://abztract.arhamkhnz.com/?seed=hello&family=knot
```

Missing geometry settings are derived from the seed. Explicit URL settings take precedence. Invalid values fall back to defaults or are clamped to the supported range.

The address updates as you edit without reloading the page. **Copy link** captures the current settings immediately. Browser back and forward navigation restores the settings in each URL.

## Run locally

You need Node.js 22.12 or newer and npm.

```bash
git clone https://github.com/arhamkhnz/abztract.git
cd abztract
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No API keys or environment variables are required.

## Development commands

| Command                | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Start the development server                                       |
| `npm run build`        | Build and export the site to `out/`                                |
| `npm run lint`         | Check code with Oxlint                                             |
| `npm run lint:fix`     | Apply automatic lint fixes, including suggestions and unsafe fixes |
| `npm run format`       | Format files with Oxfmt                                            |
| `npm run format:check` | Check formatting without changing files                            |
| `npm run fix`          | Run lint fixes, then format files                                  |

## How it works

The seed produces repeatable geometry settings for the selected family. Each family has a generator that returns paths made from points, with optional inner contours for transparent cutouts. A shared renderer fits those paths to the canvas and applies the selected style, layers, copies, and overlays.

The preview and exports use the same SVG geometry. PNG export renders that SVG into a browser canvas at the selected size. Generation and downloads happen in the browser.

The app uses Next.js App Router, React, TypeScript, Tailwind CSS, and [DialKit](https://www.dialkit.dev/) for the floating controls. Oxlint and Oxfmt handle linting and formatting.

### Project structure

```text
src/app/
├── _components/       Canvas, artwork, controls, and URL synchronization
├── _lib/
│   ├── generators/   Shape family algorithms
│   ├── families.ts   Family definitions and defaults
│   ├── dial-config.ts Control definitions
│   ├── geometry.ts   Shared geometry helpers
│   ├── render-symbol.ts SVG rendering and composition
│   ├── seed.ts       Seeded settings and random number generation
│   ├── random-variation.ts Variation selection
│   ├── url-state.ts  URL parsing, validation, and sharing
│   ├── export.ts     SVG and PNG exports
│   └── site.ts       Public URL and search metadata
├── layout.tsx        Fonts and page metadata
├── page.tsx          Server page and app structured data
├── robots.ts         Crawler rules
└── sitemap.ts        Sitemap
```

To add a family, implement its generator and register it in `types.ts`, `families.ts`, `generators/index.ts`, and `random-ranges.ts`. Review its styles and density handling in `random-variation.ts` so Randomize produces useful results. Update the README count and family table too. Search and social descriptions derive their count from `FAMILY_COUNT` in `families.ts`.

When transforming a path with cutouts, use `mapPathPoints` so its outer and inner contours stay aligned. The fitting step reserves room for rotated copies and stroke widths.

### Algorithm references and provenance

The shape generators use mathematical curves, grid boundaries, polygon construction, and sampled Bezier curves. The recent generator additions were implemented locally from visual references; they do not import implementation code or logo assets from the reference sites. Similar-looking output is still possible, so generated marks are not guaranteed unique.

Seeds use FNV-1a-style string hashing and Mulberry32 pseudorandom number generation for repeatable results.

The Oxlint and Oxfmt settings are shared with [TenderLayer](https://github.com/arhamkhnz/tenderlayer). Next.js, React, Tailwind CSS, DialKit, Motion, and other dependencies retain their own licenses.

## Deployment

Abztract uses Next.js static export. Build it with:

```bash
npm run build
```

Deploy the generated `out/` directory to a static host. Shape generation, shared URLs, and exports continue to work without a Node.js server. Use a static file server to preview the export; `next start` does not serve static exports.

### Cloudflare Workers

The included `wrangler.jsonc` serves `out/` through Workers Static Assets.

For a Git-connected Cloudflare build:

| Setting        | Value                 |
| -------------- | --------------------- |
| Build command  | `npm run build`       |
| Deploy command | `npx wrangler deploy` |

For a manual deployment:

```bash
npm run build
npx wrangler deploy
```

### Metadata and search

Update `src/app/_lib/site.ts` when deploying under another domain. It supplies the canonical URL, search description, social metadata, sitemap URL, and app structured data.

Next.js generates `/robots.txt` and `/sitemap.xml` as static files. The sitemap lists the homepage, and shared presets point to it as their canonical URL. Icons and social preview images use Next.js metadata file conventions.

After deployment, verify your domain in Google Search Console and submit `/sitemap.xml`.

## Contributing

Bug reports, shape ideas, and improvements are welcome. For a rendering bug, include the shared artwork URL, your browser, and a screenshot so the result can be reproduced.

Built by [arhamkhnz](https://github.com/arhamkhnz).
