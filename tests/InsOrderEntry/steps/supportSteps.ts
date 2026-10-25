import { Then, When } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

When("the agent opens the Support tab", async function () {
    await pageFixture.supportPage.openFromNavigation();
});

Then("the support form is visible", async function () {
    await pageFixture.supportPage.expectSupportForm();
});

When("the agent submits the configured support request", async function () {
    await pageFixture.supportPage.submitConfiguredRequest();
});

Then("the support request confirmation is visible", async function () {
    await pageFixture.supportPage.expectRequestConfirmation();
});