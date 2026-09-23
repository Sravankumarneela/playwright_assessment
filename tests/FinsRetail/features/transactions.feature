Feature: Transactions

	@transactions_TC01 @transactions
	Scenario: Verify the Transactions page
		Given the user is logged in to the Fins Retail application
		When the user opens Transactions
		Then the Transactions page should display the expected content

	@transactions_TC02 @transactions
	Scenario: Verify Transactions search and filters
		Given the user is logged in to the Fins Retail application
		When the user opens Transactions
		And the user searches Transactions using the configured options
		Then the configured transaction filter results should be displayed

	@transactions_TC03 @transactions
	Scenario: View transaction details from Transactions
		Given the user is logged in to the Fins Retail application
		When the user opens Transactions
		And the user searches Transactions using the configured options
		And the user opens the configured transaction details
		Then the configured transaction details should be displayed
		When the user returns to Transactions
		Then the configured transaction filter results should be displayed

	@transactions_TC04 @transactions @bug
	Scenario: Reproduce oversized transaction pagination arrows
		Given the user is logged in to the Fins Retail application
		When the user opens Transactions
		And the user captures the Transactions pagination screenshot
		Then the Transactions pagination arrows should have the configured size
