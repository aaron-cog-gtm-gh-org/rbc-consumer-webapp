import { Account } from '../accounts/accounts.models';
import { initialAccountsState } from '../accounts/accounts.reducer';
import { parseAmount, validateTransfer } from './transfer.validation';

const accounts: Account[] = initialAccountsState.accounts;

const form = (amount: string, overrides: Partial<{ from: string; to: string }> = {}) => ({
  fromAccountId: overrides.from ?? 'day-to-day',
  toAccountId: overrides.to ?? 'esavings',
  amount,
});

describe('parseAmount', () => {
  it('parses valid numeric strings', () => {
    expect(parseAmount('100')).toBe(100);
    expect(parseAmount(' 100.55 ')).toBe(100.55);
    expect(parseAmount('-50')).toBe(-50);
  });

  it('returns null for non-numeric input', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('-')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('1e5')).toBeNull();
  });
});

describe('validateTransfer', () => {
  it('rejects amounts that are empty, zero, or negative', () => {
    const message = 'Enter an amount greater than $0.00.';
    expect(validateTransfer(form(''), accounts)).toBe(message);
    expect(validateTransfer(form('0'), accounts)).toBe(message);
    expect(validateTransfer(form('-50'), accounts)).toBe(message);
  });

  it('rejects more than two decimal places', () => {
    expect(validateTransfer(form('1234.567'), accounts)).toBe(
      'Enter an amount with at most two decimal places.',
    );
  });

  it('rejects the same account on both sides', () => {
    expect(validateTransfer(form('100', { to: 'day-to-day' }), accounts)).toBe(
      'Choose two different accounts.',
    );
  });

  it('rejects amounts above the source balance', () => {
    expect(validateTransfer(form('999999'), accounts)).toBe(
      'Insufficient funds in the selected account.',
    );
  });

  it('accepts a valid transfer', () => {
    expect(validateTransfer(form('100.55'), accounts)).toBeNull();
  });
});
