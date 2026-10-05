import {
  accountHistoryClosed,
  accountHistoryRequested,
  accountMenuToggled,
  navTabSelected,
  userMenuToggled,
} from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer account history', () => {
  it('starts with no history selection', () => {
    expect(initialUiState.historyAccountId).toBeNull();
  });

  it('sets historyAccountId and closes menus on accountHistoryRequested', () => {
    const withMenuOpen = uiReducer(initialUiState, accountMenuToggled({ accountId: 'esavings' }));
    const state = uiReducer(withMenuOpen, accountHistoryRequested({ accountId: 'esavings' }));
    expect(state.historyAccountId).toBe('esavings');
    expect(state.openAccountMenuId).toBeNull();
    expect(state.userMenuOpen).toBe(false);

    const withUserMenu = uiReducer(initialUiState, userMenuToggled());
    expect(
      uiReducer(withUserMenu, accountHistoryRequested({ accountId: 'day-to-day' })).userMenuOpen,
    ).toBe(false);
  });

  it('clears historyAccountId on accountHistoryClosed', () => {
    const open = uiReducer(initialUiState, accountHistoryRequested({ accountId: 'day-to-day' }));
    expect(uiReducer(open, accountHistoryClosed()).historyAccountId).toBeNull();
  });

  it('clears historyAccountId on navTabSelected', () => {
    const open = uiReducer(initialUiState, accountHistoryRequested({ accountId: 'day-to-day' }));
    expect(uiReducer(open, navTabSelected({ tab: 'Bill Payments' })).historyAccountId).toBeNull();
  });
});
