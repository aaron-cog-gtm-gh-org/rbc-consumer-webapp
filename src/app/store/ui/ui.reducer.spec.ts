import { accountHistoryClosed, accountHistoryOpened, navTabSelected } from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer account history', () => {
  it('opens the drill-down and closes the menus', () => {
    const opened = uiReducer(
      { ...initialUiState, openAccountMenuId: 'day-to-day', userMenuOpen: true },
      accountHistoryOpened({ accountId: 'day-to-day' }),
    );

    expect(opened.historyAccountId).toBe('day-to-day');
    expect(opened.openAccountMenuId).toBeNull();
    expect(opened.userMenuOpen).toBe(false);
  });

  it('closes the drill-down', () => {
    const state = { ...initialUiState, historyAccountId: 'rrsp' };
    expect(uiReducer(state, accountHistoryClosed()).historyAccountId).toBeNull();
  });

  it('clears the drill-down when a nav tab is selected', () => {
    const state = { ...initialUiState, historyAccountId: 'esavings' };
    expect(uiReducer(state, navTabSelected({ tab: 'Banking' })).historyAccountId).toBeNull();
  });
});
