import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState, uiFeatureKey } from './ui.reducer';

export const selectUiState = createFeatureSelector<UiState>(uiFeatureKey);

export const selectActiveNavTab = createSelector(selectUiState, (state) => state.activeNavTab);

export const selectActiveSubNavTab = createSelector(
  selectUiState,
  (state) => state.activeSubNavTab,
);

export const selectUserMenuOpen = createSelector(selectUiState, (state) => state.userMenuOpen);

export const selectOpenAccountMenuId = createSelector(
  selectUiState,
  (state) => state.openAccountMenuId,
);

export const selectUnreadMessages = createSelector(selectUiState, (state) => state.unreadMessages);

export const selectSearchQuery = createSelector(selectUiState, (state) => state.searchQuery);
