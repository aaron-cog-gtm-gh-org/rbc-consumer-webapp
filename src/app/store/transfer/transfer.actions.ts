import { createAction, props } from '@ngrx/store';

export const transferFormChanged = createAction(
  '[Transfer] Form Changed',
  props<{
    fromAccountId?: string;
    toAccountId?: string;
    amount?: string;
    currency?: string;
  }>(),
);

export const transferSubmitted = createAction('[Transfer] Submitted');

export const transferCompleted = createAction(
  '[Transfer] Completed',
  props<{ confirmation: string }>(),
);

export const transferRejected = createAction('[Transfer] Rejected', props<{ error: string }>());

export const transferConfirmationDismissed = createAction('[Transfer] Confirmation Dismissed');
