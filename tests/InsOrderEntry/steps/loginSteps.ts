import { Given, When, Then } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

Given("the InsOrderEntry login page is open", async function () {
    await pageFixture.loginPage.open();
});

When("the agent enters the configured credentials", async function () {
    await pageFixture.loginPage.enterCredentials();
});

Then("the configured login form content is visible", async function () {
    await pageFixture.loginPage.expectLoginForm();
});

When("the agent submits the login form", async function () {
    await pageFixture.loginPage.submitLogin();
});

When("the agent clicks the navigation brand", async function () {
    await pageFixture.loginPage.clickNavigationBrand();
});

Then("the authenticated navigation is visible", async function () {
    await pageFixture.loginPage.expectAuthenticatedNavigation();
});

When("the agent submits invalid configured credentials", async function () {
    await pageFixture.loginPage.submitInvalidCredentials();
});

Then("the invalid credentials message is visible", async function () {
    await pageFixture.loginPage.expectInvalidCredentialsMessage();
});

When("the agent opens the forgot password page", async function () {
    await pageFixture.loginPage.openForgotPassword();
});

Then("the forgot password prompt is visible", async function () {
    await pageFixture.loginPage.expectForgotPasswordPrompt();
});

When("the agent submits the configured valid email for password reset", async function () {
    await pageFixture.loginPage.submitConfiguredPasswordResetRequest();
});

Then("the password reset status and OTP prompt are visible", async function () {
    await pageFixture.loginPage.expectPasswordResetStatusAndOtpPrompt();
});

When("the agent opens the registration page", async function () {
    await pageFixture.loginPage.openRegistration();
});

Then("the logout button is not visible", async function () {
    await pageFixture.loginPage.expectLogoutButtonNotVisible();
});

When("the agent requests a password reset OTP with the configured test email", async function () {
    await pageFixture.loginPage.requestPasswordResetOtp();
});

Then("the password reset OTP confirmation is visible", async function () {
    await pageFixture.loginPage.expectPasswordResetOtpConfirmation();
});

When("the agent logs out", async function () {
    await pageFixture.loginPage.clickLogout();
});

Then("the login form is visible after logout", async function () {
    await pageFixture.loginPage.expectLoginFormAfterLogout();
});

When("the agent opens the Products tab", async function () {
    await pageFixture.productsPage.openFromNavigation();
});

Then("the configured product card {string} is visible", async function (productKey: string) {
    await pageFixture.productsPage.expectProductCard(productKey);
});

When("the agent opens the details for product {string}", async function (productKey: string) {
    await pageFixture.productsPage.openProductDetails(productKey);
});

Then("the configured product details for {string} are visible", async function (productKey: string) {
    await pageFixture.productsPage.expectProductDetails(productKey);
});

Then("the Products back link is visible", async function () {
    await pageFixture.productsPage.expectBackLink();
});