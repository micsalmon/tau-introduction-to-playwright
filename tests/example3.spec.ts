import { test, expect, type Page } from '@playwright/test';
import { HomePageObjects } from '../page-objects/HomePageObjects';
import { GlobalObjects } from '../page-objects/GlobalObjects';
import { HeaderObjects } from '../page-objects/HeaderObjects';
import { IntroPageObjects } from '../page-objects/IntroPageObjects';

let home: HomePageObjects;
let global: GlobalObjects;
let header: HeaderObjects;
let intro: IntroPageObjects;

test.beforeEach(async ({ page }) => {
  home = new HomePageObjects(page);
  global = new GlobalObjects(page);
  header = new HeaderObjects(page);
  intro = new IntroPageObjects(page);
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

  test('check Java page', async () => {
    await home.getStartedButton.click();
    await header.langDropdown.hover();
    await header.selectLangOption('Java').click();
    await global.verifyUrl(/.*java/);
    await intro.verifyH1Text('Installation');
    await expect(intro.notVisibleText).not.toBeVisible();
    await expect(intro.isVisibleText).toBeVisible();
  });
});
