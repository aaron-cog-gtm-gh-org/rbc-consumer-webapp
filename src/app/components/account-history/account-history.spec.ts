import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { accountHistoryRequested } from '../../store/ui/ui.actions';
import { selectHistoryAccountId } from '../../store/ui/ui.selectors';
import { AccountHistory } from './account-history';

describe('AccountHistory', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHistory],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
    store = TestBed.inject(Store);
  });

  it('shows a placeholder when no account is selected', async () => {
    const fixture = TestBed.createComponent(AccountHistory);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Select an account to view its history.');
    expect(el.querySelector('table')).toBeNull();
  });

  it('lists the selected account transactions newest first with running balances', async () => {
    store.dispatch(accountHistoryRequested({ accountId: 'day-to-day' }));
    const fixture = TestBed.createComponent(AccountHistory);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('RBC Day to Day Banking');
    expect(el.textContent).toContain('05812-5008874');

    const rows = Array.from(el.querySelectorAll('tbody tr'));
    expect(rows.length).toBe(9);
    expect(rows[0].textContent).toContain('Aug 26, 2026');
    expect(rows[0].textContent).toContain('Loblaws #1042');
    expect(rows[0].textContent).toContain('$5,407.48');
    expect(rows.at(-1)?.textContent).toContain('Jul 31, 2026');
  });

  it('dispatches accountHistoryClosed from the back button', async () => {
    store.dispatch(accountHistoryRequested({ accountId: 'esavings' }));
    const fixture = TestBed.createComponent(AccountHistory);
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('.history__close')!
      .click();

    let selected: string | null = 'unset';
    store
      .select(selectHistoryAccountId)
      .subscribe((id) => (selected = id))
      .unsubscribe();
    expect(selected).toBeNull();
  });
});
