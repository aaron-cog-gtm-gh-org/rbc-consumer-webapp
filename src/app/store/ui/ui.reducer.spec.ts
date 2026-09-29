import {
  accountHistoryClosed,
  accountHistoryOpened,
  accountMenuToggled,
  menusClosed,
  navTabSelected,
  userMenuToggled,
} from './ui.actions';
import { UiState, initialUiState, uiReducer } from './ui.reducer';

const historyOpenState: UiState = {
  ...initialUiState,
  accountHistoryModal: { open: true, accountId: 'day-to-day' },
};

describe('uiReducer account history modal', () => {
  it('starts closed', () => {
    expect(initialUiState.accountHistoryModal).toEqual({ open: false, accountId: null });
  });

  it('opens for the selected account and closes any open menus', () => {
    const withMenus: UiState = {
      ...initialUiState,
      userMenuOpen: true,
      openAccountMenuId: 'day-to-day',
    };

    const state = uiReducer(withMenus, accountHistoryOpened({ accountId: 'esavings' }));

    expect(state.accountHistoryModal).toEqual({ open: true, accountId: 'esavings' });
    expect(state.userMenuOpen).toBe(false);
    expect(state.openAccountMenuId).toBeNull();
  });

  it('closes on accountHistoryClosed', () => {
    const state = uiReducer(historyOpenState, accountHistoryClosed());

    expect(state.accountHistoryModal).toEqual({ open: false, accountId: null });
  });

  it.each([
    ['user menu toggled', userMenuToggled()],
    ['account menu toggled', accountMenuToggled({ accountId: 'esavings' })],
    ['nav tab selected', navTabSelected({ tab: 'Transfers' })],
    ['menus closed', menusClosed()],
  ])('closes when %s', (_, action) => {
    const state = uiReducer(historyOpenState, action);

    expect(state.accountHistoryModal).toEqual({ open: false, accountId: null });
  });
});
