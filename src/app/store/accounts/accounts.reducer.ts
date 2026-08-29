import { createReducer, on } from '@ngrx/store';
import { accountsTransferApplied } from './accounts.actions';
import { Account, AccountsState } from './accounts.models';

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
        { date: '2025-12-31', balance: 4120.15 },
        { date: '2026-01-31', balance: 4630.9 },
        { date: '2026-02-28', balance: 3985.22 },
        { date: '2026-03-31', balance: 5210.4 },
        { date: '2026-04-30', balance: 4875.66 },
        { date: '2026-05-31', balance: 5602.31 },
        { date: '2026-06-30', balance: 5188.04 },
        { date: '2026-07-31', balance: 5940.72 },
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
        { date: '2025-12-31', balance: 9200.0 },
        { date: '2026-01-31', balance: 9750.5 },
        { date: '2026-02-28', balance: 10120.25 },
        { date: '2026-03-31', balance: 10480.75 },
        { date: '2026-04-30', balance: 10990.1 },
        { date: '2026-05-31', balance: 11405.6 },
        { date: '2026-06-30', balance: 11780.4 },
        { date: '2026-07-31', balance: 12105.9 },
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
        { date: '2025-12-31', balance: 7410.0 },
        { date: '2026-01-31', balance: 7685.35 },
        { date: '2026-02-28', balance: 7502.8 },
        { date: '2026-03-31', balance: 7940.12 },
        { date: '2026-04-30', balance: 8215.44 },
        { date: '2026-05-31', balance: 8032.9 },
        { date: '2026-06-30', balance: 8398.6 },
        { date: '2026-07-31', balance: 8720.25 },
        { date: '2026-08-27', balance: 8550.0 },
      ],
    },
  ],
};

const withBalance = (account: Account, balance: number): Account => ({
  ...account,
  balance,
  history: account.history.map((point, index) =>
    index === account.history.length - 1 ? { ...point, balance } : point,
  ),
});

export const accountsReducer = createReducer(
  initialAccountsState,
  on(accountsTransferApplied, (state, { fromAccountId, toAccountId, amount }) => ({
    ...state,
    accounts: state.accounts.map((account) => {
      if (account.id === fromAccountId) {
        return withBalance(account, account.balance - amount);
      }
      if (account.id === toAccountId) {
        return withBalance(account, account.balance + amount);
      }
      return account;
    }),
  })),
);
