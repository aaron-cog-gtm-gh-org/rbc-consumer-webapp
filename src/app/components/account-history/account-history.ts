import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { selectAccountById } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';
import { selectHistoryAccountId } from '../../store/ui/ui.selectors';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 80;

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
})
export class AccountHistory {
  private readonly store = inject(Store);

  protected readonly chartWidth = CHART_WIDTH;
  protected readonly chartHeight = CHART_HEIGHT;

  protected readonly account = toSignal(
    this.store
      .select(selectHistoryAccountId)
      .pipe(switchMap((id) => this.store.select(selectAccountById(id)))),
    { initialValue: null },
  );

  protected readonly history = computed(() => this.account()?.history ?? []);

  protected readonly sparklinePoints = computed(() => {
    const points = this.history();
    if (points.length < 2) {
      return '';
    }

    const balances = points.map((point) => point.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const span = max - min || 1;

    return points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - ((point.balance - min) / span) * CHART_HEIGHT;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
