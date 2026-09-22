import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectAllAccounts } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';
import { selectOpenHistoryAccountId } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-account-history-modal',
  imports: [CurrencyPipe],
  templateUrl: './account-history-modal.html',
  styleUrl: './account-history-modal.scss',
})
export class AccountHistoryModal {
  private readonly store = inject(Store);

  private readonly accounts = toSignal(this.store.select(selectAllAccounts), {
    initialValue: [],
  });
  private readonly openAccountId = toSignal(this.store.select(selectOpenHistoryAccountId), {
    initialValue: null,
  });

  protected readonly account = computed(() => {
    const id = this.openAccountId();
    return id === null ? undefined : this.accounts().find((item) => item.id === id);
  });

  protected readonly transactions = computed(() => this.account()?.transactions ?? []);

  @HostListener('document:keydown.escape')
  protected close(): void {
    if (this.openAccountId() !== null) {
      this.store.dispatch(accountHistoryClosed());
    }
  }
}
