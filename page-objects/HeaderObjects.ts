import { type Locator, type Page, expect } from '@playwright/test';

export class HeaderObjects {
  readonly page: Page;
  readonly langDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.langDropdown = page.getByRole('button', { name: 'Node.js' });
  }

  selectLangOption(lang: string) {
    return this.page.getByLabel('Main', { exact: true }).getByText(lang);
  }
}

export default HeaderObjects;
