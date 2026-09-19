import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const root = path.resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const routes = ["", "projects/navigation", "projects/gps-sdr", "projects/uav", "projects/wilkinson"];
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}

for (const route of routes) {
  const file = path.join(root, route, "index.html");
  assert.ok((await stat(file)).isFile(), `Missing exported route: ${route || "/"}`);
}
assert.ok((await stat(path.join(root, "404.html"))).isFile(), "Missing static 404 page");
assert.ok((await stat(path.join(root, ".nojekyll"))).isFile(), "Missing .nojekyll");

const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
let checked = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (/^(https?:|mailto:|data:|tel:|\/\/)/.test(href)) continue;
    const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
    if (base && pathname.startsWith("/") && pathname !== base && !pathname.startsWith(`${base}/`)) {
      errors.push(`${path.relative(root, file)}: missing base path in ${href}`);
      continue;
    }
    const local = pathname.startsWith("/") ? pathname.slice(base.length) : pathname;
    let target = pathname ? path.resolve(pathname.startsWith("/") ? root : path.dirname(file), `.${local.startsWith("/") ? local : `/${local}`}`) : file;
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      await stat(target);
      const hash = href.includes("#") ? decodeURIComponent(href.split("#")[1]) : "";
      if (hash && target.endsWith(".html")) {
        const targetHtml = target === file ? html : await readFile(target, "utf8");
        if (!targetHtml.includes(`id="${hash}"`)) errors.push(`${href}: anchor does not exist`);
      }
      checked++;
    } catch { errors.push(`${path.relative(root, file)}: missing target ${href}`); }
  }
  if (html.includes("/_next/image?")) errors.push(`${file}: runtime image optimization URL found`);
}
assert.equal(errors.length, 0, errors.join("\n"));
console.log(`Static export verified: ${routes.length} portfolio routes, 404 page, ${htmlFiles.length} HTML files, ${checked} local links/assets. Base path: ${base || "/"}`);
