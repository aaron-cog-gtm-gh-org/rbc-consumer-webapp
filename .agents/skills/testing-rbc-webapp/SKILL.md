---
name: testing-rbc-webapp
description: How to run and end-to-end test the RBC Consumer Webapp (Angular 22 + NgRx) Accounts Summary demo locally, including the quick-transfer form, NgRx-effect validation, dropdown state, and responsive checks.
---

# Testing the RBC Consumer Webapp

## Running the app

Node 22 is required (Angular 22 CLI). Dependencies are usually already installed.

```bash
source ~/.nvm/nvm.sh          # nvm default is 22
cd /path/to/rbc-consumer-webapp
npx ng serve --port 4200
```

Then open http://localhost:4200. There is **no backend and no auth** — all data is mocked
in the NgRx store, so nothing needs to be logged into and no secrets are required.

Startup takes ~40-60s for the first bundle. Poll `curl -s -o /dev/null -w "%{http_code}" http://localhost:4200`
until it returns 200 rather than guessing a sleep duration.

## Where state lives

All app state is in NgRx; there are no routes (single page). Useful files:

- `src/app/store/accounts/accounts.reducer.ts` — mock balances and the transfer-applied reducer.
  Initial: Day to Day `$5,407.48`, eSavings `$12,452.00`, RRSP `$8,550.00`.
- `src/app/store/transfer/transfer.validation.ts` — parsing and validation helpers invoked by
  `transfer.effects.ts`, not template validation. Check guard order before writing test cases.
- `src/app/store/ui/ui.reducer.ts` — nav/subnav active tab and dropdown mutual exclusion.

Resetting state is just a page reload (Ctrl+R) since nothing is persisted.

### Validation order gotcha

`validateTransfer()` checks the amount **before** checking that the two accounts differ. So to see
"Choose two different accounts." you must enter a valid non-zero amount first; otherwise you
get "Enter an amount greater than $0.00." Read the guard order rather than assuming it.

## Known/likely pitfalls when testing the amount input

The current amount field is `<input type="text" inputmode="decimal">`, retaining the raw string
in NgRx. Negative text should remain intact and be rejected with an in-app error. Earlier revisions
used a number input and could lose a typed minus sign, so inspect the current template and check
both the displayed input and unchanged balances rather than assuming validation ran.

- `-50` and `0`: "Enter an amount greater than $0.00."
- `1.234`: "Enter an amount with at most two decimal places."
- An amount exceeding the source balance: "Insufficient funds in the selected account."
- Form edits clear errors and move Submit vertically; pressing Enter in the amount field avoids
  accidentally clicking the old button position.

## Account History checks

History belongs to the Bank Accounts list (Day to Day and eSavings), not the RRSP investment.
Transactions are seeded mock data; completed quick transfers update balances but intentionally do
not append transactions. Check accessible trigger names as well as visible labels.

Test primary navigation separately from secondary navigation and test both directions of menu
mutual exclusion. An open dropdown may cover the next row's trigger; keyboard Tab/Enter can verify
state switching separately, but do not count that as proof the pointer interaction is unobstructed.

## Responsive testing on a VNC box

The browser window has a **minimum width** (~532 real px) that may be wider than the CSS viewport
you want. Two-step approach:

1. `wmctrl -r :ACTIVE: -e 0,0,0,<width>,<height>` to shrink the window. Note `wmctrl` uses **real**
   display pixels; check `xrandr` because the computer-use tool's 1024x768 coordinate space is
   usually scaled from a larger real resolution.
2. If you still cannot get narrow enough, zoom in with `ctrl+shift+equal` (plain `ctrl+plus` often
   does **not** register via xdotool) to shrink the CSS viewport further.

Confirm the actual viewport and overflow rather than eyeballing:

```js
JSON.stringify({vw: document.documentElement.clientWidth,
                scrollW: document.documentElement.scrollWidth,
                overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth})
```

Also inspect the dropdown's `getBoundingClientRect().left/right` and screenshot its full columns.
A right-anchored dropdown can clip beyond the **left** viewport edge without increasing
`documentElement.scrollWidth`. Width clamping alone does not prove the anchor stays onscreen.
On a 1600px desktop, browser zoom to 400% provides a roughly 396px content viewport while keeping
the browser maximized for recording; use Ctrl+0 to restore.

Maximize before recording: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`
(do not use `xdotool key super+Up`, which tiles to half-screen).

## Devin Secrets Needed

None. The app is fully mocked with no backend or auth.
