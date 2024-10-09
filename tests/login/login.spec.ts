import { expect, test } from '@playwright/test';
test.use({ storageState: { cookies: [], origins: [] } });
test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/');
    await expect(page).toHaveTitle(/tannrest/i);
    const loginLink = await page.getByRole('link', { name: /login/i });
    await loginLink.click();
  });

  test('login native', async ({ page }) => {
    //check content
    const emailInput = await page.getByTestId('email');
    const passwordInput = await page.getByTestId('password');
    const loginBtn = await page.getByRole('button', { name: /login/i });
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginBtn).toBeVisible();

    //fill invalid data;
    await emailInput.fill('test');

    //validate
    await loginBtn.click();
    const error = await page.getByText('Invalid Email');
    expect(error).toBeVisible();

    //fill valid data but not existed
    await emailInput.fill('test@gmail.com');
    await passwordInput.fill('123123');
    await loginBtn.click();
    const errorNotExist = await page.getByText('Email không tồn tại');
    await expect(errorNotExist).toBeVisible();

    //login
    await emailInput.fill('admin@order.com');
    await passwordInput.fill('123456');
    await loginBtn.click();

    //dashboard page

    await expect(page).toHaveURL('./manage/dashboard');
  });
});
