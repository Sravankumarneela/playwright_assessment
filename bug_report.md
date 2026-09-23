# Fins Retail Bug Report

## Summary

This report documents the four known UI and functional defects covered by the automated `@bug` regression scenarios in this project. Each defect has a repeatable Cucumber scenario and uses the seeded Fins Retail test data.

| Bug | Test case | Area | Severity | Current result |
| --- | --- | --- | --- | --- |
| Future-dated DOB accepted | `@insurance_TC04` | Insurance purchase | High | Reproduced |
| One-year-return sort does not reorder funds | `@mutualfund_TC02` | Mutual Funds | Medium | Reproduced |
| Policy download produces no file | `@policies_TC04` | Policies | High | Reproduced |
| Transaction pagination arrows are oversized | `@transactions_TC04` | Transactions | Medium | Reproduced |

Run all bug reproductions with:

```bash
npm test -- --tags "@bug"
```

Reports are generated with a timestamped filename under `reports/`. Failed scenarios also produce screenshots under `test-result/screenshots/` and videos under `test-result/videos/`.

---

## BUG-001: Future-Dated Date of Birth Accepted

### Test Case

- Feature: Insurance products
- Tag: `@insurance_TC04 @insurance @bug`
- Product: FinServe Secure Future Term Plan
- Product code: `FSLIFE002`

### Description

The insurance purchase form accepts a date of birth that is in the future. A future date of birth is invalid customer data and should prevent policy creation.

### Steps To Reproduce

1. Log in to the Fins Retail application.
2. Open the Insurance page.
3. Select `Term Insurance`.
4. Apply the insurance filter.
5. Select `FinServe Secure Future Term Plan` using product code `FSLIFE002`.
6. Generate a future date dynamically using the current date plus one year.
7. Enter the future date in the insured date-of-birth field.
8. Enter valid insured and nominee details.
9. Select the nominee relationship.
10. Accept the declaration.
11. Submit the policy form.

Automation command:

```bash
npm test -- --tags "@insurance_TC04"
```

### Expected Result

The form rejects the future date of birth and displays a validation error. No insurance policy is created.

### Actual Result

The policy is created successfully even though the date of birth is in the future.

Example failure:

```text
BUG: Future-dated date of birth 2027-09-23 was accepted for insurance product FSLIFE002
```

The date is generated at runtime, so the test remains valid on future execution dates.

### Business Impact

- Invalid customer information can be stored in policy records.
- Age-based eligibility and premium calculations may be incorrect.
- Policies may be issued for customers who cannot logically exist at the supplied date of birth.
- Downstream compliance, underwriting, claims, and reporting processes may be affected.
- The defect creates data-quality and regulatory risk.

### Recommended Area To Fix

Validate that the insured date of birth is earlier than the current date both in the UI and on the server before policy creation.

---

## BUG-002: Mutual Funds Are Not Reordered By One-Year Return

### Test Case

- Feature: Mutual fund investment
- Tag: `@mutualfund_TC02 @mutualfund @bug`
- Sort option: `one_year_return_desc`

### Description

Selecting the one-year-return descending sort option and applying the filter does not reorder the fund cards by their one-year return values.

### Steps To Reproduce

1. Log in to the Fins Retail application.
2. Open the Mutual Funds page.
3. Record the one-year return of every displayed fund in the current DOM order.
4. Select `1-Year Return: High to Low`.
5. Apply the filter.
6. Record the one-year returns again in the displayed DOM order.
7. Compare the post-filter order with the descending sort of the original values.

Automation command:

```bash
npm test -- --tags "@mutualfund_TC02"
```

### Expected Result

Funds are reordered from the highest one-year return to the lowest one-year return.

### Actual Result

The displayed fund order does not match the descending one-year-return order. The regression compares the two numeric sequences and fails when they differ.

### Business Impact

- Customers may make investment decisions using an incorrect ranking.
- High-performing funds may be hidden below lower-performing funds.
- The sort control gives users false confidence that results are ordered correctly.
- Trust in the mutual-fund discovery and investment workflow is reduced.

### Recommended Area To Fix

Apply the selected sort value to the actual fund collection before rendering the cards, and verify that the API or client-side sort compares numeric return values rather than formatted strings.

---

## BUG-003: Policy Download Does Not Download A File

### Test Case

- Feature: Policies
- Tag: `@policies_TC04 @policies @bug`
- Policy ID: `34`
- Download control: `download-policy-button`

### Description

The policy details page displays a download button, but clicking the button does not produce a browser download event or a policy file.

### Steps To Reproduce

1. Log in to the Fins Retail application.
2. Open the Policies page.
3. Open policy `34`.
4. Wait for the policy details page to load.
5. Click the `Download Policy` button.
6. Wait for a file download event.

Automation command:

```bash
npm test -- --tags "@policies_TC04"
```

### Expected Result

A policy document downloads successfully and is available to the user.

### Actual Result

No file is downloaded after clicking the button. The automated test waits for a Playwright download event and reports:

```text
BUG: Policy file was not downloaded after clicking the download button for policy 34
```

### Business Impact

- Customers cannot retain or share their policy document.
- Users may need to contact support for a document that should be self-service.
- Policy servicing and compliance workflows are delayed.
- The visible download control appears functional but provides no result, causing a poor user experience.

### Recommended Area To Fix

Verify that the button triggers a valid file response or browser download, that the document endpoint is reachable, and that the response includes an appropriate filename and content type.

---

## BUG-004: Transaction Pagination Arrow Images Are Oversized

### Test Case

- Feature: Transactions
- Tag: `@transactions_TC04 @transactions @bug`
- Controls: Previous and Next pagination arrows

### Description

The pagination arrow SVGs on the Transactions page render at an abnormally large size instead of displaying as compact navigation icons.

### Steps To Reproduce

1. Log in to the Fins Retail application.
2. Open the Transactions page.
3. Locate the Previous and Next pagination controls.
4. Capture a full-page screenshot for visual evidence.
5. Measure the Previous and Next arrow SVG bounding boxes.

Automation command:

```bash
npm test -- --tags "@transactions_TC04"
```

### Expected Result

Pagination arrows are small, usable navigation icons. The regression threshold is a maximum of `24 x 24` pixels for each arrow.

### Actual Result

The arrow image is rendered at approximately `1078 x 1078` pixels in the current application.

Example failure:

```text
BUG: Transaction pagination arrow images are too large. Actual arrow size: 1078x1078px; expected at most 24x24px
```

The test attaches a full-page screenshot to the Cucumber report and saves failure evidence under `test-result/screenshots/`.

### Business Impact

- Pagination controls can dominate the page and obscure transaction content.
- Users may have difficulty understanding or using the navigation controls.
- The Transactions page layout becomes visually broken and less accessible.
- Large SVG rendering may increase layout cost and negatively affect responsive behavior.

### Recommended Area To Fix

Set explicit width and height constraints on the pagination icon and its container, for example `24px` by `24px`, and verify that global SVG or image styles do not override those constraints.

---

## Evidence And Artifacts

The test framework records failure evidence as follows:

- HTML report: `reports/cucumber-report-<YYYYMMDDHHMMSS>.html`
- Failed screenshots: `test-result/screenshots/<scenario-name>-<timestamp>.png`
- Failed videos: `test-result/videos/<scenario-name>-<timestamp>.webm`
- Scenario logs: `test-result/logs/`

Screenshots and videos are attached to the Cucumber report for failed scenarios. Passing scenarios do not retain video files.

## Test Implementation References

- Insurance regression: `tests/FinsRetail/pages/InsurancePage.ts`
- Mutual-fund regression: `tests/FinsRetail/pages/MutualFundPage.ts`
- Policy download regression: `tests/FinsRetail/pages/PoliciesPage.ts`
- Transaction pagination regression: `tests/FinsRetail/pages/TransactionsPage.ts`
- Failure evidence lifecycle: `tests/base/hooks.ts`
- Shared test data: `tests/FinsRetail/Testdata/finsRetailData.json`
