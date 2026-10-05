import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Account, AccountsState } from './accounts.models';
import { accountsFeatureKey } from './accounts.reducer';
import { selectHistoryAccountId } from '../ui/ui.selectors';

const sumBalances = (accounts: Account[]): number =>
  accounts.reduce((total, account) => total + account.balance, 0);

export const selectAccountsState = createFeatureSelector<AccountsState>(accountsFeatureKey);

export const selectUserName = createSelector(selectAccountsState, (state) => state.userName);

export const selectUserFirstName = createSelector(
  selectAccountsState,
  (state) => state.userFirstName,
);

export const selectStatementDate = createSelector(
  selectAccountsState,
  (state) => state.statementDate,
);

export const selectAllAccounts = createSelector(selectAccountsState, (state) => state.accounts);

export const selectBankAccounts = createSelector(selectAllAccounts, (accounts) =>
  accounts.filter((account) => account.kind === 'bank'),
);

export const selectInvestmentAccounts = createSelector(selectAllAccounts, (accounts) =>
  accounts.filter((account) => account.kind === 'investment'),
);

export const selectBankAccountsTotal = createSelector(selectBankAccounts, sumBalances);

export const selectInvestmentsTotal = createSelector(selectInvestmentAccounts, sumBalances);

export const selectHistoryAccount = createSelector(
  selectAllAccounts,
  selectHistoryAccountId,
  (accounts, accountId) => accounts.find((account) => account.id === accountId) ?? null,
);
