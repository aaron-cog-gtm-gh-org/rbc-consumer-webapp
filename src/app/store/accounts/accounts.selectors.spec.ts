import { initialAccountsState } from './accounts.reducer';
import { selectAccountById } from './accounts.selectors';

const state = { accounts: initialAccountsState };

describe('selectAccountById', () => {
  it('returns the matching account with its history', () => {
    const account = selectAccountById('esavings')(state);
    expect(account?.name).toBe('RBC High Interest eSavings');
    expect(account?.history?.length).toBeGreaterThan(0);
    expect(account?.history?.at(-1)?.balance).toBe(account?.balance);
  });

  it('returns null for an unknown or null id', () => {
    expect(selectAccountById('nope')(state)).toBeNull();
    expect(selectAccountById(null)(state)).toBeNull();
  });
});
