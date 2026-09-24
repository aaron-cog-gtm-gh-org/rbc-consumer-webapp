import {
  transferCompleted,
  transferConfirmationDismissed,
  transferFormChanged,
  transferRejected,
  transferSubmitted,
} from './transfer.actions';
import { initialTransferState, transferReducer } from './transfer.reducer';

describe('transferReducer', () => {
  it('defaults to a day-to-day to eSavings CAD transfer', () => {
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

  it('applies partial form changes and clears the error', () => {
    const state = transferReducer(
      { ...initialTransferState, error: 'Choose two different accounts.' },
      transferFormChanged({ amount: '250.00' }),
    );

    expect(state.amount).toBe('250.00');
    expect(state.fromAccountId).toBe('day-to-day');
    expect(state.error).toBeNull();
  });

  it('updates accounts and currency', () => {
    const state = transferReducer(
      initialTransferState,
      transferFormChanged({ fromAccountId: 'esavings', toAccountId: 'rrsp', currency: 'USD' }),
    );

    expect(state).toMatchObject({
      fromAccountId: 'esavings',
      toAccountId: 'rrsp',
      currency: 'USD',
    });
  });

  it('marks the form as submitting and clears previous results', () => {
    const state = transferReducer(
      { ...initialTransferState, confirmation: 'old', error: 'old error' },
      transferSubmitted(),
    );

    expect(state).toMatchObject({ submitting: true, confirmation: null, error: null });
  });

  it('resets the amount and stores the confirmation on completion', () => {
    const state = transferReducer(
      { ...initialTransferState, amount: '100', submitting: true },
      transferCompleted({ confirmation: 'Transfer complete.' }),
    );

    expect(state).toMatchObject({
      submitting: false,
      amount: '',
      confirmation: 'Transfer complete.',
      error: null,
    });
  });

  it('keeps the amount and stores the error on rejection', () => {
    const state = transferReducer(
      { ...initialTransferState, amount: '-50', submitting: true, confirmation: 'old' },
      transferRejected({ error: 'Enter an amount greater than $0.00.' }),
    );

    expect(state).toMatchObject({
      submitting: false,
      amount: '-50',
      confirmation: null,
      error: 'Enter an amount greater than $0.00.',
    });
  });

  it('clears both alerts when the confirmation is dismissed', () => {
    const state = transferReducer(
      { ...initialTransferState, confirmation: 'done', error: 'boom' },
      transferConfirmationDismissed(),
    );

    expect(state).toMatchObject({ confirmation: null, error: null });
  });
});
