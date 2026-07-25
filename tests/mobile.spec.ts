import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("until-you-are-here:intro-completed:v1");
    window.localStorage.removeItem("until-youre-here:v1:intro-complete");
    window.sessionStorage.removeItem("until-youre-here:v1:music-muted");
    window.sessionStorage.removeItem("until-youre-here:v1:access-granted");
  });
});

test("playful gate shows the first question and Yes advances", async ({ page }) => {
  await page.goto("/?replayIntro=1");

  await expect(
    page.getByText("Are you ready for a little surprise, Shama?"),
  ).toBeVisible();

  expect(await page.locator("audio").count()).toBe(0);

  await page.getByTestId("surprise-yes-button").click();
  await expect(
    page.getByText("Are you sure? Once you begin, there is no going back ❤️"),
  ).toBeVisible();
});

test("final Yes completes the gate and opens the countdown", async ({ page }) => {
  await page.goto("/?replayIntro=1");

  for (let index = 0; index < 5; index += 1) {
    await page.getByTestId("surprise-yes-button").click();
  }

  await expect(
    page.getByRole("heading", { name: "Until I can hold you again" }),
  ).toBeVisible({ timeout: 6_000 });

  const values = await page.locator(".countdown-value").allTextContents();
  expect(values).toHaveLength(4);
  for (const value of values) {
    expect(Number(value)).toBeGreaterThanOrEqual(0);
  }

  await expect(page.getByTestId("journey-route")).toBeVisible();
});

test("pointer interaction moves No within the play area", async ({ page }) => {
  await page.goto("/?replayIntro=1");

  const noButton = page.getByTestId("runaway-no-button");
  const playArea = page.getByTestId("surprise-play-area");
  const before = await noButton.boundingBox();
  expect(before).not.toBeNull();

  await noButton.dispatchEvent("pointerenter", {
    clientX: before!.x + before!.width / 2,
    clientY: before!.y + before!.height / 2,
  });
  await page.waitForTimeout(320);

  const after = await noButton.boundingBox();
  const area = await playArea.boundingBox();
  expect(after).not.toBeNull();
  expect(area).not.toBeNull();

  expect(after!.x).toBeGreaterThanOrEqual(area!.x - 1);
  expect(after!.y).toBeGreaterThanOrEqual(area!.y - 1);
  expect(after!.x + after!.width).toBeLessThanOrEqual(area!.x + area!.width + 1);
  expect(after!.y + after!.height).toBeLessThanOrEqual(area!.y + area!.height + 1);
  expect(Math.hypot(after!.x - before!.x, after!.y - before!.y)).toBeGreaterThan(20);
});

test("hidden heart appears and completes the gate", async ({ page }) => {
  await page.goto("/?replayIntro=1");

  const noButton = page.getByTestId("runaway-no-button");
  for (let index = 0; index < 4; index += 1) {
    const box = await noButton.boundingBox();
    expect(box).not.toBeNull();
    await noButton.dispatchEvent("pointerdown", {
      clientX: box!.x + box!.width / 2,
      clientY: box!.y + box!.height / 2,
    });
    await page.waitForTimeout(180);
  }

  const hiddenHeart = page.getByTestId("hidden-heart-button");
  await expect(hiddenHeart).toBeVisible();

  const overlaps = await page.evaluate(() => {
    const no = document.querySelector('[data-testid="runaway-no-button"]');
    const heart = document.querySelector('[data-testid="hidden-heart-button"]');
    if (!no || !heart) {
      return true;
    }
    const a = no.getBoundingClientRect();
    const b = heart.getBoundingClientRect();
    return !(
      a.right <= b.left ||
      a.left >= b.right ||
      a.bottom <= b.top ||
      a.top >= b.bottom
    );
  });
  expect(overlaps).toBe(false);

  await hiddenHeart.click();
  await expect(
    page.getByRole("heading", { name: "Until I can hold you again" }),
  ).toBeVisible({ timeout: 6_000 });
});

test("skip remembers completion and replay clears only intro state", async ({
  page,
}) => {
  await page.goto("/?replayIntro=1");
  await page.getByRole("button", { name: "Skip the little game" }).click();
  await expect(
    page.getByRole("heading", { name: "Until I can hold you again" }),
  ).toBeVisible({ timeout: 6_000 });

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Until I can hold you again" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Replay from the beginning" }).click();
  await expect(
    page.getByText("Are you ready for a little surprise, Shama?"),
  ).toBeVisible();
});

test("mobile countdown, letter, and overflow smoke after gate", async ({ page }) => {
  await page.goto("/?replayIntro=1");
  await page.getByRole("button", { name: "Skip the little game" }).click();
  await expect(
    page.getByRole("heading", { name: "Until I can hold you again" }),
  ).toBeVisible({ timeout: 6_000 });

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

test("reduced motion keeps runaway movement bounded", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?replayIntro=1");

  const noButton = page.getByTestId("runaway-no-button");
  const box = await noButton.boundingBox();
  expect(box).not.toBeNull();

  await noButton.dispatchEvent("pointerdown", {
    clientX: box!.x + box!.width / 2,
    clientY: box!.y + box!.height / 2,
  });
  await page.waitForTimeout(80);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
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
