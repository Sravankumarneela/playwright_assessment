import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { pageFixture } from "../../base/pagefixture";
import * as data from "../Testdata/finsRetailData.json";

Given("the user is logged in to the Fins Retail application for portfolio", async function () {
    await pageFixture.loginPage.enterloginDetails(data.username, data.password);
    await pageFixture.loginPage.clickLoginButton();
});

When("the user opens the portfolio", async function () {
    await pageFixture.portfolioPage.openPortfolio(data.portfolio.linkName, data.portfolio.url);
});

When("the user starts redemption for the portfolio holding", async function () {
    await pageFixture.portfolioPage.startRedemption(data.portfolio.holdingId);
});

When("the user enters the portfolio redemption details", async function () {
    await pageFixture.portfolioPage.enterRedemptionDetails(
        data.portfolio.redemptionMode,
        data.portfolio.amount
    );
});

When("the user submits the portfolio redemption", async function () {
    await pageFixture.portfolioPage.submitRedemption();
});

Then("the portfolio redemption should be submitted", async function () {
    await expect(
        pageFixture.portfolioPage.redemptionSubmitted(data.portfolio.expectedHeading)
    ).toBeVisible();
});

Then("the portfolio overview should display the expected details", async function () {
    for (const detail of pageFixture.portfolioPage.portfolioOverviewLocators(data.portfolio.verification)) {
        await expect(detail).toBeVisible();
    }
});

When("the user opens the portfolio investment options", async function () {
    await pageFixture.portfolioPage.openInvestmentOptions();
});

When("the user selects the portfolio investment fund", async function () {
    await pageFixture.portfolioPage.selectInvestmentFund(
        data.portfolio.investment.risk,
        data.portfolio.investment.fundCode
    );
});

Then("the portfolio investment fund details should be displayed", async function () {
    await pageFixture.portfolioPage.verifyInvestmentFundDetails();
});

When("the user starts the portfolio investment", async function () {
    await pageFixture.portfolioPage.startInvestment(data.portfolio.investment.detailsHeading);
});

When("the user enters the portfolio investment details", async function () {
    await pageFixture.portfolioPage.enterInvestmentDetails(
        data.portfolio.investment.investmentType,
        data.portfolio.investment.amount,
        data.portfolio.investment.paymentMethod
    );
});

When("the user confirms the portfolio investment", async function () {
    await pageFixture.portfolioPage.confirmInvestment();
});

Then("the portfolio investment confirmation should be displayed", async function () {
    await expect(pageFixture.portfolioPage.investmentConfirmation()).toBeVisible();
    await expect(
        pageFixture.portfolioPage.investmentHeading(data.portfolio.investment.confirmationHeading)
    ).toBeVisible();
    await expect(
        pageFixture.portfolioPage.investmentHeading(data.portfolio.investment.orderHeading)
    ).toBeVisible();

    for (const detail of pageFixture.portfolioPage.investmentDetails(
        data.portfolio.investment.fundName,
        data.portfolio.investment.orderAmountPrefix
    )) {
        await expect(detail).toBeVisible();
    }
});