import { accountsTransferApplied } from './accounts.actions';
import { accountsReducer, initialAccountsState } from './accounts.reducer';

const balanceOf = (state: typeof initialAccountsState, id: string): number =>
  state.accounts.find((account) => account.id === id)!.balance;

describe('accountsReducer', () => {
  it('starts with the mock customer and balances', () => {
    expect(initialAccountsState.userName).toBe('GENE RAYMOND');
    expect(initialAccountsState.userFirstName).toBe('Gene');
    expect(balanceOf(initialAccountsState, 'day-to-day')).toBe(5407.48);
    expect(balanceOf(initialAccountsState, 'esavings')).toBe(12452.0);
    expect(balanceOf(initialAccountsState, 'rrsp')).toBe(8550.0);
  });

  it('debits the source and credits the destination account', () => {
    const state = accountsReducer(
      initialAccountsState,
      accountsTransferApplied({
        fromAccountId: 'day-to-day',
        toAccountId: 'esavings',
        amount: 400,
      }),
    );

    expect(balanceOf(state, 'day-to-day')).toBeCloseTo(5007.48, 2);
    expect(balanceOf(state, 'esavings')).toBeCloseTo(12852.0, 2);
    expect(balanceOf(state, 'rrsp')).toBe(8550.0);
  });

  it('leaves the original state untouched', () => {
    accountsReducer(
      initialAccountsState,
      accountsTransferApplied({ fromAccountId: 'day-to-day', toAccountId: 'rrsp', amount: 100 }),
    );

    expect(balanceOf(initialAccountsState, 'day-to-day')).toBe(5407.48);
  });

  it('ignores accounts that are not part of the transfer', () => {
    const state = accountsReducer(
      initialAccountsState,
      accountsTransferApplied({ fromAccountId: 'unknown', toAccountId: 'other', amount: 100 }),
    );

    expect(state.accounts).toEqual(initialAccountsState.accounts);
  });

  it('returns the current state for unknown actions', () => {
    expect(accountsReducer(initialAccountsState, { type: 'noop' })).toBe(initialAccountsState);
  });
});
