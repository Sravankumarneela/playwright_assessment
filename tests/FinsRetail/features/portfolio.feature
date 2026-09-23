Feature: Portfolio redemption

    @portfolio_TC01 @portfolio
    Scenario: Verify the portfolio overview
        Given the user is logged in to the Fins Retail application for portfolio
        When the user opens the portfolio
        Then the portfolio overview should display the expected details

    @portfolio_TC02 @portfolio
    Scenario: Redeem an amount from a portfolio holding
        Given the user is logged in to the Fins Retail application for portfolio
        When the user opens the portfolio
        And the user starts redemption for the portfolio holding
        And the user enters the portfolio redemption details
        And the user submits the portfolio redemption
        Then the portfolio redemption should be submitted

    @portfolio_TC03 @portfolio
    Scenario: Invest in a moderate-risk fund from the portfolio
        Given the user is logged in to the Fins Retail application for portfolio
        When the user opens the portfolio
        And the user opens the portfolio investment options
        And the user selects the portfolio investment fund
        Then the portfolio investment fund details should be displayed
        When the user starts the portfolio investment
        And the user enters the portfolio investment details
        And the user confirms the portfolio investment
        Then the portfolio investment confirmation should be displayed