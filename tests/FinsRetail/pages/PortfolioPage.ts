import { Locator, Page } from "playwright";
import { Logger } from "winston";

export class PortfolioPage {
    readonly page: Page;
    readonly logger: Logger;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
    }

    async openPortfolio(linkName: string, url: string): Promise<void> {
        await this.page.getByRole("link", { name: linkName }).click();
        await this.page.goto(url);
        this.logger.info(`Opened portfolio: ${url}`);
    }

    async startRedemption(holdingId: string): Promise<void> {
        await this.page.getByTestId(`redeem-button-${holdingId}`).click();
        this.logger.info(`Started redemption for holding: ${holdingId}`);
    }

    async enterRedemptionDetails(redemptionMode: string, amount: string): Promise<void> {
        await this.page.getByTestId(`redeem-mode-${redemptionMode}`).check();
        await this.page.getByTestId("redeem-units-input").click();
        await this.page.getByTestId("redeem-amount-input").fill(amount);
        this.logger.info(`Entered redemption ${redemptionMode}: ${amount}`);
    }

    async submitRedemption(): Promise<void> {
        await this.page.getByTestId("redemption-declaration-checkbox").check();
        await this.page.getByTestId("confirm-redemption-button").click();
        this.logger.info("Submitted redemption");
    }

    portfolioOverviewLocators(verification: {
        mutualFundHoldingsHeading: string;
        portfolioHeading: string;
    }): Locator[] {
        return [
            this.page.getByRole("heading", { name: verification.mutualFundHoldingsHeading }),
            this.page.getByRole("heading", { name: verification.portfolioHeading }),
        ];
    }

        async openInvestmentOptions(): Promise<void> {
            await this.page.getByTestId("portfolio-invest-more-button").click();
        }

        async selectInvestmentFund(risk: string, fundCode: string): Promise<void> {
            await this.page.getByTestId("fund-risk-filter").selectOption(risk);
            await this.page.getByTestId("fund-filter-submit").click();
            await this.page.getByTestId(`fund-details-link-${fundCode}`).click();
        }

        async verifyInvestmentFundDetails(): Promise<void> {
            await this.page.getByTestId("invest-now-button").waitFor({ state: "visible" });
            await this.page.getByText("NAV", { exact: true }).waitFor({ state: "visible" });
            await this.page.getByText("Minimum SIP:", { exact: false }).waitFor({ state: "visible" });
            await this.page.getByText("Fund Manager:", { exact: false }).waitFor({ state: "visible" });
        }

        async startInvestment(detailsHeading: string): Promise<void> {
            await this.page.getByTestId("invest-now-button").click();
            await this.page.getByRole("heading", { name: detailsHeading }).waitFor({ state: "visible" });
            await this.page.getByTestId("confirm-investment-button").waitFor({ state: "visible" });
        }

        async enterInvestmentDetails(investmentType: string, amount: string, paymentMethod: string): Promise<void> {
            await this.page.getByTestId(`investment-type-${investmentType}`).check();
            await this.page.getByTestId("investment-amount-input").fill(amount);
            await this.page.getByTestId("payment-method-select").selectOption(paymentMethod);
            await this.page.getByTestId("investment-declaration-checkbox").check();
        }

        async confirmInvestment(): Promise<void> {
            await this.page.getByTestId("confirm-investment-button").click();
        }

        investmentConfirmation(): Locator {
            return this.page.getByTestId("investment-confirmation-message");
        }

        investmentHeading(expectedHeading: string): Locator {
            return this.page.getByRole("heading", { name: expectedHeading });
        }

        investmentDetails(fundName: string, amountPrefix: string): Locator[] {
            return [
                this.page.getByText(`Fund: ${fundName}`, { exact: true }),
                this.page.getByText(amountPrefix, { exact: false })
            ];
        }

    redemptionSubmitted(expectedHeading: string): Locator {
        return this.page.getByRole("heading", { name: expectedHeading });
    }
}