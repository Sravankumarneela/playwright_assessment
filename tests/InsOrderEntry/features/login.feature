Feature: InsOrderEntry login

    @TC-001 @Login
	Scenario: Agent logs in and sees authenticated navigation
		Given the InsOrderEntry login page is open
		When the agent enters the configured credentials
		Then the configured login form content is visible
		When the agent submits the login form
		Then the authenticated navigation is visible
		And the agent clicks the navigation brand
		Then the authenticated navigation is visible

    @TC-002 @Login
	Scenario: Invalid login is rejected
		Given the InsOrderEntry login page is open
		When the agent submits invalid configured credentials
		Then the invalid credentials message is visible

    @TC-003 @Login
	Scenario: Forgot password request for a valid email opens OTP verification
		Given the InsOrderEntry login page is open
		When the agent opens the forgot password page
		Then the forgot password prompt is visible
		When the agent submits the configured valid email for password reset
		Then the password reset status and OTP prompt are visible

    @TC-004 @Login @bug
	Scenario: Registration page does not show the logout button
		Given the InsOrderEntry login page is open
		When the agent opens the registration page
		Then the logout button is not visible

    @TC-005 @Login @bug
	Scenario: Password reset request confirms that an OTP was sent
		Given the InsOrderEntry login page is open
		When the agent requests a password reset OTP with the configured test email
		Then the password reset OTP confirmation is visible

    @TC-006 @Login
	Scenario: Agent logs out and returns to the login form
		Given the InsOrderEntry login page is open
		When the agent enters the configured credentials
		And the agent submits the login form
		Then the authenticated navigation is visible
		When the agent logs out
		Then the login form is visible after logout
