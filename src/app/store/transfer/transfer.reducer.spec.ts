import {
  transferCompleted,
  transferConfirmationDismissed,
  transferFormChanged,
  transferRejected,
  transferSubmitted,
} from './transfer.actions';
import { initialTransferState, transferReducer } from './transfer.reducer';

describe('transferReducer', () => {
  it('merges form changes and clears the error', () => {
    const withError = { ...initialTransferState, error: 'Choose two different accounts.' };

    const state = transferReducer(withError, transferFormChanged({ amount: '100.55' }));

    expect(state).toEqual({ ...initialTransferState, amount: '100.55' });
  });

  it('keeps untouched form fields when merging partial changes', () => {
    const state = transferReducer(
      initialTransferState,
      transferFormChanged({ toAccountId: 'rrsp', currency: 'USD' }),
    );

    expect(state.fromAccountId).toBe(initialTransferState.fromAccountId);
    expect(state.toAccountId).toBe('rrsp');
    expect(state.currency).toBe('USD');
  });

  it('marks the transfer as submitting and clears previous results', () => {
    const previous = {
      ...initialTransferState,
      confirmation: 'Transfer complete.',
      error: 'Boom',
    };

    const state = transferReducer(previous, transferSubmitted());

    expect(state.submitting).toBe(true);
    expect(state.confirmation).toBeNull();
    expect(state.error).toBeNull();
  });

  it('stores the confirmation and resets the amount on completion', () => {
    const submitting = { ...initialTransferState, amount: '100.55', submitting: true };

    const state = transferReducer(
      submitting,
      transferCompleted({ confirmation: 'Transfer complete.' }),
    );

    expect(state.submitting).toBe(false);
    expect(state.amount).toBe('');
    expect(state.confirmation).toBe('Transfer complete.');
    expect(state.error).toBeNull();
  });

  it('stores the error and clears the confirmation on rejection', () => {
    const submitting = {
      ...initialTransferState,
      amount: '0',
      submitting: true,
      confirmation: 'Transfer complete.',
    };

    const state = transferReducer(
      submitting,
      transferRejected({ error: 'Enter an amount greater than $0.00.' }),
    );

    expect(state.submitting).toBe(false);
    expect(state.confirmation).toBeNull();
    expect(state.error).toBe('Enter an amount greater than $0.00.');
    expect(state.amount).toBe('0');
  });

  it('clears the confirmation and the error when dismissed', () => {
    const previous = {
      ...initialTransferState,
      confirmation: 'Transfer complete.',
      error: 'Boom',
    };

    const state = transferReducer(previous, transferConfirmationDismissed());

    expect(state.confirmation).toBeNull();
    expect(state.error).toBeNull();
  });
});
