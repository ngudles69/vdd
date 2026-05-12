import { expect, test } from "@playwright/test";

test("renders the editor shell with an empty Excalidraw canvas", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Crochet Design Editor" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Templates" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Properties" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Canvas" })).toHaveValue("A4_PORTRAIT");

  const editor = page.locator(".excalidraw").first();
  await expect(editor).toBeVisible();

  const editorBox = await editor.boundingBox();
  expect(editorBox?.width).toBeGreaterThan(400);
  expect(editorBox?.height).toBeGreaterThan(500);

  const canvases = page.locator("canvas");
  await expect(canvases.first()).toBeVisible();
  await expect(canvases).not.toHaveCount(0);

  await page.screenshot({
    path: "test-results/editor-smoke.png",
    fullPage: true,
  });
});

test("fits the TikTok portrait artboard to the available workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1200 });
  await page.goto("/");

  await page.getByRole("combobox", { name: "Canvas" }).selectOption("TIKTOK_9_16");
  await expect(page.getByRole("combobox", { name: "Canvas" })).toHaveValue("TIKTOK_9_16");

  const editor = page.locator(".excalidraw").first();
  const editorBox = await editor.boundingBox();

  expect(editorBox?.height).toBeGreaterThan(1000);
  expect(editorBox?.width).toBeGreaterThan(550);

  await page.screenshot({
    path: "test-results/editor-tiktok-fit.png",
    fullPage: true,
  });
});

test("shows the ported crochet symbol library", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");

  await page.getByRole("button", { name: "Symbols" }).click();

  await expect(page.getByRole("heading", { name: "Symbols" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Basic Stitches" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Single Crochet", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Double Crochet", exact: true })).toBeVisible();

  await page.screenshot({
    path: "test-results/editor-symbol-library.png",
    fullPage: true,
  });
});
