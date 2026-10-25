import { expect, Page } from "playwright/test";
import { Logger } from "winston";
import data from "../testdata/InsOrderEntrydata.json";

export class InsOrderEntryLoginPage {
    constructor(private readonly page: Page, private readonly logger: Logger) {
        this.logger.info("Initialized login page object");
    }

    async open(): Promise<void> {
        this.logger.info("Opening the InsOrderEntry login page");
        await this.page.goto(new URL(data.loginPath, data.applicationUrl).toString());
    }

    async enterCredentials(): Promise<void> {
        this.logger.info("Entering configured login credentials");
        const emailInput = this.page.getByTestId(data.loginPage.testIds.emailInput);
        const passwordInput = this.page.getByTestId(data.loginPage.testIds.passwordInput);

        await emailInput.click();
        await emailInput.fill(data.credentials.email);
        await passwordInput.click();
        await passwordInput.fill(data.credentials.password);
    }

    async expectLoginForm(): Promise<void> {
        this.logger.info("Checking configured login form content");
        await expect(this.page.getByRole("heading", { name: data.loginPage.heading })).toBeVisible();
        await expect(this.page.getByText(data.loginPage.emailLabel)).toBeVisible();
        await expect(this.page.getByText(data.loginPage.passwordLabel, { exact: true })).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.submitButton)).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.forgotPasswordLink)).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.agentRegistrationLink)).toBeVisible();
    }

    async submitLogin(): Promise<void> {
        this.logger.info("Submitting the login form");
        await this.page.getByTestId(data.loginPage.testIds.submitButton).click();
    }

    async clickNavigationBrand(): Promise<void> {
        this.logger.info("Clicking the navigation brand");
        await this.page.getByTestId(data.loginPage.testIds.navigationBrand).click();
    }

    async expectAuthenticatedNavigation(): Promise<void> {
        this.logger.info("Checking authenticated navigation");
        await expect(this.page.getByTestId(data.loginPage.testIds.navigationBrand)).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.navigationLogoutButton)).toBeVisible();
    }

    async clickLogout(): Promise<void> {
        this.logger.info("Clicking the logout button");
        await this.page.getByTestId(data.loginPage.testIds.navigationLogoutButton).click();
    }

    async expectLoginFormAfterLogout(): Promise<void> {
        this.logger.info("Checking login form after logout");
        const emailLabel = this.page.getByTestId(data.loginPage.testIds.loginForm)
            .locator("div")
            .filter({ hasText: data.loginPage.emailLabel });
        await expect(emailLabel).toBeVisible();
    }

    async submitInvalidCredentials(): Promise<void> {
        this.logger.info("Submitting invalid configured credentials");
        const emailInput = this.page.getByTestId(data.loginPage.testIds.emailInput);
        const passwordInput = this.page.getByTestId(data.loginPage.testIds.passwordInput);

        await emailInput.click();
        await emailInput.fill(data.invalidCredentials.email);
        await emailInput.press("Tab");
        await passwordInput.fill(data.invalidCredentials.password);
        await this.submitLogin();
    }

    async expectInvalidCredentialsMessage(): Promise<void> {
        this.logger.info("Checking invalid credentials message");
        await expect(this.page.getByText(data.loginPage.messages.invalidCredentials)).toBeVisible();
    }

    async openForgotPassword(): Promise<void> {
        this.logger.info("Opening the forgot password page");
        await this.page.getByTestId(data.loginPage.testIds.forgotPasswordLink).click();
    }

    async expectForgotPasswordPrompt(): Promise<void> {
        this.logger.info("Checking forgot password prompt");
        await expect(this.page.getByText(data.forgotPassword.prompt)).toBeVisible();
    }

    async submitConfiguredPasswordResetRequest(): Promise<void> {
        this.logger.info("Submitting configured password reset request");
        await this.page.getByTestId(data.forgotPassword.testIds.emailInput).fill(data.credentials.email);
        await this.page.getByTestId(data.forgotPassword.testIds.submitButton).click();
    }

    async expectPasswordResetStatusAndOtpPrompt(): Promise<void> {
        this.logger.info("Checking password reset status and OTP prompt");
        await expect(this.page.getByTestId(data.forgotPassword.testIds.statusAlert)).toBeVisible();
        await expect(this.page.getByText(data.forgotPassword.otpPrompt)).toBeVisible();
    }

    async openRegistration(): Promise<void> {
        this.logger.info("Opening the registration page");
        await this.page.getByTestId(data.loginPage.testIds.agentRegistrationLink).click();
    }

    async expectLogoutButtonNotVisible(): Promise<void> {
        this.logger.info("Checking that the logout button is hidden");
        await expect(this.page.getByTestId(data.loginPage.testIds.navigationLogoutButton)).toBeHidden();
    }

    async requestPasswordResetOtp(): Promise<void> {
        this.logger.info("Requesting password reset OTP with configured test email");
        await this.openForgotPassword();
        await this.page.getByTestId(data.forgotPassword.testIds.emailInput).fill(data.forgotPassword.otpRequestEmail);
        await this.page.getByTestId(data.forgotPassword.testIds.submitButton).click();
    }

    async expectPasswordResetOtpConfirmation(): Promise<void> {
        this.logger.info("Checking password reset OTP confirmation");
        await expect(this.page.getByText(data.forgotPassword.messages.otpConfirmation)).toBeVisible();
    }
}