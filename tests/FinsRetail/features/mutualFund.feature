Feature: Mutual fund investment

	Scenario: Place a SIP investment in a low-risk mutual fund
		Given the user is logged in to the Fins Retail application
		When the user opens Mutual Funds
		And the user filters funds by "Low" risk
		And the user opens fund "FSLIQ009" details
		And the user starts an investment
		And the user verifies the fund details
		And the user enters a SIP investment of "500"
		And the user selects "UPI" payment and accepts the declaration
		When the user confirms the investment
		Then the investment order should be placed
		And the investment order details should be displayed

	Scenario: Place a lump-sum investment of 100000 in a low-risk mutual fund
		Given the user is logged in to the Fins Retail application
		When the user opens Mutual Funds
		And the user filters funds by "Low" risk
		And the user opens fund "FSLIQ009" details
		And the user starts an investment
		And the user verifies the fund details
		And the user enters a lump-sum investment of "100000"
		And the user selects "UPI" payment and accepts the declaration
		When the user confirms the investment
		Then the investment order should be placed
		And the investment order details should be displayed
