import { expect, test } from '@playwright/test';
import { mockApiResponse } from '../../utils/mockUtils';
import { responseDashboard } from './data.mock';

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

    // update from to date

    await page.getByPlaceholder('From').fill('2024-09-07T00:00');
    await mockApiResponse(page, '/indicators/dashboard', responseDashboard);

    const firstCard = await cardItem.first();
    await expect(firstCard).toContainText('290.000');
  });
});
