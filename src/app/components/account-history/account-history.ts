import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectHistoryAccount } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
})
export class AccountHistory {
  private readonly store = inject(Store);

  protected readonly account = toSignal(this.store.select(selectHistoryAccount), {
    initialValue: undefined,
  });

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
