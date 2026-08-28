import { transactionsCleared, transactionsLoaded } from './transactions.actions';
import { Transaction } from './transactions.models';
import { initialTransactionsState, transactionsReducer } from './transactions.reducer';
import { selectAllTransactions, selectTransactionsForAccount } from './transactions.selectors';

const transaction: Transaction = {
  id: 'test-1',
  accountId: 'day-to-day',
  date: 'Aug 28, 2026',
  description: 'Test Purchase',
  amount: 10.5,
  balance: 100,
  type: 'debit',
};

describe('transactionsReducer', () => {
  it('should seed mock transactions for the known accounts', () => {
    const accountIds = new Set(initialTransactionsState.transactions.map((t) => t.accountId));
    expect([...accountIds].sort()).toEqual(['day-to-day', 'esavings', 'rrsp']);
  });

  it('should replace transactions on transactionsLoaded', () => {
    const state = transactionsReducer(
      initialTransactionsState,
      transactionsLoaded({ transactions: [transaction] }),
    );
    expect(state.transactions).toEqual([transaction]);
  });

  it('should empty transactions on transactionsCleared', () => {
    const state = transactionsReducer(initialTransactionsState, transactionsCleared());
    expect(state.transactions).toEqual([]);
  });
});

describe('transactions selectors', () => {
  it('should select all transactions', () => {
    expect(selectAllTransactions.projector(initialTransactionsState)).toEqual(
      initialTransactionsState.transactions,
    );
  });

  it('should filter transactions by account id', () => {
    const result = selectTransactionsForAccount('esavings').projector(
      initialTransactionsState.transactions,
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((t) => t.accountId === 'esavings')).toBe(true);
  });

  it('should return an empty list when no account is selected', () => {
    expect(
      selectTransactionsForAccount(null).projector(initialTransactionsState.transactions),
    ).toEqual([]);
  });
});
