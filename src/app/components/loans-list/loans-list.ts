import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectLoanAccounts, selectLoansTotal } from '../../store/accounts/accounts.selectors';
import { accountMenuToggled } from '../../store/ui/ui.actions';
import { selectOpenAccountMenuId } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-loans-list',
  imports: [CurrencyPipe],
  templateUrl: './loans-list.html',
  styleUrl: './loans-list.scss',
})
export class LoansList {
  private readonly store = inject(Store);

  protected readonly optionsMenuItems = [
    'View Details',
    'Make a Payment',
    'Change Payment Schedule',
    'View Statements',
  ];

  protected readonly loans = toSignal(this.store.select(selectLoanAccounts), {
    initialValue: [],
  });
  protected readonly total = toSignal(this.store.select(selectLoansTotal), {
    initialValue: 0,
  });
  protected readonly openMenuId = toSignal(this.store.select(selectOpenAccountMenuId), {
    initialValue: null,
  });

  protected toggleMenu(accountId: string): void {
    this.store.dispatch(accountMenuToggled({ accountId }));
  }
}
