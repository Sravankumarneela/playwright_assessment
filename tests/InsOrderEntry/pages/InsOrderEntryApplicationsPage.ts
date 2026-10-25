import { expect, Page } from "playwright/test";
import path from "node:path";
import data from "../testdata/InsOrderEntrydata.json";

type ScenarioKey = keyof typeof data.applications.scenarios;
type ApplicantKey = keyof typeof data.applications.applicants;
type BeneficiaryKey = keyof typeof data.applications.beneficiaries;
type ProductKey = keyof typeof data.products.catalog;
type ApplicationScenario = (typeof data.applications.scenarios)[ScenarioKey];

export class InsOrderEntryApplicationsPage {
    private activeScenarioKey?: string;

    constructor(private readonly page: Page) {}

    async openApplications(): Promise<void> {
        await this.page.getByTestId(data.applications.testIds.navigationLink).click();
    }

    async expectApplicationsIndex(): Promise<void> {
        await expect(this.page.getByRole("heading", { name: data.applications.text.indexHeading })).toBeVisible();
        await expect(this.page.getByText(data.applications.text.indexDescription)).toBeVisible();
        await expect(this.page.getByTestId(data.applications.testIds.newButton)).toBeVisible();

        const table = this.page.getByTestId(data.applications.testIds.table);
        await expect(table).toBeVisible();
        for (const header of data.applications.text.tableHeaders) {
            await expect(table.getByRole("columnheader", { name: header, exact: true })).toBeVisible();
        }
    }

    async submitConfiguredApplication(scenarioKey: string): Promise<void> {
        await this.prepareToBeneficiaries(scenarioKey);
        await this.saveConfiguredBeneficiaries();
        await this.continueFromDocumentsToReview();
        await this.validateAndSubmit();
    }

    async prepareConfiguredApplication(scenarioKey: string): Promise<void> {
        await this.prepareToBeneficiaries(scenarioKey);
    }

    async saveConfiguredBeneficiaries(): Promise<void> {
        if (!this.activeScenarioKey) {
            throw new Error("Prepare an application before saving its beneficiaries.");
        }

        const scenario = this.getScenario(this.activeScenarioKey);
        for (const beneficiaryKey of scenario.beneficiaries) {
            await this.fillBeneficiary(beneficiaryKey);
            await this.page.getByTestId(data.applications.testIds.beneficiarySave).click();
        }

        await this.page.getByTestId(data.applications.testIds.beneficiaryContinue).click();
    }

    async uploadTestDocument(): Promise<void> {
        const uploadInput = this.page.locator('input[type="file"]').first();
        const fileName = data.applications.documents.testFile;
        const filePath = path.resolve(__dirname, "../testdata", fileName);
        await uploadInput.setInputFiles(filePath);
        await expect.poll(async () => uploadInput.evaluate((input) => (input as unknown as { files?: ArrayLike<{ name: string }> }).files?.[0]?.name)).toBe(fileName);
    }

    async reviewAndSubmitApplication(): Promise<void> {
        await this.continueFromDocumentsToReview();
        await this.validateAndSubmit();
    }

    private async continueFromDocumentsToReview(): Promise<void> {
        await this.page.getByTestId(data.applications.testIds.documentsContinue).click();
        await expect(this.page.getByRole("heading", { name: data.applications.text.reviewHeading })).toBeVisible();
    }

    private async validateAndSubmit(): Promise<void> {
        await this.page.getByTestId(data.applications.testIds.reviewValidate).click();
        await expect(this.page.getByTestId(data.applications.testIds.reviewValidationPassed)).toBeVisible();
        await this.page.getByTestId(data.applications.testIds.reviewSubmit).click();
    }

    async expectSubmissionConfirmation(): Promise<void> {
        const confirmation = this.page.getByTestId(data.applications.testIds.submissionConfirmation);
        await expect(confirmation.getByText(data.applications.text.submittedHeading)).toBeVisible();
        await expect(confirmation.getByText(data.applications.text.submittedMessage)).toBeVisible();
        await expect(this.page.getByTestId(data.applications.testIds.submissionReference)).toBeVisible();
    }

    async attemptInvalidBeneficiaryEmail(): Promise<void> {
        if (!this.activeScenarioKey) {
            throw new Error("Prepare an application before entering its beneficiary.");
        }

        const scenario = this.getScenario(this.activeScenarioKey);
        await this.fillBeneficiary(scenario.beneficiaries[0]);
        await this.page.getByTestId(data.applications.testIds.beneficiarySave).click();
    }

    async expectInvalidBeneficiaryEmailReviewError(): Promise<void> {
        await this.page.getByTestId(data.applications.testIds.beneficiaryContinue).click();
        await this.page.getByTestId(data.applications.testIds.documentsContinue).click();
        await this.page.getByTestId(data.applications.testIds.reviewValidate).click();

        const errors = this.page.getByTestId(data.applications.testIds.reviewValidationErrors);
        await expect(errors).toBeVisible();
        await expect(errors.getByText(data.applications.validationErrors.invalidBeneficiaryEmail)).toBeVisible();
    }

    async prepareApplicationForReview(scenarioKey: string): Promise<void> {
        await this.prepareToBeneficiaries(scenarioKey);
        await this.saveConfiguredBeneficiaries();
        await this.continueFromDocumentsToReview();
    }

    async runReviewValidation(): Promise<void> {
        await this.page.getByTestId(data.applications.testIds.reviewValidate).click();
    }

    async expectConfiguredReviewValidationError(scenarioKey: string): Promise<void> {
        const errorMessage = data.applications.validationErrors[scenarioKey as keyof typeof data.applications.validationErrors];
        if (!errorMessage) {
            throw new Error(`No configured validation error for application scenario: ${scenarioKey}`);
        }

        const errors = this.page.getByTestId(data.applications.testIds.reviewValidationErrors);
        await expect(errors).toBeVisible();
        await expect(errors.getByText(errorMessage)).toBeVisible();
    }
    async createDraftAndOpenSummary(scenarioKey: string): Promise<void> {
        const scenario = this.getScenario(scenarioKey);
        await this.createDraft();
        await this.fillClient(scenario.applicantKey);
        await this.page.getByTestId(data.applications.testIds.clientContinue).click();
        await this.page.getByTestId(data.applications.testIds.workflowSummaryButton).click();
    }

    async expectConfiguredSummary(scenarioKey: string): Promise<void> {
        const scenario = this.getScenario(scenarioKey);
        const applicant = data.applications.applicants[scenario.applicantKey as ApplicantKey];

        await expect(this.page.getByRole("heading", { name: data.applications.text.applicationSummaryHeading })).toBeVisible();
        await expect(this.page.getByText(data.applications.text.applicationSummaryDescription)).toBeVisible();
        await expect(this.page.getByRole("heading", { name: data.applications.text.snapshotHeading })).toBeVisible();
        await expect(this.page.getByText(applicant.summaryName, { exact: true })).toBeVisible();
        await expect(this.page.getByRole("heading", { name: data.applications.text.continueWorkflowHeading })).toBeVisible();

        for (const linkName of data.applications.text.workflowLinks) {
            await expect(this.page.getByRole("link", { name: linkName, exact: true })).toBeVisible();
        }
    }

    async prepareToBeneficiaries(scenarioKey: string): Promise<void> {
        const scenario = this.getScenario(scenarioKey);
        this.activeScenarioKey = scenarioKey;
        await this.createDraft();
        await this.fillClient(scenario.applicantKey);
        await this.page.getByTestId(data.applications.testIds.clientContinue).click();
        await this.fillAddressContact("contactEmail" in scenario ? scenario.contactEmail : undefined);
        await this.page.getByTestId(data.applications.testIds.addressContactContinue).click();
        await this.fillKycFinancial();
        await this.page.getByTestId(data.applications.testIds.kycContinue).click();
        await this.fillProduct(scenario);
        await this.page.getByTestId(data.applications.testIds.productContinue).click();
        await this.fillRiders(scenario);
        await this.page.getByTestId(data.applications.testIds.ridersContinue).click();
    }

    private async createDraft(): Promise<void> {
        await this.openApplications();
        await this.page.getByTestId(data.applications.testIds.newButton).click();
        await this.page.getByTestId(data.applications.testIds.createDraftButton).click();
        await expect(this.page.getByTestId(data.applications.testIds.clientPage)).toBeVisible();
    }

    private async fillClient(applicantKey: string): Promise<void> {
        const applicant = data.applications.applicants[applicantKey as ApplicantKey];
        const ids = data.applications.testIds;

        await this.page.getByTestId(ids.clientFirstName).fill(applicant.firstName);
        await this.page.getByTestId(ids.clientMiddleName).fill(applicant.middleName);
        await this.page.getByTestId(ids.clientLastName).fill(applicant.lastName);
        await this.page.getByTestId(ids.clientDateOfBirth).fill(applicant.dateOfBirth);
        await this.page.getByTestId(ids.clientGender).selectOption(applicant.gender);
        await this.page.getByTestId(ids.clientMaritalStatus).selectOption(applicant.maritalStatus);
        await this.page.getByTestId(ids.clientNationality).fill(applicant.nationality);
        await this.page.getByTestId(ids.clientOccupation).fill(applicant.occupation);
        await this.page.getByTestId(ids.clientEmployerName).fill(applicant.employerName);
        await this.page.getByTestId(ids.clientEmployerAddress).fill(applicant.employerAddress);
    }

    private async fillAddressContact(contactEmailOverride?: string): Promise<void> {
        const address = data.applications.address;
        const ids = data.applications.testIds;

        await this.page.getByTestId(ids.addressLine1).fill(address.line1);
        await this.page.getByTestId(ids.addressLine2).fill(address.line2);
        await this.page.getByTestId(ids.addressCity).fill(address.city);
        await this.page.getByTestId(ids.addressState).selectOption(address.state);
        await this.page.getByTestId(ids.addressPostalCode).fill(address.postalCode);

        const sameAsResidential = this.page.getByTestId(ids.sameAsResidential);
        if (address.sameAsResidential) {
            await sameAsResidential.check();
        } else {
            await this.page.getByTestId(ids.mailingLine1).fill(address.mailingLine1);
            await this.page.getByTestId(ids.mailingLine2).fill(address.mailingLine2);
            await this.page.getByTestId(ids.mailingCity).fill(address.mailingCity);
            await this.page.getByTestId(ids.mailingState).selectOption(address.mailingState);
            await this.page.getByTestId(ids.mailingPostalCode).fill(address.mailingPostalCode);
        }

        await this.page.getByTestId(ids.contactEmail).fill(contactEmailOverride ?? address.email);
        await this.page.getByTestId(ids.contactPhone).fill(address.phone);
        await this.page.getByTestId(ids.contactAlternatePhone).fill(address.alternatePhone);
        await this.page.getByTestId(ids.contactMode).selectOption(address.preferredMode);
    }

    private async fillKycFinancial(): Promise<void> {
        const financial = data.applications.financial;
        const ids = data.applications.testIds;

        await this.page.getByTestId(ids.kycIdType).selectOption(financial.idType);
        await this.page.getByTestId(ids.kycIdNumber).fill(financial.idNumber);
        await this.page.getByTestId(ids.kycIssueDate).fill(financial.issueDate);
        await this.page.getByTestId(ids.kycExpiryDate).fill(financial.expiryDate);
        await this.page.getByTestId(ids.annualIncome).fill(financial.annualIncome);
        await this.page.getByTestId(ids.netWorth).fill(financial.netWorth);
        await this.page.getByTestId(ids.sourceOfFunds).selectOption(financial.sourceOfFunds);
        await this.page.getByTestId(ids.riskProfile).selectOption(financial.riskProfile);
        await this.page.getByTestId(ids.pep).selectOption(financial.pep);
        await this.page.getByTestId(ids.pepDetails).fill(financial.pepDetails);

        if (financial.declarationCompleted) {
            await this.page.getByTestId(ids.complianceDeclaration).check();
        }
    }

    private async fillProduct(scenario: ApplicationScenario): Promise<void> {
        const product = data.products.catalog[scenario.productKey as ProductKey];
        const ids = data.applications.testIds;

        await this.page.getByTestId(ids.productSelect).selectOption(product.id);
        await this.page.getByTestId(ids.sumAssured).fill(scenario.sumAssured);
        await this.page.getByTestId(ids.premiumFrequency).selectOption(scenario.premiumFrequency);
        await this.page.getByTestId(ids.paymentTerm).selectOption(scenario.paymentTerm);
        await this.page.getByTestId(ids.coverageTerm).selectOption(scenario.coverageTerm);
    }

    private async fillRiders(scenario: ApplicationScenario): Promise<void> {
        const ids = data.applications.testIds;

        for (const rider of scenario.riders) {
            await this.page.getByTestId(`${ids.riderSelectedPrefix}${rider.index}`).check();
            await this.page.getByTestId(`${ids.riderCoveragePrefix}${rider.index}`).fill(rider.coverageAmount);
        }

        await expect(this.page.locator(`[data-testid^="${ids.riderSelectedPrefix}"]:checked`)).toHaveCount(scenario.riders.length);
    }

    private async fillBeneficiary(beneficiaryKey: string): Promise<void> {
        const beneficiary = data.applications.beneficiaries[beneficiaryKey as BeneficiaryKey];
        const ids = data.applications.testIds;

        await this.page.getByTestId(ids.beneficiaryLevel).selectOption(beneficiary.level);
        await this.page.getByTestId(ids.beneficiaryType).selectOption(beneficiary.type);
        await this.page.getByTestId(ids.beneficiaryRelationship).selectOption(beneficiary.relationship);
        await this.page.getByTestId(ids.beneficiaryAllocation).fill(beneficiary.allocation);
        await this.page.getByTestId(ids.beneficiaryDesignation).selectOption(beneficiary.designation);
        await this.page.getByTestId(ids.beneficiaryPhone).fill(beneficiary.phone);
        await this.page.getByTestId(ids.beneficiaryEmail).fill(beneficiary.email);
        await this.page.getByTestId(ids.beneficiaryCountry).fill(beneficiary.country);
        await this.page.getByTestId(ids.beneficiaryFirstName).fill(beneficiary.firstName);
        await this.page.getByTestId(ids.beneficiaryMiddleName).fill(beneficiary.middleName);
        await this.page.getByTestId(ids.beneficiaryLastName).fill(beneficiary.lastName);
        await this.page.getByTestId(ids.beneficiaryDateOfBirth).fill(beneficiary.dateOfBirth);
        await this.page.getByTestId(ids.beneficiaryGender).selectOption(beneficiary.gender);
        await this.page.getByTestId(ids.beneficiaryAddressLine1).fill(beneficiary.addressLine1);
        await this.page.getByTestId(ids.beneficiaryCity).fill(beneficiary.city);
        await this.page.getByTestId(ids.beneficiaryState).fill(beneficiary.state);
        await this.page.getByTestId(ids.beneficiaryPostalCode).fill(beneficiary.postalCode);

        if (beneficiary.guardian) {
            await this.page.getByTestId(ids.guardianName).fill(beneficiary.guardian.name);
            await this.page.getByTestId(ids.guardianRelationship).fill(beneficiary.guardian.relationship);
            await this.page.getByTestId(ids.guardianContact).fill(beneficiary.guardian.contact);
            await this.page.getByTestId(ids.guardianAddress).fill(beneficiary.guardian.address);

            if (beneficiary.guardian.acknowledgement) {
                await this.page.getByTestId(ids.guardianAcknowledgement).check();
            }
        }
    }

    private async openReview(): Promise<void> {
        const ids = data.applications.testIds;

        await this.page.getByTestId(ids.beneficiaryContinue).click();
        await this.page.getByTestId(ids.documentsContinue).click();
        await expect(this.page.getByRole("heading", { name: data.applications.text.reviewHeading })).toBeVisible();
    }

    private getScenario(scenarioKey: string) {
        const scenario = data.applications.scenarios[scenarioKey as ScenarioKey];
        if (!scenario) {
            throw new Error(`Unknown application scenario: ${scenarioKey}`);
        }

        return scenario;
    }
}