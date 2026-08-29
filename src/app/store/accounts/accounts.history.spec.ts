import { AppState } from '../index';
import { initialTransferState } from '../transfer/transfer.reducer';
import { accountHistoryClosed, accountHistoryOpened, navTabSelected } from '../ui/ui.actions';
import { initialUiState, uiReducer } from '../ui/ui.reducer';
import { initialAccountsState } from './accounts.reducer';
import { selectHistoryAccount } from './accounts.selectors';

const stateWith = (historyAccountId: string | null): AppState => ({
  accounts: initialAccountsState,
  transfer: initialTransferState,
  ui: { ...initialUiState, historyAccountId },
});

describe('ui reducer account history handling', () => {
  it('opens history and closes menus', () => {
    const state = uiReducer(
      { ...initialUiState, openAccountMenuId: 'esavings', userMenuOpen: true },
      accountHistoryOpened({ accountId: 'esavings' }),
    );

    expect(state.historyAccountId).toBe('esavings');
    expect(state.openAccountMenuId).toBeNull();
    expect(state.userMenuOpen).toBe(false);
  });

  it('clears history on close and on nav tab change', () => {
    const open = { ...initialUiState, historyAccountId: 'rrsp' };

    expect(uiReducer(open, accountHistoryClosed()).historyAccountId).toBeNull();
    expect(uiReducer(open, navTabSelected({ tab: 'Banking' })).historyAccountId).toBeNull();
  });
});

describe('selectHistoryAccount', () => {
  it('returns null when no account is drilled into', () => {
    expect(selectHistoryAccount(stateWith(null))).toBeNull();
  });

  it('returns null for an unknown account id', () => {
    expect(selectHistoryAccount(stateWith('nope'))).toBeNull();
  });

  it('returns the selected account with history ending at its balance', () => {
    const account = selectHistoryAccount(stateWith('day-to-day'));

    expect(account?.name).toBe('RBC Day to Day Banking');
    expect(account?.history?.at(-1)).toEqual({ date: '2026-08-31', balance: account?.balance });
  });

  it('gives every seed account a chronological history ending at its balance', () => {
    for (const seed of initialAccountsState.accounts) {
      const history = seed.history ?? [];
      const dates = history.map((point) => point.date);

      expect(history.length).toBeGreaterThanOrEqual(6);
      expect(dates).toEqual([...dates].sort());
      expect(history.at(-1)?.balance).toBe(seed.balance);
    }
  });
});
