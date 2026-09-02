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
        { date: '2026-01-31', balance: 4218.32 },
        { date: '2026-02-28', balance: 3985.11 },
        { date: '2026-03-31', balance: 4612.9 },
        { date: '2026-04-30', balance: 5104.27 },
        { date: '2026-05-31', balance: 4790.55 },
        { date: '2026-06-30', balance: 5286.04 },
        { date: '2026-07-31', balance: 5012.76 },
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
        { date: '2026-01-31', balance: 9850.0 },
        { date: '2026-02-28', balance: 10175.4 },
        { date: '2026-03-31', balance: 10502.85 },
        { date: '2026-04-30', balance: 10884.12 },
        { date: '2026-05-31', balance: 11260.6 },
        { date: '2026-06-30', balance: 11648.9 },
        { date: '2026-07-31', balance: 12045.3 },
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
        { date: '2026-01-31', balance: 7420.15 },
        { date: '2026-02-28', balance: 7288.6 },
        { date: '2026-03-31', balance: 7690.44 },
        { date: '2026-04-30', balance: 7955.02 },
        { date: '2026-05-31', balance: 7812.38 },
        { date: '2026-06-30', balance: 8194.7 },
        { date: '2026-07-31', balance: 8365.25 },
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
