import { BeforeAll, AfterAll, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { mkdir, readFile, rename, rm } from 'fs/promises';
import { join } from 'path';
import { Browser, Page, BrowserContext } from 'playwright';
import { pageFixture } from './pagefixture';
import { invokeBrowser } from '../helpers/browsers/browserManager';
import { getEnv } from '../helpers/Environment/env';
import { createLogger } from 'winston';
import { options } from '../helpers/util/logger';
import { LoginPage } from '../FinsRetail/pages/LoginPage';
import { MutualFundPage } from '../FinsRetail/pages/MutualFundPage';
import { PortfolioPage } from '../FinsRetail/pages/PortfolioPage';
import { InsurancePage } from '../FinsRetail/pages/InsurancePage';
import { PoliciesPage } from '../FinsRetail/pages/PoliciesPage';
import { TransactionsPage } from '../FinsRetail/pages/TransactionsPage';
import { SupportPage } from '../FinsRetail/pages/SupportPage';

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

Before({ timeout: 30000 }, async function ({pickle}) {
    const scenarioName = pickle.name+pickle.id;
    await mkdir(temporaryVideoDirectory, { recursive: true });
    context = await browser.newContext({
        viewport: null,
        recordVideo: {
            dir: temporaryVideoDirectory
        }
    });
    const page = await context.newPage();
    pageFixture.page = page;
    pageFixture.logger = createLogger(options(scenarioName)); // Assuming createLogger is defined elsewhere
    pageFixture.loginPage = new LoginPage(pageFixture.page, pageFixture.logger);
    pageFixture.mutualFundPage = new MutualFundPage(pageFixture.page, pageFixture.logger);
    pageFixture.portfolioPage = new PortfolioPage(pageFixture.page, pageFixture.logger);
    pageFixture.insurancePage = new InsurancePage(pageFixture.page, pageFixture.logger);
    pageFixture.policiesPage = new PoliciesPage(pageFixture.page, pageFixture.logger);
    pageFixture.transactionsPage = new TransactionsPage(pageFixture.page, pageFixture.logger);
    pageFixture.supportPage = new SupportPage(pageFixture.page, pageFixture.logger);

    const baseUrl = process.env.BASEURL;
    if (!baseUrl) {
        throw new Error('BASEURL is not configured');
    }

    await page.goto(baseUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
    });
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
    if (pageFixture.logger) {
        pageFixture.logger.close();
    }
});