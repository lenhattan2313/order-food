import envConfig from '@/config';
import { chromium, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');
async function globalSetup() {
  const browsers = await chromium.launch();
  const context = await browsers.newContext();
  const page = await context.newPage();
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('http://localhost:3000/en/login');
  const emailInput = await page.getByTestId('email');
  const passwordInput = await page.getByTestId('password');
  const loginBtn = await page.getByRole('button', { name: /login/i });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginBtn).toBeVisible();
  await emailInput.fill(process.env.NEXT_ACCOUNT_USER ?? '');
  await passwordInput.fill(process.env.NEXT_ACCOUNT_PASSWORD ?? '');
  await loginBtn.click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.

  await page.waitForURL(
    `${envConfig.NEXT_PUBLIC_BASE_URL}/en/manage/dashboard`,
    { waitUntil: 'networkidle' },
  );
  // End of authentication steps.
  await page.context().storageState({ path: authFile });
  await browsers.close();
}
export default globalSetup;
