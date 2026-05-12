import { expect, test } from "@playwright/test";

test("renders the editor shell with an empty Excalidraw canvas", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Violet Drizzle Designer" })).toBeVisible();
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

test("keeps the TikTok artboard as a locked page inside a full workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1200 });
  await page.goto("/");

  await page.getByRole("combobox", { name: "Canvas" }).selectOption("TIKTOK_9_16");
  await expect(page.getByRole("combobox", { name: "Canvas" })).toHaveValue("TIKTOK_9_16");
  await page.waitForFunction(() => Boolean(window.__VDD_EXCALIDRAW_API__));

  const editor = page.locator(".excalidraw").first();
  const editorBox = await editor.boundingBox();

  expect(editorBox?.height).toBeGreaterThan(1000);
  expect(editorBox?.width).toBeGreaterThan(1300);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const pageElement = window.__VDD_EXCALIDRAW_API__
          ?.getSceneElements()
          .find((element) => element.customData?.role === "vdd-artboard-page");

        return pageElement
          ? {
              height: pageElement.height,
              locked: pageElement.locked,
              type: pageElement.type,
              width: pageElement.width,
            }
          : null;
      }),
    )
    .toEqual({
      height: 1920,
      locked: true,
      type: "rectangle",
      width: 1080,
    });

  await page.screenshot({
    path: "test-results/editor-tiktok-fit.png",
    fullPage: true,
  });
});

test("shows the ported crochet symbol library", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");

  await page.getByRole("button", { name: "Symbols" }).click();

  const drawer = page.getByLabel("Elements drawer");
  await expect(drawer).toBeVisible();
  await expect(page.getByRole("heading", { name: "Elements" })).toBeVisible();
  await expect(page.getByPlaceholder("Search symbols")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Basic Stitches" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Single Crochet", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Double Crochet", exact: true })).toBeVisible();

  const drawerBox = await drawer.boundingBox();
  const propertiesBox = await page.getByRole("heading", { name: "Properties" }).boundingBox();
  expect(drawerBox?.x).toBeGreaterThanOrEqual(70);
  expect(drawerBox?.x).toBeLessThan(90);
  expect(propertiesBox?.x).toBeGreaterThan(1300);

  await page.screenshot({
    path: "test-results/editor-symbol-library.png",
    fullPage: true,
  });
});

test("inserts a selected crochet symbol into the canvas", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/");

  await page.waitForFunction(() => Boolean(window.__VDD_EXCALIDRAW_API__));
  await page.getByRole("button", { name: "Symbols" }).click();
  await page.getByRole("button", { name: "Single Crochet", exact: true }).click();

  await expect
    .poll(async () =>
      page.evaluate(
        () =>
          window.__VDD_EXCALIDRAW_API__
            ?.getSceneElements()
            .filter((element) => element.type === "image").length ?? 0,
      ),
    )
    .toBe(1);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const elements = window.__VDD_EXCALIDRAW_API__?.getSceneElements() ?? [];
        const pageElement = elements.find(
          (element) => element.customData?.role === "vdd-artboard-page",
        );
        const imageElement = elements.find((element) => element.type === "image");

        if (!pageElement || !imageElement) {
          return false;
        }

        const imageCenter = {
          x: imageElement.x + imageElement.width / 2,
          y: imageElement.y + imageElement.height / 2,
        };

        return (
          imageCenter.x > pageElement.x &&
          imageCenter.x < pageElement.x + pageElement.width &&
          imageCenter.y > pageElement.y &&
          imageCenter.y < pageElement.y + pageElement.height
        );
      }),
    )
    .toBe(true);

  await page.waitForTimeout(500);
  await page.screenshot({
    path: "test-results/editor-symbol-inserted.png",
    fullPage: true,
  });
});
