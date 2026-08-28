import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store, createSelector } from '@ngrx/store';
import { selectAllAccounts } from '../../store/accounts/accounts.selectors';
import { accountDetailsClosed } from '../../store/ui/ui.actions';
import { selectSelectedAccountId } from '../../store/ui/ui.selectors';

const selectSelectedAccount = createSelector(
  selectAllAccounts,
  selectSelectedAccountId,
  (accounts, selectedAccountId) =>
    accounts.find((account) => account.id === selectedAccountId) ?? null,
);

@Component({
  selector: 'app-account-detail',
  imports: [CurrencyPipe],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.scss',
})
export class AccountDetail {
  private readonly store = inject(Store);

  protected readonly account = toSignal(this.store.select(selectSelectedAccount), {
    initialValue: null,
  });

  protected closeDetails(): void {
    this.store.dispatch(accountDetailsClosed());
  }
}
