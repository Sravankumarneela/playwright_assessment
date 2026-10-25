Feature: InsOrderEntry applications

    Background:
		Given the InsOrderEntry login page is open
		When the agent enters the configured credentials
		And the agent submits the login form
		Then the authenticated navigation is visible

    @TC-010 @Applications
	Scenario: Applications page shows the list and new application action
		When the agent opens the Applications tab
		Then the Applications page view is visible

    @Applications
	Scenario Outline: Submit an application with configured beneficiary data for <scenarioKey>
		When the agent submits configured application "<scenarioKey>" with the ID proof document
		Then the application submission confirmation is visible

		@TC-011
		Examples: Single beneficiary application
			| scenarioKey |
			| happyPath |

		@TC-013
		Examples: Multiple beneficiaries and another product
			| scenarioKey |
			| multipleBeneficiaries |

		@TC-016
		Examples: Minor beneficiary with guardian
			| scenarioKey |
			| minorBeneficiary |

    @TC-017 @Applications
	Scenario: Submit an application with multiple riders
		When the agent completes the client, contact, financial, product, and rider details for "multipleRiders"
		And the agent saves the configured beneficiaries and proceeds to document upload
		And the agent uploads the configured test document
		And the agent reviews, validates, and submits the application
		Then the application submission confirmation is visible

    @TC-018 @Applications
	Scenario: Submit an application without selecting any riders
		When the agent completes the client, contact, financial, and product details for "noRiders" and leaves every rider unselected
		And the agent saves the configured beneficiaries and proceeds to document upload
		And the agent uploads the configured test document
		And the agent reviews, validates, and submits the application
		Then the application submission confirmation is visible

    @TC-019 @Applications
	Scenario: Submit an application with the ID proof document
		When the agent completes the client, contact, financial, product, and rider details for "noRiders"
		And the agent saves the configured beneficiaries and proceeds to document upload
		And the agent uploads the configured test document
		And the agent reviews, validates, and submits the application
		Then the application submission confirmation is visible

	@TC-024 @Applications @bug
	Scenario: Prevent submission when the ID proof document is missing
		When the agent completes the client, contact, financial, product, and rider details for "happyPath"
		And the agent saves the configured beneficiaries and proceeds to document upload
		And the agent attempts to submit without the ID proof document
		Then the missing ID proof error is displayed and submission is blocked

    @TC-012 @Applications @bug
	Scenario: Review validation rejects a invalid beneficiary email
		When the agent prepares configured application "invalidBeneficiaryEmail" to add a beneficiary
		And the agent attempts to save its configured beneficiary
		Then the review page displays the beneficiary email validation error

    @TC-014 @Applications
	Scenario: Run Validation rejects a client younger than eighteen
		When the agent prepares configured application "underageClient" for review
		And the agent runs validation on the application
		Then the review page displays the configured validation error for "underageClient"

    @TC-020 @Applications
	Scenario: Run Validation rejects a client older than sixty-five
		When the agent prepares configured application "overageClient" for review
		And the agent runs validation on the application
		Then the review page displays the configured validation error for "overageClient"

    @TC-021 @Applications
	Scenario: Run Validation rejects an invalid primary email
		When the agent prepares configured application "invalidPrimaryEmail" for review
		And the agent runs validation on the application
		Then the review page displays the configured validation error for "invalidPrimaryEmail"

    @TC-015 @Applications
	Scenario: Verify the  Application summary layout and workflow links in the Application summary page
		When the agent submits configured application "summary" with the ID proof document
		Then the application submission confirmation is visible
		When the agent creates a draft from scenario "summary" and opens its summary
		Then the configured application summary and workflow links are visible for "summary"
