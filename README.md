# Playwright Cucumber Assessment

A TypeScript UI automation project for the InsOrderEntry demo application. Tests are written in Gherkin with Cucumber.js and executed in Playwright-managed browsers. The suite uses page objects, shared test data, per-scenario logging, and Cucumber reports with failure evidence.

## Requirements

- Node.js and npm
- The InsOrderEntry demo application running at the configured address: `http://127.0.0.1:8081`
- A valid QA test account configured in `tests/InsOrderEntry/testdata/InsOrderEntrydata.json`
- A browser supported by Playwright: Chromium, Firefox, or WebKit

The test suite does not start the application server. Start it separately before running browser tests.

## Setup

Install the project dependencies and browser binaries:

```bash
npm install
npx playwright install chromium firefox webkit
```

The selected environment is loaded from `tests/helpers/Environment/.env.<ENV>`. The npm test script sets `ENV=qa`, so the default file is `tests/helpers/Environment/.env.qa`. Set these values in that file:

```dotenv
BROWSER=chromium
HEADLESS=true
```

`BROWSER` must be `chromium`, `firefox`, or `webkit`. `HEADLESS` must be `true` or `false` (case-insensitive). The browser manager rejects missing or unsupported values.

The application URL, login path, and test account are currently stored in `tests/InsOrderEntry/testdata/InsOrderEntrydata.json`. Keep credentials limited to non-production test accounts and do not store production secrets in test data.

## Running Tests

Run the complete InsOrderEntry Cucumber suite from the repository root:

```bash
npm test
```

Run selected scenarios by tag:

```bash
npm test -- --tags "@Login"
npm test -- --tags "@Applications"
npm test -- --tags "@Products"
npm test -- --tags "@Support"
npm test -- --tags "@TC-014"
```

Check feature parsing and step bindings without launching browser actions:

```bash
npx cucumber-js --config cucumber.js --dry-run
```

Type-check the TypeScript project:

```bash
npx tsc --noEmit
```

Some scenarios carry the `@bug` tag to identify defect reproductions. Review those cases when interpreting a full-suite result; the test runner does not automatically treat tagged scenarios as expected failures.

## Test Coverage

| Feature | Coverage |
| --- | --- |
| Login | Configured and invalid login, authenticated navigation, logout, forgot-password and registration flows |
| Products | Catalog cards and product detail views for configured products |
| Support | Support form visibility and configured request submission |
| Applications | Draft creation, configured applicant/product details, rider selection, beneficiaries, document upload, review validation, submission, and application summary |
| Dashboard | Dashboard components, status cards, recent applications, and opening an existing application |

Feature files are in `tests/InsOrderEntry/features/`. Step definitions are in `tests/InsOrderEntry/steps/`, and browser interactions are implemented in page objects under `tests/InsOrderEntry/pages/`.

## Test Data

`tests/InsOrderEntry/testdata/InsOrderEntrydata.json` is the central source for application, applicant, beneficiary, product, login, support, and validation data. Scenario and product keys in feature files refer to records in this file. The PDF used by the document-upload scenario is `tests/InsOrderEntry/testdata/Test_file.pdf`.

When adding a scenario, prefer adding or updating a named data record and referencing its key from Gherkin rather than embedding applicant details, contact values, expected messages, or file names in the feature file.

## Project Layout

```text
.
|-- cucumber.js                     # Active Cucumber configuration and timestamped HTML report output
|-- cucumber.json                   # Alternate/legacy Cucumber configuration
|-- playwright.config.ts            # Playwright Test config; not used by npm test
|-- tsconfig.json                   # TypeScript compiler settings
|-- tests/
|   |-- base/
|   |   |-- hooks.ts                # Browser lifecycle, scenario logs, screenshots, and videos
|   |   `-- pagefixture.ts          # Shared page-object and logger references
|   |-- helpers/
|   |   |-- browsers/               # Browser selection and launch configuration
|   |   |-- Environment/            # Environment loader and .env.qa
|   |   |-- types/                  # Shared TypeScript declarations
|   |   `-- util/                   # Winston logger configuration
|   `-- InsOrderEntry/
|       |-- features/               # Gherkin specifications
|       |-- pages/                  # Page objects
|       |-- steps/                  # Cucumber step definitions
|       `-- testdata/               # JSON data and upload fixtures
|-- reports/                        # Generated timestamped Cucumber HTML reports
`-- test-result/                    # Scenario logs, failure screenshots, and videos
```

## Execution and Artifacts

- `npm test` runs Cucumber using `cucumber.js`; it does not invoke the separate Playwright Test runner configuration.
- Cucumber scenarios run sequentially (`parallel: 1`) with a 30-second default step timeout.
- The browser is launched once per run. Each scenario receives a new browser context and page at a 1280 x 900 viewport.
- A Winston `info` log is created for each scenario under `test-result/logs/`. Step definitions and page-object methods write action-level log messages.
- Each run creates a timestamped report under `reports/`.
- Failed scenarios save a full-page screenshot under `test-result/screenshots/` and retain a video under `test-result/videos/`; passing-scenario videos are removed after the scenario.
- Generated artifacts are not automatically purged. Remove old files only when storage cleanup is desired.

## Adding or Updating Tests

1. Add or update the scenario in the appropriate `.feature` file.
2. Store scenario inputs and expected values in `InsOrderEntrydata.json`.
3. Bind the Gherkin step in the matching step-definition file.
4. Implement browser interactions and assertions in the relevant page object.
5. Run `npx tsc --noEmit` and `npx cucumber-js --config cucumber.js --dry-run` before running the affected scenario against the application.

Keep logs useful for diagnosing actions, but do not log passwords, authentication tokens, or other secrets.
