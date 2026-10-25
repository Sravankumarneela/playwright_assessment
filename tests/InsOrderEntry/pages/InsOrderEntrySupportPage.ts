import { expect, Page } from "playwright/test";
import { Logger } from "winston";
import data from "../testdata/InsOrderEntrydata.json";

export class InsOrderEntrySupportPage {
    constructor(private readonly page: Page, private readonly logger: Logger) {
        this.logger.info("Initialized support page object");
    }

    async openFromNavigation(): Promise<void> {
        this.logger.info("Opening support page from navigation");
        await this.page.getByTestId(data.support.testIds.navigationLink).click();
    }

    async expectSupportForm(): Promise<void> {
        this.logger.info("Checking support form content");
        await expect(this.page.getByRole("heading", { name: data.support.formHeading })).toBeVisible();

        const form = this.page.getByTestId(data.support.testIds.form);
        await expect(form.locator("div").filter({ hasText: data.support.labels.subject })).toBeVisible();
        await expect(form.locator("div").filter({ hasText: data.support.labels.message })).toBeVisible();
        await expect(this.page.getByTestId(data.support.testIds.subjectInput)).toBeVisible();
        await expect(this.page.getByTestId(data.support.testIds.messageInput)).toBeVisible();
        await expect(this.page.getByTestId(data.support.testIds.submitButton)).toBeVisible();
    }

    async submitConfiguredRequest(): Promise<void> {
        this.logger.info("Submitting configured support request");
        await this.page.getByTestId(data.support.testIds.subjectInput).fill(data.support.request.subject);
        await this.page.getByTestId(data.support.testIds.messageInput).fill(data.support.request.message);
        await this.page.getByTestId(data.support.testIds.submitButton).click();
    }

    async expectRequestConfirmation(): Promise<void> {
        this.logger.info("Checking support request confirmation");
        await expect(this.page.getByRole("heading", { name: data.support.confirmation.heading })).toBeVisible();
        await expect(this.page.getByText(data.support.confirmation.message)).toBeVisible();
        await expect(this.page.getByTestId(data.support.testIds.confirmationDashboardLink)).toBeVisible();
    }
}