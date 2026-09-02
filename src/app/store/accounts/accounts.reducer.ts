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
        { date: '2026-03-01', balance: 4120.11 },
        { date: '2026-04-01', balance: 3894.62 },
        { date: '2026-05-01', balance: 4630.05 },
        { date: '2026-06-01', balance: 5012.37 },
        { date: '2026-07-01', balance: 4788.9 },
        { date: '2026-08-01', balance: 5216.24 },
        { date: '2026-09-01', balance: 5407.48 },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      history: [
        { date: '2026-03-01', balance: 9800.0 },
        { date: '2026-04-01', balance: 10250.75 },
        { date: '2026-05-01', balance: 10710.4 },
        { date: '2026-06-01', balance: 11185.62 },
        { date: '2026-07-01', balance: 11640.18 },
        { date: '2026-08-01', balance: 12045.33 },
        { date: '2026-09-01', balance: 12452.0 },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: [
        { date: '2026-03-01', balance: 7420.5 },
        { date: '2026-04-01', balance: 7690.15 },
        { date: '2026-05-01', balance: 7512.88 },
        { date: '2026-06-01', balance: 8005.62 },
        { date: '2026-07-01', balance: 8248.91 },
        { date: '2026-08-01', balance: 8130.44 },
        { date: '2026-09-01', balance: 8550.0 },
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
