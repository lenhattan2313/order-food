import { expect, test } from '@playwright/test';
import { mockApiResponse } from '../../utils/mockUtils';
import { responseDashboard } from './data.mock';
import { accessibilityTest } from '../../fixture';

test.describe('Dashboard page', () => {
  test('display content', async ({ page }) => {
    // show content page
    await mockApiResponse(
      page,
      '/indicators/dashboard?fromDate=2024-10-09T17%3A00%3A00.000Z&toDate=2024-10-10T16%3A59%3A59.999Z',
      responseDashboard,
    );
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

    await page.getByPlaceholder('From').fill('2024-10-10T00:00');
    await page.getByPlaceholder('To').fill('2024-10-10T23:59');

    const firstCard = await cardItem.first();
    await expect(firstCard).toContainText('290.000');
  });
});

accessibilityTest(
  'accessibility check',
  async ({ page, axeBuilder }, testInfo) => {
    await page.goto('./manage/dashboard');

    const { violations } = await axeBuilder().analyze();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
    await expect(violations).toHaveLength(0);
  },
);
