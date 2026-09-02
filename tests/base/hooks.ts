import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { Browser, Page, BrowserContext } from 'playwright';
import { pageFixture } from './pagefixture';
import { invokeBrowser } from '../helpers/browsers/browserManager';
import { getEnv } from '../helpers/Environment/env';

let browser: Browser;
let page: Page ;
let context: BrowserContext;

BeforeAll({ timeout: 30000 }, async function () {
    getEnv();
    browser = await invokeBrowser();
});

Before({ timeout: 30000 }, async function () {
    context = await browser.newContext();
    const page = await context.newPage();
    pageFixture.page = page;

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
});