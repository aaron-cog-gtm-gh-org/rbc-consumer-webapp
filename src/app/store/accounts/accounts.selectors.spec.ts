import { accountsFeatureKey, initialAccountsState } from './accounts.reducer';
import {
  selectAllAccounts,
  selectBankAccounts,
  selectBankAccountsTotal,
  selectInvestmentAccounts,
  selectInvestmentsTotal,
  selectStatementDate,
  selectUserFirstName,
  selectUserName,
} from './accounts.selectors';

const state = { [accountsFeatureKey]: initialAccountsState };

describe('accounts selectors', () => {
  it('selects the customer details', () => {
    expect(selectUserName(state)).toBe('GENE RAYMOND');
    expect(selectUserFirstName(state)).toBe('Gene');
    expect(selectStatementDate(state)).toBe('Thursday, August 27, 2026');
  });

  it('selects every account', () => {
    expect(selectAllAccounts(state).map((account) => account.id)).toEqual([
      'day-to-day',
      'esavings',
      'rrsp',
    ]);
  });

  it('splits accounts by kind', () => {
    expect(selectBankAccounts(state).map((account) => account.id)).toEqual([
      'day-to-day',
      'esavings',
    ]);
    expect(selectInvestmentAccounts(state).map((account) => account.id)).toEqual(['rrsp']);
  });

  it('totals balances per kind', () => {
    expect(selectBankAccountsTotal(state)).toBeCloseTo(17859.48, 2);
    expect(selectInvestmentsTotal(state)).toBeCloseTo(8550.0, 2);
  });
});
