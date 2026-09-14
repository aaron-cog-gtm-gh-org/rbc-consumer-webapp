import { createReducer, on } from '@ngrx/store';
import { accountsTransferApplied } from './accounts.actions';
import { Account, AccountsState, BalancePoint } from './accounts.models';

const monthLabels = [
  'Sep 2025',
  'Oct 2025',
  'Nov 2025',
  'Dec 2025',
  'Jan 2026',
  'Feb 2026',
  'Mar 2026',
  'Apr 2026',
  'May 2026',
  'Jun 2026',
  'Jul 2026',
  'Aug 2026',
];

const monthlyBalances = (balances: number[]): BalancePoint[] =>
  balances.map((balance, index) => ({ label: monthLabels[index], balance }));

const withBalance = (account: Account, balance: number): Account => ({
  ...account,
  balance,
  history: account.history.map((point, index) =>
    index === account.history.length - 1 ? { ...point, balance } : point,
  ),
});

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
      history: monthlyBalances([
        4180.22, 3925.6, 4610.35, 2890.14, 3502.77, 4188.9, 3970.45, 4732.18, 5120.63, 4860.05,
        5215.32, 5407.48,
      ]),
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      history: monthlyBalances([
        8900.0, 9250.0, 9600.0, 9750.0, 10300.0, 10650.0, 11000.0, 11150.0, 11500.0, 11850.0,
        12200.0, 12452.0,
      ]),
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: monthlyBalances([
        7410.0, 7560.0, 7395.0, 7680.0, 7920.0, 7735.0, 8010.0, 8265.0, 8120.0, 8380.0, 8465.0,
        8550.0,
      ]),
    },
  ],
};

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
