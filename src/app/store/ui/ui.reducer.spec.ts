import {
  accountMenuToggled,
  menusClosed,
  navTabSelected,
  searchQueryChanged,
  subNavTabSelected,
  userMenuToggled,
} from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';

describe('uiReducer', () => {
  it('starts on the accounts summary with closed menus', () => {
    expect(initialUiState).toEqual({
      activeNavTab: 'My Accounts',
      activeSubNavTab: 'Accounts Summary',
      userMenuOpen: false,
      openAccountMenuId: null,
      unreadMessages: 3,
      searchQuery: '',
    });
  });

  it('changes the active nav tab and closes any open menu', () => {
    const state = uiReducer(
      { ...initialUiState, userMenuOpen: true, openAccountMenuId: 'esavings' },
      navTabSelected({ tab: 'Customer Service' }),
    );

    expect(state).toMatchObject({
      activeNavTab: 'Customer Service',
      userMenuOpen: false,
      openAccountMenuId: null,
    });
  });

  it('changes the active subnav tab', () => {
    const state = uiReducer(
      initialUiState,
      subNavTabSelected({ tab: 'Profile & Account Settings' }),
    );

    expect(state.activeSubNavTab).toBe('Profile & Account Settings');
  });

  it('toggles the user menu and closes an open account menu', () => {
    const opened = uiReducer(
      { ...initialUiState, openAccountMenuId: 'day-to-day' },
      userMenuToggled(),
    );

    expect(opened).toMatchObject({ userMenuOpen: true, openAccountMenuId: null });
    expect(uiReducer(opened, userMenuToggled()).userMenuOpen).toBe(false);
  });

  it('opens one account menu at a time and closes the user menu', () => {
    const first = uiReducer(
      { ...initialUiState, userMenuOpen: true },
      accountMenuToggled({ accountId: 'day-to-day' }),
    );

    expect(first).toMatchObject({ openAccountMenuId: 'day-to-day', userMenuOpen: false });

    const second = uiReducer(first, accountMenuToggled({ accountId: 'esavings' }));

    expect(second.openAccountMenuId).toBe('esavings');
  });

  it('closes an account menu when its own trigger is toggled again', () => {
    const opened = uiReducer(initialUiState, accountMenuToggled({ accountId: 'esavings' }));

    expect(uiReducer(opened, accountMenuToggled({ accountId: 'esavings' })).openAccountMenuId).toBe(
      null,
    );
  });

  it('closes every menu', () => {
    const state = uiReducer(
      { ...initialUiState, userMenuOpen: true, openAccountMenuId: 'rrsp' },
      menusClosed(),
    );

    expect(state).toMatchObject({ userMenuOpen: false, openAccountMenuId: null });
  });

  it('stores the search query', () => {
    expect(uiReducer(initialUiState, searchQueryChanged({ query: 'e-transfer' })).searchQuery).toBe(
      'e-transfer',
    );
  });
});
