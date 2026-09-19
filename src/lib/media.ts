import { existsSync } from "node:fs";
import path from "node:path";

/** Runs only while rendering/building, never requires a production server. */
export function publicFileExists(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//")) return false;
  const root = path.resolve(process.cwd(), "public");
  const file = path.resolve(root, `.${src}`);
  return file.startsWith(`${root}${path.sep}`) && existsSync(file);
}
