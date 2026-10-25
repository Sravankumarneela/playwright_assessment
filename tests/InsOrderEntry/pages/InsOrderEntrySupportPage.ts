import { expect, Page } from "playwright/test";
import data from "../testdata/InsOrderEntrydata.json";

export class InsOrderEntrySupportPage {
    constructor(private readonly page: Page) {}

    async openFromNavigation(): Promise<void> {
        await this.page.getByTestId(data.support.testIds.navigationLink).click();
    }

    async expectSupportForm(): Promise<void> {
        await expect(this.page.getByRole("heading", { name: data.support.formHeading })).toBeVisible();

        const form = this.page.getByTestId(data.support.testIds.form);
        await expect(form.locator("div").filter({ hasText: data.support.labels.subject })).toBeVisible();
        await expect(form.locator("div").filter({ hasText: data.support.labels.message })).toBeVisible();
    }

    async submitConfiguredRequest(): Promise<void> {
        await this.page.getByTestId(data.support.testIds.subjectInput).fill(data.support.request.subject);
        await this.page.getByTestId(data.support.testIds.messageInput).fill(data.support.request.message);
        await this.page.getByTestId(data.support.testIds.submitButton).click();
    }

    async expectRequestConfirmation(): Promise<void> {
        await expect(this.page.getByRole("heading", { name: data.support.confirmation.heading })).toBeVisible();
        await expect(this.page.getByText(data.support.confirmation.message)).toBeVisible();
        await expect(this.page.getByTestId(data.support.testIds.confirmationDashboardLink)).toBeVisible();
    }
}