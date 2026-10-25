import { expect, Page } from "playwright/test";
import { Logger } from "winston";
import data from "../testdata/InsOrderEntrydata.json";

export class InsOrderEntryDashboardPage {
    constructor(private readonly page: Page, private readonly logger: Logger) {
        this.logger.info("Initialized dashboard page object");
    }

    async openDashboard(): Promise<void> {
        this.logger.info("Opening the Dashboard page");
        await this.page.getByTestId(data.dashboard.testIds.navigationLink).click();
    }

    async expectDashboard(): Promise<void> {
        this.logger.info("Checking dashboard content and recent applications");
        const text = data.dashboard.text;
        const testIds = data.dashboard.testIds;

        await expect(this.page.getByRole("heading", { name: text.heading })).toBeVisible();
        await expect(this.page.getByTestId(testIds.newApplicationButton)).toBeVisible();
        await expect(this.page.getByText(text.description)).toBeVisible();

        for (const statusLabel of text.statusLabels) {
            const statusCard = this.page.getByText(statusLabel, { exact: true }).locator("..");
            await expect(statusCard).toBeVisible();
            await expect(statusCard).toHaveText(/\d+/);
        }

        await expect(this.page.getByRole("heading", { name: text.recentApplicationsHeading })).toBeVisible();
        await expect(this.page.getByTestId(testIds.viewAllApplicationsLink)).toBeVisible();

        const applicationId = await this.getFirstRecentApplicationId();
        const applicationRow = this.page.getByTestId(`${testIds.applicationRowPrefix}${applicationId}`);
        await expect(applicationRow.getByRole("cell").first()).toBeVisible();
        await expect(this.page.getByTestId(`${testIds.applicationOpenPrefix}${applicationId}`)).toBeVisible();
        await expect(this.page.getByRole("columnheader", { name: text.statusColumn })).toBeVisible();
        await expect(this.page.getByTestId(`${testIds.applicationStatusPrefix}${applicationId}`)).toBeVisible();
    }

    async openExistingApplication(): Promise<void> {
        this.logger.info("Opening an existing application from the dashboard");
        const applicationId = await this.getFirstRecentApplicationId();
        await this.page.getByTestId(
            `${data.dashboard.testIds.applicationOpenPrefix}${applicationId}`
        ).click();
    }

    async expectApplicationSummary(): Promise<void> {
        this.logger.info("Checking the existing application summary");
        await expect(this.page.getByRole("heading", {
            name: data.dashboard.text.applicationSummaryHeading
        })).toBeVisible();
    }

    private async getFirstRecentApplicationId(): Promise<string> {
        const rowPrefix = data.dashboard.testIds.applicationRowPrefix;
        const firstRow = this.page.locator(`[data-testid^="${rowPrefix}"]`).first();
        await expect(firstRow).toBeVisible();

        const rowTestId = await firstRow.getAttribute("data-testid");
        if (!rowTestId?.startsWith(rowPrefix)) {
            throw new Error("The first recent application row does not expose its configured test ID.");
        }

        return rowTestId.slice(rowPrefix.length);
    }
}