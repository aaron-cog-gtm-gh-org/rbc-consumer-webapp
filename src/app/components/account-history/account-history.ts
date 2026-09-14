import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Account, BalancePoint } from '../../store/accounts/accounts.models';
import { accountHistoryClosed } from '../../store/ui/ui.actions';

interface ChartPoint extends BalancePoint {
  x: number;
  y: number;
}

const chartWidth = 640;
const chartHeight = 150;
const padding = 10;

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
})
export class AccountHistory {
  readonly account = input.required<Account>();

  private readonly store = inject(Store);

  protected readonly points = computed<ChartPoint[]>(() => {
    const history = this.account().history;
    const balances = history.map((point) => point.balance);
    const low = Math.min(...balances);
    const high = Math.max(...balances);
    const span = high - low || 1;
    const usableWidth = chartWidth - padding * 2;
    const usableHeight = chartHeight - padding * 2;

    return history.map((point, index) => ({
      ...point,
      x: padding + (usableWidth * index) / Math.max(history.length - 1, 1),
      y: padding + usableHeight * (1 - (point.balance - low) / span),
    }));
  });

  protected readonly line = computed(() =>
    this.points()
      .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(' '),
  );

  protected readonly area = computed(() => {
    const points = this.points();
    const first = points[0];
    const last = points[points.length - 1];
    return `${first.x.toFixed(1)},${chartHeight} ${this.line()} ${last.x.toFixed(1)},${chartHeight}`;
  });

  protected readonly high = computed(() =>
    this.account().history.reduce((best, point) => (point.balance > best.balance ? point : best)),
  );

  protected readonly low = computed(() =>
    this.account().history.reduce((worst, point) =>
      point.balance < worst.balance ? point : worst,
    ),
  );

  protected readonly change = computed(() => {
    const history = this.account().history;
    return history[history.length - 1].balance - history[0].balance;
  });

  protected readonly changePercent = computed(() => {
    const first = this.account().history[0].balance;
    return first === 0 ? 0 : (this.change() / first) * 100;
  });

  protected readonly viewBox = `0 0 ${chartWidth} ${chartHeight}`;

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
