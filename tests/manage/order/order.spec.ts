import test, { Page, expect } from '@playwright/test';
import { accessibilityTest } from '../../fixture';
import { mockMultipleApiResponses } from '../../utils/mockUtils';
import { dishesData, orderData, tableData } from './data.mock';
import envConfig from '@/config';

const myTest = test.extend<{ webApp: Page }>({
  webApp: async ({ page }, use) => {
    await mockMultipleApiResponses(page, [
      {
        url: '/dishes',
        response: dishesData,
      },
      {
        url: '/orders?fromDate=**',
        response: orderData,
      },
      {
        url: '/tables',
        response: tableData,
      },
    ]);
    // show content page
    await page.goto('./manage/orders');

    const heading = await page.getByRole('heading', { name: /order/i });
    await expect(heading).toBeVisible();
    await use(page);
  },
});

myTest('display content', async ({ webApp }) => {
  await myTest.step('check table data', async () => {
    const table = await webApp.getByTestId('table-order');
    await expect(table).toBeVisible();
    await webApp.getByPlaceholder('From').fill('2024-10-10T00:00');
    await webApp.getByPlaceholder('To').fill('2024-10-10T23:59');
    //check data
    const guestName = await webApp.getByRole('button', { name: 'Tan(#123)' });
    await expect(guestName).toBeVisible();
  });
});

accessibilityTest(
  'accessibility check',
  async ({ page, axeBuilder }, testInfo) => {
    await page.goto('./manage/orders');
    await expect(page).toHaveURL(
      `${envConfig.NEXT_PUBLIC_BASE_URL}/en/manage/orders`,
    );
    const { violations } = await axeBuilder().analyze();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
    await expect(violations).toHaveLength(0);
  },
);
