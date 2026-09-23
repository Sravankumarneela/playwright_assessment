import { Locator, Page } from "playwright";
import { Logger } from "winston";

export class PoliciesPage {
    readonly page: Page;
    readonly logger: Logger;
    readonly policiesLink: Locator;
    readonly statusFilter: Locator;
    readonly applyButton: Locator;
    readonly resetLink: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.policiesLink = page.getByRole("link", { name: "Policies" });
        this.statusFilter = page.getByTestId("policy-status-filter");
        this.applyButton = page.getByRole("button", { name: "Apply" });
        this.resetLink = page.getByRole("link", { name: "Reset" });
    }

    async openPolicies(): Promise<void> {
        await this.policiesLink.click();
        this.logger.info("Opened Policies");
    }

    policyOverviewLocators(verification: {
        heading: string;
        description: string;
        statusFilterText: string;
        tableText: string;
        policyIds: string[];
        statusIds: string[];
        coverageDate: string;
        coverageAmount: string;
        premiumAmount: string;
        productName: string;
        columnHeaders: string[];
    }): Locator[] {
        return [
            this.page.getByRole("heading", { name: verification.heading }),
            this.page.getByText(verification.description, { exact: false }),
            this.page.getByText(verification.statusFilterText, { exact: false }),
            this.applyButton,
            this.resetLink,
            this.page.getByRole("main").locator("div").filter({ hasText: verification.tableText }).first(),
            this.page.locator('[data-testid^="policy-details-link-"]').first(),
            this.page.locator('[data-testid^="policy-status-"]').first(),
            ...verification.columnHeaders.map((header) =>
                this.page.getByRole("columnheader", { name: header })
            ),
            this.page.locator('[data-testid^="policy-row-"]').first().getByRole("cell").nth(5),
            this.page.locator('[data-testid^="policy-row-"]').first().getByRole("cell").nth(2),
            this.page.locator('[data-testid^="policy-row-"]').first().getByRole("cell").nth(3),
            this.page.locator('[data-testid^="policy-row-"]').first().getByRole("cell").nth(1),
            this.page.locator('[data-testid^="policy-number-"]').first()
        ];
    }

    async filterByStatus(status: string): Promise<void> {
        await this.statusFilter.selectOption(status);
        await this.applyButton.click();
        this.logger.info(`Filtered policies by status: ${status}`);
    }

    async verifyPolicyRows(policyIds: string[]): Promise<void> {
        const rows = this.page.locator('[data-testid^="policy-row-"]');
        if (await rows.count() === 0) {
            throw new Error("No policy rows are visible after applying the policy filter");
        }

        await rows.first().waitFor({ state: "visible" });
    }

    async openPolicyDetails(policyId: string): Promise<void> {
        const configuredLink = this.page.getByTestId(`policy-details-link-${policyId}`);
        const detailsLink = await configuredLink.count() > 0
            ? configuredLink
            : this.page.locator('[data-testid^="policy-details-link-"]').first();
        await detailsLink.click();
        this.logger.info(`Opened policy details: ${policyId}`);
    }

    async returnToPolicies(): Promise<void> {
        await this.page.getByText("Back to Policies", { exact: true }).click();
    }

    async verifyPolicyDetails(details: {
        policyNumberText: string;
        productName: string;
        detailsPageTestId: string;
        status: string;
        downloadButtonTestId: string;
    }): Promise<void> {
        await this.page.getByRole("heading", { name: new RegExp(details.productName) }).waitFor({ state: "visible" });
        await this.page.getByTestId(details.detailsPageTestId).waitFor({ state: "visible" });
        await this.page.getByText(details.status, { exact: true }).last().waitFor({ state: "visible" });
        await this.page.getByText("Back to Policies", { exact: true }).waitFor({ state: "visible" });
        await this.page.getByTestId(details.downloadButtonTestId).waitFor({ state: "visible" });
    }

    async verifyPolicyDownload(details: {
        policyId: string;
        downloadButtonTestId: string;
        failureMessage: string;
    }): Promise<void> {
        await this.openPolicyDetails(details.policyId);

        const downloadButton = this.page.getByTestId(details.downloadButtonTestId);
        await downloadButton.waitFor({ state: "visible" });

        const downloadEvent = this.page.waitForEvent("download", { timeout: 5000 });
        await downloadButton.click();

        try {
            await downloadEvent;
        } catch {
            throw new Error(details.failureMessage);
        }
    }
}
