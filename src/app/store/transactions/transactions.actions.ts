import { createAction, props } from '@ngrx/store';
import { Transaction } from './transactions.models';

export const transactionsLoaded = createAction(
  '[Transactions] Loaded',
  props<{ transactions: Transaction[] }>(),
);

export const transactionsCleared = createAction('[Transactions] Cleared');
