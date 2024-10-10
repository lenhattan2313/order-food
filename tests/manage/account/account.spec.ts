import { Page, expect, test } from '@playwright/test';
import { mockApiResponse } from '../../utils/mockUtils';
import { accountResponse, newAccountResponse } from './data.mock';
import path from 'path';

const myTest = test.extend<{ webApp: Page }>({
  webApp: async ({ page }, use) => {
    await mockApiResponse(page, '/accounts', accountResponse);
    // show content page
    await page.goto('./manage/accounts');

    const heading = await page.getByRole('heading', { name: /accounts/i });
    await expect(heading).toBeVisible();
    await use(page);
  },
});

myTest('display content', async ({ webApp }) => {
  //check filter
  const filter = await webApp.getByTestId('filter-box');
  await expect(filter).toBeVisible();
  //table
  const table = await webApp.getByTestId('account-table');
  await expect(table).toBeVisible();
  //check data mock
  const firstRow = await webApp.getByRole('cell', {
    name: '20',
    exact: true,
  });
  await expect(firstRow).toBeVisible();

  //apply filter
  await filter.fill('admin');
  await expect(firstRow).not.toBeVisible();
  //reset filter
  await filter.clear();
  await expect(firstRow).toBeVisible();
});
myTest('add new account', async ({ webApp }) => {
  //find btn add
  const addBtn = await webApp.getByTestId('add-button');
  await expect(addBtn).toBeVisible();

  //open dialog
  await addBtn.click();

  const dialog = await webApp.getByTestId('dialog-add-employee');
  await expect(dialog).toBeVisible();

  //fill data
  const file = await webApp.locator('input[type="file"]');
  const filePath = path.resolve(__dirname, './pho.jpeg');

  await file.setInputFiles(filePath);
  await webApp.getByTestId('name').fill('test');
  await webApp.getByTestId('email').fill('tan@gmail.com');
  await webApp.getByTestId('password').fill('123123');
  await webApp.getByTestId('confirmPassword').fill('123123');
  await mockApiResponse(webApp, '/accounts', newAccountResponse);
  await webApp.getByRole('button', { name: /add/i }).click();
  const newAccountList = {
    ...accountResponse,
    data: [newAccountResponse.data, ...accountResponse.data],
  };
  await mockApiResponse(webApp, '/accounts', newAccountList);
  await expect(dialog).not.toBeVisible();

  const firstRow = await webApp.getByRole('cell', {
    name: '16',
    exact: true,
  });
  await expect(firstRow).toBeVisible();
});

myTest('delete account', async ({ webApp }) => {
  //find actions button
  const actionsIcon = await webApp.getByTestId('action-button-20');
  await expect(actionsIcon).toBeVisible();

  //click delete menu
  await actionsIcon.click();
  const deleteItem = await webApp.getByRole('menuitem', { name: /delete/i });
  await deleteItem.click();
  const dialog = await webApp.getByLabel('Delete account?');
  await expect(dialog).toBeVisible();
  await mockApiResponse(webApp, '/accounts/detail/20', {});
  await webApp.getByRole('button', { name: /continue/i }).click();
  //update api get
  const newAccountList = {
    ...accountResponse,
    data: accountResponse.data.slice(1),
  };
  await mockApiResponse(webApp, '/accounts', newAccountList);
  await expect(dialog).not.toBeVisible();

  await expect(actionsIcon).not.toBeVisible();
});
