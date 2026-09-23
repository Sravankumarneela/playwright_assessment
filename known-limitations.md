# Known Limitations

## Application And Test Data

- The tests depend on the locally running Fins Retail application at `http://127.0.0.1:8082` by default.
- Several tests depend on seeded IDs and values, including policy IDs `34`, `33`, and `32`, transaction IDs, fund codes, and insurance product codes.
- Test data is centralized in `tests/FinsRetail/Testdata/finsRetailData.json`, but the application state is not reset automatically before each scenario.
- Purchase, investment, redemption, support-request, and policy workflows can create or mutate application data.
- Tests that rely on fixed dates, amounts, statuses, policy numbers, or transaction references can become stale when seeded data changes.

## Known Product Defects

The following scenarios are intentionally expected to fail while the application defects remain open:

- `@insurance_TC04`: future-dated date of birth is accepted for product `FSLIFE002`.
- `@mutualfund_TC02`: one-year-return sorting does not reorder fund cards correctly.
- `@policies_TC04`: clicking the policy download button produces no browser download event.
- `@transactions_TC04`: pagination arrow SVGs render much larger than the configured `24 x 24` pixel threshold.

Use `npm test -- --tags "not @bug"` for a run that excludes known defect reproductions.

## Browser And Environment

- The browser manager supports Chromium, Firefox, and WebKit, but selectors and seeded UI behavior are primarily validated with Chromium.
- `HEADLESS=true` runs headless; `HEADLESS=false` runs headed. Headed Chromium uses `--start-maximized` and a native viewport.
- The `HEADLESS` environment value must be exactly `true` or `false`.
- The browser is launched once per run, while each scenario receives a new browser context and page.
- The `playwright.config.ts` Playwright Test configuration is not the active runner configuration. `npm test` runs Cucumber through `cucumber.js`.
- The TypeScript configuration currently contains `ignoreDeprecations: "6.0"`, which is incompatible with the installed TypeScript 5.9 compiler. Use `npx tsc --noEmit --ignoreDeprecations 5.0` until the configuration is aligned.

## Reporting And Artifacts

- Every run creates a new timestamped report under `reports/cucumber-report-YYYYMMDDHHMMSS.html`.
- Failed scenarios save screenshots under `test-result/screenshots/` and attach them to the Cucumber report.
- Failed scenarios retain videos under `test-result/videos/`; passing-scenario videos are deleted after the context closes.
- Video finalization depends on browser-context shutdown. A failure during setup may prevent a video from being available.
- Artifact directories are not automatically cleaned, so long-running execution can accumulate reports, screenshots, videos, and logs.
- Scenario names are converted into filenames, so unusual or duplicate names may produce less readable artifact names.

## Execution And Maintenance

- Cucumber runs scenarios sequentially with `parallel: 1`.
- There is no API/database setup layer or fixture reset layer; all workflows use the UI.
- Full-suite execution can fail because the suite intentionally includes known bug reproductions.
- The current framework does not enforce a separate pass/fail gate that excludes expected defect scenarios.
- The test data JSON contains credentials for the QA test account and should be treated as environment-specific test data.
- Tests should be run from the repository root because environment and report paths are relative paths.
- The current screenshot/video evidence is attached by the Cucumber hooks; step-level screenshots may use separate logic and artifact locations.
