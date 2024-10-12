import { expect } from '@playwright/test';
import { accessibilityTest } from '../../fixture';

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
