import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, delay, from, of, withLatestFrom } from 'rxjs';
import { accountsTransferApplied } from '../accounts/accounts.actions';
import { selectAllAccounts } from '../accounts/accounts.selectors';
import { transferCompleted, transferRejected, transferSubmitted } from './transfer.actions';
import { selectTransferForm } from './transfer.selectors';
import { parseAmount, validateTransfer } from './transfer.validation';

const formatCurrency = (amount: number, currency: string): string =>
  `${amount.toLocaleString('en-CA', { style: 'currency', currency })}`;

export const submitTransfer$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(transferSubmitted),
      withLatestFrom(store.select(selectTransferForm), store.select(selectAllAccounts)),
      concatMap(([, form, accounts]) => {
        const error = validateTransfer(form, accounts);
        if (error) {
          return of(transferRejected({ error }));
        }
        const amount = parseAmount(form.amount) as number;
        const fromAccount = accounts.find((account) => account.id === form.fromAccountId);
        const toAccount = accounts.find((account) => account.id === form.toAccountId);
        const confirmation =
          `Transfer complete. ${formatCurrency(amount, form.currency)} moved from ` +
          `${fromAccount?.name} to ${toAccount?.name}.`;
        return from([
          accountsTransferApplied({
            fromAccountId: form.fromAccountId,
            toAccountId: form.toAccountId,
            amount,
          }),
          transferCompleted({ confirmation }),
        ]).pipe(delay(250));
      }),
    ),
  { functional: true },
);
