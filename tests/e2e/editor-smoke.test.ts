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

test("keeps the TikTok artboard as an overlay inside a full workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1200 });
  await page.goto("/");

  await page.getByRole("combobox", { name: "Canvas" }).selectOption("TIKTOK_9_16");
  await expect(page.getByRole("combobox", { name: "Canvas" })).toHaveValue("TIKTOK_9_16");
  await page.waitForFunction(() => Boolean(window.__VDD_EXCALIDRAW_API__));

  const editor = page.locator(".excalidraw").first();
  const editorBox = await editor.boundingBox();

  expect(editorBox?.height).toBeGreaterThan(1000);
  expect(editorBox?.width).toBeGreaterThan(1300);

  await expect(page.getByTestId("artboard-overlay")).toBeVisible();

  await expect
    .poll(async () =>
      page.getByTestId("artboard-overlay").boundingBox().then((artboardBox) => {
        if (!artboardBox || !editorBox) {
          return false;
        }

        const artboardCenter = {
          x: artboardBox.x + artboardBox.width / 2,
          y: artboardBox.y + artboardBox.height / 2,
        };
        const editorCenter = {
          x: editorBox.x + editorBox.width / 2,
          y: editorBox.y + editorBox.height / 2,
        };

        return (
          Math.abs(artboardCenter.x - editorCenter.x) <= 2 &&
          Math.abs(artboardCenter.y - editorCenter.y) <= 2 &&
          Math.abs(artboardBox.width / artboardBox.height - 9 / 16) <= 0.01 &&
          artboardBox.width > 500 &&
          artboardBox.height > 900 &&
          artboardBox.width < editorBox.width &&
          artboardBox.height < editorBox.height
        );
      }),
    )
    .toBe(true);

  await expect
    .poll(async () =>
      page.evaluate(() => window.__VDD_EXCALIDRAW_API__?.getSceneElements().length ?? -1),
    )
    .toBe(0);

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
        const imageElement = elements.find((element) => element.type === "image");

        if (!imageElement) {
          return false;
        }

        const imageCenter = {
          x: imageElement.x + imageElement.width / 2,
          y: imageElement.y + imageElement.height / 2,
        };

        return Math.abs(imageCenter.x) <= 1 && Math.abs(imageCenter.y) <= 1;
      }),
    )
    .toBe(true);

  await expect
    .poll(async () =>
      page.evaluate(() => {
        const elements = window.__VDD_EXCALIDRAW_API__?.getSceneElements() ?? [];
        const imageIndex = elements.findIndex((element) => element.type === "image");
        const imageElement = elements[imageIndex];

        return {
          frameId: imageElement?.frameId ?? null,
          groupCount: imageElement?.groupIds.length ?? -1,
          imageOnlySceneElement: elements.length === 1 && imageIndex === 0,
          objectRole: imageElement?.customData?.role,
        };
      }),
    )
    .toEqual({
      frameId: null,
      groupCount: 0,
      imageOnlySceneElement: true,
      objectRole: "vdd-object",
    });

  await page.waitForTimeout(500);
  await page.screenshot({
    path: "test-results/editor-symbol-inserted.png",
    fullPage: true,
  });

  const dragStart = await page.evaluate(() => {
    const api = window.__VDD_EXCALIDRAW_API__;
    const imageElement = api?.getSceneElements().find((element) => element.type === "image");

    if (!api || !imageElement) {
      return null;
    }

    const appState = api.getAppState();
    const zoom = appState.zoom.value;

    return {
      sceneX: imageElement.x,
      sceneY: imageElement.y,
      viewportX:
        (imageElement.x + imageElement.width / 2 + appState.scrollX) * zoom +
        appState.offsetLeft,
      viewportY:
        (imageElement.y + imageElement.height / 2 + appState.scrollY) * zoom +
        appState.offsetTop,
    };
  });

  expect(dragStart).not.toBeNull();
  await page.mouse.move(dragStart!.viewportX, dragStart!.viewportY);
  await page.mouse.down();
  await page.mouse.move(dragStart!.viewportX + 140, dragStart!.viewportY + 90, {
    steps: 8,
  });
  await page.mouse.up();

  await expect
    .poll(async () =>
      page.evaluate((start) => {
        const elements = window.__VDD_EXCALIDRAW_API__?.getSceneElements() ?? [];
        const imageElement = elements.find((element) => element.type === "image");

        if (!imageElement || !start) {
          return false;
        }

        return (
          elements.length === 1 &&
          imageElement.frameId === null &&
          imageElement.groupIds.length === 0 &&
          imageElement.x > start.sceneX + 50 &&
          imageElement.y > start.sceneY + 30
        );
      }, dragStart),
    )
    .toBe(true);

  await page.screenshot({
    path: "test-results/editor-symbol-dragged-independent.png",
    fullPage: true,
  });
});
