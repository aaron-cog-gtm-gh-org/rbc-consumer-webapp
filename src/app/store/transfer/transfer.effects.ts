import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMap, delay, from, of, withLatestFrom } from 'rxjs';
import { accountsTransferApplied } from '../accounts/accounts.actions';
import { Account } from '../accounts/accounts.models';
import { selectAllAccounts } from '../accounts/accounts.selectors';
import { transferCompleted, transferRejected, transferSubmitted } from './transfer.actions';
import { selectTransferForm } from './transfer.selectors';

const formatCurrency = (amount: number, currency: string): string =>
  `${amount.toLocaleString('en-CA', { style: 'currency', currency })}`;

export const parseAmount = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (trimmed === '' || !/^-?\d*\.?\d*$/.test(trimmed)) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateTransfer = (
  form: { fromAccountId: string; toAccountId: string; amount: string },
  accounts: Account[],
): string | null => {
  const amount = parseAmount(form.amount);
  if (amount === null || amount <= 0) {
    return 'Enter an amount greater than $0.00.';
  }
  if ((form.amount.trim().split('.')[1]?.length ?? 0) > 2) {
    return 'Enter an amount with at most two decimal places.';
  }
  if (form.fromAccountId === form.toAccountId) {
    return 'Choose two different accounts.';
  }
  const from = accounts.find((account) => account.id === form.fromAccountId);
  if (!from) {
    return 'Choose an account to transfer from.';
  }
  if (from.balance < amount) {
    return 'Insufficient funds in the selected account.';
  }
  return null;
};

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
