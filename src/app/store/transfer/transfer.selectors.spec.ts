import { TransferState } from './transfer.models';
import { transferFeatureKey } from './transfer.reducer';
import {
  selectTransferConfirmation,
  selectTransferError,
  selectTransferForm,
  selectTransferState,
  selectTransferSubmitting,
} from './transfer.selectors';

const transferState: TransferState = {
  fromAccountId: 'esavings',
  toAccountId: 'rrsp',
  amount: '42.10',
  currency: 'USD',
  submitting: true,
  confirmation: 'Transfer complete.',
  error: 'Something went wrong.',
};

const state = { [transferFeatureKey]: transferState };

describe('transfer selectors', () => {
  it('selects the transfer feature state', () => {
    expect(selectTransferState(state)).toBe(transferState);
  });

  it('selects only the form fields', () => {
    expect(selectTransferForm(state)).toEqual({
      fromAccountId: 'esavings',
      toAccountId: 'rrsp',
      amount: '42.10',
      currency: 'USD',
    });
  });

  it('memoizes the form for the same state', () => {
    expect(selectTransferForm(state)).toBe(selectTransferForm(state));
  });

  it('selects submitting, confirmation, and error', () => {
    expect(selectTransferSubmitting(state)).toBe(true);
    expect(selectTransferConfirmation(state)).toBe('Transfer complete.');
    expect(selectTransferError(state)).toBe('Something went wrong.');
  });
});
