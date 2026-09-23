Feature: Login tests

@login_TC01 @login
Scenario: User should login successfully to the Fins Retail application
Given User is on the login page
When user enters the valid credentials
And User click on login button
Then User should be login successfully

@login_TC02 @login
Scenario: User should not login successfully to the Fins Retail application
Given User is on the login page
When user enters the invalid email and password
And User click on login button
Then User should be not login successfully

@login_TC03 @login
Scenario: Verify the logout option
Given User is on the login page
When user enters the valid credentials
And User click on login button
And user logs out of the Fins Retail application
Then the logout confirmation should be displayed

@login_TC04 @login
Scenario: Verify Login validation messages
Given User is on the login page
When user submits the login form without values
Then the configured empty login validation messages should be displayed
When user submits the configured wrong username and password