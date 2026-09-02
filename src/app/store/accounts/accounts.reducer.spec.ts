import { accountsTransferApplied } from './accounts.actions';
import { accountsReducer, initialAccountsState } from './accounts.reducer';

const balanceOf = (accounts: { id: string; balance: number }[], id: string): number =>
  accounts.find((account) => account.id === id)!.balance;

describe('accountsReducer', () => {
  it('starts from the known mock balances', () => {
    expect(balanceOf(initialAccountsState.accounts, 'day-to-day')).toBe(5407.48);
    expect(balanceOf(initialAccountsState.accounts, 'esavings')).toBe(12452.0);
    expect(balanceOf(initialAccountsState.accounts, 'rrsp')).toBe(8550.0);
  });

  it('debits the source account and credits the destination account', () => {
    const state = accountsReducer(
      initialAccountsState,
      accountsTransferApplied({
        fromAccountId: 'day-to-day',
        toAccountId: 'esavings',
        amount: 407.48,
      }),
    );

    expect(balanceOf(state.accounts, 'day-to-day')).toBeCloseTo(5000, 2);
    expect(balanceOf(state.accounts, 'esavings')).toBeCloseTo(12859.48, 2);
  });

  it('leaves accounts that are not part of the transfer unchanged', () => {
    const state = accountsReducer(
      initialAccountsState,
      accountsTransferApplied({
        fromAccountId: 'day-to-day',
        toAccountId: 'esavings',
        amount: 100,
      }),
    );

    const rrsp = state.accounts.find((account) => account.id === 'rrsp')!;
    expect(rrsp).toBe(initialAccountsState.accounts.find((account) => account.id === 'rrsp'));
    expect(rrsp.balance).toBe(8550.0);
    expect(state.userName).toBe(initialAccountsState.userName);
  });

  it('does not mutate the previous state', () => {
    const snapshot = JSON.stringify(initialAccountsState);

    accountsReducer(
      initialAccountsState,
      accountsTransferApplied({ fromAccountId: 'day-to-day', toAccountId: 'rrsp', amount: 250 }),
    );

    expect(JSON.stringify(initialAccountsState)).toBe(snapshot);
    expect(balanceOf(initialAccountsState.accounts, 'day-to-day')).toBe(5407.48);
  });
});
