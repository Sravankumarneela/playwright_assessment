import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { pageFixture } from "../../base/pagefixture";
import * as data from "../Testdata/finsRetailData.json";

Given("the user is logged in to the Fins Retail application", async function () {
    await pageFixture.loginPage.enterloginDetails(data.username, data.password);
    await pageFixture.loginPage.clickLoginButton();
});

When("the user opens Mutual Funds", async function () {
    await pageFixture.mutualFundPage.openMutualFunds();
});

When("the user filters funds by {string} risk", async function (risk: string) {
    await pageFixture.mutualFundPage.filterFundsByRisk(risk);
});

When("the user opens fund {string} details", async function (fundCode: string) {
    if (fundCode !== "FSLIQ009") {
        throw new Error(`Unsupported fund code: ${fundCode}`);
    }
    await pageFixture.mutualFundPage.openFundDetails();
});

When("the user starts an investment", async function () {
    await pageFixture.mutualFundPage.startInvestment();
});

When("the user verifies the fund details", async function () {
    await pageFixture.mutualFundPage.verifyFundDetails();
});

When("the user enters a SIP investment of {string}", async function (amount: string) {
    await pageFixture.mutualFundPage.enterSipInvestment(amount);
});

When("the user enters a lump-sum investment of {string}", async function (amount: string) {
    await pageFixture.mutualFundPage.enterLumpSumInvestment(amount);
});

When("the user selects {string} payment and accepts the declaration", async function (paymentMethod: string) {
    await pageFixture.mutualFundPage.selectPaymentMethod(paymentMethod);
});

When("the user confirms the investment", async function () {
    await pageFixture.mutualFundPage.confirmInvestment();
});

Then("the investment order should be placed", async function () {
    await expect(pageFixture.mutualFundPage.investmentOrderPlaced).toBeVisible();
});

Then("the investment order details should be displayed", async function () {
    await pageFixture.mutualFundPage.verifyInvestmentOrder();
});
