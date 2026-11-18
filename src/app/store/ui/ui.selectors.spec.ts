import { UiState, uiFeatureKey } from './ui.reducer';
import {
  selectActiveNavTab,
  selectActiveSubNavTab,
  selectOpenAccountMenuId,
  selectSearchQuery,
  selectUiState,
  selectUnreadMessages,
  selectUserMenuOpen,
} from './ui.selectors';

const uiState: UiState = {
  activeNavTab: 'Customer Service',
  activeSubNavTab: 'Profile & Account Settings',
  userMenuOpen: true,
  openAccountMenuId: 'esavings',
  unreadMessages: 7,
  searchQuery: 'mortgage',
};

const state = { [uiFeatureKey]: uiState };

describe('ui selectors', () => {
  it('selects the ui feature state', () => {
    expect(selectUiState(state)).toBe(uiState);
  });

  it('selects the active tabs', () => {
    expect(selectActiveNavTab(state)).toBe('Customer Service');
    expect(selectActiveSubNavTab(state)).toBe('Profile & Account Settings');
  });

  it('selects menu state', () => {
    expect(selectUserMenuOpen(state)).toBe(true);
    expect(selectOpenAccountMenuId(state)).toBe('esavings');
  });

  it('selects unread messages and search query', () => {
    expect(selectUnreadMessages(state)).toBe(7);
    expect(selectSearchQuery(state)).toBe('mortgage');
  });
});
