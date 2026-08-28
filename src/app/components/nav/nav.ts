import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectStatementDate } from '../../store/accounts/accounts.selectors';
import { navTabSelected } from '../../store/ui/ui.actions';
import { selectActiveNavTab } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  private readonly store = inject(Store);

  protected readonly tabs = ['Products & Services', 'My Accounts', 'Customer Service'];

  protected readonly activeTab = toSignal(this.store.select(selectActiveNavTab), {
    initialValue: '',
  });
  protected readonly statementDate = toSignal(this.store.select(selectStatementDate), {
    initialValue: '',
  });

  protected selectTab(tab: string): void {
    this.store.dispatch(navTabSelected({ tab }));
  }
}
