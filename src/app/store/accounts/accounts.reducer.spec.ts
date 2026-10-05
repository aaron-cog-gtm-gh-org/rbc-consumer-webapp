import { accountsTransferApplied } from './accounts.actions';
import { accountsReducer, initialAccountsState } from './accounts.reducer';

describe('accountsReducer history', () => {
  it('seeds a newest-first history that reconciles with each balance', () => {
    for (const account of initialAccountsState.accounts) {
      expect(account.history.length).toBeGreaterThan(0);
      expect(account.history[0].balance).toBeCloseTo(account.balance, 2);

      for (let i = 0; i < account.history.length - 1; i++) {
        const newer = account.history[i];
        const older = account.history[i + 1];
        expect(newer.date >= older.date).toBe(true);
        expect(newer.balance).toBeCloseTo(older.balance + newer.amount, 2);
      }
    }
  });

  it('posts a transaction to both accounts when a transfer is applied', () => {
    const state = accountsReducer(
      initialAccountsState,
      accountsTransferApplied({
        fromAccountId: 'day-to-day',
        toAccountId: 'esavings',
        amount: 100,
      }),
    );
    const from = state.accounts.find((a) => a.id === 'day-to-day')!;
    const to = state.accounts.find((a) => a.id === 'esavings')!;

    expect(from.balance).toBeCloseTo(5307.48, 2);
    expect(from.history[0]).toMatchObject({
      date: '2026-08-27',
      description: 'Transfer to RBC High Interest eSavings',
      amount: -100,
      balance: 5307.48,
    });
    expect(to.history[0]).toMatchObject({
      description: 'Transfer from RBC Day to Day Banking',
      amount: 100,
      balance: 12552,
    });
    expect(new Set(from.history.map((t) => t.id)).size).toBe(from.history.length);
  });
});
