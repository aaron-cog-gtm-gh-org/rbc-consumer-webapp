import { combineReducers } from '@ngrx/store';
import { rootReducers } from '.';
import { initialAccountsState } from './accounts/accounts.reducer';
import { initialTransferState } from './transfer/transfer.reducer';
import { initialUiState } from './ui/ui.reducer';

describe('rootReducers', () => {
  it('registers a reducer for every feature slice', () => {
    expect(Object.keys(rootReducers).sort()).toEqual(['accounts', 'transfer', 'ui']);
  });

  it('builds the initial app state from each slice', () => {
    expect(combineReducers(rootReducers)(undefined, { type: '@@init' })).toEqual({
      accounts: initialAccountsState,
      transfer: initialTransferState,
      ui: initialUiState,
    });
  });
});
