import {
  accountHistoryClosed,
  accountHistoryOpened,
  accountMenuToggled,
  menusClosed,
} from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer account history', () => {
  it('opens the history for an account and closes the other menus', () => {
    const withMenus = uiReducer(initialUiState, accountMenuToggled({ accountId: 'esavings' }));
    const state = uiReducer(withMenus, accountHistoryOpened({ accountId: 'esavings' }));

    expect(state.openHistoryAccountId).toBe('esavings');
    expect(state.openAccountMenuId).toBeNull();
    expect(state.userMenuOpen).toBe(false);
  });

  it('clears the open history account id on close', () => {
    const opened = uiReducer(initialUiState, accountHistoryOpened({ accountId: 'rrsp' }));

    expect(uiReducer(opened, accountHistoryClosed()).openHistoryAccountId).toBeNull();
    expect(uiReducer(opened, menusClosed()).openHistoryAccountId).toBeNull();
  });
});
