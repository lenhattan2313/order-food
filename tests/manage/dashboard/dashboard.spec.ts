import { expect, test } from '@playwright/test';

test.describe('Dashboard page', () => {
  test('display content', async ({ page }) => {
    // show content page
    await page.goto('./manage/dashboard');

    const heading = await page.getByRole('heading', { name: /dashboard/i });
    await expect(heading).toBeVisible();
    // 4 card item
    const cardItem = await page.locator('.card-item');
    await expect(cardItem).toHaveCount(4);

    // chart
    const revenueChart = await page.getByTestId('revenue-chart');
    const barChart = await page.getByTestId('bar-chart');
    await expect(revenueChart).toBeVisible();
    await expect(barChart).toBeVisible();
  });
});
