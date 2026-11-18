import {
  accountMenuToggled,
  menusClosed,
  navTabSelected,
  searchQueryChanged,
  subNavTabSelected,
  userMenuToggled,
} from './ui.actions';

describe('ui actions', () => {
  it('creates tab selection actions with the tab name', () => {
    expect(navTabSelected({ tab: 'My Accounts' })).toEqual({
      type: '[UI] Nav Tab Selected',
      tab: 'My Accounts',
    });
    expect(subNavTabSelected({ tab: 'Accounts Summary' })).toEqual({
      type: '[UI] Sub Nav Tab Selected',
      tab: 'Accounts Summary',
    });
  });

  it('creates menu actions', () => {
    expect(userMenuToggled()).toEqual({ type: '[UI] User Menu Toggled' });
    expect(menusClosed()).toEqual({ type: '[UI] Menus Closed' });
    expect(accountMenuToggled({ accountId: 'esavings' })).toEqual({
      type: '[UI] Account Menu Toggled',
      accountId: 'esavings',
    });
  });

  it('creates searchQueryChanged with the query', () => {
    expect(searchQueryChanged({ query: 'rrsp' })).toEqual({
      type: '[UI] Search Query Changed',
      query: 'rrsp',
    });
  });
});
