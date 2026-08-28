import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectAllAccounts } from '../../store/accounts/accounts.selectors';
import {
  transferConfirmationDismissed,
  transferFormChanged,
  transferSubmitted,
} from '../../store/transfer/transfer.actions';
import {
  selectTransferConfirmation,
  selectTransferError,
  selectTransferForm,
  selectTransferSubmitting,
} from '../../store/transfer/transfer.selectors';

@Component({
  selector: 'app-quick-transfer',
  templateUrl: './quick-transfer.html',
  styleUrl: './quick-transfer.scss',
})
export class QuickTransfer {
  private readonly store = inject(Store);

  protected readonly currencies = ['CAD', 'USD'];

  protected readonly quickLinks = [
    'Pay Bills & Transfer Funds',
    'Send an Interac e-Transfer',
    'International Money Transfer',
  ];

  protected readonly accounts = toSignal(this.store.select(selectAllAccounts), {
    initialValue: [],
  });
  protected readonly form = toSignal(this.store.select(selectTransferForm), {
    initialValue: { fromAccountId: '', toAccountId: '', amount: null, currency: 'CAD' },
  });
  protected readonly submitting = toSignal(this.store.select(selectTransferSubmitting), {
    initialValue: false,
  });
  protected readonly confirmation = toSignal(this.store.select(selectTransferConfirmation), {
    initialValue: null,
  });
  protected readonly error = toSignal(this.store.select(selectTransferError), {
    initialValue: null,
  });

  protected onFromChange(event: Event): void {
    this.store.dispatch(
      transferFormChanged({ fromAccountId: (event.target as HTMLSelectElement).value }),
    );
  }

  protected onToChange(event: Event): void {
    this.store.dispatch(
      transferFormChanged({ toAccountId: (event.target as HTMLSelectElement).value }),
    );
  }

  protected onCurrencyChange(event: Event): void {
    this.store.dispatch(
      transferFormChanged({ currency: (event.target as HTMLSelectElement).value }),
    );
  }

  protected onAmountChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const amount = raw === '' ? null : Number(raw);
    this.store.dispatch(transferFormChanged({ amount }));
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.store.dispatch(transferSubmitted());
  }

  protected dismissConfirmation(): void {
    this.store.dispatch(transferConfirmationDismissed());
  }
}
