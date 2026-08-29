import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, HostListener, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AccountHistoryPoint } from '../../store/accounts/accounts.models';
import { selectHistoryAccount } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';

interface ChartPoint {
  date: string;
  balance: number;
  x: number;
  y: number;
}

interface Chart {
  width: number;
  height: number;
  points: ChartPoint[];
  line: string;
  area: string;
  min: number;
  max: number;
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = 12;

const buildChart = (history: AccountHistoryPoint[]): Chart | null => {
  if (history.length < 2) {
    return null;
  }

  const balances = history.map((point) => point.balance);
  const min = Math.min(...balances);
  const max = Math.max(...balances);
  const span = max - min || 1;
  const innerWidth = CHART_WIDTH - PADDING * 2;
  const innerHeight = CHART_HEIGHT - PADDING * 2;

  const points = history.map((point, index) => ({
    ...point,
    x: PADDING + (innerWidth * index) / (history.length - 1),
    y: PADDING + innerHeight * (1 - (point.balance - min) / span),
  }));

  const line = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');

  return {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    points,
    line,
    area: `${PADDING},${CHART_HEIGHT - PADDING} ${line} ${CHART_WIDTH - PADDING},${CHART_HEIGHT - PADDING}`,
    min,
    max,
  };
};

@Component({
  selector: 'app-account-history',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './account-history.html',
  styleUrl: './account-history.scss',
})
export class AccountHistory {
  private readonly store = inject(Store);

  protected readonly account = toSignal(this.store.select(selectHistoryAccount), {
    initialValue: null,
  });

  protected readonly history = computed<AccountHistoryPoint[]>(() => this.account()?.history ?? []);

  protected readonly chart = computed(() => buildChart(this.history()));

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.account()) {
      this.close();
    }
  }

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
