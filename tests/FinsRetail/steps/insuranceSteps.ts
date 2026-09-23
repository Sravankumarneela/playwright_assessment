import { Then, When } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { pageFixture } from "../../base/pagefixture";
import * as data from "../Testdata/finsRetailData.json";

When("the user opens Insurance", async function () {
    await pageFixture.insurancePage.openInsurance(data.insurance.linkName);
});

When("the user searches Insurance for the configured term", async function () {
    await pageFixture.insurancePage.searchInsurance(data.insurance.search.term);
});

Then("the configured Insurance search results should be displayed", async function () {
    await pageFixture.insurancePage.verifyInsuranceResults(data.insurance.search.resultIds);
});

When("the user resets the Insurance filters", async function () {
    await pageFixture.insurancePage.resetInsuranceFilters();
});

When("the user selects the configured Insurance type", async function () {
    await pageFixture.insurancePage.selectInsuranceType(data.insurance.filters.healthType);
});

When("the user selects the configured premium range and applies the filter", async function () {
    await pageFixture.insurancePage.selectPremiumRange(data.insurance.filters.premiumRange);
    await pageFixture.insurancePage.applyInsuranceFilters();
});

Then("the configured premium Insurance results should be displayed", async function () {
    await pageFixture.insurancePage.verifyInsuranceResults(data.insurance.filters.premiumResultIds);
});

When("the user applies the Insurance type filter", async function () {
    await pageFixture.insurancePage.applyInsuranceFilters();
});

When("the user buys the configured Insurance policy with generated details", async function () {
    await pageFixture.insurancePage.purchaseInsurancePolicy(data.insurance.purchase);
});

When("the user attempts to buy Insurance with the configured future date of birth", async function () {
    await pageFixture.insurancePage.attemptPolicyPurchaseWithFutureDob(data.insurance.futureDobRegression);
});

Then("the Insurance policy confirmation should display the configured details", async function () {
    await pageFixture.insurancePage.verifyPolicyConfirmation(data.insurance.purchase.confirmation);
});

Then("the configured health Insurance results should be displayed", async function () {
    await pageFixture.insurancePage.verifyInsuranceResults(data.insurance.filters.healthResultIds);
});

Then("the Insurance page should display the expected products", async function () {
    for (const detail of pageFixture.insurancePage.insuranceOverviewLocators(data.insurance)) {
        await expect(detail).toBeVisible();
    }
});
