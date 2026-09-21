import { Locator, Page } from "playwright";
import { Logger } from "winston";

export class LoginPage {

    readonly page: Page;
    readonly logger: Logger;
    readonly emailAddress:Locator;
    readonly password:Locator;
    readonly loginButton:Locator;
    readonly successIndicator: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.emailAddress = page.locator('[name="email"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.password = page.locator('[name="password"]');
        this.successIndicator = this.page.getByRole('link', { name: 'FS FinServe Retail' });
    }

    async enterloginDetails(email: string, password: string) {
        await this.emailAddress.fill(email);
        await this.password.fill(password);
        this.logger.info(`Entered login details: ${email}`);
    }

    async clickLoginButton() {
        await this.loginButton.click();
        this.logger.info('Clicked on login button');
    }

    async navigateToLoginPage(url: string) {
        await this.page.goto(url);
        this.logger.info(`Navigated to login page: ${url}`);
    }

    async isLoginSuccessful(): Promise<boolean> {
        const isVisible = await this.successIndicator.isVisible({ timeout: 10000 });
        this.logger.info(`Login success indicator visibility: ${isVisible}`);
        return isVisible;
    }

}