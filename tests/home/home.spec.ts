import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("/");
    await expect(page).toHaveTitle(/restaurant/i);
  });

  test("display content", async ({ page }) => {
    const h1 = await page.getByRole("heading", { name: /restaurant/i });
    await expect(h1).toBeVisible();
  });
});
