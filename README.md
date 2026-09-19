# Kai Zou — Engineering Portfolio

An image-first portfolio built with **Next.js, TypeScript, and Tailwind CSS**, designed specifically for GitHub Pages. Four project case studies cover multi-sensor navigation, a software-defined GPS receiver, autonomous aerial systems, and a Wilkinson GPS splitter.

The visual system is deliberately simple: a white background, neutral text, one sans-serif typeface, and a centered content column. Projects use descriptive titles followed by large images. Thin rules separate sections; image placeholders contain only a label and file path. Navigation remains visible on mobile, and the site uses no decorative animation.

`npm run build` creates **`out/`**, a complete static website. There are no API routes, server actions, databases, dynamic image services, or production server dependencies. React Server Components and local file checks execute at build time only. The site does not require Vercel or an external font service.

## Local development

Install Node.js 22 or newer (the repository includes `.nvmrc`), then:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. For a production preview:

```sh
npm run build
npm run check:export
npm run preview
```

Open `http://127.0.0.1:4173`. The preview command is a local testing utility, not a backend needed by the deployed site. Do not use `next start` for this static export.

## Deploy to GitHub Pages

1. Push this project, including `package-lock.json`, to your GitHub repository on the `main` branch.
2. Open **Settings → Pages → Build and deployment** and choose **GitHub Actions** as the source.
3. Push a commit or run **Actions → Deploy portfolio to GitHub Pages → Run workflow**.
4. After the workflow succeeds, open the URL shown in the `github-pages` deployment.

The workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) installs dependencies with `npm ci`, runs ESLint, builds the static export, checks TypeScript and exported references, uploads `out/`, and deploys it with the official Pages actions. If your default branch differs from `main`, change `on.push.branches` in the workflow. No deploy tokens or Vercel account are required.

### Root domains and project sites

Both deployments are supported:

| Hosting | Base path | Example |
| --- | --- | --- |
| User/organization repository | Empty | `https://kai-zou.github.io/` |
| Project repository | Repository path | `https://username.github.io/portfolio/` |
| Custom domain configured in Pages | Usually empty | `https://example.com/` |

The workflow uses `actions/configure-pages`'s `base_path` output, so the build receives the actual GitHub Pages path automatically. Configure a custom domain in Pages settings before building if you use one.

For a local project-site build and preview:

```sh
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
NEXT_PUBLIC_BASE_PATH=/portfolio npm run check:export
NEXT_PUBLIC_BASE_PATH=/portfolio npm run preview
```

Then open `http://127.0.0.1:4173/portfolio/` and a deep link such as `http://127.0.0.1:4173/portfolio/projects/gps-sdr/`. These command examples use POSIX shells; on Windows you can set `NEXT_PUBLIC_BASE_PATH=/portfolio` in `.env.local` for Next.js, or use PowerShell's `$env:NEXT_PUBLIC_BASE_PATH = '/portfolio'` for all commands.

`next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`. `basePath` prefixes Next's routes and JS/CSS automatically, so an additional `assetPrefix` is unnecessary. The `assetPath()` helper prefixes public images, the favicon, and local resume URLs. Keep paths in the data root-relative (`/images/...`), without the repository name. Rebuild whenever the base path changes; it is compiled into the site. The contents of `out/` should be served at the configured base path, not moved into a nested `out/portfolio/` folder.

See the official [Next.js static export guide](https://nextjs.org/docs/app/guides/static-exports) and [basePath documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath).

## Adding Project Images

1. Drop your photograph, plot, diagram, or screenshot into the appropriate folder under `public/images/`.
2. In [`src/data/projects.ts`](src/data/projects.ts), set the image's `src` to its path **without `public`**, for example `/images/navigation/point-cloud.png`. If you use the expected filename, no data change is needed.
3. Update its `alt`, `caption`, and optional technical `metadata` to describe the actual image and test conditions.
4. Run `npm run build` again, or commit and push to let GitHub Actions rebuild and publish it.

Missing files are detected at build time and rendered as intentional technical placeholders. They show the image label and exact file location to add; they do not request missing images or fabricate evidence. When a file exists, the same component renders it automatically. A client-side fallback also handles image decode or loading failures. Rebuild after adding or deleting files so the exported HTML reflects the new media.

```text
public/images/
  profile/       # optional small professional portrait
  navigation/    # lidar-hardware.jpg, point-cloud.png, trajectory.png,
                 # system-architecture.png, gnss-hardware.jpg,
                 # gnss-result.png, mapping-result.png
  gps-sdr/       # rtl-sdr-setup.jpg, acquisition.png, tracking.png, pvt-results.png
  uav/           # quadcopter.jpg, fixed-wing.jpg, jetson-integration.jpg,
                 # flight-test.jpg, gazebo-simulation.png
  wilkinson/     # pcb.jpg, schematic.png, pcb-layout.png, sparameters.png
  experience/    # optional work-related media
```

Images are fully data-driven. Add entries to any section's `images` array to extend a gallery. Use `layout: "grid"` for responsive columns or `layout: "full"` for full-width figures. No layout edits are needed to add or replace project media.

```ts
{
  src: "/images/navigation/point-cloud.png",
  alt: "3D LiDAR point cloud generated from VLP-16 data",
  label: "LiDAR point cloud",
  kind: "Result figure",
  caption: "Replace with the actual processing and capture conditions.",
  metadata: ["VLP-16", "Add actual test conditions"],
  aspect: "wide",
  fit: "contain",
  width: 1600,
  height: 900,
}
```

`ProjectImage` also works independently:

```tsx
<ProjectImage
  src="/images/navigation/point-cloud.png"
  alt="3D LiDAR point cloud generated from VLP-16 data"
  caption="Add the actual capture and filtering conditions here."
/>
```

Available aspect ratios are `landscape` (4:3), `wide` (16:9), `portrait` (3:4), `square`, and `natural`. All images default to `contain`, preserving the entire photograph, plot, schematic, or screenshot. Use `cover` only when cropping is appropriate. For `natural`, set `width` and `height` to the actual image dimensions to reserve the correct space. Figures normally reserve their aspect ratio to prevent layout shift.

Real project images can be opened in an accessible native dialog with a larger view and original-file link. Escape or the close button closes it, and focus returns to the trigger. There is no gallery dependency. Below-the-fold images use native lazy loading; the first project image on the homepage and the lead image on each project page load eagerly.

### Image sizes and formats

- Hero photography: approximately **1600–2000 px wide**.
- Normal project photography: approximately **1200–1600 px wide**.
- Plots and screenshots: enough resolution for readable labels; retain complete axes and legends.
- Compress photos as JPEG, WebP, or AVIF. Use PNG or WebP for diagrams and plots when appropriate.
- Aim for a few hundred KB per photograph where quality allows; inspect full-size readability before compressing figures aggressively.

Local JPEG, PNG, WebP, AVIF, and SVG files work on static hosting. Use the corresponding filename extension in the data. Source files are served directly: Next's dynamic image optimization is disabled, so resize and compress images **before** adding them. No synthetic project images or measurements are included.

## Personal details and content

Edit [`src/data/site.ts`](src/data/site.ts) for biography, experience, and contact links:

- **GitHub:** configured as `https://github.com/KAI-ZOU`, based on this repository's remote.
- **Resume:** add `public/resume.pdf`, or set `resume` to another public file path or HTTPS URL. A local file is linked only when it exists at build time.
- **LinkedIn:** set `linkedin` to your actual profile URL.
- **Email:** set `email` to your actual email address.
- **Portrait:** optionally set `profileImage` to `/images/profile/your-photo.webp`. Otherwise the portrait is omitted.

Resume, LinkedIn, and email remain explicitly unavailable until supplied. They never link to missing files, generic social-network homepages, or invented addresses. Project descriptions document the supplied project scope without inventing experimental results. Replace editorial guidance and placeholder captions with your actual methods, observations, and figures as you add evidence.

Project copy, technologies, paths, figure order, and gallery layout live in `src/data/projects.ts`. Every project is statically generated by `generateStaticParams()`. Adding a project to that array creates its route and homepage entry; update the verification route lists if you expand beyond the four included projects.

## Validation

```sh
npm run lint
npm run build
npm run typecheck
npm run check:export
npx playwright install chromium
npm run test:browser
```

If a preview is already using port 4173, run browser checks on a separate port with `PORT=4174 npm run test:browser`.

To repeat browser checks for a project site, first rebuild with the base path and pass the same environment value to `check:export` and `test:browser`:

```sh
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
NEXT_PUBLIC_BASE_PATH=/portfolio npm run check:export
NEXT_PUBLIC_BASE_PATH=/portfolio npm run test:browser
```

The export checker verifies that the homepage, all four project pages, static 404, and `.nojekyll` exist; it checks internal links, anchor targets, CSS, scripts, images, and base-path prefixes. Browser tests cover all routes at 360, 768, and 1440 px, horizontal overflow, missing resources, mobile navigation, anchor links, deep-link reloads, project navigation, and the 404 page. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` if using an existing compatible Chromium installation. `TEST_MEDIA_FIXTURE=1` additionally checks the GPS acquisition image lightbox and failure fallback when a test image is present at the expected path.

Generated output (`out/`, `.next/`), dependencies, and test reports are intentionally ignored by Git. Commit the source and lockfile; the workflow produces the deployable artifact.
