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
        { date: 'Aug 26, 2026', description: 'INTERAC e-Transfer to J. Tremblay', amount: -240.0 },
        { date: 'Aug 25, 2026', description: 'Payroll Deposit - NORTHWIND INC', amount: 2145.62 },
        { date: 'Aug 24, 2026', description: 'LOBLAWS #1274', amount: -86.41 },
        {
          date: 'Aug 21, 2026',
          description: 'Pre-Authorized Payment - BELL CANADA',
          amount: -112.35,
        },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      history: [
        { date: 'Aug 27, 2026', description: 'Monthly Interest Earned', amount: 18.72 },
        { date: 'Aug 20, 2026', description: 'Transfer from Day to Day Banking', amount: 500.0 },
        { date: 'Aug 05, 2026', description: 'Transfer to Day to Day Banking', amount: -300.0 },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: [
        { date: 'Aug 15, 2026', description: 'Contribution - Pre-Authorized', amount: 250.0 },
        {
          date: 'Aug 01, 2026',
          description: 'RBC Select Balanced Portfolio Purchase',
          amount: -250.0,
        },
        { date: 'Jul 31, 2026', description: 'Distribution Reinvested', amount: 41.18 },
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
