import { Then, When } from "@cucumber/cucumber";
import { expect } from "playwright/test";
import { pageFixture } from "../../base/pagefixture";
import * as data from "../Testdata/finsRetailData.json";

When("the user opens Transactions", async function () {
    await pageFixture.transactionsPage.openTransactions();
});

Then("the Transactions page should display the expected content", async function () {
    for (const detail of pageFixture.transactionsPage.transactionOverviewLocators(data.transactions.overview)) {
        await expect(detail).toBeVisible();
    }
});

When("the user searches Transactions using the configured options", async function () {
    await pageFixture.transactionsPage.searchTransactions(data.transactions.filters.searchTerms[0]);
    await pageFixture.transactionsPage.resetFilters();
    await pageFixture.transactionsPage.searchTransactions(data.transactions.filters.searchTerms[1]);
    await pageFixture.transactionsPage.resetFilters();
    await pageFixture.transactionsPage.applyTransactionFilters(data.transactions.filters);
});

Then("the configured transaction filter results should be displayed", async function () {
    await pageFixture.transactionsPage.verifyTransactionRows(data.transactions.filters.resultTransactionIds);
});

When("the user opens the configured transaction details", async function () {
    await pageFixture.transactionsPage.openTransactionDetails(data.transactions.details.transactionId);
});

Then("the configured transaction details should be displayed", async function () {
    await pageFixture.transactionsPage.verifyTransactionDetails(data.transactions.details);
});

When("the user returns to Transactions", async function () {
    await pageFixture.transactionsPage.returnToTransactions(data.transactions.details.backLinkTestId);
});

When("the user captures the Transactions pagination screenshot", async function () {
    const screenshot = await pageFixture.transactionsPage.capturePaginationEvidence();
    await this.attach(screenshot, "image/png");
});

Then("the Transactions pagination arrows should have the configured size", async function () {
    await pageFixture.transactionsPage.verifyPaginationArrowSize(
        data.transactions.pagination.maxArrowWidth,
        data.transactions.pagination.maxArrowHeight,
        data.transactions.pagination.failureMessage
    );
});
