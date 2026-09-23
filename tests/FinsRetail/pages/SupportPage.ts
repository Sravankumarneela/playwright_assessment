import { Locator, Page } from "playwright";
import { Logger } from "winston";

export class SupportPage {
    readonly page: Page;
    readonly logger: Logger;
    readonly supportLink: Locator;
    readonly categorySelect: Locator;
    readonly messageInput: Locator;
    readonly submitButton: Locator;
    readonly cancelLink: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.supportLink = page.getByRole("link", { name: "Support" });
        this.categorySelect = page.getByTestId("support-category-select");
        this.messageInput = page.getByTestId("support-message-input");
        this.submitButton = page.getByTestId("support-submit-button");
        this.cancelLink = page.getByTestId("support-cancel-link");
    }

    async openSupport(): Promise<void> {
        await this.supportLink.click();
        this.logger.info("Opened Customer Support");
    }

    supportOverviewLocators(verification: {
        customerSupportText: string;
        heading: string;
        description: string;
        categoryText: string;
        messageLabel: string;
    }): Locator[] {
        return [
            this.page.getByText(verification.customerSupportText, { exact: true }),
            this.page.getByRole("heading", { name: verification.heading }),
            this.page.getByText(verification.description, { exact: false }),
            this.page.getByText(verification.categoryText, { exact: false }),
            this.messageInput,
            this.page.getByText(verification.messageLabel, { exact: true }),
            this.submitButton,
            this.cancelLink
        ];
    }

    async submitSupportRequest(category: string, message: string): Promise<void> {
        await this.categorySelect.selectOption(category);
        await this.messageInput.fill(message);
        await this.submitButton.click();
        this.logger.info(`Submitted support request for category: ${category}`);
    }

    async verifyMessageValidationError(errorText: string): Promise<void> {
        const messageError = this.page.getByTestId("support-message-error");
        await messageError.waitFor({ state: "visible" });

        const actualError = await messageError.innerText();
        if (!actualError.includes(errorText)) {
            throw new Error(`Expected support message error to contain "${errorText}", but received "${actualError}"`);
        }
    }

    async verifySupportConfirmation(confirmation: {
        heading: string;
        messageTestId: string;
        statusText: string;
        raiseAnotherTestId: string;
        dashboardTestId: string;
    }): Promise<void> {
        await this.page.getByRole("heading", { name: confirmation.heading }).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.messageTestId).getByText(confirmation.statusText, { exact: false }).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.raiseAnotherTestId).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.dashboardTestId).waitFor({ state: "visible" });
    }

    async raiseAnotherSupportRequest(testId: string): Promise<void> {
        await this.page.getByTestId(testId).click();
        await this.heading.waitFor({ state: "visible" });
    }

    private get heading(): Locator {
        return this.page.getByRole("heading", { name: "Raise Support Request" });
    }
}
