import { expect, test } from '@playwright/test';

test.describe('Account page', () => {
  test('display content', async ({ page }) => {
    // show content page
    await page.goto('./manage/accounts');

    const heading = await page.getByRole('heading', { name: /accounts/i });
    await expect(heading).toBeVisible();
    // 4 card item
  });
});
