Feature: Customer Support

	@support_TC01 @support
	Scenario: Verify the Support page
		Given the user is logged in to the Fins Retail application
		When the user opens Support
		Then the Support page should display the expected content

	@support_TC02 @support
	Scenario: Reject a Support message shorter than ten characters
		Given the user is logged in to the Fins Retail application
		When the user opens Support
		And the user submits a short Support message
		Then the Support message validation error should be displayed

	@support_TC03 @support
	Scenario: Raise a new Support request
		Given the user is logged in to the Fins Retail application
		When the user opens Support
		And the user raises the configured Support request
		Then the Support request confirmation should be displayed
		When the user chooses to raise another Support request
