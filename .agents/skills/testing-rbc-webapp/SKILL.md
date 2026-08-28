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
- `src/app/store/transfer/transfer.effects.ts` — **all transfer validation lives in an effect**,
  not in the template. Check the order of the `validate()` guards before writing test cases.
- `src/app/store/ui/ui.reducer.ts` — nav/subnav active tab and dropdown mutual exclusion.

Resetting state is just a page reload (Ctrl+R) since nothing is persisted.

### Validation order gotcha

`validate()` checks the amount **before** checking that the two accounts differ. So to see
"Choose two different accounts." you must enter a valid non-zero amount first; otherwise you
get "Enter an amount greater than $0.00." Read the guard order rather than assuming it.

## Known/likely pitfalls when testing the amount input

The amount field is a `<input type="number">` with a one-way `[value]="form().amount ?? ''"`
binding plus an `(input)` handler dispatching to the store. This combination has a real trap:

- Typing a leading `-` makes the browser report `value === ''`, which sets the store amount to
  `null`, which re-renders the input as empty and **wipes the minus sign**. The result is that a
  typed negative can silently become a positive number and transfer real money with no error.
  Always screenshot/inspect the field **before** submitting a negative, and check whether balances
  moved afterwards — do not assume the effect's `amount <= 0` guard was reached.
- Behaviour differs depending on whether the field was already populated, so test both
  "type -50 into an empty field" and "select-all then type -50 over an existing value".
- Native `min="0"` and `step="0.01"` produce **browser tooltips** ("Please enter a valid value…"),
  not the in-app red alert. A blocked submit may therefore show no NgRx error at all. Distinguish
  native validation from effect validation when reporting.

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

Maximize before recording: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`
(do not use `xdotool key super+Up`, which tiles to half-screen).

## Devin Secrets Needed

None. The app is fully mocked with no backend or auth.
