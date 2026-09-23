# Reset Notes

Use these notes when a test run changes application state or seeded records no longer match the project test data.

## Before A Run

1. Start the Fins Retail application at the configured `BASEURL`.
2. Confirm the selected environment file exists, for example `tests/helpers/Environment/.env.qa`.
3. Confirm the QA account in `tests/FinsRetail/Testdata/finsRetailData.json` is valid.
4. Confirm seeded records still exist:
   - Insurance product `FSLIFE002`
   - Mutual fund `FSLIQ009`
   - Policies `34`, `33`, and `32`
   - Transaction references used by `finsRetailData.json`
   - Portfolio holding `4`
5. Run non-mutating smoke checks before workflows that create data:

```bash
npm test -- --tags "@login and @login_TC01"
npm test -- --tags "@insurance_TC01"
npm test -- --tags "@policies_TC01"
npm test -- --tags "@transactions_TC01"
```

## Tests That Mutate State

The following scenarios can create or change application records:

- `@insurance_TC03`: creates an insurance policy.
- `@mutualfund_TC03`: creates a SIP investment.
- `@mutualfund_TC04`: creates a lump-sum investment.
- `@portfolio_TC02`: submits a redemption for holding `4`.
- `@portfolio_TC03`: creates a portfolio investment.
- `@support_TC03`: creates a support request.
- `@insurance_TC04`: may create a policy while reproducing the future-DOB defect.

Run these scenarios separately when validating seeded data, and avoid assuming newly created IDs will match the fixed IDs in the JSON.

## Reset Procedure

The automation repository does not provide an API, database, or application reset command. Reset must be performed using the environment's supported application or data-management process.

1. Stop or finish the current test run.
2. Reset created policies, investments, redemptions, and support requests using the application admin/data reset mechanism.
3. Restore the seeded records and statuses expected by `tests/FinsRetail/Testdata/finsRetailData.json`.
4. Confirm policy `34` is available for the Policies detail and download scenarios.
5. Confirm the configured transaction references and portfolio holding values are restored.
6. Clear stale generated artifacts if required:

```powershell
Remove-Item -Recurse -Force test-result\videos\.tmp -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force test-result\screenshots -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force test-result\videos -ErrorAction SilentlyContinue
```

Reports under `reports/` are intentionally timestamped and should normally be retained. Delete old reports separately only when storage cleanup is required:

```powershell
Get-ChildItem reports -Filter 'cucumber-report-*.html' | Remove-Item
```

## Running After Reset

Exclude known defects when validating the healthy workflow set:

```bash
npm test -- --tags "not @bug"
```

Run defect reproductions independently:

```bash
npm test -- --tags "@bug"
```

Run a single workflow after reset:

```bash
npm test -- --tags "@insurance_TC03"
npm test -- --tags "@support_TC03"
```

## When Seeded Data Changes

Update these locations together:

- `tests/FinsRetail/Testdata/finsRetailData.json`
- The affected page object if locator or UI text changed
- The affected feature tag or scenario if the workflow changed
- `bug_report.md` if expected/actual defect behavior changed
- `test-design.xlsx` by rerunning `node tools/generate-test-design.js`

Do not replace generated transaction, policy, or order IDs in test data with values from a single run unless the application deliberately uses stable seeded fixtures.

## Reset Limitations

- Reset cannot be completed automatically by the current framework.
- UI-only cleanup may not remove all server-side records.
- A policy, transaction, support request, or investment created during a run may affect later list, filter, and detail scenarios.
- The exact reset mechanism is environment-specific and must be confirmed with the application owner or test-data administrator.
