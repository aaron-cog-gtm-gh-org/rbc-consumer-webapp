import { AppState } from '..';
import { initialTransferState } from '../transfer/transfer.reducer';
import { initialUiState } from '../ui/ui.reducer';
import { initialAccountsState } from './accounts.reducer';
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

const state: AppState = {
  accounts: initialAccountsState,
  transfer: initialTransferState,
  ui: initialUiState,
};

describe('accounts selectors', () => {
  it('selects the profile fields', () => {
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

  it('filters accounts by kind', () => {
    expect(selectBankAccounts(state).map((account) => account.id)).toEqual([
      'day-to-day',
      'esavings',
    ]);
    expect(selectInvestmentAccounts(state).map((account) => account.id)).toEqual(['rrsp']);
  });

  it('sums the bank and investment totals', () => {
    expect(selectBankAccountsTotal(state)).toBeCloseTo(17859.48, 2);
    expect(selectInvestmentsTotal(state)).toBeCloseTo(8550.0, 2);
  });

  it('reflects updated balances', () => {
    const updated: AppState = {
      ...state,
      accounts: {
        ...initialAccountsState,
        accounts: initialAccountsState.accounts.map((account) =>
          account.id === 'rrsp' ? { ...account, balance: 9000 } : account,
        ),
      },
    };

    expect(selectInvestmentsTotal(updated)).toBe(9000);
    expect(selectBankAccountsTotal(updated)).toBeCloseTo(17859.48, 2);
  });
});
