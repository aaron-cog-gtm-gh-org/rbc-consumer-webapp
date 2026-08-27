# RBC Consumer Webapp (Demo)

Angular + NgRx recreation of an RBC-style Online Banking "Accounts Summary" page. All data is
mocked in the NgRx store — there is no backend and no real branding assets are used.

## Requirements

- Node.js 22 LTS (Angular 22 CLI requires >= 22.22.3)

## Getting started

```bash
npm install
npm start      # dev server on http://localhost:4200
npm run build  # production build
npm test       # unit tests (vitest)
```

## Structure

- `src/app/store/accounts` — accounts + investments state, seeded mock data, totals selectors
- `src/app/store/transfer` — Quick Payments & Transfers form state, validation effect, confirmation
- `src/app/store/ui` — active nav tabs, open dropdowns, unread message badge, search query
- `src/app/components` — standalone components (header, nav, subnav, welcome bar, account list,
  investments list, quick transfer sidebar, inline SVG icon)

## Interactivity

- Nav / sub-nav tabs switch active state via the store
- Per-account "Options" dropdowns and the header user menu open one at a time
- Submitting a transfer validates the form, moves money between accounts, and shows a confirmation
- Layout collapses to a single column at 900px
