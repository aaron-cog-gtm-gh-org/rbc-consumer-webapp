import { createAction, props } from '@ngrx/store';

export const accountsTransferApplied = createAction(
  '[Accounts] Transfer Applied',
  props<{ fromAccountId: string; toAccountId: string; amount: number }>(),
);
