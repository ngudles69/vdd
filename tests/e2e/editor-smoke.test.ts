import { expect, test } from "@playwright/test";

test("renders the editor shell with an empty Excalidraw canvas", async ({ page }) => {
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
