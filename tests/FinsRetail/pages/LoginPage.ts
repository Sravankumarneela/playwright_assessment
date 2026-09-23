import { Locator, Page } from "playwright";
import { Logger } from "winston";

export class LoginPage {

    readonly page: Page;
    readonly logger: Logger;
    readonly emailAddress:Locator;
    readonly password:Locator;
    readonly loginButton:Locator;
    readonly successIndicator: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.emailAddress = page.locator('[name="email"]');
        this.loginButton = page.locator('button[type="submit"]');
        this.password = page.locator('[name="password"]');
        this.successIndicator = this.page.getByRole('link', { name: 'FS FinServe Retail' });
        this.logoutButton = page.getByTestId('logout-button');
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

    async logout(): Promise<void> {
        await this.logoutButton.click();
        this.logger.info('Logged out of the Fins Retail application');
    }

    async verifyLogoutMessage(): Promise<void> {
        const flashStatus = this.page.getByTestId('flash-status');
        await flashStatus.waitFor({ state: 'visible' });

        if (!(await flashStatus.innerText()).trim()) {
            throw new Error('Logout confirmation is visible but contains no message');
        }
    }

    async submitEmptyLogin(): Promise<void> {
        await this.loginButton.click();
    }

    async verifyValidationMessages(messages: string[]): Promise<void> {
        for (const message of messages) {
            await this.page.getByTestId('login-form').getByText(message, { exact: false }).waitFor({ state: 'visible' });
        }
    }

    async verifyInvalidCredentials(username: string, password: string, errorMessage: string): Promise<void> {
        await this.enterloginDetails(username, password);
        await this.clickLoginButton();
        await this.page.getByTestId('form-error-summary').getByText(errorMessage, { exact: false }).waitFor({ state: 'visible' });
        await this.page.getByTestId('login-form').getByText(errorMessage, { exact: false }).waitFor({ state: 'visible' });
    }

}