import { createReducer, on } from '@ngrx/store';
import {
  accountHistoryClosed,
  accountHistoryOpened,
  accountMenuToggled,
  menusClosed,
  navTabSelected,
  searchQueryChanged,
  subNavTabSelected,
  userMenuToggled,
} from './ui.actions';

export const uiFeatureKey = 'ui';

export interface UiState {
  activeNavTab: string;
  activeSubNavTab: string;
  userMenuOpen: boolean;
  openAccountMenuId: string | null;
  historyAccountId: string | null;
  unreadMessages: number;
  searchQuery: string;
}

export const initialUiState: UiState = {
  activeNavTab: 'My Accounts',
  activeSubNavTab: 'Accounts Summary',
  userMenuOpen: false,
  openAccountMenuId: null,
  historyAccountId: null,
  unreadMessages: 3,
  searchQuery: '',
};

export const uiReducer = createReducer(
  initialUiState,
  on(navTabSelected, (state, { tab }) => ({
    ...state,
    activeNavTab: tab,
    userMenuOpen: false,
    openAccountMenuId: null,
    historyAccountId: null,
  })),
  on(subNavTabSelected, (state, { tab }) => ({ ...state, activeSubNavTab: tab })),
  on(userMenuToggled, (state) => ({
    ...state,
    userMenuOpen: !state.userMenuOpen,
    openAccountMenuId: null,
  })),
  on(accountMenuToggled, (state, { accountId }) => ({
    ...state,
    userMenuOpen: false,
    openAccountMenuId: state.openAccountMenuId === accountId ? null : accountId,
  })),
  on(menusClosed, (state) => ({ ...state, userMenuOpen: false, openAccountMenuId: null })),
  on(accountHistoryOpened, (state, { accountId }) => ({
    ...state,
    historyAccountId: accountId,
    openAccountMenuId: null,
    userMenuOpen: false,
  })),
  on(accountHistoryClosed, (state) => ({ ...state, historyAccountId: null })),
  on(searchQueryChanged, (state, { query }) => ({ ...state, searchQuery: query })),
);
