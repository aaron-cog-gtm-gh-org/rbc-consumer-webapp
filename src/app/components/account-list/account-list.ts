import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import {
  selectBankAccounts,
  selectBankAccountsTotal,
} from '../../store/accounts/accounts.selectors';
import { accountMenuToggled, balanceHistoryOpened } from '../../store/ui/ui.actions';
import { selectOpenAccountMenuId } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-account-list',
  imports: [CurrencyPipe],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss',
})
export class AccountList {
  private readonly store = inject(Store);

  protected readonly optionsMenuItems = [
    'View Details',
    'View Balance History',
    'Pay Bills & Transfer Funds',
    'Set Up an Alert',
    'Void Cheque Information',
  ];

  protected readonly accounts = toSignal(this.store.select(selectBankAccounts), {
    initialValue: [],
  });
  protected readonly total = toSignal(this.store.select(selectBankAccountsTotal), {
    initialValue: 0,
  });
  protected readonly openMenuId = toSignal(this.store.select(selectOpenAccountMenuId), {
    initialValue: null,
  });

  protected toggleMenu(accountId: string): void {
    this.store.dispatch(accountMenuToggled({ accountId }));
  }

  protected openBalanceHistory(accountId: string): void {
    this.store.dispatch(balanceHistoryOpened({ accountId }));
  }
}
