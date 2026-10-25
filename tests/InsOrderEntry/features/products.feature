Feature: InsOrderEntry products

    @TC-007 @Products
	Scenario Outline: Agent views a product card and its details
		Given the InsOrderEntry login page is open
		When the agent enters the configured credentials
		And the agent submits the login form
		And the agent opens the Products tab
		Then the configured product card "<productKey>" is visible
		When the agent opens the details for product "<productKey>"
		Then the configured product details for "<productKey>" are visible
		And the Products back link is visible

		Examples:
			| productKey   |
			| eliteLegacy  |
			| flexiPay     |
			| secureBasic  |
			| wealthBuilder |
