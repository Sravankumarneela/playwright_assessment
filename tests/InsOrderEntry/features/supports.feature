Feature: InsOrderEntry support

    Background:
		Given the InsOrderEntry login page is open
		When the agent enters the configured credentials
		And the agent submits the login form
		Then the authenticated navigation is visible

    @TC-008 @Support
	Scenario: Validate the support page
		When the agent opens the Support tab
		Then the support form is visible

    @TC-009 @Support
	Scenario: Raise a support request
		When the agent opens the Support tab
		And the agent submits the configured support request
		Then the support request confirmation is visible
