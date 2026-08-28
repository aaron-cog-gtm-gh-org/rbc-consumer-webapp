import { createReducer, on } from '@ngrx/store';
import {
  transferCompleted,
  transferConfirmationDismissed,
  transferFormChanged,
  transferRejected,
  transferSubmitted,
} from './transfer.actions';
import { TransferState } from './transfer.models';

export const transferFeatureKey = 'transfer';

export const initialTransferState: TransferState = {
  fromAccountId: 'day-to-day',
  toAccountId: 'esavings',
  amount: null,
  currency: 'CAD',
  submitting: false,
  confirmation: null,
  error: null,
};

export const transferReducer = createReducer(
  initialTransferState,
  on(transferFormChanged, (state, { type, ...changes }) => ({
    ...state,
    ...changes,
    error: null,
  })),
  on(transferSubmitted, (state) => ({
    ...state,
    submitting: true,
    confirmation: null,
    error: null,
  })),
  on(transferCompleted, (state, { confirmation }) => ({
    ...state,
    submitting: false,
    amount: null,
    confirmation,
    error: null,
  })),
  on(transferRejected, (state, { error }) => ({
    ...state,
    submitting: false,
    confirmation: null,
    error,
  })),
  on(transferConfirmationDismissed, (state) => ({ ...state, confirmation: null, error: null })),
);
