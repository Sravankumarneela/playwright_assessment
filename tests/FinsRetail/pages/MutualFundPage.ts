import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { Logger } from "winston";

export class MutualFundPage {
    readonly page: Page;
    readonly logger: Logger;
    readonly mutualFundsLink: Locator;
    readonly fundRiskFilter: Locator;
    readonly fundSortSelect: Locator;
    readonly fundFilterSubmit: Locator;
    readonly fundDetailsLink: Locator;
    readonly minimumSip: Locator;
    readonly investNowButton: Locator;
    readonly fundCode: Locator;
    readonly category: Locator;
    readonly currentNav: Locator;
    readonly yearReturn: Locator;
    readonly investmentTypeSip: Locator;
    readonly investmentTypeLumpSum: Locator;
    readonly investmentAmount: Locator;
    readonly paymentMethod: Locator;
    readonly investmentDeclaration: Locator;
    readonly confirmInvestmentButton: Locator;
    readonly investmentOrderPlaced: Locator;
    readonly orderNumber: Locator;
    readonly fundName: Locator;
    readonly transactionLabel: Locator;
    readonly transactionNumber: Locator;
    readonly amount: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.mutualFundsLink = page.getByRole("link", { name: "Mutual Funds" });
        this.fundRiskFilter = page.getByTestId("fund-risk-filter");
        this.fundSortSelect = page.getByTestId("fund-sort-select");
        this.fundFilterSubmit = page.getByTestId("fund-filter-submit");
        this.fundDetailsLink = page.getByTestId("fund-details-link-FSLIQ009");
        this.minimumSip = page.getByText("Minimum SIP:", { exact: false });
        this.investNowButton = page.getByTestId("invest-now-button");
        this.fundCode = page.getByText("Fund Code", { exact: true });
        this.category = page.getByText("Category", { exact: true });
        this.currentNav = page.getByText("Current NAV", { exact: true });
        this.yearReturn = page.getByText("1 Year Return", { exact: true });
        this.investmentTypeSip = page.getByTestId("investment-type-sip");
        this.investmentTypeLumpSum = page.getByTestId("investment-type-lumpsum");
        this.investmentAmount = page.getByTestId("investment-amount-input");
        this.paymentMethod = page.getByTestId("payment-method-select");
        this.investmentDeclaration = page.getByTestId("investment-declaration-checkbox");
        this.confirmInvestmentButton = page.getByTestId("confirm-investment-button");
        this.investmentOrderPlaced = page.getByRole("heading", { name: "Investment order placed" });
        this.orderNumber = page.getByText(/^Order: INV-/);
        this.fundName = page.getByText("Fund: FinServe Liquid Fund", { exact: true });
        this.transactionLabel = page.getByText("Transaction:", { exact: true });
        this.transactionNumber = page.getByText(/^Transaction: TXN-/);
        this.amount = page.getByText(/^Amount: ₹/);
    }

    async navigateToLoginPage(url: string): Promise<void> {
        await this.page.goto(url);
        this.logger.info(`Navigated to login page: ${url}`);
    }

    async openMutualFunds(linkName: string): Promise<void> {
        await this.page.getByRole("link", { name: linkName }).click();
        this.logger.info("Opened Mutual Funds");
    }

    mutualFundsOverviewLocators(validation: {
        pageTestId: string;
        pageLabel: string;
        exploreHeading: string;
        sectionSelector: string;
        fundCardIds: string[];
        featuredFundId: string;
        featuredFundName: string;
        navLabel: string;
        detailsLinkId: string;
    }): Locator[] {
        const fundCardLocators = validation.fundCardIds.map((fundId) =>
            this.page.getByTestId(`fund-card-${fundId}`)
        );

        return [
            this.page.getByTestId(validation.pageTestId).getByText(validation.pageLabel, { exact: true }),
            this.page.getByRole("heading", { name: validation.exploreHeading }),
            this.page.locator(validation.sectionSelector),
            ...fundCardLocators,
            this.page.getByRole("heading", { name: validation.featuredFundName }),
            this.page
                .getByTestId(`fund-card-${validation.featuredFundId}`)
                .getByText(validation.navLabel, { exact: false }),
            this.page.getByTestId(`fund-details-link-${validation.detailsLinkId}`)
        ];
    }

    async filterFundsByRisk(risk: string = "Low"): Promise<void> {
        await this.fundRiskFilter.selectOption(risk);
        await this.fundFilterSubmit.click();
        this.logger.info(`Filtered funds by risk: ${risk}`);
    }

    async recordOneYearReturns(): Promise<number[]> {
        const returnLocators = this.page.locator('[data-testid^="fund-return-"]');
        const actualFundCount = await returnLocators.count();

        const returns = [];

        for (let index = 0; index < actualFundCount; index++) {
            const returnText = await returnLocators.nth(index).innerText();
            const returnValue = Number.parseFloat(returnText.replace(/[^\d.-]/g, ""));

            if (Number.isNaN(returnValue)) {
                throw new Error(`Unable to read one-year return at position ${index + 1}: ${returnText}`);
            }

            returns.push(returnValue);
        }

        return returns;
    }

    async verifyFundsOrderedByOneYearReturn(unsortedReturns: number[]): Promise<void> {
        const sortedReturns = await this.recordOneYearReturns();
        const expectedReturns = [...unsortedReturns].sort((first, second) => second - first);

        expect(sortedReturns).toEqual(expectedReturns);
    }

    async sortFunds(sortOption: string): Promise<void> {
        await this.fundSortSelect.selectOption(sortOption);
        await this.fundFilterSubmit.click();
        this.logger.info(`Sorted mutual funds using option: ${sortOption}`);
    }

    async openFundDetails(fundCode: string): Promise<void> {
        if (fundCode !== "FSLIQ009") {
            throw new Error(`Unsupported fund code: ${fundCode}`);
        }

        await this.fundDetailsLink.click();
        await this.minimumSip.click();
        this.logger.info("Opened FSLIQ009 fund details");
    }

    async startInvestment(): Promise<void> {
        await this.investNowButton.click();
        this.logger.info("Started fund investment");
    }

    async verifyFundDetails(): Promise<void> {
        await this.fundCode.waitFor({ state: "visible" });
        await this.category.waitFor({ state: "visible" });
        await this.currentNav.waitFor({ state: "visible" });
        await this.yearReturn.waitFor({ state: "visible" });
        this.logger.info("Verified fund details");
    }

    async enterSipInvestment(amount: string = "500"): Promise<void> {
        await this.investmentTypeSip.check();
        await this.investmentAmount.fill(amount);
        this.logger.info(`Entered SIP investment amount: ${amount}`);
    }

    async enterLumpSumInvestment(amount: string = "100000"): Promise<void> {
        await this.investmentTypeLumpSum.check();
        await this.investmentAmount.fill(amount);
        this.logger.info(`Entered lump-sum investment amount: ${amount}`);
    }

    async selectPaymentMethod(paymentMethod: string = "UPI"): Promise<void> {
        await this.paymentMethod.selectOption(paymentMethod);
        await this.investmentDeclaration.check();
    }

    async confirmInvestment(): Promise<void> {
        await this.confirmInvestmentButton.click();
        this.logger.info("Confirmed investment");
    }

    async verifyInvestmentOrder(): Promise<void> {
        await this.investmentOrderPlaced.click();
        await this.orderNumber.click();
        await this.fundName.click();
        await this.transactionLabel.click();
        await this.transactionNumber.click();
        await this.amount.click();
    }
}
