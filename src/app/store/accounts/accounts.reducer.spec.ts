import { accountsTransferApplied } from './accounts.actions';
import { AccountsState } from './accounts.models';
import { accountsReducer, initialAccountsState } from './accounts.reducer';

const state: AccountsState = {
  userName: 'TEST USER',
  userFirstName: 'Test',
  statementDate: 'Monday, January 5, 2026',
  accounts: [
    { id: 'chequing', name: 'Chequing', number: '00001-1', balance: 1000, kind: 'bank' },
    { id: 'savings', name: 'Savings', number: '00001-2', balance: 500.5, kind: 'bank' },
    { id: 'tfsa', name: 'TFSA', number: '00001-3', balance: 2000, kind: 'investment' },
  ],
};

describe('accountsReducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(accountsReducer(undefined, { type: 'unknown' })).toBe(initialAccountsState);
  });

  it('seeds the user profile and accounts', () => {
    expect(initialAccountsState.userName).toBe('GENE RAYMOND');
    expect(initialAccountsState.userFirstName).toBe('Gene');
    expect(initialAccountsState.statementDate).toBe('Thursday, August 27, 2026');
    expect(initialAccountsState.accounts.map((account) => account.id)).toEqual([
      'day-to-day',
      'esavings',
      'rrsp',
    ]);
  });

  describe('accountsTransferApplied', () => {
    it('debits the source account and credits the destination account', () => {
      const next = accountsReducer(
        state,
        accountsTransferApplied({
          fromAccountId: 'chequing',
          toAccountId: 'savings',
          amount: 250.25,
        }),
      );
      expect(next.accounts[0].balance).toBeCloseTo(749.75);
      expect(next.accounts[1].balance).toBeCloseTo(750.75);
    });

    it('leaves uninvolved accounts and profile fields untouched', () => {
      const next = accountsReducer(
        state,
        accountsTransferApplied({ fromAccountId: 'chequing', toAccountId: 'savings', amount: 10 }),
      );
      expect(next.accounts[2]).toBe(state.accounts[2]);
      expect(next.userName).toBe(state.userName);
      expect(next.statementDate).toBe(state.statementDate);
    });

    it('does not mutate the previous state', () => {
      const snapshot = structuredClone(state);
      accountsReducer(
        state,
        accountsTransferApplied({ fromAccountId: 'chequing', toAccountId: 'tfsa', amount: 100 }),
      );
      expect(state).toEqual(snapshot);
    });

    it('leaves balances unchanged when no account ids match', () => {
      const next = accountsReducer(
        state,
        accountsTransferApplied({ fromAccountId: 'missing', toAccountId: 'other', amount: 100 }),
      );
      expect(next.accounts).toEqual(state.accounts);
    });
  });
});
