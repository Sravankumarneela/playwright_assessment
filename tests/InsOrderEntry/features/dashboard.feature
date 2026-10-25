Feature: InsOrderEntry agent dashboard

	Background:
		Given the InsOrderEntry login page is open
		When the agent enters the configured credentials
		And the agent submits the login form
		Then the authenticated navigation is visible

	@TC-022 @Dashboard
	Scenario: Validate the dashboard page and its components
		When the agent opens the Dashboard tab
		Then the dashboard page and its components are displayed

	@TC-023 @Dashboard
	Scenario: Open an existing application from the dashboard
		When the agent opens the Dashboard tab
		And the agent opens an existing application from the dashboard
		Then the existing application's summary is displayed
