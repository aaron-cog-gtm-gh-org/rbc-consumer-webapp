import { initialTransferState, transferFeatureKey } from './transfer.reducer';
import {
  selectTransferConfirmation,
  selectTransferError,
  selectTransferForm,
  selectTransferState,
  selectTransferSubmitting,
} from './transfer.selectors';

const stateWith = (overrides: Partial<typeof initialTransferState> = {}) => ({
  [transferFeatureKey]: { ...initialTransferState, ...overrides },
});

describe('transfer selectors', () => {
  it('selects the whole feature state', () => {
    expect(selectTransferState(stateWith())).toEqual(initialTransferState);
  });

  it('selects only the form fields', () => {
    const state = stateWith({ amount: '75.25', currency: 'USD', error: 'boom', submitting: true });

    expect(selectTransferForm(state)).toEqual({
      fromAccountId: 'day-to-day',
      toAccountId: 'esavings',
      amount: '75.25',
      currency: 'USD',
    });
  });

  it('selects the submitting, confirmation and error flags', () => {
    const state = stateWith({ submitting: true, confirmation: 'done', error: 'boom' });

    expect(selectTransferSubmitting(state)).toBe(true);
    expect(selectTransferConfirmation(state)).toBe('done');
    expect(selectTransferError(state)).toBe('boom');
  });

  it('defaults the confirmation and error to null', () => {
    expect(selectTransferConfirmation(stateWith())).toBeNull();
    expect(selectTransferError(stateWith())).toBeNull();
  });
});
