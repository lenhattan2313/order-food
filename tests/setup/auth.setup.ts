import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("./login");
  const emailInput = await page.locator("#email");
  const passwordInput = await page.locator("#password");
  const loginBtn = await page.getByRole("button", { name: /login/i });
  await emailInput.fill(process.env.NEXT_ACCOUNT_USER ?? "");
  await passwordInput.fill(process.env.NEXT_ACCOUNT_PASSWORD ?? "");
  await loginBtn.click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await expect(page).toHaveURL("/en/manage/dashboard");
  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
