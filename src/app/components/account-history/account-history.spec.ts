import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { AccountHistory } from './account-history';
import { rootReducers } from '../../store';
import { accountHistoryClosed, accountHistoryOpened } from '../../store/ui/ui.actions';

describe('AccountHistory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHistory],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
  });

  it('should render nothing until an account history is opened', async () => {
    const fixture = TestBed.createComponent(AccountHistory);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.history')).toBeNull();
  });

  it('should render the opened account balance history and close again', async () => {
    const fixture = TestBed.createComponent(AccountHistory);
    const store = TestBed.inject(Store);

    store.dispatch(accountHistoryOpened({ accountId: 'day-to-day' }));
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('RBC Day to Day Banking');
    expect(element.textContent).toContain('$5,407.48');
    expect(element.querySelectorAll('.history__table tbody tr').length).toBe(12);
    expect(element.querySelector('.history__line')?.getAttribute('points')).toBeTruthy();

    store.dispatch(accountHistoryClosed());
    await fixture.whenStable();
    expect(element.querySelector('.history')).toBeNull();
  });
});
