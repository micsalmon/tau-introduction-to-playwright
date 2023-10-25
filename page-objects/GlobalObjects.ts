import { type Page, expect } from '@playwright/test';

export class GlobalObjects {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToPage(url: string) {
    await this.page.goto(url);
  }

  async verifyUrl(url: RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  async waitForLoad(wait: number) {
    await this.page.waitForTimeout(wait);
  }
}

export default GlobalObjects;
