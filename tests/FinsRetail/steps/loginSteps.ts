import { Given, When, Then } from '@cucumber/cucumber';
import { pageFixture } from '../../base/pagefixture';
import { expect } from 'playwright/test';
import * as data from '../Testdata/finsRetailData.json';

Given('User is on the login page', async function () {
  await expect(pageFixture.page).toHaveURL('http://127.0.0.1:8082/login');
  pageFixture.logger.info('User is on the login page');
  const username = data.username;
});

When('user enters the valid credentials', async function () {
    await pageFixture.page.fill('input[name="email"]', 'admin');
    //await pageFixture.page.fill('input[name="password"]', 'password');
});

When('User click on login button', async function () {
  
});

Then('User should be login successfully', async function () {
  
});