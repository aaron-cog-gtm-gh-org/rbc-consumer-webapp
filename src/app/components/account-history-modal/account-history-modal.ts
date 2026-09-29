import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, afterNextRender, inject, input, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { selectAccountById } from '../../store/accounts/accounts.selectors';
import { accountHistoryClosed } from '../../store/ui/ui.actions';

@Component({
  selector: 'app-account-history-modal',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './account-history-modal.html',
  styleUrl: './account-history-modal.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class AccountHistoryModal {
  private readonly store = inject(Store);
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  readonly accountId = input.required<string>();

  protected readonly account = toSignal(
    toObservable(this.accountId).pipe(
      switchMap((accountId) => this.store.select(selectAccountById(accountId))),
    ),
    { initialValue: null },
  );

  constructor() {
    afterNextRender(() => this.closeButton().nativeElement.focus());
  }

  protected close(): void {
    this.store.dispatch(accountHistoryClosed());
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
