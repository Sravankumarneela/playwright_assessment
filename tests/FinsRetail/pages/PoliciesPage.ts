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
            ...verification.policyIds.map((policyId) => this.page.getByTestId(`policy-details-link-${policyId}`)),
            ...verification.statusIds.map((policyId) => this.page.getByTestId(`policy-status-${policyId}`)),
            ...verification.columnHeaders.map((header) =>
                this.page.getByRole("columnheader", { name: header })
            ),
            this.page.getByTestId(`policy-row-${verification.policyIds[0]}`).getByRole("cell", { name: verification.coverageDate }),
            this.page.getByTestId(`policy-row-${verification.policyIds[0]}`).getByRole("cell", { name: verification.coverageAmount }),
            this.page.getByTestId(`policy-row-${verification.policyIds[0]}`).getByRole("cell", { name: verification.premiumAmount }),
            this.page.getByTestId(`policy-row-${verification.policyIds[0]}`).getByRole("cell", { name: verification.productName }),
            this.page.getByTestId(`policy-number-${verification.policyIds[0]}`)
        ];
    }

    async filterByStatus(status: string): Promise<void> {
        await this.statusFilter.selectOption(status);
        await this.applyButton.click();
        this.logger.info(`Filtered policies by status: ${status}`);
    }

    async verifyPolicyRows(policyIds: string[]): Promise<void> {
        for (const policyId of policyIds) {
            await this.page.getByTestId(`policy-row-${policyId}`).waitFor({ state: "visible" });
        }
    }

    async openPolicyDetails(policyId: string): Promise<void> {
        await this.page.getByTestId(`policy-details-link-${policyId}`).click();
        this.logger.info(`Opened policy details: ${policyId}`);
    }

    async returnToPolicies(): Promise<void> {
        await this.page.getByRole("link", { name: "Back to Policies" }).click();
    }

    async verifyPolicyDetails(details: {
        policyNumberText: string;
        productName: string;
        detailsPageTestId: string;
        status: string;
        downloadButtonTestId: string;
    }): Promise<void> {
        await this.page.getByText(details.policyNumberText, { exact: false }).waitFor({ state: "visible" });
        await this.page.getByRole("heading", { name: details.productName }).waitFor({ state: "visible" });
        await this.page.getByTestId(details.detailsPageTestId).waitFor({ state: "visible" });
        await this.page.getByRole("definition").filter({ hasText: details.status }).waitFor({ state: "visible" });
        await this.page.getByRole("link", { name: "Back to Policies" }).waitFor({ state: "visible" });
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
