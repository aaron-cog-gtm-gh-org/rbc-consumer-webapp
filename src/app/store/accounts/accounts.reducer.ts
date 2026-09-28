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
        {
          id: 'dtd-1005',
          date: 'Thursday, August 27, 2026',
          description: 'Interac e-Transfer to J. Chen',
          amount: -120.0,
        },
        {
          id: 'dtd-1004',
          date: 'Wednesday, August 26, 2026',
          description: 'Loblaws #1042 Toronto',
          amount: -86.43,
        },
        {
          id: 'dtd-1003',
          date: 'Tuesday, August 25, 2026',
          description: 'Payroll Deposit ACME Corp',
          amount: 2450.0,
        },
        {
          id: 'dtd-1002',
          date: 'Monday, August 24, 2026',
          description: 'Bill Payment Rogers Wireless',
          amount: -95.2,
        },
        {
          id: 'dtd-1001',
          date: 'Friday, August 21, 2026',
          description: 'Tim Hortons #2231',
          amount: -6.75,
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
        {
          id: 'esv-2002',
          date: 'Tuesday, August 25, 2026',
          description: 'Transfer from Day to Day Banking',
          amount: 500.0,
        },
        {
          id: 'esv-2001',
          date: 'Monday, August 10, 2026',
          description: 'Transfer to Day to Day Banking',
          amount: -250.0,
        },
        {
          id: 'esv-2003',
          date: 'Friday, July 31, 2026',
          description: 'Interest Earned',
          amount: 41.12,
        },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: [
        {
          id: 'rsp-3003',
          date: 'Thursday, August 27, 2026',
          description: 'Pre-Authorized Contribution',
          amount: 250.0,
        },
        {
          id: 'rsp-3002',
          date: 'Friday, August 14, 2026',
          description: 'Dividend RBC Canadian Equity Fund',
          amount: 18.64,
        },
        {
          id: 'rsp-3001',
          date: 'Monday, July 27, 2026',
          description: 'Pre-Authorized Contribution',
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
