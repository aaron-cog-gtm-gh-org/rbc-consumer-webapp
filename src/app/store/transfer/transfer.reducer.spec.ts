import {
  transferCompleted,
  transferConfirmationDismissed,
  transferFormChanged,
  transferRejected,
  transferSubmitted,
} from './transfer.actions';
import { TransferState } from './transfer.models';
import { initialTransferState, transferReducer } from './transfer.reducer';

const state: TransferState = {
  fromAccountId: 'day-to-day',
  toAccountId: 'esavings',
  amount: '100',
  currency: 'CAD',
  submitting: false,
  confirmation: 'Previous confirmation',
  error: 'Previous error',
};

describe('transferReducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(transferReducer(undefined, { type: 'unknown' })).toBe(initialTransferState);
  });

  it('starts with a blank CAD transfer between day-to-day and eSavings', () => {
    expect(initialTransferState).toEqual({
      fromAccountId: 'day-to-day',
      toAccountId: 'esavings',
      amount: '',
      currency: 'CAD',
      submitting: false,
      confirmation: null,
      error: null,
    });
  });

  describe('transferFormChanged', () => {
    it('merges only the provided fields and clears the error', () => {
      const next = transferReducer(state, transferFormChanged({ toAccountId: 'rrsp' }));
      expect(next).toEqual({ ...state, toAccountId: 'rrsp', error: null });
    });

    it('updates amount and currency together', () => {
      const next = transferReducer(state, transferFormChanged({ amount: '5.5', currency: 'USD' }));
      expect(next.amount).toBe('5.5');
      expect(next.currency).toBe('USD');
    });

    it('does not copy the action type into state', () => {
      const next = transferReducer(state, transferFormChanged({ amount: '1' }));
      expect(next).not.toHaveProperty('type');
    });
  });

  it('marks the transfer as submitting and clears messages on transferSubmitted', () => {
    expect(transferReducer(state, transferSubmitted())).toEqual({
      ...state,
      submitting: true,
      confirmation: null,
      error: null,
    });
  });

  it('stores the confirmation and resets the amount on transferCompleted', () => {
    const next = transferReducer(
      { ...state, submitting: true },
      transferCompleted({ confirmation: 'Transfer complete.' }),
    );
    expect(next).toEqual({
      ...state,
      submitting: false,
      amount: '',
      confirmation: 'Transfer complete.',
      error: null,
    });
  });

  it('stores the error and keeps the amount on transferRejected', () => {
    const next = transferReducer(
      { ...state, submitting: true },
      transferRejected({ error: 'Insufficient funds in the selected account.' }),
    );
    expect(next).toEqual({
      ...state,
      submitting: false,
      confirmation: null,
      error: 'Insufficient funds in the selected account.',
    });
  });

  it('clears confirmation and error on transferConfirmationDismissed', () => {
    expect(transferReducer(state, transferConfirmationDismissed())).toEqual({
      ...state,
      confirmation: null,
      error: null,
    });
  });
});
