import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  selectInvestmentAccounts,
  selectInvestmentsTotal,
} from '../../store/accounts/accounts.selectors';

@Component({
  selector: 'app-investments-list',
  imports: [CurrencyPipe],
  templateUrl: './investments-list.html',
  styleUrl: './investments-list.scss',
})
export class InvestmentsList {
  private readonly store = inject(Store);

  protected readonly investments = toSignal(this.store.select(selectInvestmentAccounts), {
    initialValue: [],
  });
  protected readonly total = toSignal(this.store.select(selectInvestmentsTotal), {
    initialValue: 0,
  });
}
