import { ActionReducerMap } from '@ngrx/store';
import { AccountsState } from './accounts/accounts.models';
import { accountsFeatureKey, accountsReducer } from './accounts/accounts.reducer';
import { TransactionsState } from './transactions/transactions.models';
import { transactionsFeatureKey, transactionsReducer } from './transactions/transactions.reducer';
import { TransferState } from './transfer/transfer.models';
import { transferFeatureKey, transferReducer } from './transfer/transfer.reducer';
import { UiState, uiFeatureKey, uiReducer } from './ui/ui.reducer';

export interface AppState {
  [accountsFeatureKey]: AccountsState;
  [transactionsFeatureKey]: TransactionsState;
  [transferFeatureKey]: TransferState;
  [uiFeatureKey]: UiState;
}

export const rootReducers: ActionReducerMap<AppState> = {
  [accountsFeatureKey]: accountsReducer,
  [transactionsFeatureKey]: transactionsReducer,
  [transferFeatureKey]: transferReducer,
  [uiFeatureKey]: uiReducer,
};
