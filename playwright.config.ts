import { defineConfig } from "@playwright/test";

const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = process.env.PORT ?? "4173";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}${base}/`,
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  webServer: { command: "npm run preview", url: `http://127.0.0.1:${port}${base}/`, reuseExistingServer: false },
});
