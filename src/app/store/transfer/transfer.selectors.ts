import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransferState } from './transfer.models';
import { transferFeatureKey } from './transfer.reducer';

export const selectTransferState = createFeatureSelector<TransferState>(transferFeatureKey);

export const selectTransferForm = createSelector(selectTransferState, (state) => ({
  fromAccountId: state.fromAccountId,
  toAccountId: state.toAccountId,
  amount: state.amount,
  currency: state.currency,
}));

export const selectTransferSubmitting = createSelector(
  selectTransferState,
  (state) => state.submitting,
);

export const selectTransferConfirmation = createSelector(
  selectTransferState,
  (state) => state.confirmation,
);

export const selectTransferError = createSelector(selectTransferState, (state) => state.error);
