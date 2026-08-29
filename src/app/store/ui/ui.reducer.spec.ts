import {
  accountMenuToggled,
  balanceHistoryClosed,
  balanceHistoryOpened,
  menusClosed,
  navTabSelected,
} from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer balance history', () => {
  it('opens the drill-down and closes other menus', () => {
    const withMenu = uiReducer(initialUiState, accountMenuToggled({ accountId: 'esavings' }));
    const state = uiReducer(withMenu, balanceHistoryOpened({ accountId: 'esavings' }));

    expect(state.balanceHistoryAccountId).toBe('esavings');
    expect(state.openAccountMenuId).toBeNull();
    expect(state.userMenuOpen).toBe(false);
  });

  it('closes the drill-down', () => {
    const open = uiReducer(initialUiState, balanceHistoryOpened({ accountId: 'rrsp' }));

    expect(uiReducer(open, balanceHistoryClosed()).balanceHistoryAccountId).toBeNull();
    expect(uiReducer(open, menusClosed()).balanceHistoryAccountId).toBeNull();
    expect(uiReducer(open, navTabSelected({ tab: 'Banking' })).balanceHistoryAccountId).toBeNull();
  });
});
