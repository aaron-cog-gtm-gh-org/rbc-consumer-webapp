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
        { date: '2026-01-31', balance: 4210.12 },
        { date: '2026-02-28', balance: 4685.9 },
        { date: '2026-03-31', balance: 3980.44 },
        { date: '2026-04-30', balance: 4720.31 },
        { date: '2026-05-31', balance: 5115.06 },
        { date: '2026-06-30', balance: 4890.77 },
        { date: '2026-07-31', balance: 5288.23 },
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
        { date: '2026-01-31', balance: 9800.0 },
        { date: '2026-02-28', balance: 10150.35 },
        { date: '2026-03-31', balance: 10520.6 },
        { date: '2026-04-30', balance: 10905.18 },
        { date: '2026-05-31', balance: 11340.72 },
        { date: '2026-06-30', balance: 11720.44 },
        { date: '2026-07-31', balance: 12088.91 },
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
        { date: '2026-01-31', balance: 7420.5 },
        { date: '2026-02-28', balance: 7615.88 },
        { date: '2026-03-31', balance: 7380.14 },
        { date: '2026-04-30', balance: 7842.6 },
        { date: '2026-05-31', balance: 8105.27 },
        { date: '2026-06-30', balance: 7990.03 },
        { date: '2026-07-31', balance: 8321.45 },
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
