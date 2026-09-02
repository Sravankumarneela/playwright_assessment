import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { pageFixture } from './pagefixture';

let browser: Browser;
let page: Page ;
let context: BrowserContext;

BeforeAll({ timeout: 30000 }, async function () {
    browser = await chromium.launch({ headless: false });
});

Before({ timeout: 30000 }, async function () {
    context = await browser.newContext();
    const page = await context.newPage();
    pageFixture.page = page;

    await page.goto('http://127.0.0.1:8082/login', {
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