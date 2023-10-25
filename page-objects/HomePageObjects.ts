import { type Locator, type Page, expect } from '@playwright/test';

export class HomePageObjects {
  readonly page: Page;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
  }

  async verifyTitle(title: RegExp) {
    await expect(this.page).toHaveTitle(title);
  }
}

export default HomePageObjects;
