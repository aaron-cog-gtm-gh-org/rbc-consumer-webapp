import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransactionsState } from './transactions.models';
import { transactionsFeatureKey } from './transactions.reducer';

export const selectTransactionsState =
  createFeatureSelector<TransactionsState>(transactionsFeatureKey);

export const selectAllTransactions = createSelector(
  selectTransactionsState,
  (state) => state.transactions,
);

export const selectTransactionsForAccount = (accountId: string | null) =>
  createSelector(selectAllTransactions, (transactions) =>
    accountId === null
      ? []
      : transactions.filter((transaction) => transaction.accountId === accountId),
  );
