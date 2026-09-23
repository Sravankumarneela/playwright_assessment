import { Then, When } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { pageFixture } from "../../base/pagefixture";
import * as data from "../Testdata/finsRetailData.json";

When("the user opens Support", async function () {
    await pageFixture.supportPage.openSupport();
});

Then("the Support page should display the expected content", async function () {
    for (const detail of pageFixture.supportPage.supportOverviewLocators(data.support.overview)) {
        await expect(detail).toBeVisible();
    }
});

When("the user submits a short Support message", async function () {
    await pageFixture.supportPage.submitSupportRequest(
        data.support.invalidMessage.category,
        data.support.invalidMessage.message
    );
});

Then("the Support message validation error should be displayed", async function () {
    await pageFixture.supportPage.verifyMessageValidationError(data.support.invalidMessage.errorText);
});

When("the user raises the configured Support request", async function () {
    await pageFixture.supportPage.submitSupportRequest(
        data.support.validRequest.category,
        data.support.validRequest.message
    );
});

Then("the Support request confirmation should be displayed", async function () {
    await pageFixture.supportPage.verifySupportConfirmation(data.support.validRequest.confirmation);
});

When("the user chooses to raise another Support request", async function () {
    await pageFixture.supportPage.raiseAnotherSupportRequest(data.support.validRequest.confirmation.raiseAnotherTestId);
});
