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

export interface AccountHistoryModalState {
  open: boolean;
  accountId: string | null;
}

const closedAccountHistoryModal: AccountHistoryModalState = { open: false, accountId: null };

export interface UiState {
  activeNavTab: string;
  activeSubNavTab: string;
  userMenuOpen: boolean;
  openAccountMenuId: string | null;
  unreadMessages: number;
  searchQuery: string;
  accountHistoryModal: AccountHistoryModalState;
}

export const initialUiState: UiState = {
  activeNavTab: 'My Accounts',
  activeSubNavTab: 'Accounts Summary',
  userMenuOpen: false,
  openAccountMenuId: null,
  unreadMessages: 3,
  searchQuery: '',
  accountHistoryModal: closedAccountHistoryModal,
};

export const uiReducer = createReducer(
  initialUiState,
  on(navTabSelected, (state, { tab }) => ({
    ...state,
    activeNavTab: tab,
    userMenuOpen: false,
    openAccountMenuId: null,
    accountHistoryModal: closedAccountHistoryModal,
  })),
  on(subNavTabSelected, (state, { tab }) => ({ ...state, activeSubNavTab: tab })),
  on(userMenuToggled, (state) => ({
    ...state,
    userMenuOpen: !state.userMenuOpen,
    openAccountMenuId: null,
    accountHistoryModal: closedAccountHistoryModal,
  })),
  on(accountMenuToggled, (state, { accountId }) => ({
    ...state,
    userMenuOpen: false,
    openAccountMenuId: state.openAccountMenuId === accountId ? null : accountId,
    accountHistoryModal: closedAccountHistoryModal,
  })),
  on(accountHistoryOpened, (state, { accountId }) => ({
    ...state,
    userMenuOpen: false,
    openAccountMenuId: null,
    accountHistoryModal: { open: true, accountId },
  })),
  on(accountHistoryClosed, (state) => ({
    ...state,
    accountHistoryModal: closedAccountHistoryModal,
  })),
  on(menusClosed, (state) => ({
    ...state,
    userMenuOpen: false,
    openAccountMenuId: null,
    accountHistoryModal: closedAccountHistoryModal,
  })),
  on(searchQueryChanged, (state, { query }) => ({ ...state, searchQuery: query })),
);
