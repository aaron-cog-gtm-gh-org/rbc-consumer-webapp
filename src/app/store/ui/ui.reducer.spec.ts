import {
  accountHistoryToggled,
  accountMenuToggled,
  menusClosed,
  navTabSelected,
} from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer account history', () => {
  it('opens history and closes other menus', () => {
    const withMenus = {
      ...uiReducer(initialUiState, accountMenuToggled({ accountId: 'esavings' })),
      userMenuOpen: true,
    };
    const state = uiReducer(withMenus, accountHistoryToggled({ accountId: 'esavings' }));
    expect(state.openAccountHistoryId).toBe('esavings');
    expect(state.openAccountMenuId).toBeNull();
    expect(state.userMenuOpen).toBe(false);
  });

  it('toggles the same account history closed', () => {
    const open = uiReducer(initialUiState, accountHistoryToggled({ accountId: 'day-to-day' }));
    expect(
      uiReducer(open, accountHistoryToggled({ accountId: 'day-to-day' })).openAccountHistoryId,
    ).toBeNull();
  });

  it('clears history on nav tab change and menusClosed', () => {
    const open = uiReducer(initialUiState, accountHistoryToggled({ accountId: 'day-to-day' }));
    expect(uiReducer(open, navTabSelected({ tab: 'Transfers' })).openAccountHistoryId).toBeNull();
    expect(uiReducer(open, menusClosed()).openAccountHistoryId).toBeNull();
  });
});
