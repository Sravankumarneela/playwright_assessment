import { Then, When } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

When("the agent opens the Support tab", async function () {
    pageFixture.logger.info("Step: open the Support tab");
    await pageFixture.supportPage.openFromNavigation();
});

Then("the support form is visible", async function () {
    pageFixture.logger.info("Step: verify support form");
    await pageFixture.supportPage.expectSupportForm();
});

When("the agent submits the configured support request", async function () {
    pageFixture.logger.info("Step: submit configured support request");
    await pageFixture.supportPage.submitConfiguredRequest();
});

Then("the support request confirmation is visible", async function () {
    pageFixture.logger.info("Step: verify support request confirmation");
    await pageFixture.supportPage.expectRequestConfirmation();
});