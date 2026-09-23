# Fins Retail QA Summary

**Test cycle:** QA regression and defect reproduction  
**Environment:** QA  
**Application:** Fins Retail  
**Base URL:** `http://127.0.0.1:8082`  
**Automation:** Playwright, Cucumber, TypeScript  
**Date:** 2026-09-23

## Executive Summary

The Fins Retail automation suite covers authentication, insurance, mutual funds, policies, transactions, customer support, and portfolio workflows. It contains 26 Cucumber scenarios, including positive workflows, validation checks, state-changing transactions, and four known defect reproductions.

The suite is suitable for QA regression and repeatable defect evidence. A full run is expected to return a non-zero exit code while the four tagged defects remain open. Healthy workflow validation should be evaluated separately with the known defects excluded.

## Coverage Summary

| Area | Scenarios | Coverage |
| --- | ---: | --- |
| Login | 4 | Valid login, invalid login, logout, empty and invalid credential validation |
| Insurance | 4 | Page, search/filter, policy purchase, future-DOB defect |
| Mutual Funds | 4 | Page, return sorting defect, SIP, lump-sum investment |
| Policies | 4 | Page, status filter, details, download defect |
| Transactions | 4 | Page, search/filter, details, pagination UI defect |
| Customer Support | 3 | Page, short-message validation, request creation |
| Portfolio | 3 | Overview, redemption, portfolio investment |
| **Total** | **26** | **22 healthy workflow cases and 4 known defect reproductions** |

## Execution Status

The suite uses timestamped Cucumber reports and runs scenarios sequentially.

| Metric | Status |
| --- | --- |
| Total scenarios | 26 |
| Known defect scenarios | 4 |
| Healthy workflow scenarios | 22 |
| Browser | Chromium by default; Firefox and WebKit supported |
| Execution mode | Controlled by `HEADLESS=true/false` |
| Full-suite result | Non-zero while known defects reproduce |
| Report | `reports/cucumber-report-YYYYMMDDHHMMSS.html` |
| Failed screenshots | Saved and embedded in the Cucumber report |
| Failed videos | Saved and embedded for failed scenarios only |

Recommended healthy workflow command:

```bash
npm test -- --tags "not @bug"
```

Run all known defect reproductions:

```bash
npm test -- --tags "@bug"
```

## Known Defects

### Insurance: Future Date Of Birth Accepted

- **Tag:** `@insurance_TC04 @insurance @bug`
- **Product:** `FSLIFE002`, FinServe Secure Future Term Plan
- **Expected:** A future date of birth is rejected and no policy is created.
- **Actual:** The purchase form accepts a generated future date and creates the policy.
- **Impact:** Invalid customer data, incorrect age eligibility, premium calculation risk, and possible compliance issues.
- **Evidence:** Failure screenshot, failure video, generated future DOB, Cucumber report, and scenario log.

### Mutual Funds: One-Year Return Sort Does Not Reorder Funds

- **Tag:** `@mutualfund_TC02 @mutualfund @bug`
- **Expected:** Fund cards are ordered from highest to lowest one-year return.
- **Actual:** The displayed order does not match the descending return sequence.
- **Impact:** Customers may compare or select funds using an incorrect ranking.
- **Evidence:** Before/after return values, failure screenshot, failure video, Cucumber report, and scenario log.

### Policies: Policy Download Produces No File

- **Tag:** `@policies_TC04 @policies @bug`
- **Policy:** `34`
- **Expected:** Clicking Download Policy produces a downloadable policy document.
- **Actual:** No browser download event or file is produced.
- **Impact:** Customers cannot self-serve policy documents, increasing support demand and delaying servicing.
- **Evidence:** Failure screenshot, failure video, download-event failure, Cucumber report, and scenario log.

### Transactions: Pagination Arrows Are Oversized

- **Tag:** `@transactions_TC04 @transactions @bug`
- **Expected:** Previous and Next arrows remain compact, with a maximum configured size of `24 x 24` pixels.
- **Actual:** The arrow SVG renders at approximately `1078 x 1078` pixels.
- **Impact:** Pagination controls dominate the page, obscure content, and reduce usability and accessibility.
- **Evidence:** Full-page failure screenshot, measured dimensions, failure video, Cucumber report, and scenario log.

## Risk Assessment

| Risk | Level | Reason |
| --- | --- | --- |
| Invalid insurance policy data | High | Future DOB can result in policy creation with invalid eligibility data. |
| Policy document availability | High | Customers cannot retrieve an expected contractual document. |
| Investment discovery accuracy | Medium | Incorrect fund sorting can influence investment decisions. |
| Transaction page usability | Medium | Oversized pagination controls impair navigation and layout. |
| Seeded-data drift | Medium | Fixed IDs and expected values can become stale after application changes. |
| Test data mutation | Medium | Purchase, investment, redemption, and support flows change application state. |

## Evidence And Reporting

The framework produces:

- Timestamped HTML reports: `reports/cucumber-report-<timestamp>.html`
- Failure screenshots: `test-result/screenshots/`
- Failure videos: `test-result/videos/`
- Scenario logs: `test-result/logs/`
- Test design workbook: `test-design.xlsx`
- Detailed defect documentation: `bug_report.md`

Screenshots and videos are retained only for failed scenarios. Passing-scenario videos are deleted after browser-context shutdown.

## Release Recommendation

**Recommendation: Conditional QA acceptance for healthy workflows; do not close the release with all defects unresolved.**

The 22 non-bug scenarios provide broad workflow coverage, but the four known defects affect policy validity, document access, investment discovery, and transaction usability. The release should be approved only if these defects are accepted with documented ownership and risk sign-off, or after the relevant fixes pass the tagged regression tests.

## Exit Criteria

Before release approval:

- All non-bug scenarios pass with `npm test -- --tags "not @bug"`.
- Each known defect has an owner, priority, and target fix version.
- Policy, transaction, fund, and insurance seeded data is restored and verified.
- Failure evidence is available in the timestamped Cucumber report.
- Any state-changing test data is reset or isolated before final regression execution.
- The four bug scenarios are rerun after fixes and no longer reproduce the documented failures.

## Source Documents

- [README.md](README.md)
- [bug_report.md](bug_report.md)
- [known-limitations.md](known-limitations.md)
- [reset-notes.md](reset-notes.md)
- [test-design.xlsx](test-design.xlsx)
