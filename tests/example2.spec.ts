import { test, expect, type Page } from '@playwright/test';
import { HomePageObjects } from '../page-objects/HomePageObjects';
import { GlobalObjects } from '../page-objects/GlobalObjects';

let home: HomePageObjects;
let global: GlobalObjects;

test.beforeEach(async ({ page }) => {
  home = new HomePageObjects(page);
  global = new GlobalObjects(page);
  await global.goToPage('https://playwright.dev/');
});

test.describe('Playwright Website', () => {
  test('has title', async () => {
    await home.verifyTitle(/Playwright/);
  });

  test('get started link', async () => {
    await home.getStartedButton.click();
    await global.verifyUrl(/.*intro/);
  });

  test('check Java page', async ({ page }) => {
    await home.getStartedButton.click();
    await page.getByRole('button', { name: 'Node.js' }).hover();
    await page.getByLabel('Main', { exact: true }).getByText('Java').click();
    await expect(page).toHaveURL(/.*java/);
    await expect(
      page.getByText('Installing Playwright', { exact: true })
    ).not.toBeVisible();
    await expect(
      page.getByText('Playwright is distributed as a set of')
    ).toBeVisible();
  });
});
