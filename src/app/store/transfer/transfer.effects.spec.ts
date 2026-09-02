import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, lastValueFrom, toArray } from 'rxjs';
import { accountsTransferApplied } from '../accounts/accounts.actions';
import { initialAccountsState } from '../accounts/accounts.reducer';
import { selectAllAccounts } from '../accounts/accounts.selectors';
import { transferCompleted, transferRejected, transferSubmitted } from './transfer.actions';
import { submitTransfer$ } from './transfer.effects';
import { selectTransferForm } from './transfer.selectors';

const form = (overrides: Partial<Record<string, string>> = {}) => ({
  fromAccountId: 'day-to-day',
  toAccountId: 'esavings',
  amount: '100.55',
  currency: 'CAD',
  ...overrides,
});

const runEffect = async (formValue: ReturnType<typeof form>): Promise<Action[]> => {
  const actions$ = new ReplaySubject<Action>(1);

  TestBed.configureTestingModule({
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        selectors: [
          { selector: selectTransferForm, value: formValue },
          { selector: selectAllAccounts, value: initialAccountsState.accounts },
        ],
      }),
    ],
  });

  const effect$ = TestBed.runInInjectionContext(() => submitTransfer$());
  const emitted = lastValueFrom(effect$.pipe(toArray()));

  actions$.next(transferSubmitted());
  actions$.complete();

  return emitted;
};

describe('submitTransfer$', () => {
  it('applies the transfer and confirms it for a valid form', async () => {
    const actions = await runEffect(form());

    expect(actions).toEqual([
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

  it('rejects a zero amount without touching balances', async () => {
    const actions = await runEffect(form({ amount: '0' }));

    expect(actions).toEqual([transferRejected({ error: 'Enter an amount greater than $0.00.' })]);
  });

  it('rejects a transfer between the same account', async () => {
    const actions = await runEffect(form({ toAccountId: 'day-to-day' }));

    expect(actions).toEqual([transferRejected({ error: 'Choose two different accounts.' })]);
  });

  it('rejects a transfer larger than the source balance', async () => {
    const actions = await runEffect(form({ amount: '999999' }));

    expect(actions).toEqual([
      transferRejected({ error: 'Insufficient funds in the selected account.' }),
    ]);
  });
});
