import { expect, test } from "@playwright/test";

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("/");
    await expect(page).toHaveTitle(/tannrest/i);
  });

  test("goto login page", async ({ page }) => {
        const loginLink = await page.getByRole("link", { name: "Đăng nhập" });
  });
});
