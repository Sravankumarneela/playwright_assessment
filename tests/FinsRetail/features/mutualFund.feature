Feature: Mutual fund investment

	@mutualfund_TC01 @mutualfund
	Scenario: Verify the mutual funds page
		Given the user is logged in to the Fins Retail application
		When the user opens Mutual Funds
		Then the mutual funds page should display the expected products
		
	@mutualfund_TC02 @mutualfund @bug
	Scenario: Verify mutual funds can be sorted by one-year return
		Given the user is logged in to the Fins Retail application
		When the user opens Mutual Funds
		And the user records the unsorted one-year returns for all displayed funds
		And the user sorts funds using the configured one-year return option
		Then the funds should be ordered by one-year return from high to low

	@mutualfund_TC03 @mutualfund
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

	@mutualfund_TC04 @mutualfund
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
