import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { Browser, Page, BrowserContext } from 'playwright';
import { pageFixture } from './pagefixture';
import { invokeBrowser } from '../helpers/browsers/browserManager';
import { getEnv } from '../helpers/Environment/env';
import { createLogger } from 'winston';
import { options } from '../helpers/util/logger';

let browser: Browser;
let page: Page ;
let context: BrowserContext;

BeforeAll({ timeout: 30000 }, async function () {
    getEnv();
    browser = await invokeBrowser();
});

Before({ timeout: 30000 }, async function ({pickle}) {
    const scenarioName = pickle.name+pickle.id;
    context = await browser.newContext();
    const page = await context.newPage();
    pageFixture.page = page;
    pageFixture.logger = createLogger(options(scenarioName)); // Assuming createLogger is defined elsewhere

    const baseUrl = process.env.BASEURL;
    if (!baseUrl) {
        throw new Error('BASEURL is not configured');
    }

    await page.goto(baseUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
    });
});

After(async function ({pickle}) {

    if (pageFixture.page) {
        const img =  await pageFixture.page.screenshot({path: `./test-result/screenshots/${pickle.name}.png`,type: 'png'});
        await this.attach(img, 'image/png');
        await pageFixture.page.close();
    }

    if (context) {
        await context.close();
    }
});

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
    pageFixture.logger.close(); // Close the logger after all tests are done
});