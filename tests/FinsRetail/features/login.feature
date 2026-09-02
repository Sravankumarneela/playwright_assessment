Feature: Login tests

Scenario: User should login successfully to the Fins Retail application
Given User is on the login page
When user enters the valid credentials
And User click on login button
Then User should be login successfully

Scenario: User should not login successfully to the Fins Retail application
Given User is on the login page
When user enters the valid credentials
And User click on login button
Then User should be login successfully