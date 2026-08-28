import { accountDetailsClosed, accountDetailsOpened } from './ui.actions';
import { initialUiState, uiReducer } from './ui.reducer';
import { selectSelectedAccountId } from './ui.selectors';

describe('uiReducer account details', () => {
  it('should default selectedAccountId to null', () => {
    expect(initialUiState.selectedAccountId).toBeNull();
  });

  it('should store the account id and close menus on accountDetailsOpened', () => {
    const state = uiReducer(
      { ...initialUiState, userMenuOpen: true, openAccountMenuId: 'esavings' },
      accountDetailsOpened({ accountId: 'day-to-day' }),
    );
    expect(state.selectedAccountId).toBe('day-to-day');
    expect(state.userMenuOpen).toBe(false);
    expect(state.openAccountMenuId).toBeNull();
  });

  it('should clear the account id on accountDetailsClosed', () => {
    const opened = uiReducer(initialUiState, accountDetailsOpened({ accountId: 'rrsp' }));
    expect(uiReducer(opened, accountDetailsClosed()).selectedAccountId).toBeNull();
  });

  it('should expose the selected account id through the selector', () => {
    expect(
      selectSelectedAccountId.projector({ ...initialUiState, selectedAccountId: 'rrsp' }),
    ).toBe('rrsp');
  });
});
