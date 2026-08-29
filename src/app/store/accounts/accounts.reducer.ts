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
        { date: '2026-01-31', balance: 3890.12 },
        { date: '2026-02-28', balance: 4210.55 },
        { date: '2026-03-31', balance: 3975.4 },
        { date: '2026-04-30', balance: 4560.9 },
        { date: '2026-05-31', balance: 4988.31 },
        { date: '2026-06-30', balance: 4725.66 },
        { date: '2026-07-31', balance: 5180.24 },
        { date: '2026-08-31', balance: 5407.48 },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      history: [
        { date: '2026-01-31', balance: 9800.0 },
        { date: '2026-02-28', balance: 10150.75 },
        { date: '2026-03-31', balance: 10520.4 },
        { date: '2026-04-30', balance: 10990.1 },
        { date: '2026-05-31', balance: 11375.85 },
        { date: '2026-06-30', balance: 11720.3 },
        { date: '2026-07-31', balance: 12088.6 },
        { date: '2026-08-31', balance: 12452.0 },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: [
        { date: '2026-01-31', balance: 7420.5 },
        { date: '2026-02-28', balance: 7690.25 },
        { date: '2026-03-31', balance: 7510.8 },
        { date: '2026-04-30', balance: 7985.6 },
        { date: '2026-05-31', balance: 8240.15 },
        { date: '2026-06-30', balance: 8105.9 },
        { date: '2026-07-31', balance: 8398.45 },
        { date: '2026-08-31', balance: 8550.0 },
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
