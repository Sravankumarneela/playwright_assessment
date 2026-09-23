Feature: Insurance products

	@insurance_TC01 @insurance
	Scenario: Verify the Insurance page
		Given the user is logged in to the Fins Retail application
		When the user opens Insurance
		Then the Insurance page should display the expected products

	@insurance_TC02 @insurance
	Scenario: Verify Insurance search and filters
		Given the user is logged in to the Fins Retail application
		When the user opens Insurance
		And the user searches Insurance for the configured term
		Then the configured Insurance search results should be displayed
		When the user resets the Insurance filters
		And the user selects the configured Insurance type
		And the user applies the Insurance type filter
		Then the configured health Insurance results should be displayed
		When the user resets the Insurance filters
		And the user selects the configured premium range and applies the filter
		Then the configured premium Insurance results should be displayed

	@insurance_TC03 @insurance
	Scenario: Buy a new Insurance policy with generated details
		Given the user is logged in to the Fins Retail application
		When the user opens Insurance
		And the user buys the configured Insurance policy with generated details
		Then the Insurance policy confirmation should display the configured details

	@insurance_TC04 @insurance @bug
	Scenario: Reject a future-dated date of birth when buying Insurance
		Given the user is logged in to the Fins Retail application
		When the user opens Insurance
		And the user attempts to buy Insurance with the configured future date of birth
