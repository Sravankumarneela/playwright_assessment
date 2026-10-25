import { Then, When } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

When("the agent opens the Dashboard tab", async function () {
    pageFixture.logger.info("Step: open the Dashboard tab");
    await pageFixture.dashboardPage.openDashboard();
});

Then("the dashboard page and its components are displayed", async function () {
    pageFixture.logger.info("Step: verify dashboard page and components");
    await pageFixture.dashboardPage.expectDashboard();
});

When("the agent opens an existing application from the dashboard", async function () {
    pageFixture.logger.info("Step: open an existing application from the dashboard");
    await pageFixture.dashboardPage.openExistingApplication();
});

Then("the existing application's summary is displayed", async function () {
    pageFixture.logger.info("Step: verify existing application summary");
    await pageFixture.dashboardPage.expectApplicationSummary();
});