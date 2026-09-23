import { Given, When, Then } from '@cucumber/cucumber';
import { pageFixture } from '../../base/pagefixture';
import { expect } from 'playwright/test';
import * as data from '../Testdata/finsRetailData.json';

Given('User is on the login page', async function () {
  const baseUrl = process.env.BASEURL;
  if (!baseUrl) {
    throw new Error('BASEURL is not configured');
  }
  await pageFixture.loginPage.navigateToLoginPage(baseUrl);
});

When('user enters the valid credentials', async function () {
    await pageFixture.loginPage.enterloginDetails(data.username, data.password);
});

When('User click on login button', async function () {
    await pageFixture.loginPage.clickLoginButton();
});

Then('User should be login successfully', async function () {
  await expect(await pageFixture.loginPage.isLoginSuccessful()).toBe(true);
});

When('user enters the invalid email and password', async function () {
  await pageFixture.loginPage.enterloginDetails(data.invalidUsername, data.invalidPassword);
});

Then('User should be not login successfully', async function () {
  await expect(await pageFixture.loginPage.isLoginSuccessful()).toBe(false);
});

When('user logs out of the Fins Retail application', async function () {
  await pageFixture.loginPage.logout();
});

Then('the logout confirmation should be displayed', async function () {
  await pageFixture.loginPage.verifyLogoutMessage();
});

When('user submits the login form without values', async function () {
  await pageFixture.loginPage.submitEmptyLogin();
});

Then('the configured empty login validation messages should be displayed', async function () {
  await pageFixture.loginPage.verifyValidationMessages(data.login.emptyValidationMessages);
});

When('user submits the configured wrong username and password', async function () {
  await pageFixture.loginPage.verifyInvalidCredentials(
    data.login.wrongUsername,
    data.login.wrongPassword,
    data.login.invalidCredentialsMessage
  );
});