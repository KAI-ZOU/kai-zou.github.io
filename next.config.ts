import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
if (basePath && !/^\/[a-zA-Z0-9_/-]+$/.test(basePath)) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a path such as /portfolio");
}

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // basePath also prefixes Next's JS/CSS. A separate assetPrefix is unnecessary.
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default config;
