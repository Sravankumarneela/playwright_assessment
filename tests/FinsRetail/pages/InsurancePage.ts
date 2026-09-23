import { Locator, Page } from "playwright";
import { randomInt } from "crypto";
import { Logger } from "winston";

export class InsurancePage {
    readonly page: Page;
    readonly logger: Logger;
    readonly searchInput: Locator;
    readonly insuranceTypeFilter: Locator;
    readonly premiumRangeFilter: Locator;
    readonly filterSubmit: Locator;
    readonly filterReset: Locator;

    constructor(page: Page, logger: Logger) {
        this.page = page;
        this.logger = logger;
        this.searchInput = page.getByTestId("insurance-search-input");
        this.insuranceTypeFilter = page.getByTestId("insurance-type-filter");
        this.premiumRangeFilter = page.getByTestId("premium-range-filter");
        this.filterSubmit = page.getByTestId("insurance-filter-submit");
        this.filterReset = page.getByTestId("insurance-filter-reset");
    }

    async openInsurance(linkName: string): Promise<void> {
        await this.page.getByRole("link", { name: linkName }).click();
        this.logger.info("Opened Insurance");
    }

    async searchInsurance(searchTerm: string): Promise<void> {
        await this.searchInput.fill(searchTerm);
        await this.filterSubmit.click();
        this.logger.info(`Searched insurance products for: ${searchTerm}`);
    }

    async selectInsuranceType(insuranceType: string): Promise<void> {
        await this.insuranceTypeFilter.selectOption(insuranceType);
    }

    async selectPremiumRange(premiumRange: string): Promise<void> {
        await this.premiumRangeFilter.selectOption(premiumRange);
    }

    async applyInsuranceFilters(): Promise<void> {
        await this.filterSubmit.click();
        this.logger.info("Applied insurance filters");
    }

    async resetInsuranceFilters(): Promise<void> {
        await this.filterReset.click();
        this.logger.info("Reset insurance filters");
    }

    async verifyInsuranceResults(productIds: string[]): Promise<void> {
        for (const productId of productIds) {
            await this.page.getByTestId(`insurance-card-${productId}`).waitFor({ state: "visible" });
        }
    }

    async purchaseInsurancePolicy(policy: {
        type: string;
        productId: string;
        dateOfBirth: string;
        nomineeRelationship: string;
        firstNames: string[];
        lastNames: string[];
        coverageAmount: string;
    }): Promise<void> {
        await this.selectInsuranceType(policy.type);
        await this.applyInsuranceFilters();
        await this.page.getByTestId(`buy-insurance-link-${policy.productId}`).click();

        const insuredName = this.generateName(policy.firstNames, policy.lastNames);
        const nomineeName = this.generateName(policy.firstNames, policy.lastNames);
        const mobileNumber = this.generateMobileNumber();
        const emailAddress = `insurance.${Date.now()}@test.com`;

        await this.page.getByTestId("insured-name-input").fill(insuredName);
        await this.page.getByTestId("insured-dob-input").fill(policy.dateOfBirth);
        await this.page.getByTestId("insured-mobile-input").fill(mobileNumber);
        await this.page.getByTestId("insured-email-input").fill(emailAddress);
        await this.page.getByTestId("nominee-name-input").fill(nomineeName);
        await this.page.getByTestId("nominee-relationship-select").selectOption(policy.nomineeRelationship);
        await this.page.getByTestId("insurance-declaration-checkbox").check();
        await this.page.getByTestId("confirm-policy-button").click();

        this.logger.info(`Created insurance policy for ${insuredName}`);
    }

    async attemptPolicyPurchaseWithFutureDob(policy: {
        type: string;
        productId: string;
        futureDateOffsetYears: number;
        nomineeRelationship: string;
        firstNames: string[];
        lastNames: string[];
    }): Promise<void> {
        const futureDateOfBirth = this.generateFutureDate(policy.futureDateOffsetYears);

        await this.selectInsuranceType(policy.type);
        await this.applyInsuranceFilters();
        await this.page.getByTestId(`buy-insurance-link-${policy.productId}`).click();

        await this.page.getByTestId("insured-name-input").fill(this.generateName(policy.firstNames, policy.lastNames));
        await this.page.getByTestId("insured-dob-input").fill(futureDateOfBirth);
        await this.page.getByTestId("insured-mobile-input").fill(this.generateMobileNumber());
        await this.page.getByTestId("insured-email-input").fill(`future-dob.${Date.now()}@test.com`);
        await this.page.getByTestId("nominee-name-input").fill(this.generateName(policy.firstNames, policy.lastNames));
        await this.page.getByTestId("nominee-relationship-select").selectOption(policy.nomineeRelationship);
        await this.page.getByTestId("insurance-declaration-checkbox").check();
        await this.page.getByTestId("confirm-policy-button").click();

        const confirmationHeading = this.page.getByRole("heading", { name: "Policy Created Successfully" });
        if (await confirmationHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
            throw new Error(
                `BUG: Future-dated date of birth ${futureDateOfBirth} was accepted for insurance product ${policy.productId}`
            );
        }

        this.logger.info(`Future-dated DOB was rejected for product: ${policy.productId}`);
    }

    async verifyPolicyConfirmation(confirmation: {
        heading: string;
        policyNumberTestId: string;
        transactionReferenceTestId: string;
        coverageAmount: string;
        productName: string;
        viewPolicyLinkTestId: string;
        viewTransactionsLinkTestId: string;
    }): Promise<void> {
        await this.page.getByRole("heading", { name: confirmation.heading }).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.policyNumberTestId).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.transactionReferenceTestId).waitFor({ state: "visible" });
        await this.page.getByText(confirmation.coverageAmount, { exact: true }).waitFor({ state: "visible" });
        await this.page.getByText(confirmation.productName, { exact: true }).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.viewPolicyLinkTestId).waitFor({ state: "visible" });
        await this.page.getByTestId(confirmation.viewTransactionsLinkTestId).waitFor({ state: "visible" });
    }

    private generateName(firstNames: string[], lastNames: string[]): string {
        const firstName = firstNames[randomInt(firstNames.length)];
        const lastName = lastNames[randomInt(lastNames.length)];
        return `${firstName} ${lastName}`;
    }

    private generateMobileNumber(): string {
        return `${randomInt(6, 10)}${randomInt(100000000, 1000000000)}`;
    }

    private generateFutureDate(yearOffset: number): string {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + yearOffset);

        return [
            futureDate.getFullYear(),
            String(futureDate.getMonth() + 1).padStart(2, "0"),
            String(futureDate.getDate()).padStart(2, "0")
        ].join("-");
    }

    insuranceOverviewLocators(verification: {
        pageHeading: string;
        browseText: string;
        filterFormTestId: string;
        searchText: string;
        insuranceTypeText: string;
        premiumRangeText: string;
        filterSubmitTestId: string;
        filterResetTestId: string;
        insuranceCardIds: string[];
        featuredProductName: string;
        featuredProductDescription: string;
        detailsLinkId: string;
        buyLinkId: string;
    }): Locator[] {
        return [
            this.page.getByRole("heading", { name: verification.pageHeading }),
            this.page.getByText(verification.browseText, { exact: false }),
            this.page.getByTestId(verification.filterFormTestId).getByText(verification.searchText, { exact: true }),
            this.page.getByText(verification.insuranceTypeText, { exact: false }),
            this.page.getByText(verification.premiumRangeText, { exact: false }),
            this.page.getByTestId(verification.filterSubmitTestId),
            this.page.getByTestId(verification.filterResetTestId),
            ...verification.insuranceCardIds.map((productId) =>
                this.page.getByTestId(`insurance-card-${productId}`)
            ),
            this.page.getByRole("heading", { name: verification.featuredProductName }),
            this.page.getByText(verification.featuredProductDescription, { exact: false }),
            this.page.getByTestId(`insurance-details-link-${verification.detailsLinkId}`),
            this.page.getByTestId(`buy-insurance-link-${verification.buyLinkId}`)
        ];
    }
}
