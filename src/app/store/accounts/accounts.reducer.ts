import { createReducer, on } from '@ngrx/store';
import { accountsTransferApplied } from './accounts.actions';
import { Account, AccountTransaction, AccountsState } from './accounts.models';

export const accountsFeatureKey = 'accounts';

type MockEntry = Pick<AccountTransaction, 'date' | 'description' | 'amount'>;

const roundCents = (value: number): number => Math.round(value * 100) / 100;

/**
 * Builds a newest-first history whose running balances end at `closingBalance`,
 * so the mock history always reconciles with the account's current balance.
 */
const buildHistory = (
  accountId: string,
  closingBalance: number,
  entriesNewestFirst: MockEntry[],
): AccountTransaction[] => {
  let balance = closingBalance;
  return entriesNewestFirst.map((entry, index) => {
    const transaction: AccountTransaction = {
      id: `${accountId}-${entriesNewestFirst.length - index}`,
      ...entry,
      balance: roundCents(balance),
    };
    balance -= entry.amount;
    return transaction;
  });
};

export const initialAccountsState: AccountsState = {
  userName: 'GENE RAYMOND',
  userFirstName: 'Gene',
  statementDate: 'Thursday, August 27, 2026',
  statementIsoDate: '2026-08-27',
  accounts: [
    {
      id: 'day-to-day',
      name: 'RBC Day to Day Banking',
      number: '05812-5008874',
      balance: 5407.48,
      kind: 'bank',
      history: buildHistory('day-to-day', 5407.48, [
        { date: '2026-08-26', description: 'Loblaws #1042', amount: -142.67 },
        { date: '2026-08-25', description: 'Interac e-Transfer from M. Raymond', amount: 250.0 },
        { date: '2026-08-21', description: 'Rogers Wireless - Bill Payment', amount: -96.05 },
        { date: '2026-08-20', description: 'Tim Hortons #2231', amount: -8.47 },
        { date: '2026-08-15', description: 'Payroll Deposit - Maple Leaf Foods', amount: 2318.42 },
        {
          date: '2026-08-12',
          description: 'Transfer to RBC High Interest eSavings',
          amount: -500.0,
        },
        { date: '2026-08-08', description: 'Hydro One - Bill Payment', amount: -134.2 },
        { date: '2026-08-01', description: 'Rent - Interac e-Transfer', amount: -1850.0 },
        { date: '2026-07-31', description: 'Payroll Deposit - Maple Leaf Foods', amount: 2318.42 },
      ]),
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      history: buildHistory('esavings', 12452.0, [
        { date: '2026-08-26', description: 'Interest Paid', amount: 18.36 },
        { date: '2026-08-12', description: 'Transfer from RBC Day to Day Banking', amount: 500.0 },
        { date: '2026-08-03', description: 'Transfer to RRSP', amount: -1000.0 },
        { date: '2026-07-28', description: 'Interest Paid', amount: 19.12 },
        { date: '2026-07-12', description: 'Transfer from RBC Day to Day Banking', amount: 500.0 },
      ]),
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      history: buildHistory('rrsp', 8550.0, [
        { date: '2026-08-24', description: 'Market Value Change', amount: 112.4 },
        {
          date: '2026-08-03',
          description: 'Contribution from RBC High Interest eSavings',
          amount: 1000.0,
        },
        { date: '2026-07-24', description: 'Market Value Change', amount: -64.18 },
      ]),
    },
  ],
};

const postTransaction = (
  account: Account,
  date: string,
  description: string,
  amount: number,
): Account => {
  const balance = roundCents(account.balance + amount);
  const transaction: AccountTransaction = {
    id: `${account.id}-${account.history.length + 1}`,
    date,
    description,
    amount,
    balance,
  };
  return { ...account, balance, history: [transaction, ...account.history] };
};

export const accountsReducer = createReducer(
  initialAccountsState,
  on(accountsTransferApplied, (state, { fromAccountId, toAccountId, amount }) => {
    const nameOf = (id: string) => state.accounts.find((account) => account.id === id)?.name ?? id;
    return {
      ...state,
      accounts: state.accounts.map((account) => {
        if (account.id === fromAccountId) {
          return postTransaction(
            account,
            state.statementIsoDate,
            `Transfer to ${nameOf(toAccountId)}`,
            -amount,
          );
        }
        if (account.id === toAccountId) {
          return postTransaction(
            account,
            state.statementIsoDate,
            `Transfer from ${nameOf(fromAccountId)}`,
            amount,
          );
        }
        return account;
      }),
    };
  }),
);
