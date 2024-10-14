import { Page, expect, test } from '@playwright/test';
import { accessibilityTest } from '../fixture';
test.use({ storageState: { cookies: [], origins: [] } });
const myTest = test.extend<{ webApp: Page }>({
  webApp: async ({ page }, use) => {
    // Go to the starting url before each test.
    await page.goto('/');
    await expect(page).toHaveTitle(/tannrest/i);
    const loginLink = await page.getByRole('link', { name: /login/i });
    await expect(loginLink).toBeVisible();
    await loginLink.click();

    const login = await page.getByRole('heading', { name: /login/i });
    await login.waitFor(); // Ensure login heading is rendered
    await expect(login).toBeVisible();
    await use(page);
  },
});

myTest('login native', async ({ webApp }) => {
  //check content

  const emailInput = await webApp.getByTestId('email');
  const passwordInput = await webApp.getByTestId('password');
  const loginBtn = await webApp.getByRole('button', { name: /login/i });
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginBtn).toBeVisible();

  //fill invalid data;
  await emailInput.fill('test');

  //validate
  await loginBtn.click();
  const error = await webApp.getByText('Invalid Email');
  expect(error).toBeVisible();

  //fill valid data but not existed
  await emailInput.fill('test@gmail.com');
  await passwordInput.fill('123123');
  await loginBtn.click();

  const errorNotExist = await webApp.getByText('Email không tồn tại');
  await errorNotExist.waitFor(); // Ensure login heading is rendered
  await expect(errorNotExist).toBeVisible();

  //login
  await emailInput.fill('admin@order.com');
  await passwordInput.fill('123456');
  await loginBtn.click();

  //dashboard webApp

  const heading = await webApp.getByRole('heading', { name: /dashboard/i });
  await heading.waitFor(); // Ensure login heading is rendered

  await expect(heading).toBeVisible();
});
accessibilityTest(
  'accessibility check',
  async ({ page, axeBuilder }, testInfo) => {
    await page.goto('./login');

    const { violations } = await axeBuilder().analyze();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
    await expect(violations).toHaveLength(0);
  },
);
