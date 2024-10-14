import { expect, test } from '@playwright/test';
import { accessibilityTest } from '../fixture';

test('display content', async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto('/');
  await expect(page).toHaveTitle(/tannrest/i);
  //show content page
  const h1 = await page.getByRole('heading', { name: /tannrest/i });
  const h2 = await page.getByRole('heading', { name: 'Our Delicious Menu' });
  await expect(h1).toBeVisible();
  await expect(h2).toBeVisible();
  const cardDish = await page.getByTestId('card-dish');
  await expect(cardDish).toBeVisible();

  //click detail item

  const dishItems = page.locator('.dish-item');
  const dishCount = await dishItems.count();

  if (dishCount > 0) {
    //click first button
    await dishItems.first().locator('img').click();
    //   const popup = await page.waitForEvent("popup");
    const popup = await page.getByTestId('popup-dish');
    const isVisible = await popup.isVisible();
    if (isVisible) {
      await expect(popup).toBeVisible();

      const titlePopup = await page.getByRole('heading', {
        name: /dish detail/i,
      });
      await expect(titlePopup).toBeVisible();

      //close popup
      await page.keyboard.press('Escape');
      await expect(titlePopup).not.toBeVisible();
    } else {
      const title = await page.getByRole('heading', {
        name: /dish detail/i,
      });
      await title.waitFor(); // Ensure login heading is rendered

      await expect(title).toBeVisible();
    }
  } else {
    const text = await page.getByText(/no result/i);
    await expect(text).toBeVisible();
  }
});

accessibilityTest(
  'accessibility check',
  async ({ page, axeBuilder }, testInfo) => {
    await page.goto('/');

    const { violations } = await axeBuilder().analyze();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(violations, null, 2),
      contentType: 'application/json',
    });
    await expect(violations).toHaveLength(0);
  },
);
