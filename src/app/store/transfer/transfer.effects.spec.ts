import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { AppState } from '..';
import { accountsTransferApplied } from '../accounts/accounts.actions';
import { initialAccountsState } from '../accounts/accounts.reducer';
import { initialUiState } from '../ui/ui.reducer';
import {
  transferCompleted,
  transferFormChanged,
  transferRejected,
  transferSubmitted,
} from './transfer.actions';
import { submitTransfer$ } from './transfer.effects';
import { TransferState } from './transfer.models';
import { initialTransferState } from './transfer.reducer';

describe('submitTransfer$', () => {
  let actions$: Observable<Action>;
  let scheduler: TestScheduler;

  const setup = (transfer: Partial<TransferState>) => {
    const initialState: AppState = {
      accounts: initialAccountsState,
      transfer: { ...initialTransferState, ...transfer },
      ui: initialUiState,
    };
    TestBed.configureTestingModule({
      providers: [provideMockActions(() => actions$), provideMockStore({ initialState })],
    });
    return TestBed.runInInjectionContext(() => submitTransfer$());
  };

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  it('dispatches transferRejected when validation fails', () => {
    scheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a', { a: transferSubmitted() });
      expectObservable(setup({ amount: '' })).toBe('-r', {
        r: transferRejected({ error: 'Enter an amount greater than $0.00.' }),
      });
    });
  });

  it('rejects transfers that exceed the source balance', () => {
    scheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a', { a: transferSubmitted() });
      expectObservable(setup({ amount: '999999' })).toBe('-r', {
        r: transferRejected({ error: 'Insufficient funds in the selected account.' }),
      });
    });
  });

  it('applies the transfer and confirms it after the simulated delay', () => {
    scheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a', { a: transferSubmitted() });
      expectObservable(setup({ amount: '100.5' })).toBe('- 250ms (tc)', {
        t: accountsTransferApplied({
          fromAccountId: 'day-to-day',
          toAccountId: 'esavings',
          amount: 100.5,
        }),
        c: transferCompleted({
          confirmation:
            'Transfer complete. $100.50 moved from RBC Day to Day Banking to RBC High Interest eSavings.',
        }),
      });
    });
  });

  it('formats the confirmation in the selected currency', () => {
    scheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a', { a: transferSubmitted() });
      expectObservable(
        setup({ amount: '20', currency: 'USD', fromAccountId: 'esavings', toAccountId: 'rrsp' }),
      ).toBe('- 250ms (tc)', {
        t: accountsTransferApplied({ fromAccountId: 'esavings', toAccountId: 'rrsp', amount: 20 }),
        c: transferCompleted({
          confirmation:
            'Transfer complete. US$20.00 moved from RBC High Interest eSavings to RRSP.',
        }),
      });
    });
  });

  it('processes consecutive submissions serially', () => {
    scheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-aa', { a: transferSubmitted() });
      const effect$ = setup({ amount: '1' });
      const t = accountsTransferApplied({
        fromAccountId: 'day-to-day',
        toAccountId: 'esavings',
        amount: 1,
      });
      const c = transferCompleted({
        confirmation:
          'Transfer complete. $1.00 moved from RBC Day to Day Banking to RBC High Interest eSavings.',
      });
      expectObservable(effect$).toBe('- 250ms (tc) 246ms (tc)', { t, c });
    });
  });

  it('ignores unrelated actions', () => {
    scheduler.run(({ hot, expectObservable }) => {
      actions$ = hot('-a', { a: transferFormChanged({ amount: '5' }) });
      expectObservable(setup({ amount: '5' })).toBe('--');
    });
  });
});
