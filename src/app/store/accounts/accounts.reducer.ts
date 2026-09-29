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
      transactions: [
        { id: 'dtd-6', date: '2026-08-26', description: 'Loblaws #1042', amount: -86.37 },
        {
          id: 'dtd-5',
          date: '2026-08-25',
          description: 'Interac e-Transfer from M. Chen',
          amount: 120.0,
        },
        { id: 'dtd-4', date: '2026-08-24', description: 'Hydro One bill payment', amount: -142.18 },
        {
          id: 'dtd-3',
          date: '2026-08-21',
          description: 'Transfer to High Interest eSavings',
          amount: -500.0,
        },
        {
          id: 'dtd-2',
          date: '2026-08-20',
          description: 'Payroll deposit, Northwind Ltd.',
          amount: 2350.0,
        },
        { id: 'dtd-1', date: '2026-08-18', description: 'Tim Hortons #3318', amount: -6.45 },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      transactions: [
        {
          id: 'esv-3',
          date: '2026-08-21',
          description: 'Transfer from Day to Day Banking',
          amount: 500.0,
        },
        { id: 'esv-2', date: '2026-07-31', description: 'Interest paid', amount: 18.42 },
        {
          id: 'esv-1',
          date: '2026-07-15',
          description: 'Transfer from Day to Day Banking',
          amount: 750.0,
        },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      transactions: [
        {
          id: 'rrsp-2',
          date: '2026-08-01',
          description: 'Pre-authorized contribution',
          amount: 250.0,
        },
        {
          id: 'rrsp-1',
          date: '2026-07-01',
          description: 'Pre-authorized contribution',
          amount: 250.0,
        },
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
