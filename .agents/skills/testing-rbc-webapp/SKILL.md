---
name: testing-rbc-webapp
description: Run and end-to-end test the RBC Angular Accounts Summary demo, including account histories, quick transfers, and responsive layouts.
---

# Testing the RBC Consumer Webapp

## Running the app

Use Node 22 and the repository's installed dependencies:

```bash
source ~/.nvm/nvm.sh
npx ng serve --port 4200
```

Wait for Angular's ready message or an HTTP 200 before navigating to
http://localhost:4200. Startup duration varies; do not assume a fixed delay.
There is no backend, auth, or route navigation. All data is in NgRx, and
reloading resets transfers and UI state.

## Source and UI paths

- `src/app/store/accounts/accounts.reducer.ts`: seeded accounts, histories,
  and transfer posting.
- `src/app/store/transfer/transfer.reducer.ts`: form defaults.
- `src/app/store/transfer/transfer.effects.ts`: transfer orchestration.
- `src/app/store/transfer/transfer.validation.ts`: amount parsing and guards.
- `src/app/store/ui/ui.reducer.ts`: menu, selected history, and nav state.
- Bank Accounts → an account's Options → View Account History selects that
  account. The section appears below Bank Accounts; it does not navigate.
- Back to Accounts Summary removes history; switching primary nav tabs clears it.
- Quick Payments & Transfers defaults to Day to Day → eSavings in CAD.
  A valid submission updates both balances and adds rows to both histories.

## Validation checks

Inspect the current template and guard order before designing negative cases.
The amount input is now a text field with `inputmode="decimal"` and a string
store value; older advice describing a number input's native min/step
validation does not apply to this implementation.

Always inspect the displayed input before submitting edge values and check
the balances afterwards. Differentiate browser-native validation from
application alerts if future versions reintroduce numeric inputs.

## History assertions

Use rendered rows to verify dates are newest first and that, moving from older
to newer, previous balance plus the newer amount equals the newer balance.
The newest row's balance should match Current Balance and the account list.
Verify credits visibly have a plus sign and green text, not merely a CSS class.
After switching accounts, check there is one history section and the account
name/number and rows have changed.

## Recording and responsive checks

Maximize Chrome before recording:

```bash
wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz
```

For an exact narrow viewport, open DevTools with F12 and use Ctrl+Shift+M
for the device toolbar. Select Responsive and enter the desired width
(e.g. 400). Keep the browser maximized and scroll inside the emulated page.
Restore normal mode with Ctrl+Shift+M then F12.

If device emulation is unavailable, resize the window with wmctrl and zoom
in if the browser minimum width prevents the intended CSS width. Confirm the
actual viewport; physical display pixels and CSS pixels are not equivalent.

Supplement screenshots with read-only geometry checks:

```js
({
  viewport: document.documentElement.clientWidth,
  documentWidth: document.documentElement.scrollWidth,
  table: document.querySelector('.history__table')?.getBoundingClientRect()
})
```

Check the table and its containing section's clientWidth and scrollWidth too.
DOM text alone is not proof that columns are visible: scroll through the table
and capture screenshots with all four columns.

## Devin Secrets Needed

None. The app is a local mock with no authentication or backend.
