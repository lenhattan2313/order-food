import { expect, test } from "@playwright/test";

test.describe("Dashboard page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("/");
    await expect(page).toHaveTitle(/tannrest/i);
  });

  test("display content", async ({ page }) => {
    //show content page
    const heading = await page.getByRole("heading", { name: /dashboard/i });
    await expect(heading).toBeVisible();
  });
});
