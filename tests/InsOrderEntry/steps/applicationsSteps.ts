import { Then, When } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

When("the agent opens the Applications tab", async function () {
    pageFixture.logger.info("Step: open the Applications tab");
    await pageFixture.applicationsPage.openApplications();
});

Then("the Applications page view is visible", async function () {
    pageFixture.logger.info("Step: verify the Applications page view");
    await pageFixture.applicationsPage.expectApplicationsIndex();
});

When("the agent submits configured application {string} with the ID proof document", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: submit configured application scenario '${scenarioKey}' with ID proof`);
    await pageFixture.applicationsPage.submitConfiguredApplication(scenarioKey);
});

When("the agent attempts to submit without the ID proof document", async function () {
    pageFixture.logger.info("Step: attempt submission without ID proof");
    await pageFixture.applicationsPage.attemptSubmissionWithoutIdProof();
});

Then("the missing ID proof error is displayed and submission is blocked", async function () {
    pageFixture.logger.info("Step: verify missing ID proof error and blocked submission");
    await pageFixture.applicationsPage.expectMissingIdProofSubmissionError();
});

When("the agent completes the client, contact, financial, product, and rider details for {string}", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: prepare application scenario '${scenarioKey}' through rider details`);
    await pageFixture.applicationsPage.prepareConfiguredApplication(scenarioKey);
});

When("the agent completes the client, contact, financial, and product details for {string} and leaves every rider unselected", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: prepare application scenario '${scenarioKey}' with no selected riders`);
    await pageFixture.applicationsPage.prepareConfiguredApplication(scenarioKey);
});

When("the agent saves the configured beneficiaries and proceeds to document upload", async function () {
    pageFixture.logger.info("Step: save configured beneficiaries and proceed to document upload");
    await pageFixture.applicationsPage.saveConfiguredBeneficiaries();
});

When("the agent uploads the configured test document", async function () {
    pageFixture.logger.info("Step: upload the configured test document");
    await pageFixture.applicationsPage.uploadTestDocument();
});

When("the agent reviews, validates, and submits the application", async function () {
    pageFixture.logger.info("Step: review, validate, and submit the application");
    await pageFixture.applicationsPage.reviewAndSubmitApplication();
});

Then("the application submission confirmation is visible", async function () {
    pageFixture.logger.info("Step: verify application submission confirmation");
    await pageFixture.applicationsPage.expectSubmissionConfirmation();
});

When("the agent prepares configured application {string} to add a beneficiary", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: prepare application scenario '${scenarioKey}' for beneficiary entry`);
    await pageFixture.applicationsPage.prepareToBeneficiaries(scenarioKey);
});

When("the agent attempts to save its configured beneficiary", async function () {
    pageFixture.logger.info("Step: attempt to save the configured beneficiary");
    await pageFixture.applicationsPage.attemptInvalidBeneficiaryEmail();
});

Then("the review page displays the beneficiary email validation error", async function () {
    pageFixture.logger.info("Step: verify beneficiary email validation error on review");
    await pageFixture.applicationsPage.expectInvalidBeneficiaryEmailReviewError();
});

When("the agent prepares configured application {string} for review", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: prepare application scenario '${scenarioKey}' for review`);
    await pageFixture.applicationsPage.prepareApplicationForReview(scenarioKey);
});

When("the agent runs validation on the application", async function () {
    pageFixture.logger.info("Step: run application review validation");
    await pageFixture.applicationsPage.runReviewValidation();
});

Then("the review page displays the configured validation error for {string}", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: verify configured review validation error for '${scenarioKey}'`);
    await pageFixture.applicationsPage.expectConfiguredReviewValidationError(scenarioKey);
});

When("the agent creates a draft from scenario {string} and opens its summary", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: create draft and open summary for scenario '${scenarioKey}'`);
    await pageFixture.applicationsPage.createDraftAndOpenSummary(scenarioKey);
});

Then("the configured application summary and workflow links are visible for {string}", async function (scenarioKey: string) {
    pageFixture.logger.info(`Step: verify application summary and workflow links for '${scenarioKey}'`);
    await pageFixture.applicationsPage.expectConfiguredSummary(scenarioKey);
});