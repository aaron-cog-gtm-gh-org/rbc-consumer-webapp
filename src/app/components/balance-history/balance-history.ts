import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { Account, BalanceHistoryPoint } from '../../store/accounts/accounts.models';
import { selectAccountById, selectAccountHistory } from '../../store/accounts/accounts.selectors';
import { balanceHistoryClosed } from '../../store/ui/ui.actions';
import { selectBalanceHistoryAccountId } from '../../store/ui/ui.selectors';

const CHART_WIDTH = 560;
const CHART_HEIGHT = 180;
const CHART_PADDING = 12;

interface ChartPoint {
  x: number;
  y: number;
  point: BalanceHistoryPoint;
}

@Component({
  selector: 'app-balance-history',
  imports: [CurrencyPipe],
  templateUrl: './balance-history.html',
  styleUrl: './balance-history.scss',
})
export class BalanceHistory {
  private readonly store = inject(Store);
  private readonly accountId$ = this.store.select(selectBalanceHistoryAccountId);

  protected readonly chartWidth = CHART_WIDTH;
  protected readonly chartHeight = CHART_HEIGHT;

  protected readonly accountId = toSignal(this.accountId$, { initialValue: null });

  protected readonly account = toSignal(
    this.accountId$.pipe(
      switchMap((accountId) =>
        accountId ? this.store.select(selectAccountById(accountId)) : of<Account | null>(null),
      ),
    ),
    { initialValue: null },
  );

  protected readonly history = toSignal(
    this.accountId$.pipe(
      switchMap((accountId) =>
        accountId
          ? this.store.select(selectAccountHistory(accountId))
          : of<BalanceHistoryPoint[]>([]),
      ),
    ),
    { initialValue: [] as BalanceHistoryPoint[] },
  );

  protected readonly chartPoints = computed<ChartPoint[]>(() => {
    const history = this.history();
    if (history.length === 0) {
      return [];
    }

    const balances = history.map((point) => point.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const range = max - min || 1;
    const innerWidth = CHART_WIDTH - CHART_PADDING * 2;
    const innerHeight = CHART_HEIGHT - CHART_PADDING * 2;
    const step = history.length > 1 ? innerWidth / (history.length - 1) : 0;

    return history.map((point, index) => ({
      x: CHART_PADDING + step * index,
      y: CHART_PADDING + innerHeight - ((point.balance - min) / range) * innerHeight,
      point,
    }));
  });

  protected readonly linePoints = computed(() =>
    this.chartPoints()
      .map(({ x, y }) => `${x},${y}`)
      .join(' '),
  );

  protected close(): void {
    this.store.dispatch(balanceHistoryClosed());
  }
}
