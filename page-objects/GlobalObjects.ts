import { type Locator, type Page, expect } from '@playwright/test';

export class GlobalObjects {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  async goToPage(url: string) {
    await this.page.goto(url);
  }

  async verifyUrl(url: RegExp) {
    await expect(this.page).toHaveURL(url);
  }
}

export default GlobalObjects;
