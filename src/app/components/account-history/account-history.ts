import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Account } from '../../store/accounts/accounts.models';
import { selectActiveHistoryAccount } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';

interface HistoryRow {
  date: string;
  balance: number;
  change: number;
  barWidth: number;
}

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
})
export class AccountHistory {
  private readonly store = inject(Store);

  protected readonly account = toSignal<Account | null>(
    this.store.select(selectActiveHistoryAccount),
    { initialValue: null },
  );

  protected readonly rows = computed<HistoryRow[]>(() => {
    const history = this.account()?.balanceHistory ?? [];
    const max = Math.max(0, ...history.map((point) => point.balance));

    return history.map((point, index) => ({
      date: point.date,
      balance: point.balance,
      change: index === 0 ? 0 : point.balance - history[index - 1].balance,
      barWidth: max > 0 ? (point.balance / max) * 100 : 0,
    }));
  });

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
