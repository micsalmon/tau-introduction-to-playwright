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

// Settings to control how tests are run.
// These could be set by environment variables or other input mechanisms.
// They are hard-coded here to keep the example project simple.
export const USE_ULTRAFAST_GRID: boolean = true;

// Applitools Variables
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: EyesRunner;
// End Applitools

let home: HomePageObjects;
let global: GlobalObjects;
let header: HeaderObjects;
let intro: IntroPageObjects;
const timeout: number = 10000;

// Applitools BeforeAll
test.beforeAll(async () => {
  if (USE_ULTRAFAST_GRID) {
    // Create the runner for the Ultrafast Grid.
    // Concurrency refers to the number of visual checkpoints Applitools will perform in parallel.
    // Warning: If you have a free account, then concurrency will be limited to 1.
    Runner = new VisualGridRunner({ testConcurrency: 5 });
  } else {
    // Create the classic runner.
    Runner = new ClassicRunner();
  }

  // Runner.DontCloseBatches = true;

  // Create a new batch for tests.
  // A batch is the collection of visual checkpoints for a test suite.
  // Batches are displayed in the Eyes Test Manager, so use meaningful names.
  const runnerName = USE_ULTRAFAST_GRID ? 'Ultrafast Grid' : 'Classic runner';
  Batch = new BatchInfo({
    name: `Example: Playwright TypeScript with the ${runnerName}`,
  });

  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Set the batch for the config.
  Config.setBatch(Batch);
  Config.setServerUrl('eyes.applitools.com');

  // If running tests on the Ultrafast Grid, configure browsers.
  if (USE_ULTRAFAST_GRID) {
    // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
    // Other browsers are also available, like Edge and IE.
    Config.addBrowser(800, 600, BrowserType.CHROME);
    Config.addBrowser(1600, 1200, BrowserType.FIREFOX);
    Config.addBrowser(1024, 768, BrowserType.SAFARI);

    // Add 2 mobile emulation devices with different orientations for cross-browser testing in the Ultrafast Grid.
    // Other mobile devices are available.
    Config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
    Config.addDeviceEmulation(DeviceName.Nexus_10, ScreenOrientation.LANDSCAPE);
  }
  // Config.setApiKey('IDc2p5GubjG15seJi5JzWrtmGhPbwQorfulqzrhddtw110');
});

test.describe('Playwright Website', () => {
  let eyes: Eyes;

  test.beforeEach(async ({ page }) => {
    // Applitools BeforeEach
    eyes = new Eyes(Runner, Config);
    await eyes.open(page, 'Playwright Website', test.info().title, {
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

  test.only('has title', async () => {
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

    // await global.waitForLoad(timeout);
    // await eyes.check('Intro Page', Target.window().fully().layout());
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

    // await global.waitForLoad(timeout);
    // await eyes.check('Java Page', Target.window().fully().ignoreColors());
  });

  // test.afterEach(async () => {
  //   await eyes.close();
  // });

  // test.afterAll(async () => {
  //   const results = await Runner.getAllTestResults();
  //   console.log('Visual test results', results);
  // });
});
