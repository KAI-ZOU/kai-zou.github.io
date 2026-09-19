// A local preview utility only. GitHub Pages serves out/ directly.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.env.PORT ?? 4173);
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".pdf": "application/pdf", ".woff2": "font/woff2" };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (base && pathname !== base && !pathname.startsWith(`${base}/`)) throw new Error("Outside base path");
    pathname = pathname.slice(base.length);
    let file = path.resolve(root, `.${pathname || "/"}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error("Outside export");
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith("/")) { response.writeHead(301, { Location: `${url.pathname}/${url.search}` }); response.end(); return; }
      file = path.join(file, "index.html");
    }
    const data = await readFile(file);
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] ?? "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(await readFile(path.join(root, "404.html")).catch(() => "Not found"));
  }
}).listen(port, "127.0.0.1", () => console.log(`Static preview: http://127.0.0.1:${port}${base}/`));
