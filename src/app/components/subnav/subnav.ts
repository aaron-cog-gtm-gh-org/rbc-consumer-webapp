import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { subNavTabSelected } from '../../store/ui/ui.actions';
import { selectActiveSubNavTab } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.html',
  styleUrl: './subnav.scss',
})
export class Subnav {
  private readonly store = inject(Store);

  protected readonly tabs = ['Accounts Summary', 'Profile & Account Settings'];

  protected readonly activeTab = toSignal(this.store.select(selectActiveSubNavTab), {
    initialValue: '',
  });

  protected selectTab(tab: string): void {
    this.store.dispatch(subNavTabSelected({ tab }));
  }
}
