import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("until-youre-here:v1:intro-complete");
    window.sessionStorage.removeItem("until-youre-here:v1:music-muted");
    window.sessionStorage.removeItem("until-youre-here:v1:access-granted");
  });
});

test("mobile romantic experience smoke test", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: "See how close we are" }),
  ).toBeVisible();
  await expect(
    page.locator('[aria-label="Someone in the UK is counting every second…"]'),
  ).toBeVisible();

  expect(await page.locator("audio").count()).toBe(0);

  await page.getByRole("button", { name: "See how close we are" }).click();
  await expect(
    page.getByRole("heading", { name: "Until I can hold you again" }),
  ).toBeVisible({ timeout: 5_000 });

  const values = await page.locator(".countdown-value").allTextContents();
  expect(values).toHaveLength(4);
  for (const value of values) {
    expect(Number(value)).toBeGreaterThanOrEqual(0);
  }

  await expect(page.getByTestId("journey-route")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByRole("button", { name: "Open the love letter" }).click();
  const dialog = page.getByRole("dialog", {
    name: "There is something I have been trying to say.",
  });
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Close the letter" }).click();
  await expect(dialog).toBeHidden();
});

test("development arrival preview opens directly in arrival state", async ({
  page,
}) => {
  await page.goto("/?preview=arrival");

  await expect(
    page.getByRole("heading", { name: "Welcome home, my love" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open our next chapter" })).toBeVisible();
});
