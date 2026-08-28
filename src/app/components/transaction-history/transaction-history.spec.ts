import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { accountDetailsOpened } from '../../store/ui/ui.actions';
import { TransactionHistory } from './transaction-history';

describe('TransactionHistory', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionHistory],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
  });

  it('should show an empty message when no account is selected', async () => {
    const fixture = TestBed.createComponent(TransactionHistory);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table')).toBeNull();
    expect(compiled.textContent).toContain('No transactions to display');
  });

  it('should render the transactions of the selected account only', async () => {
    TestBed.inject(Store).dispatch(accountDetailsOpened({ accountId: 'esavings' }));
    const fixture = TestBed.createComponent(TransactionHistory);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
    expect(compiled.textContent).toContain('Interest Payment');
    expect(compiled.textContent).toContain('$12,452.00');
    expect(compiled.textContent).not.toContain('LOBLAWS');
  });
});
