import { UiState, initialUiState, uiFeatureKey } from './ui.reducer';
import {
  selectActiveNavTab,
  selectActiveSubNavTab,
  selectOpenAccountMenuId,
  selectSearchQuery,
  selectUiState,
  selectUnreadMessages,
  selectUserMenuOpen,
} from './ui.selectors';

const stateWith = (overrides: Partial<UiState> = {}) => ({
  [uiFeatureKey]: { ...initialUiState, ...overrides },
});

describe('ui selectors', () => {
  it('selects the whole feature state', () => {
    expect(selectUiState(stateWith())).toEqual(initialUiState);
  });

  it('selects the active tabs', () => {
    const state = stateWith({
      activeNavTab: 'Customer Service',
      activeSubNavTab: 'Profile & Account Settings',
    });

    expect(selectActiveNavTab(state)).toBe('Customer Service');
    expect(selectActiveSubNavTab(state)).toBe('Profile & Account Settings');
  });

  it('selects the menu state', () => {
    const state = stateWith({ userMenuOpen: true, openAccountMenuId: 'esavings' });

    expect(selectUserMenuOpen(state)).toBe(true);
    expect(selectOpenAccountMenuId(state)).toBe('esavings');
  });

  it('selects unread messages and the search query', () => {
    const state = stateWith({ unreadMessages: 7, searchQuery: 'visa' });

    expect(selectUnreadMessages(state)).toBe(7);
    expect(selectSearchQuery(state)).toBe('visa');
  });
});
