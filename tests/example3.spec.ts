import { test, expect, type Page } from '@playwright/test';
import { HomePageObjects } from '../page-objects/HomePageObjects';
import { GlobalObjects } from '../page-objects/GlobalObjects';
import { HeaderObjects } from '../page-objects/HeaderObjects';
import { IntroPageObjects } from '../page-objects/IntroPageObjects';

// Applitools Imports
import {
  BatchInfo,
  Configuration,
  EyesRunner,
  ClassicRunner,
  VisualGridRunner,
  BrowserType,
  DeviceName,
  ScreenOrientation,
  Eyes,
  Target,
} from '@applitools/eyes-playwright';

// Applitools Variables
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
let eyes: Eyes;
// End Applitools

let home: HomePageObjects;
let global: GlobalObjects;
let header: HeaderObjects;
let intro: IntroPageObjects;
const timeout: number = 10000;

// Applitools BeforeAll
test.beforeAll(async () => {
  Runner = new ClassicRunner();
  Batch = new BatchInfo({ name: `Playwright Website` });
  Config = new Configuration();
  Config.setBatch(Batch);
});

test.beforeEach(async ({ page }) => {
  // Applitools BeforeEach
  eyes = new Eyes(Runner);
  await eyes.open(page, 'Playwright', test.info().title, {
    width: 1024,
    height: 768,
  });
  // End Applitools

  home = new HomePageObjects(page);
  global = new GlobalObjects(page);
  header = new HeaderObjects(page);
  intro = new IntroPageObjects(page);
  await global.goToPage('https://playwright.dev/');
});

test.describe('Playwright Website', () => {
  test('has title', async () => {
    await home.verifyTitle(/Playwright/);
    // Window: Checks only viewport
    // Fully: Checks entire viewport & scroll
    await global.waitForLoad(timeout);
    await eyes.check('Home Page', Target.window().fully());
  });

  test('get started link', async () => {
    await home.getStartedButton.click();
    await global.verifyUrl(/.*intro/);
    // Layout: Checks only the layout & ignores text & graphics
    await global.waitForLoad(timeout);
    await eyes.check('Intro Page', Target.window().fully().layout());
  });

  test('check Java page', async () => {
    await home.getStartedButton.click();
    await header.langDropdown.hover();
    await header.selectLangOption('Java').click();
    await global.verifyUrl(/.*java/);
    await intro.verifyH1Text('Installation');
    await expect(intro.notVisibleText).not.toBeVisible();
    await expect(intro.isVisibleText).toBeVisible();
    // IgnoreColors: Check for strict match, but ignores colors
    await global.waitForLoad(timeout);
    await eyes.check('Java Page', Target.window().fully().ignoreColors());
  });

  test.afterEach(async () => {
    await eyes.close();
  });

  test.afterAll(async () => {
    const results = await Runner.getAllTestResults();
    console.log('Visual test results', results);
  });
});
