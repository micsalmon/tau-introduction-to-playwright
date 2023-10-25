import { type Locator, type Page, expect } from '@playwright/test';

export class IntroPageObjects {
  readonly page: Page;
  readonly introHeader: Locator;
  readonly notVisibleText: Locator;
  readonly isVisibleText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.introHeader = page.locator('h1');
    this.notVisibleText = page.getByText('Installing Playwright', {
      exact: true,
    });
    this.isVisibleText = page.getByText('Playwright is distributed');
  }

  async verifyH1Text(h1: string) {
    expect(this.introHeader).toHaveText(h1);
  }
}

export default IntroPageObjects;
