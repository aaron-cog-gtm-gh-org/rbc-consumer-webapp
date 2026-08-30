import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Account, AccountsState, BalanceHistoryPoint } from './accounts.models';
import { accountsFeatureKey } from './accounts.reducer';

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

export const selectAccountById = (id: string | null) =>
  createSelector(
    selectAllAccounts,
    (accounts): Account | null => accounts.find((account) => account.id === id) ?? null,
  );

export const selectAccountHistory = (id: string | null) =>
  createSelector(selectAccountById(id), (account): BalanceHistoryPoint[] => account?.history ?? []);

export const selectBankAccountsTotal = createSelector(selectBankAccounts, sumBalances);

export const selectInvestmentsTotal = createSelector(selectInvestmentAccounts, sumBalances);
