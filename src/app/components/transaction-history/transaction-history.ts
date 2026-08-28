import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { selectTransactionsForAccount } from '../../store/transactions/transactions.selectors';
import { selectSelectedAccountId } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-transaction-history',
  imports: [CurrencyPipe],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss',
})
export class TransactionHistory {
  private readonly store = inject(Store);

  protected readonly transactions = toSignal(
    this.store
      .select(selectSelectedAccountId)
      .pipe(switchMap((accountId) => this.store.select(selectTransactionsForAccount(accountId)))),
    { initialValue: [] },
  );
}
