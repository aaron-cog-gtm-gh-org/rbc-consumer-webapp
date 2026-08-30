import { createReducer, on } from '@ngrx/store';
import { accountsTransferApplied } from './accounts.actions';
import { AccountsState } from './accounts.models';

export const accountsFeatureKey = 'accounts';

export const initialAccountsState: AccountsState = {
  userName: 'GENE RAYMOND',
  userFirstName: 'Gene',
  statementDate: 'Thursday, August 27, 2026',
  accounts: [
    {
      id: 'day-to-day',
      name: 'RBC Day to Day Banking',
      number: '05812-5008874',
      balance: 5407.48,
      kind: 'bank',
      history: [
        { date: '2025-09-30', balance: 3980.12 },
        { date: '2025-10-31', balance: 4215.67 },
        { date: '2025-11-30', balance: 3877.4 },
        { date: '2025-12-31', balance: 4602.95 },
        { date: '2026-01-31', balance: 4388.21 },
        { date: '2026-02-28', balance: 4731.06 },
        { date: '2026-03-31', balance: 4519.83 },
        { date: '2026-04-30', balance: 4954.6 },
        { date: '2026-05-31', balance: 5120.44 },
        { date: '2026-06-30', balance: 4988.72 },
        { date: '2026-07-31', balance: 5286.19 },
        { date: '2026-08-27', balance: 5407.48 },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      history: [
        { date: '2025-09-30', balance: 9250.0 },
        { date: '2025-10-31', balance: 9575.4 },
        { date: '2025-11-30', balance: 9912.85 },
        { date: '2025-12-31', balance: 10180.3 },
        { date: '2026-01-31', balance: 10044.75 },
        { date: '2026-02-28', balance: 10460.18 },
        { date: '2026-03-31', balance: 10832.6 },
        { date: '2026-04-30', balance: 11205.94 },
        { date: '2026-05-31', balance: 11488.37 },
        { date: '2026-06-30', balance: 11902.55 },
        { date: '2026-07-31', balance: 12188.9 },
        { date: '2026-08-27', balance: 12452.0 },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: [
        { date: '2025-09-30', balance: 7020.5 },
        { date: '2025-10-31', balance: 7188.9 },
        { date: '2025-11-30', balance: 7042.15 },
        { date: '2025-12-31', balance: 7460.8 },
        { date: '2026-01-31', balance: 7615.45 },
        { date: '2026-02-28', balance: 7398.22 },
        { date: '2026-03-31', balance: 7724.66 },
        { date: '2026-04-30', balance: 7960.31 },
        { date: '2026-05-31', balance: 8125.77 },
        { date: '2026-06-30', balance: 8004.19 },
        { date: '2026-07-31', balance: 8342.06 },
        { date: '2026-08-27', balance: 8550.0 },
      ],
    },
  ],
};

export const accountsReducer = createReducer(
  initialAccountsState,
  on(accountsTransferApplied, (state, { fromAccountId, toAccountId, amount }) => ({
    ...state,
    accounts: state.accounts.map((account) => {
      if (account.id === fromAccountId) {
        return { ...account, balance: account.balance - amount };
      }
      if (account.id === toAccountId) {
        return { ...account, balance: account.balance + amount };
      }
      return account;
    }),
  })),
);
