import { Then, When } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { pageFixture } from "../../base/pagefixture";
import * as data from "../Testdata/finsRetailData.json";

When("the user opens Policies", async function () {
    await pageFixture.policiesPage.openPolicies();
});

Then("the Policies page should display the expected content", async function () {
    for (const detail of pageFixture.policiesPage.policyOverviewLocators(data.policies.overview)) {
        await expect(detail).toBeVisible();
    }
});

When("the user filters Policies by the configured status", async function () {
    await pageFixture.policiesPage.filterByStatus(data.policies.statusFilter.value);
});

Then("the configured policy status results should be displayed", async function () {
    await pageFixture.policiesPage.verifyPolicyRows(data.policies.statusFilter.resultPolicyIds);
});

When("the user opens the configured policy details", async function () {
    await pageFixture.policiesPage.openPolicyDetails(data.policies.details.policyId);
});

When("the user returns to Policies", async function () {
    await pageFixture.policiesPage.returnToPolicies();
});

When("the user attempts to download the configured policy", async function () {
    await pageFixture.policiesPage.verifyPolicyDownload(data.policies.download);
});

Then("the configured policy details should be displayed", async function () {
    await pageFixture.policiesPage.verifyPolicyDetails(data.policies.details);
});
