import { Given, When, Then } from "@cucumber/cucumber";
import { pageFixture } from "../../base/pagefixture";

Given("the InsOrderEntry login page is open", async function () {
    pageFixture.logger.info("Step: open the InsOrderEntry login page");
    await pageFixture.loginPage.open();
});

When("the agent enters the configured credentials", async function () {
    pageFixture.logger.info("Step: enter configured login credentials");
    await pageFixture.loginPage.enterCredentials();
});

Then("the configured login form content is visible", async function () {
    pageFixture.logger.info("Step: verify configured login form content");
    await pageFixture.loginPage.expectLoginForm();
});

When("the agent submits the login form", async function () {
    pageFixture.logger.info("Step: submit the login form");
    await pageFixture.loginPage.submitLogin();
});

When("the agent clicks the navigation brand", async function () {
    pageFixture.logger.info("Step: click the navigation brand");
    await pageFixture.loginPage.clickNavigationBrand();
});

Then("the authenticated navigation is visible", async function () {
    pageFixture.logger.info("Step: verify authenticated navigation");
    await pageFixture.loginPage.expectAuthenticatedNavigation();
});

When("the agent submits invalid configured credentials", async function () {
    pageFixture.logger.info("Step: submit invalid configured credentials");
    await pageFixture.loginPage.submitInvalidCredentials();
});

Then("the invalid credentials message is visible", async function () {
    pageFixture.logger.info("Step: verify invalid credentials message");
    await pageFixture.loginPage.expectInvalidCredentialsMessage();
});

When("the agent opens the forgot password page", async function () {
    pageFixture.logger.info("Step: open the forgot password page");
    await pageFixture.loginPage.openForgotPassword();
});

Then("the forgot password prompt is visible", async function () {
    pageFixture.logger.info("Step: verify forgot password prompt");
    await pageFixture.loginPage.expectForgotPasswordPrompt();
});

When("the agent submits the configured valid email for password reset", async function () {
    pageFixture.logger.info("Step: submit configured password reset email");
    await pageFixture.loginPage.submitConfiguredPasswordResetRequest();
});

Then("the password reset status and OTP prompt are visible", async function () {
    pageFixture.logger.info("Step: verify password reset status and OTP prompt");
    await pageFixture.loginPage.expectPasswordResetStatusAndOtpPrompt();
});

When("the agent opens the registration page", async function () {
    pageFixture.logger.info("Step: open the registration page");
    await pageFixture.loginPage.openRegistration();
});

Then("the logout button is not visible", async function () {
    pageFixture.logger.info("Step: verify logout button is hidden");
    await pageFixture.loginPage.expectLogoutButtonNotVisible();
});

When("the agent requests a password reset OTP with the configured test email", async function () {
    pageFixture.logger.info("Step: request password reset OTP with configured test email");
    await pageFixture.loginPage.requestPasswordResetOtp();
});

Then("the password reset OTP confirmation is visible", async function () {
    pageFixture.logger.info("Step: verify password reset OTP confirmation");
    await pageFixture.loginPage.expectPasswordResetOtpConfirmation();
});

When("the agent logs out", async function () {
    pageFixture.logger.info("Step: log out the agent");
    await pageFixture.loginPage.clickLogout();
});

Then("the login form is visible after logout", async function () {
    pageFixture.logger.info("Step: verify login form after logout");
    await pageFixture.loginPage.expectLoginFormAfterLogout();
});

When("the agent opens the Products tab", async function () {
    pageFixture.logger.info("Step: open the Products tab");
    await pageFixture.productsPage.openFromNavigation();
});

Then("the configured product card {string} is visible", async function (productKey: string) {
    pageFixture.logger.info(`Step: verify configured product card '${productKey}'`);
    await pageFixture.productsPage.expectProductCard(productKey);
});

When("the agent opens the details for product {string}", async function (productKey: string) {
    pageFixture.logger.info(`Step: open details for configured product '${productKey}'`);
    await pageFixture.productsPage.openProductDetails(productKey);
});

Then("the configured product details for {string} are visible", async function (productKey: string) {
    pageFixture.logger.info(`Step: verify configured product details for '${productKey}'`);
    await pageFixture.productsPage.expectProductDetails(productKey);
});

Then("the Products back link is visible", async function () {
    pageFixture.logger.info("Step: verify Products back link");
    await pageFixture.productsPage.expectBackLink();
});