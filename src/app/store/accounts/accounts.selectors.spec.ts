import { Account, AccountsState } from './accounts.models';
import { accountsFeatureKey } from './accounts.reducer';
import {
  selectAccountsState,
  selectAllAccounts,
  selectBankAccounts,
  selectBankAccountsTotal,
  selectInvestmentAccounts,
  selectInvestmentsTotal,
  selectStatementDate,
  selectUserFirstName,
  selectUserName,
} from './accounts.selectors';

const accounts: Account[] = [
  { id: 'chequing', name: 'Chequing', number: '00001-1', balance: 100.25, kind: 'bank' },
  { id: 'savings', name: 'Savings', number: '00001-2', balance: 200.5, kind: 'bank' },
  { id: 'tfsa', name: 'TFSA', number: '00001-3', balance: 1000, kind: 'investment' },
  { id: 'rrsp', name: 'RRSP', number: '00001-4', balance: 250.75, kind: 'investment' },
];

const accountsState: AccountsState = {
  userName: 'TEST USER',
  userFirstName: 'Test',
  statementDate: 'Monday, January 5, 2026',
  accounts,
};

const state = { [accountsFeatureKey]: accountsState };

describe('accounts selectors', () => {
  it('selects the accounts feature state', () => {
    expect(selectAccountsState(state)).toBe(accountsState);
  });

  it('selects the user profile fields', () => {
    expect(selectUserName(state)).toBe('TEST USER');
    expect(selectUserFirstName(state)).toBe('Test');
    expect(selectStatementDate(state)).toBe('Monday, January 5, 2026');
  });

  it('selects all accounts', () => {
    expect(selectAllAccounts(state)).toBe(accounts);
  });

  it('selects only bank accounts', () => {
    expect(selectBankAccounts(state).map((account) => account.id)).toEqual(['chequing', 'savings']);
  });

  it('selects only investment accounts', () => {
    expect(selectInvestmentAccounts(state).map((account) => account.id)).toEqual(['tfsa', 'rrsp']);
  });

  it('sums bank and investment balances separately', () => {
    expect(selectBankAccountsTotal(state)).toBeCloseTo(300.75);
    expect(selectInvestmentsTotal(state)).toBeCloseTo(1250.75);
  });

  it('returns a zero total when there are no matching accounts', () => {
    expect(selectBankAccountsTotal.projector([])).toBe(0);
    expect(selectInvestmentsTotal.projector([])).toBe(0);
  });
});
