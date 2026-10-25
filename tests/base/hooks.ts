import { BeforeAll, AfterAll, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { mkdir, readFile, rename, rm } from 'fs/promises';
import { join } from 'path';
import { Browser, Page, BrowserContext } from 'playwright';
import { pageFixture } from './pagefixture';
import { invokeBrowser } from '../helpers/browsers/browserManager';
import { getEnv } from '../helpers/Environment/env';
import { InsOrderEntryLoginPage } from '../InsOrderEntry/pages/InsOrderEntryLoginPage';
import { InsOrderEntryProductsPage } from '../InsOrderEntry/pages/InsOrderEntryProductsPage';
import { InsOrderEntrySupportPage } from '../InsOrderEntry/pages/InsOrderEntrySupportPage';
import { InsOrderEntryApplicationsPage } from '../InsOrderEntry/pages/InsOrderEntryApplicationsPage';

setDefaultTimeout(30000);

let browser: Browser;
let page: Page ;
let context: BrowserContext;
const temporaryVideoDirectory = 'test-result/videos/.tmp';
const savedVideoDirectory = 'test-result/videos';
const savedScreenshotDirectory = 'test-result/screenshots';

BeforeAll({ timeout: 30000 }, async function () {
    getEnv();
    browser = await invokeBrowser();
});

Before({ timeout: 30000 }, async function () {
    await mkdir(temporaryVideoDirectory, { recursive: true });
    context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        recordVideo: {
            dir: temporaryVideoDirectory
        }
    });
    pageFixture.page = await context.newPage();
    pageFixture.loginPage = new InsOrderEntryLoginPage(pageFixture.page);
    pageFixture.productsPage = new InsOrderEntryProductsPage(pageFixture.page);
    pageFixture.supportPage = new InsOrderEntrySupportPage(pageFixture.page);
    pageFixture.applicationsPage = new InsOrderEntryApplicationsPage(pageFixture.page);
});

After(async function ({ result, pickle }) {
    const failed = result?.status === Status.FAILED;
    const video = pageFixture.page?.video();

    if (pageFixture.page && failed) {
        await mkdir(savedScreenshotDirectory, { recursive: true });
        const safeScenarioName = pickle.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
        const screenshotPath = join(savedScreenshotDirectory, `${safeScenarioName}-${Date.now()}.png`);
        const screenshot = await pageFixture.page.screenshot({
            path: screenshotPath,
            fullPage: true
        });
        await this.attach(screenshot, 'image/png');
    }

    if (pageFixture.page) {
        await pageFixture.page.close();
    }

    if (context) {
        await context.close();
    }

    if (video) {
        const temporaryVideoPath = await video.path();

        if (failed) {
            await mkdir(savedVideoDirectory, { recursive: true });
            const safeScenarioName = pickle.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
            const savedVideoPath = join(savedVideoDirectory, `${safeScenarioName}-${Date.now()}.webm`);
            await rename(temporaryVideoPath, savedVideoPath);
            await this.attach(await readFile(savedVideoPath), 'video/webm');
        } else {
            await rm(temporaryVideoPath, { force: true });
        }
    }
});

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
});