import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { accountHistoryOpened } from '../../store/ui/ui.actions';
import { AccountHistory } from './account-history';

describe('AccountHistory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHistory],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
  });

  it('renders nothing when no account is selected', async () => {
    const fixture = TestBed.createComponent(AccountHistory);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('');
  });

  it('renders the selected account history', async () => {
    const fixture = TestBed.createComponent(AccountHistory);
    TestBed.inject(Store).dispatch(accountHistoryOpened({ accountId: 'rrsp' }));
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RRSP');
    expect(compiled.textContent).toContain('$8,550.00');
    expect(compiled.querySelectorAll('.history__table tbody tr').length).toBe(7);
    expect(compiled.querySelector('polyline')).toBeTruthy();
  });
});
