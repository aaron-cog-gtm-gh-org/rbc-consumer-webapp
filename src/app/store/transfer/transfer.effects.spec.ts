import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, firstValueFrom, toArray } from 'rxjs';
import { accountsTransferApplied } from '../accounts/accounts.actions';
import { Account } from '../accounts/accounts.models';
import { initialAccountsState } from '../accounts/accounts.reducer';
import { selectAllAccounts } from '../accounts/accounts.selectors';
import { transferCompleted, transferRejected, transferSubmitted } from './transfer.actions';
import { submitTransfer$ } from './transfer.effects';
import { selectTransferForm } from './transfer.selectors';
import { validateTransfer } from './transfer.validation';

interface Form {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  currency: string;
}

const accounts: Account[] = initialAccountsState.accounts;

const setUp = (form: Partial<Form> = {}) => {
  const actions$ = new ReplaySubject<Action>(1);
  TestBed.configureTestingModule({
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        selectors: [
          {
            selector: selectTransferForm as MemoizedSelector<object, Form>,
            value: {
              fromAccountId: 'day-to-day',
              toAccountId: 'esavings',
              amount: '100.55',
              currency: 'CAD',
              ...form,
            },
          },
          { selector: selectAllAccounts as MemoizedSelector<object, Account[]>, value: accounts },
        ],
      }),
    ],
  });
  TestBed.inject(MockStore);
  const effect$ = TestBed.runInInjectionContext(() => submitTransfer$());
  const emissions = firstValueFrom(effect$.pipe(toArray()));
  actions$.next(transferSubmitted());
  actions$.complete();
  return emissions;
};

describe('submitTransfer$', () => {
  it('applies the transfer and emits a formatted confirmation', async () => {
    const emitted = await setUp();

    expect(emitted).toEqual([
      accountsTransferApplied({
        fromAccountId: 'day-to-day',
        toAccountId: 'esavings',
        amount: 100.55,
      }),
      transferCompleted({
        confirmation:
          'Transfer complete. $100.55 moved from RBC Day to Day Banking to ' +
          'RBC High Interest eSavings.',
      }),
    ]);
  });

  it('formats the confirmation with the selected currency', async () => {
    const emitted = await setUp({ amount: '1500', currency: 'USD' });

    expect(emitted[1]).toEqual(
      transferCompleted({
        confirmation:
          'Transfer complete. US$1,500.00 moved from RBC Day to Day Banking to ' +
          'RBC High Interest eSavings.',
      }),
    );
  });

  it('rejects an empty amount', async () => {
    expect(await setUp({ amount: '' })).toEqual([
      transferRejected({ error: 'Enter an amount greater than $0.00.' }),
    ]);
  });

  it('rejects a zero amount', async () => {
    expect(await setUp({ amount: '0' })).toEqual([
      transferRejected({ error: 'Enter an amount greater than $0.00.' }),
    ]);
  });

  it('rejects a negative amount', async () => {
    expect(await setUp({ amount: '-50' })).toEqual([
      transferRejected({ error: 'Enter an amount greater than $0.00.' }),
    ]);
  });

  it('rejects a transfer between the same account', async () => {
    expect(await setUp({ toAccountId: 'day-to-day' })).toEqual([
      transferRejected({ error: 'Choose two different accounts.' }),
    ]);
  });

  it('rejects an unknown source account', async () => {
    expect(await setUp({ fromAccountId: 'unknown' })).toEqual([
      transferRejected({ error: 'Choose an account to transfer from.' }),
    ]);
  });

  it('rejects an amount above the source balance', async () => {
    expect(await setUp({ amount: '999999' })).toEqual([
      transferRejected({ error: 'Insufficient funds in the selected account.' }),
    ]);
  });

  it('validates the amount before the same-account check', async () => {
    const form = { fromAccountId: 'esavings', toAccountId: 'esavings', amount: '0' };

    expect(validateTransfer(form, accounts)).toBe('Enter an amount greater than $0.00.');
    expect(await setUp(form)).toEqual([
      transferRejected({ error: 'Enter an amount greater than $0.00.' }),
    ]);
  });

  it('emits the error returned by validateTransfer', async () => {
    const form = { fromAccountId: 'day-to-day', toAccountId: 'esavings', amount: '10.123' };
    const error = validateTransfer(form, accounts) as string;

    expect(await setUp(form)).toEqual([transferRejected({ error })]);
  });
});
