import { createReducer, on } from '@ngrx/store';
import { accountsTransferApplied } from './accounts.actions';
import { Account, AccountsState, BalanceHistoryPoint } from './accounts.models';

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
      balanceHistory: [
        { date: '2025-09-30', balance: 4210.12 },
        { date: '2025-10-31', balance: 3987.55 },
        { date: '2025-11-30', balance: 4622.9 },
        { date: '2025-12-31', balance: 3140.27 },
        { date: '2026-01-31', balance: 3895.61 },
        { date: '2026-02-28', balance: 4478.33 },
        { date: '2026-03-31', balance: 5012.04 },
        { date: '2026-04-30', balance: 4756.88 },
        { date: '2026-05-31', balance: 5290.41 },
        { date: '2026-06-30', balance: 5688.19 },
        { date: '2026-07-31', balance: 5133.76 },
        { date: '2026-08-31', balance: 5407.48 },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      balanceHistory: [
        { date: '2025-09-30', balance: 9200.0 },
        { date: '2025-10-31', balance: 9500.0 },
        { date: '2025-11-30', balance: 9812.45 },
        { date: '2025-12-31', balance: 10125.9 },
        { date: '2026-01-31', balance: 10440.18 },
        { date: '2026-02-28', balance: 10755.62 },
        { date: '2026-03-31', balance: 11072.3 },
        { date: '2026-04-30', balance: 11390.05 },
        { date: '2026-05-31', balance: 11709.44 },
        { date: '2026-06-30', balance: 12029.87 },
        { date: '2026-07-31', balance: 12240.55 },
        { date: '2026-08-31', balance: 12452.0 },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      balanceHistory: [
        { date: '2025-09-30', balance: 7120.4 },
        { date: '2025-10-31', balance: 6980.15 },
        { date: '2025-11-30', balance: 7345.72 },
        { date: '2025-12-31', balance: 7601.33 },
        { date: '2026-01-31', balance: 7488.9 },
        { date: '2026-02-28', balance: 7822.6 },
        { date: '2026-03-31', balance: 8035.18 },
        { date: '2026-04-30', balance: 7910.77 },
        { date: '2026-05-31', balance: 8244.05 },
        { date: '2026-06-30', balance: 8402.61 },
        { date: '2026-07-31', balance: 8318.94 },
        { date: '2026-08-31', balance: 8550.0 },
      ],
    },
  ],
};

const applyDelta = (account: Account, delta: number): Account => {
  const balance = account.balance + delta;
  const balanceHistory: BalanceHistoryPoint[] = account.balanceHistory.map((point, index) =>
    index === account.balanceHistory.length - 1 ? { ...point, balance } : point,
  );
  return { ...account, balance, balanceHistory };
};

export const accountsReducer = createReducer(
  initialAccountsState,
  on(accountsTransferApplied, (state, { fromAccountId, toAccountId, amount }) => ({
    ...state,
    accounts: state.accounts.map((account) => {
      if (account.id === fromAccountId) {
        return applyDelta(account, -amount);
      }
      if (account.id === toAccountId) {
        return applyDelta(account, amount);
      }
      return account;
    }),
  })),
);
