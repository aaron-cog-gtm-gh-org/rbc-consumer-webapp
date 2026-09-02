import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { BalanceHistoryPoint } from '../../store/accounts/accounts.models';
import { selectAccountById } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';
import { selectOpenHistoryAccountId } from '../../store/ui/ui.selectors';

interface ChartPoint {
  x: number;
  y: number;
  point: BalanceHistoryPoint;
}

const CHART_WIDTH = 560;
const CHART_HEIGHT = 180;
const CHART_PADDING = 12;

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class AccountHistory {
  private readonly store = inject(Store);

  protected readonly account = toSignal(
    this.store
      .select(selectOpenHistoryAccountId)
      .pipe(switchMap((accountId) => this.store.select(selectAccountById(accountId)))),
    { initialValue: null },
  );

  protected readonly history = computed<BalanceHistoryPoint[]>(() => this.account()?.history ?? []);

  protected readonly chartWidth = CHART_WIDTH;
  protected readonly chartHeight = CHART_HEIGHT;

  protected readonly chartPoints = computed<ChartPoint[]>(() => {
    const history = this.history();
    if (history.length < 2) {
      return [];
    }

    const balances = history.map((point) => point.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const span = max - min || 1;
    const innerWidth = CHART_WIDTH - CHART_PADDING * 2;
    const innerHeight = CHART_HEIGHT - CHART_PADDING * 2;

    return history.map((point, index) => ({
      point,
      x: CHART_PADDING + (innerWidth * index) / (history.length - 1),
      y: CHART_PADDING + innerHeight * (1 - (point.balance - min) / span),
    }));
  });

  protected readonly chartLine = computed(() =>
    this.chartPoints()
      .map((chartPoint) => `${chartPoint.x},${chartPoint.y}`)
      .join(' '),
  );

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
