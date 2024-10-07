import { expect, test } from "@playwright/test";

test.describe("Dashboard page", () => {
  test("display content", async ({ page }) => {
    //show content page
    await page.goto("./manage/dashboard");

    const heading = await page.getByRole("heading", { name: /dashboard/i });
    await expect(heading).toBeVisible();
  });
});
