import {
  accountMenuToggled,
  menusClosed,
  navTabSelected,
  searchQueryChanged,
  subNavTabSelected,
  userMenuToggled,
} from './ui.actions';
import { UiState, initialUiState, uiReducer } from './ui.reducer';

const state: UiState = {
  activeNavTab: 'My Accounts',
  activeSubNavTab: 'Accounts Summary',
  userMenuOpen: false,
  openAccountMenuId: null,
  unreadMessages: 2,
  searchQuery: '',
};

describe('uiReducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toBe(initialUiState);
  });

  it('starts on My Accounts / Accounts Summary with menus closed', () => {
    expect(initialUiState).toEqual({
      activeNavTab: 'My Accounts',
      activeSubNavTab: 'Accounts Summary',
      userMenuOpen: false,
      openAccountMenuId: null,
      unreadMessages: 3,
      searchQuery: '',
    });
  });

  it('selects a nav tab and closes all menus', () => {
    const next = uiReducer(
      { ...state, userMenuOpen: true, openAccountMenuId: 'esavings' },
      navTabSelected({ tab: 'Customer Service' }),
    );
    expect(next).toEqual({ ...state, activeNavTab: 'Customer Service' });
  });

  it('selects a sub nav tab without touching menus', () => {
    const open = { ...state, userMenuOpen: true };
    expect(uiReducer(open, subNavTabSelected({ tab: 'Profile & Account Settings' }))).toEqual({
      ...open,
      activeSubNavTab: 'Profile & Account Settings',
    });
  });

  describe('userMenuToggled', () => {
    it('opens the user menu and closes any account menu', () => {
      const next = uiReducer({ ...state, openAccountMenuId: 'rrsp' }, userMenuToggled());
      expect(next.userMenuOpen).toBe(true);
      expect(next.openAccountMenuId).toBeNull();
    });

    it('closes the user menu when already open', () => {
      expect(uiReducer({ ...state, userMenuOpen: true }, userMenuToggled()).userMenuOpen).toBe(
        false,
      );
    });
  });

  describe('accountMenuToggled', () => {
    it('opens the account menu and closes the user menu', () => {
      const next = uiReducer(
        { ...state, userMenuOpen: true },
        accountMenuToggled({ accountId: 'esavings' }),
      );
      expect(next.openAccountMenuId).toBe('esavings');
      expect(next.userMenuOpen).toBe(false);
    });

    it('closes the menu when the same account is toggled again', () => {
      const next = uiReducer(
        { ...state, openAccountMenuId: 'esavings' },
        accountMenuToggled({ accountId: 'esavings' }),
      );
      expect(next.openAccountMenuId).toBeNull();
    });

    it('switches to a different account menu', () => {
      const next = uiReducer(
        { ...state, openAccountMenuId: 'esavings' },
        accountMenuToggled({ accountId: 'day-to-day' }),
      );
      expect(next.openAccountMenuId).toBe('day-to-day');
    });
  });

  it('closes every menu on menusClosed', () => {
    const next = uiReducer(
      { ...state, userMenuOpen: true, openAccountMenuId: 'rrsp' },
      menusClosed(),
    );
    expect(next).toEqual(state);
  });

  it('stores the search query', () => {
    expect(uiReducer(state, searchQueryChanged({ query: 'tfsa' })).searchQuery).toBe('tfsa');
  });
});
