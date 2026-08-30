import { CurrencyPipe } from '@angular/common';
import { Component, HostListener, computed, inject } from '@angular/core';
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
  label: string;
  point: BalanceHistoryPoint;
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const CHART_PADDING = 24;

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
})
export class AccountHistory {
  private readonly store = inject(Store);

  protected readonly chartWidth = CHART_WIDTH;
  protected readonly chartHeight = CHART_HEIGHT;

  protected readonly openAccountId = toSignal(this.store.select(selectOpenHistoryAccountId), {
    initialValue: null,
  });

  protected readonly account = toSignal(
    this.store
      .select(selectOpenHistoryAccountId)
      .pipe(switchMap((accountId) => this.store.select(selectAccountById(accountId)))),
    { initialValue: null },
  );

  protected readonly history = computed<BalanceHistoryPoint[]>(() => this.account()?.history ?? []);

  protected readonly chartPoints = computed<ChartPoint[]>(() => {
    const history = this.history();
    if (history.length === 0) {
      return [];
    }

    const balances = history.map((point) => point.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const span = max - min || 1;
    const usableWidth = CHART_WIDTH - CHART_PADDING * 2;
    const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
    const step = history.length > 1 ? usableWidth / (history.length - 1) : 0;

    return history.map((point, index) => ({
      x: CHART_PADDING + step * index,
      y: CHART_PADDING + usableHeight * (1 - (point.balance - min) / span),
      label: this.shortLabel(point.date),
      point,
    }));
  });

  protected readonly linePath = computed(() =>
    this.chartPoints()
      .map((chartPoint) => `${chartPoint.x.toFixed(1)},${chartPoint.y.toFixed(1)}`)
      .join(' '),
  );

  protected readonly areaPath = computed(() => {
    const points = this.chartPoints();
    if (points.length === 0) {
      return '';
    }
    const baseline = CHART_HEIGHT - CHART_PADDING;
    const first = points[0];
    const last = points[points.length - 1];
    return `${first.x.toFixed(1)},${baseline} ${this.linePath()} ${last.x.toFixed(1)},${baseline}`;
  });

  protected readonly changeAmount = computed(() => {
    const history = this.history();
    if (history.length < 2) {
      return 0;
    }
    return history[history.length - 1].balance - history[0].balance;
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.openAccountId() !== null) {
      this.close();
    }
  }

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }

  private shortLabel(date: string): string {
    const [, month] = date.split('-');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[Number(month) - 1] ?? date;
  }
}
