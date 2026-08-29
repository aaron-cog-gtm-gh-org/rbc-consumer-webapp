import {
  accountHistoryClosed,
  accountHistoryOpened,
  accountMenuToggled,
  menusClosed,
  navTabSelected,
} from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer account history', () => {
  it('opens history and closes the options menu', () => {
    const withMenu = uiReducer(initialUiState, accountMenuToggled({ accountId: 'esavings' }));
    const state = uiReducer(withMenu, accountHistoryOpened({ accountId: 'esavings' }));

    expect(state.historyAccountId).toBe('esavings');
    expect(state.openAccountMenuId).toBeNull();
    expect(state.userMenuOpen).toBe(false);
  });

  it('clears the history account on close', () => {
    const opened = uiReducer(initialUiState, accountHistoryOpened({ accountId: 'rrsp' }));

    expect(uiReducer(opened, accountHistoryClosed()).historyAccountId).toBeNull();
  });

  it('clears the history account when menus close or the nav tab changes', () => {
    const opened = uiReducer(initialUiState, accountHistoryOpened({ accountId: 'day-to-day' }));

    expect(uiReducer(opened, menusClosed()).historyAccountId).toBeNull();
    expect(uiReducer(opened, navTabSelected({ tab: 'Pay Bills' })).historyAccountId).toBeNull();
  });
});
