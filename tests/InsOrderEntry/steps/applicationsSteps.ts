import { Then, When } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

When("the agent opens the Applications tab", async function () {
    await pageFixture.applicationsPage.openApplications();
});

Then("the Applications page view is visible", async function () {
    await pageFixture.applicationsPage.expectApplicationsIndex();
});

When("the agent submits the configured application {string}", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.submitConfiguredApplication(scenarioKey);
});

When("the agent completes the client, contact, financial, product, and rider details for {string}", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.prepareConfiguredApplication(scenarioKey);
});

When("the agent completes the client, contact, financial, and product details for {string} and leaves every rider unselected", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.prepareConfiguredApplication(scenarioKey);
});

When("the agent saves the configured beneficiaries and proceeds to document upload", async function () {
    await pageFixture.applicationsPage.saveConfiguredBeneficiaries();
});

When("the agent uploads the configured test document", async function () {
    await pageFixture.applicationsPage.uploadTestDocument();
});

When("the agent reviews, validates, and submits the application", async function () {
    await pageFixture.applicationsPage.reviewAndSubmitApplication();
});

Then("the application submission confirmation is visible", async function () {
    await pageFixture.applicationsPage.expectSubmissionConfirmation();
});

When("the agent prepares configured application {string} to add a beneficiary", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.prepareToBeneficiaries(scenarioKey);
});

When("the agent attempts to save its configured beneficiary", async function () {
    await pageFixture.applicationsPage.attemptInvalidBeneficiaryEmail();
});

Then("the review page displays the beneficiary email validation error", async function () {
    await pageFixture.applicationsPage.expectInvalidBeneficiaryEmailReviewError();
});

When("the agent prepares configured application {string} for review", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.prepareApplicationForReview(scenarioKey);
});

When("the agent runs validation on the application", async function () {
    await pageFixture.applicationsPage.runReviewValidation();
});

Then("the review page displays the configured validation error for {string}", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.expectConfiguredReviewValidationError(scenarioKey);
});

When("the agent creates a draft from scenario {string} and opens its summary", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.createDraftAndOpenSummary(scenarioKey);
});

Then("the configured application summary and workflow links are visible for {string}", async function (scenarioKey: string) {
    await pageFixture.applicationsPage.expectConfiguredSummary(scenarioKey);
});