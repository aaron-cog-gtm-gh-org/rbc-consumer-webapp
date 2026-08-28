import { createAction, props } from '@ngrx/store';

export const navTabSelected = createAction('[UI] Nav Tab Selected', props<{ tab: string }>());

export const subNavTabSelected = createAction(
  '[UI] Sub Nav Tab Selected',
  props<{ tab: string }>(),
);

export const userMenuToggled = createAction('[UI] User Menu Toggled');

export const accountMenuToggled = createAction(
  '[UI] Account Menu Toggled',
  props<{ accountId: string }>(),
);

export const menusClosed = createAction('[UI] Menus Closed');

export const searchQueryChanged = createAction(
  '[UI] Search Query Changed',
  props<{ query: string }>(),
);
