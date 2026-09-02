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
  it('selects a nav tab and closes every menu', () => {
    const open = { ...initialUiState, userMenuOpen: true, openAccountMenuId: 'day-to-day' };

    const state = uiReducer(open, navTabSelected({ tab: 'Pay Bills & Transfer Funds' }));

    expect(state.activeNavTab).toBe('Pay Bills & Transfer Funds');
    expect(state.userMenuOpen).toBe(false);
    expect(state.openAccountMenuId).toBeNull();
  });

  it('selects a sub nav tab', () => {
    const state = uiReducer(initialUiState, subNavTabSelected({ tab: 'View & Pay Bills' }));

    expect(state.activeSubNavTab).toBe('View & Pay Bills');
    expect(state.activeNavTab).toBe(initialUiState.activeNavTab);
  });

  it('toggles the user menu and closes any open account menu', () => {
    const opened = uiReducer(
      { ...initialUiState, openAccountMenuId: 'day-to-day' },
      userMenuToggled(),
    );
    expect(opened.userMenuOpen).toBe(true);
    expect(opened.openAccountMenuId).toBeNull();

    const closed = uiReducer(opened, userMenuToggled());
    expect(closed.userMenuOpen).toBe(false);
    expect(closed.openAccountMenuId).toBeNull();
  });

  it('toggles an account menu and closes the user menu', () => {
    const opened = uiReducer(
      { ...initialUiState, userMenuOpen: true },
      accountMenuToggled({ accountId: 'day-to-day' }),
    );
    expect(opened.openAccountMenuId).toBe('day-to-day');
    expect(opened.userMenuOpen).toBe(false);

    const switched = uiReducer(opened, accountMenuToggled({ accountId: 'esavings' }));
    expect(switched.openAccountMenuId).toBe('esavings');

    const toggledOff = uiReducer(switched, accountMenuToggled({ accountId: 'esavings' }));
    expect(toggledOff.openAccountMenuId).toBeNull();
  });

  it('closes every menu', () => {
    const state = uiReducer(
      { ...initialUiState, userMenuOpen: true, openAccountMenuId: 'rrsp' },
      menusClosed(),
    );

    expect(state.userMenuOpen).toBe(false);
    expect(state.openAccountMenuId).toBeNull();
  });

  it('updates the search query', () => {
    const state = uiReducer(initialUiState, searchQueryChanged({ query: 'e-transfer' }));

    expect(state.searchQuery).toBe('e-transfer');
  });
});
