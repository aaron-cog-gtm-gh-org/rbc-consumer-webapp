import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { Account } from '../../store/accounts/accounts.models';
import { selectAccountById } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';
import { selectHistoryAccountId } from '../../store/ui/ui.selectors';

interface ChartPoint {
  date: string;
  balance: number;
  x: number;
  y: number;
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const PADDING_X = 8;
const PADDING_Y = 16;

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

  protected readonly account = toSignal<Account | null>(
    this.store
      .select(selectHistoryAccountId)
      .pipe(switchMap((accountId) => this.store.select(selectAccountById(accountId)))),
    { initialValue: null },
  );

  protected readonly points = computed<ChartPoint[]>(() => {
    const history = this.account()?.history ?? [];
    if (history.length === 0) {
      return [];
    }

    const balances = history.map((point) => point.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const range = max - min || 1;
    const usableWidth = CHART_WIDTH - PADDING_X * 2;
    const usableHeight = CHART_HEIGHT - PADDING_Y * 2;
    const step = history.length > 1 ? usableWidth / (history.length - 1) : 0;

    return history.map((point, index) => ({
      ...point,
      x: PADDING_X + step * index,
      y: PADDING_Y + usableHeight - ((point.balance - min) / range) * usableHeight,
    }));
  });

  protected readonly linePath = computed(() =>
    this.points()
      .map(
        (point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`,
      )
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const points = this.points();
    if (points.length === 0) {
      return '';
    }
    const last = points[points.length - 1];
    return `${this.linePath()} L${last.x.toFixed(1)} ${CHART_HEIGHT} L${points[0].x.toFixed(1)} ${CHART_HEIGHT} Z`;
  });

  protected readonly highBalance = computed(() =>
    Math.max(...this.points().map((point) => point.balance)),
  );

  protected readonly lowBalance = computed(() =>
    Math.min(...this.points().map((point) => point.balance)),
  );

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
