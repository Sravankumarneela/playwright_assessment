# Fins Retail Playwright Assessment

TypeScript end-to-end tests for the Fins Retail application. The framework uses Playwright for browser automation and Cucumber for Gherkin feature files, step definitions, reporting, and scenario filtering.

## Prerequisites

- Node.js and npm
- The Fins Retail application running locally
- The application available at `http://127.0.0.1:8082` unless another environment file is configured
- Playwright browser binaries installed locally

Install dependencies and browsers:

```bash
npm install
npx playwright install
```

## Project Layout

```text
.
|-- cucumber.js                   Timestamped Cucumber configuration
|-- cucumber.json                 Static Cucumber configuration reference
|-- package.json                  npm scripts and dependencies
|-- playwright.config.ts         Playwright Test configuration scaffold
|-- tsconfig.json                TypeScript configuration
|-- reports/                     Generated Cucumber HTML report
|-- test-result/
|   |-- logs/                    Scenario logs
|   `-- screenshots/              Saved screenshots when present
`-- tests/
	|-- base/
	|   |-- hooks.ts              Browser and scenario lifecycle
	|   `-- pagefixture.ts        Shared page-object registry
	|-- FinsRetail/
	|   |-- features/             Gherkin scenarios
	|   |-- pages/                Page objects
	|   |-- steps/                Step definitions
	|   `-- Testdata/             JSON test data
	`-- helpers/
		|-- browsers/             Browser selection and launch
		|-- Environment/          Environment loading
		|-- types/                Environment type declarations
		`-- util/                 Winston logger setup
```

## Configuration

The npm test script runs:

```text
cross-env ENV=qa cucumber-js --config cucumber.js
```

`tests/helpers/Environment/env.ts` loads the file matching `ENV`:

```text
tests/helpers/Environment/.env.<ENV>
```

The current QA configuration is:

```text
BASEURL=http://127.0.0.1:8082
HEADLESS=false
BROWSER=chromium
```

Supported environment variables:

| Variable | Values | Purpose |
| --- | --- | --- |
| `ENV` | `dev`, `qa`, `staging`, `prod` | Selects the environment file |
| `BASEURL` | URL | Application login URL |
| `BROWSER` | `chromium`, `firefox`, `webkit` | Browser engine |
| `HEADLESS` | `true`, `false` | Declared configuration value |

The browser manager converts `HEADLESS` to a boolean at launch time. Use `HEADLESS=true` for headless execution or `HEADLESS=false` for headed execution. When headed, Chromium is launched with `--start-maximized`, and each scenario uses the native browser viewport.

## Running Tests

Run the complete Cucumber suite:

```bash
npm test
```

Run one feature:

```bash
npm test -- tests/FinsRetail/features/insurance.feature
```

Run one scenario by name:

```bash
npm test -- --name "Verify the Transactions page"
```

Run scenarios by tag:

```bash
npm test -- --tags "@bug"
npm test -- --tags "@transactions_TC04"
npm test -- --tags "@transactions"
npm test -- --tags "not @bug"
```

Run using another browser:

```bash
cross-env ENV=qa BROWSER=firefox cucumber-js --config cucumber.js
cross-env ENV=qa BROWSER=webkit cucumber-js --config cucumber.js
```

Validate TypeScript with the repository's current TypeScript version:

```bash
npx tsc --noEmit --ignoreDeprecations 5.0
```

The `tsconfig.json` value `ignoreDeprecations: "6.0"` is not accepted by the installed TypeScript 5.9 compiler, so the command-line override is currently required for type-checking.

## Test Architecture

1. Cucumber loads features from `tests/FinsRetail/features/*.feature`.
2. Cucumber loads hooks from `tests/base/*.ts` and steps from `tests/FinsRetail/steps/*.ts`.
3. `BeforeAll` loads the selected environment and launches one browser.
4. `Before` creates a new browser context and page for each scenario.
5. `pagefixture.ts` stores the page, logger, and initialized page objects.
6. Each scenario starts at `BASEURL`.
7. Step definitions translate Gherkin into page-object method calls.
8. Page objects own locators, browser interactions, and workflow assertions.
9. Shared values are read from `tests/FinsRetail/Testdata/finsRetailData.json`.
10. The `After` hook attaches a full-page PNG screenshot only for failed scenarios, then closes the page and context.

Most locators use accessible roles or application `data-testid` attributes. The application must retain the seeded IDs and labels used by the test data.

## Feature Coverage

### Login

File: `tests/FinsRetail/features/login.feature`

- Successful login with valid credentials
- Rejection of invalid credentials

### Insurance

File: `tests/FinsRetail/features/insurance.feature`

- Verify the Insurance page and products
- Search and filter insurance products
- Create a new insurance policy with generated applicant data
- `@bug`: Reproduce acceptance of a future-dated date of birth

### Mutual Funds

File: `tests/FinsRetail/features/mutualFund.feature`

- Verify the Mutual Funds page
- `@bug`: Verify one-year-return descending sort
- Place a low-risk SIP investment
- Place a low-risk lump-sum investment

### Policies

File: `tests/FinsRetail/features/policies.feature`

- Verify the Policies page
- Filter policies by status
- View policy details and return to the list
- `@bug`: Reproduce policy download failure

### Transactions

File: `tests/FinsRetail/features/transactions.feature`

- Verify the Transactions page
- Search and filter transactions by text, type, status, and date
- View transaction details and return to the list
- `@transactions_TC04 @transactions @bug`: Reproduce oversized pagination arrows with screenshot evidence

### Customer Support

File: `tests/FinsRetail/features/support.feature`

- Verify the Support page
- Reject a message shorter than ten characters
- Raise a support request and start another request

### Portfolio

File: `tests/FinsRetail/features/portfolio.feature`

- Verify the portfolio overview
- Redeem an amount from a holding
- Open portfolio investment options and complete the investment workflow

There are currently 24 scenarios across seven feature files. Four scenarios are tagged `@bug`.

## Page Objects

Page objects are in `tests/FinsRetail/pages/` and are initialized in `tests/base/hooks.ts`.

| Page object | Responsibilities |
| --- | --- |
| `LoginPage` | Login navigation, credential entry, and login result checks |
| `InsurancePage` | Insurance navigation, search, filters, policy purchase, confirmation, and future-DOB regression |
| `MutualFundPage` | Fund filtering, sorting, details, SIP, and lump-sum investment workflows |
| `PoliciesPage` | Policy filtering, list/detail navigation, and download regression |
| `TransactionsPage` | Transaction search, filters, details, pagination evidence, and arrow-size regression |
| `SupportPage` | Support form, message validation, request confirmation, and repeat request flow |
| `PortfolioPage` | Portfolio overview, redemption, and portfolio investment workflows |

## Test Data

The central data file is `tests/FinsRetail/Testdata/finsRetailData.json`. It contains:

- Valid and invalid login credentials
- Expected page labels and test IDs
- Insurance products, filters, purchase values, and confirmation data
- Mutual fund IDs, sort options, and investment amounts
- Policy IDs, statuses, table values, and detail expectations
- Transaction IDs, search terms, filter values, dates, and detail expectations
- Support categories, invalid/valid messages, and confirmation values
- Portfolio holding, redemption, and investment values

Applicant names, mobile numbers, email addresses, and future dates used by Insurance regressions are generated at runtime where required. Keep seeded product, policy, and transaction IDs synchronized with the local application.

## Reports and Artifacts

After a test run:

- Cucumber HTML report: `reports/cucumber-report-<timestamp>.html`
- Scenario logs: `test-result/logs/<scenario-name><pickle-id>.log`
- Failure screenshots: saved as `test-result/screenshots/<scenario-name>-<timestamp>.png` and embedded as Base64 PNG attachments in the Cucumber report
- Failure videos: saved as `test-result/videos/<scenario-name>-<timestamp>.webm` and embedded in the Cucumber report
- Additional saved screenshots: `test-result/screenshots/` when a workflow or prior hook writes them

Playwright records each scenario temporarily so it can finalize the video after the browser context closes. Videos from passing scenarios are deleted; only failed-scenario videos are retained.

Each run creates a new report using the `html:reports/cucumber-report-<timestamp>.html` formatter configured in `cucumber.js`; previous reports are retained.

## Known Bug Reproductions

These tests are expected to fail while the corresponding application bugs remain open:

- **Future DOB accepted:** the Insurance regression generates a future date and reports acceptance for product `FSLIFE002`.
- **Mutual fund sorting:** the one-year-return sort regression compares the displayed order with a descending baseline.
- **Policy download:** the Policies regression waits for a Playwright download event and reports when no file is downloaded.
- **Oversized transaction arrows:** the Transactions regression captures a screenshot and reports actual arrow dimensions above the configured `24 x 24` pixel limit.

Run only the bug regressions with:

```bash
npm test -- --tags "@bug"
```

## Troubleshooting

- Confirm the Fins Retail application is running at the configured `BASEURL`.
- Confirm `tests/helpers/Environment/.env.qa` exists when using the default `ENV=qa` command.
- Confirm `BROWSER` is one of `chromium`, `firefox`, or `webkit`.
- If seeded IDs or labels changed in the application, update `finsRetailData.json` and the relevant page object locators.
- Use scenario-name or tag filtering to isolate failures before running the full suite.
- A failing `@bug` scenario is expected when it reproduces its documented defect.

## Main Files

- `package.json`: npm scripts and dependencies
- `cucumber.js`: Cucumber paths, TypeScript registration, sequential execution, and timestamped HTML reporter
- `cucumber.json`: legacy static Cucumber configuration reference
- `tsconfig.json`: TypeScript compiler settings
- `tests/base/hooks.ts`: browser lifecycle, page initialization, and failure screenshots
- `tests/base/pagefixture.ts`: shared page-object registry
- `tests/helpers/browsers/browserManager.ts`: browser selection and launch
- `tests/helpers/Environment/env.ts`: environment file loading
- `tests/helpers/util/logger.ts`: scenario log configuration
- `known-limitations.md`: current framework, environment, data, and defect limitations
- `reset-notes.md`: state reset procedure and post-reset execution guidance
- `qa-summary.md`: QA coverage, execution status, risk assessment, and release recommendation
