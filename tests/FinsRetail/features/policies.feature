Feature: Policies

	@policies_TC01 @policies
	Scenario: Verify the Policies page
		Given the user is logged in to the Fins Retail application
		When the user opens Policies
		Then the Policies page should display the expected content

	@policies_TC02 @policies
	Scenario: Verify Policies can be filtered by status
		Given the user is logged in to the Fins Retail application
		When the user opens Policies
		And the user filters Policies by the configured status
		Then the configured policy status results should be displayed

	@policies_TC03 @policies
	Scenario: View policy details from Policies
		Given the user is logged in to the Fins Retail application
		When the user opens Policies
		And the user opens the configured policy details
		Then the configured policy details should be displayed
		When the user returns to Policies
		Then the configured policy status results should be displayed

	@policies_TC04 @policies @bug
	Scenario: Reproduce policy download failure
		Given the user is logged in to the Fins Retail application
		When the user opens Policies
		And the user attempts to download the configured policy
