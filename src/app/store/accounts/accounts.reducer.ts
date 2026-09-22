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
        { date: 'Aug 26, 2026', description: 'Loblaws #1042', amount: -142.37 },
        { date: 'Aug 24, 2026', description: 'Payroll Deposit - Northwind', amount: 2480.15 },
        { date: 'Aug 22, 2026', description: 'Hydro One Pre-Auth Payment', amount: -96.4 },
        { date: 'Aug 19, 2026', description: 'Interac e-Transfer to J. Tremblay', amount: -60.0 },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      transactions: [
        { date: 'Aug 25, 2026', description: 'Transfer from Day to Day Banking', amount: 500.0 },
        { date: 'Aug 01, 2026', description: 'Monthly Interest', amount: 31.22 },
        { date: 'Jul 18, 2026', description: 'Transfer to Day to Day Banking', amount: -250.0 },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      transactions: [
        { date: 'Aug 15, 2026', description: 'Contribution - Pre-Authorized', amount: 300.0 },
        { date: 'Jul 15, 2026', description: 'Contribution - Pre-Authorized', amount: 300.0 },
        { date: 'Jun 30, 2026', description: 'Management Fee', amount: -18.75 },
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
