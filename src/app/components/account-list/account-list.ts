import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { Transaction } from '../../store/accounts/accounts.models';
import {
  selectAccountHistory,
  selectBankAccounts,
  selectBankAccountsTotal,
} from '../../store/accounts/accounts.selectors';
import {
  accountHistoryClosed,
  accountHistoryToggled,
  accountMenuToggled,
} from '../../store/ui/ui.actions';
import { selectOpenAccountHistoryId, selectOpenAccountMenuId } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-account-list',
  imports: [CurrencyPipe],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss',
})
export class AccountList {
  private readonly store = inject(Store);

  protected readonly viewHistoryItem = 'View Account History';

  protected readonly optionsMenuItems = [
    this.viewHistoryItem,
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
  protected readonly openHistoryId = toSignal(this.store.select(selectOpenAccountHistoryId), {
    initialValue: null,
  });
  protected readonly openHistory = toSignal(
    this.store
      .select(selectOpenAccountHistoryId)
      .pipe(
        switchMap((accountId) =>
          accountId ? this.store.select(selectAccountHistory(accountId)) : of<Transaction[]>([]),
        ),
      ),
    { initialValue: [] },
  );

  protected toggleMenu(accountId: string): void {
    this.store.dispatch(accountMenuToggled({ accountId }));
  }

  protected viewHistory(accountId: string): void {
    this.store.dispatch(accountHistoryToggled({ accountId }));
  }

  protected closeHistory(): void {
    this.store.dispatch(accountHistoryClosed());
  }
}
