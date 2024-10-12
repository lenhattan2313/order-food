import test, { Page, expect } from '@playwright/test';
import { accessibilityTest } from '../../fixture';
import { mockMultipleApiResponses } from '../../utils/mockUtils';
import { dishesData, orderData, tableData } from './data.mock';

const myTest = test.extend<{ webApp: Page }>({
  webApp: async ({ page }, use) => {
    await mockMultipleApiResponses(page, [
      {
        url: '/dishes',
        response: dishesData,
      },
      {
        url: '/orders?fromDate=2024-10-11T17%3A00%3A00.000Z&toDate=2024-10-12T16%3A59%3A59.999Z',
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

    //check data
    const guestName = await webApp.getByRole('button', { name: 'Tan(#123)' });
    await expect(guestName).toBeVisible();
  });
});

accessibilityTest(
  'accessibility check',
  async ({ page, axeBuilder }, testInfo) => {
    await page.goto('./manage/orders');

    const { violations } = await axeBuilder().analyze();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
    await expect(violations).toHaveLength(0);
  },
);
