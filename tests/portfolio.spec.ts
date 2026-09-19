import { test, expect } from "@playwright/test";
import { site } from "../src/data/site";
import { publicFileExists } from "../src/lib/media";

const routes = ["", "projects/navigation/", "projects/gps-sdr/", "projects/uav/", "projects/wilkinson/"];

for (const width of [360, 768, 1440]) {
  test(`all static pages render without overflow or broken resources at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const route of routes) {
      const response = await page.goto(route || "./");
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".image-placeholder").first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      for (const image of await page.locator("img:visible").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveJSProperty("complete", true);
        expect(await image.evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation, anchors, project navigation, and external destinations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect(page.locator("#primary-navigation")).toBeVisible();
  await page.locator("#primary-navigation").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/#projects$/);
  await page.getByRole("link", { name: "View project" }).first().click();
  await expect(page.locator("h1")).toHaveText("Multi-Sensor Navigation System");
  await page.reload();
  await expect(page.locator("h1")).toBeVisible();
  await page.getByRole("link", { name: "System architecture", exact: true }).click();
  await expect(page).toHaveURL(/#architecture$/);
  await page.getByRole("link", { name: "← Projects" }).click();
  await expect(page.locator("#projects h2")).toBeInViewport();
  await expect(page.locator("#contact").getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/KAI-ZOU");
  // Unconfigured contact/resume items must never point to generic or missing destinations.
  await expect(page.locator('a[href="https://www.linkedin.com/"], a[href="mailto:your-email@example.com"], a[href="#"]')).toHaveCount(0);
  if (site.resume && (site.resume.startsWith("https://") || publicFileExists(site.resume))) {
    const expectedResume = site.resume.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${site.resume}` : site.resume;
    await expect(page.getByRole("link", { name: "View resume" })).toHaveAttribute("href", expectedResume);
  } else {
    await expect(page.getByText("Resume not added", { exact: true })).toBeVisible();
  }
  if (site.linkedin) await expect(page.locator("#contact").getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", site.linkedin);
  else await expect(page.locator("#contact").getByRole("link", { name: "LinkedIn" })).toHaveCount(0);
  await page.locator("#primary-navigation a").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#projects h2")).toBeInViewport();
});

test("unknown routes serve the exported 404", async ({ page }) => {
  const response = await page.goto("missing-project/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Back to the portfolio" }).click();
  await expect(page.locator("h1")).toHaveText("Kai Zou");
});

if (process.env.TEST_MEDIA_FIXTURE === "1") {
  test("real local media, base path, lightbox, and failure fallback", async ({ page }) => {
    await page.goto("projects/gps-sdr/");
    const trigger = page.getByRole("button", { name: "Enlarge image: GPS acquisition" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const original = page.getByRole("link", { name: "Open original" });
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    await expect(original).toHaveAttribute("href", `${base}/images/gps-sdr/acquisition.png`);
    expect((await page.request.get(await original.getAttribute("href") as string)).status()).toBe(200);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole("button", { name: "Close image" }).click();
    await expect(trigger).toBeFocused();
    await page.route("**/images/gps-sdr/acquisition.png", (route) => route.abort());
    await page.reload();
    await page.locator("#signal-processing").scrollIntoViewIfNeeded();
    await expect(page.getByText("GPS acquisition", { exact: true })).toBeVisible();
    await expect(trigger).toHaveCount(0);
  });
}
