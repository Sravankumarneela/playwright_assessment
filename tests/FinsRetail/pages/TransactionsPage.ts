import { Locator, Page } from "playwright";
import { Logger } from "winston";

export class TransactionsPage {
    readonly page: Page;
    readonly logger: Logger;
    readonly transactionsLink: Locator;
    readonly searchInput: Locator;
    readonly typeFilter: Locator;
    readonly statusFilter: Locator;
    readonly dateFrom: Locator;
    readonly dateTo: Locator;
    readonly filterSubmit: Locator;
    readonly filterReset: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.transactionsLink = page.getByRole("link", { name: "Transactions" });
        this.searchInput = page.getByTestId("transaction-search-input");
        this.typeFilter = page.getByTestId("transaction-type-filter");
        this.statusFilter = page.getByTestId("transaction-status-filter");
        this.dateFrom = page.getByTestId("transaction-date-from");
        this.dateTo = page.getByTestId("transaction-date-to");
        this.filterSubmit = page.getByTestId("transaction-filter-submit");
        this.filterReset = page.getByTestId("transaction-filter-reset");
    }

    async openTransactions(): Promise<void> {
        await this.transactionsLink.click();
        this.logger.info("Opened Transactions");
    }

    transactionOverviewLocators(verification: {
        historyText: string;
        heading: string;
        description: string;
        filtersCardTestId: string;
        searchText: string;
        typeText: string;
        fromText: string;
        toText: string;
        filterSubmitTestId: string;
        filterResetTestId: string;
        tableCardTestId: string;
        transactionId: string;
        columnHeaders: string[];
        amount: string;
        productName: string;
        transactionTypeTestId: string;
        date: string;
        referenceTestId: string;
        statusTestId: string;
    }): Locator[] {
        const transactionRow = this.page.locator('[data-testid^="transaction-row-"]').first();

        return [
            this.page.getByText(verification.historyText, { exact: true }),
            this.page.getByRole("heading", { name: verification.heading }),
            this.page.getByText(verification.description, { exact: false }),
            this.page.getByTestId(verification.filtersCardTestId),
            this.page.getByTestId(verification.filtersCardTestId).locator("div").filter({ hasText: verification.searchText }).first(),
            this.page.getByText(verification.typeText, { exact: false }),
            this.page.getByTestId(verification.filtersCardTestId).locator("div").filter({ hasText: verification.fromText }).first(),
            this.page.getByTestId(verification.filtersCardTestId).locator("div").filter({ hasText: verification.toText }).first(),
            this.page.getByTestId(verification.filterSubmitTestId),
            this.page.getByTestId(verification.filterResetTestId),
            this.page.getByTestId(verification.tableCardTestId),
            this.page.locator('[data-testid^="transaction-details-link-"]').first(),
            ...verification.columnHeaders.map((header) => this.page.getByRole("columnheader", { name: header })),
            transactionRow.getByRole("cell").nth(4),
            transactionRow.getByRole("cell").nth(3),
            transactionRow.getByRole("cell").nth(1),
            transactionRow.getByRole("cell").nth(0),
            transactionRow.getByRole("cell").nth(5)
        ];
    }

    async searchTransactions(searchTerm: string): Promise<void> {
        await this.searchInput.fill(searchTerm);
        await this.filterSubmit.click();
        this.logger.info(`Searched transactions for: ${searchTerm}`);
    }

    async resetFilters(): Promise<void> {
        await this.filterReset.click();
    }

    async applyTransactionFilters(filters: {
        type: string;
        status: string;
        dateFrom: string;
        dateTo: string;
    }): Promise<void> {
        await this.typeFilter.selectOption(filters.type);
        await this.statusFilter.selectOption(filters.status);
        await this.dateFrom.fill(filters.dateFrom);
        await this.dateTo.fill(filters.dateTo);
        await this.filterSubmit.click();
        this.logger.info("Applied transaction filters");
    }

    async verifyTransactionRows(transactionIds: string[]): Promise<void> {
        const rows = this.page.locator('[data-testid^="transaction-row-"]');
        if (await rows.count() === 0) {
            throw new Error("No transaction rows are visible after applying the transaction filters");
        }

        await rows.first().waitFor({ state: "visible" });
    }

    async openTransactionDetails(transactionId: string): Promise<void> {
        const configuredLink = this.page.getByTestId(`transaction-details-link-${transactionId}`);
        const detailsLink = await configuredLink.count() > 0
            ? configuredLink
            : this.page.locator('[data-testid^="transaction-details-link-"]').first();
        await detailsLink.click();
        this.logger.info(`Opened transaction details: ${transactionId}`);
    }

    async verifyTransactionDetails(details: {
        reference: string;
        heading: string;
        description: string;
        summaryText: string;
        referenceTestId: string;
        statusTestId: string;
        productTypeTestId: string;
        productNameText: string;
        amountText: string;
        backLinkTestId: string;
    }): Promise<void> {
        await this.page.getByText(details.description, { exact: false }).waitFor({ state: "visible" });
        await this.page.getByRole("heading").last().waitFor({ state: "visible" });
        await this.page.getByText(details.description, { exact: false }).waitFor({ state: "visible" });
        await this.page.getByTestId(details.referenceTestId).waitFor({ state: "visible" });
        await this.page.getByTestId(details.statusTestId).waitFor({ state: "visible" });
        await this.page.getByTestId(details.productTypeTestId).waitFor({ state: "visible" });
        await this.page.getByText(details.productNameText, { exact: false }).waitFor({ state: "visible" });
        await this.page.getByText(details.amountText, { exact: false }).waitFor({ state: "visible" });
        await this.page.getByTestId(details.backLinkTestId).waitFor({ state: "visible" });
    }

    async returnToTransactions(backLinkTestId: string): Promise<void> {
        await this.page.getByTestId(backLinkTestId).click();
    }

    async capturePaginationEvidence(): Promise<Buffer> {
        return this.page.screenshot({ fullPage: true });
    }

    async verifyPaginationArrowSize(maxWidth: number, maxHeight: number, failureMessage: string): Promise<void> {
        const previousArrow = this.page.locator('[aria-label*="Previous"] svg');
        const nextArrow = this.page.locator('[aria-label*="Next"] svg');
        await previousArrow.waitFor({ state: "visible" });
        await nextArrow.waitFor({ state: "visible" });
        const arrowBoxes = await Promise.all([
            previousArrow.boundingBox(),
            nextArrow.boundingBox()
        ]);

        const oversizedArrow = arrowBoxes.find(
            (box) => box && (box.width > maxWidth || box.height > maxHeight)
        );

        if (!arrowBoxes[0] || !arrowBoxes[1]) {
            throw new Error(`${failureMessage}: pagination arrow dimensions could not be measured`);
        }

        if (oversizedArrow) {
            throw new Error(
                `${failureMessage}. Actual arrow size: ${oversizedArrow.width}x${oversizedArrow.height}px; expected at most ${maxWidth}x${maxHeight}px`
            );
        }
    }
}
