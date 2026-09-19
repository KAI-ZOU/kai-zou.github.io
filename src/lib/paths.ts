/** Public assets and plain anchors need an explicit prefix; Next Link handles its own. */
export function assetPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
