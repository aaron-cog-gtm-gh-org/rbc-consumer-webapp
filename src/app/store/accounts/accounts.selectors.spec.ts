import { initialAccountsState } from './accounts.reducer';
import { selectAccountById, selectAccountHistory } from './accounts.selectors';

const state = { accounts: initialAccountsState };

describe('selectAccountById', () => {
  it('returns the matching account or null', () => {
    expect(selectAccountById('rrsp')(state)?.name).toBe('RRSP');
    expect(selectAccountById('missing')(state)).toBeNull();
  });
});

describe('selectAccountHistory', () => {
  it('returns history ending at the current balance', () => {
    for (const account of initialAccountsState.accounts) {
      const history = selectAccountHistory(account.id)(state);
      expect(history.length).toBeGreaterThanOrEqual(6);
      expect(history[history.length - 1].balance).toBe(account.balance);
    }
  });

  it('returns an empty history for an unknown account', () => {
    expect(selectAccountHistory('missing')(state)).toEqual([]);
  });
});
