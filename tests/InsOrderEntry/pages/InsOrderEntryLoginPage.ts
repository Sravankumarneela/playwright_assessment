import { expect, Page } from "playwright/test";
import data from "../testdata/InsOrderEntrydata.json";

export class InsOrderEntryLoginPage {
    constructor(private readonly page: Page) {}

    async open(): Promise<void> {
        await this.page.goto(new URL(data.loginPath, data.applicationUrl).toString());
    }

    async enterCredentials(): Promise<void> {
        const emailInput = this.page.getByTestId(data.loginPage.testIds.emailInput);
        const passwordInput = this.page.getByTestId(data.loginPage.testIds.passwordInput);

        await emailInput.click();
        await emailInput.fill(data.credentials.email);
        await passwordInput.click();
        await passwordInput.fill(data.credentials.password);
    }

    async expectLoginForm(): Promise<void> {
        await expect(this.page.getByRole("heading", { name: data.loginPage.heading })).toBeVisible();
        await expect(this.page.getByText(data.loginPage.emailLabel)).toBeVisible();
        await expect(this.page.getByText(data.loginPage.passwordLabel, { exact: true })).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.submitButton)).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.forgotPasswordLink)).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.agentRegistrationLink)).toBeVisible();
    }

    async submitLogin(): Promise<void> {
        await this.page.getByTestId(data.loginPage.testIds.submitButton).click();
    }

    async clickNavigationBrand(): Promise<void> {
        await this.page.getByTestId(data.loginPage.testIds.navigationBrand).click();
    }

    async expectAuthenticatedNavigation(): Promise<void> {
        await expect(this.page.getByTestId(data.loginPage.testIds.navigationBrand)).toBeVisible();
        await expect(this.page.getByTestId(data.loginPage.testIds.navigationLogoutButton)).toBeVisible();
    }

    async clickLogout(): Promise<void> {
        await this.page.getByTestId(data.loginPage.testIds.navigationLogoutButton).click();
    }

    async expectLoginFormAfterLogout(): Promise<void> {
        const emailLabel = this.page.getByTestId(data.loginPage.testIds.loginForm)
            .locator("div")
            .filter({ hasText: data.loginPage.emailLabel });
        await expect(emailLabel).toBeVisible();
    }

    async submitInvalidCredentials(): Promise<void> {
        const emailInput = this.page.getByTestId(data.loginPage.testIds.emailInput);
        const passwordInput = this.page.getByTestId(data.loginPage.testIds.passwordInput);

        await emailInput.click();
        await emailInput.fill(data.invalidCredentials.email);
        await emailInput.press("Tab");
        await passwordInput.fill(data.invalidCredentials.password);
        await this.submitLogin();
    }

    async expectInvalidCredentialsMessage(): Promise<void> {
        await expect(this.page.getByText(data.loginPage.messages.invalidCredentials)).toBeVisible();
    }

    async openForgotPassword(): Promise<void> {
        await this.page.getByTestId(data.loginPage.testIds.forgotPasswordLink).click();
    }

    async expectForgotPasswordPrompt(): Promise<void> {
        await expect(this.page.getByText(data.forgotPassword.prompt)).toBeVisible();
    }

    async submitConfiguredPasswordResetRequest(): Promise<void> {
        await this.page.getByTestId(data.forgotPassword.testIds.emailInput).fill(data.credentials.email);
        await this.page.getByTestId(data.forgotPassword.testIds.submitButton).click();
    }

    async expectPasswordResetStatusAndOtpPrompt(): Promise<void> {
        await expect(this.page.getByTestId(data.forgotPassword.testIds.statusAlert)).toBeVisible();
        await expect(this.page.getByText(data.forgotPassword.otpPrompt)).toBeVisible();
    }

    async openRegistration(): Promise<void> {
        await this.page.getByTestId(data.loginPage.testIds.agentRegistrationLink).click();
    }

    async expectLogoutButtonNotVisible(): Promise<void> {
        await expect(this.page.getByTestId(data.loginPage.testIds.navigationLogoutButton)).toBeHidden();
    }

    async requestPasswordResetOtp(): Promise<void> {
        await this.openForgotPassword();
        await this.page.getByTestId(data.forgotPassword.testIds.emailInput).fill(data.forgotPassword.otpRequestEmail);
        await this.page.getByTestId(data.forgotPassword.testIds.submitButton).click();
    }

    async expectPasswordResetOtpConfirmation(): Promise<void> {
        await expect(this.page.getByText(data.forgotPassword.messages.otpConfirmation)).toBeVisible();
    }
}