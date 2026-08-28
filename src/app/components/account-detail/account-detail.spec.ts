import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { accountDetailsClosed, accountDetailsOpened } from '../../store/ui/ui.actions';
import { selectSelectedAccountId } from '../../store/ui/ui.selectors';
import { AccountDetail } from './account-detail';

describe('AccountDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetail],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
  });

  it('should render nothing when no account is selected', async () => {
    const fixture = TestBed.createComponent(AccountDetail);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent?.trim()).toBe('');
  });

  it('should render the selected account name, number and balance', async () => {
    const store = TestBed.inject(Store);
    store.dispatch(accountDetailsOpened({ accountId: 'day-to-day' }));
    const fixture = TestBed.createComponent(AccountDetail);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RBC Day to Day Banking');
    expect(compiled.textContent).toContain('05812-5008874');
    expect(compiled.textContent).toContain('$5,407.48');
  });

  it('should dispatch accountDetailsClosed from the back control', async () => {
    const store = TestBed.inject(Store);
    store.dispatch(accountDetailsOpened({ accountId: 'day-to-day' }));
    const dispatch = vi.spyOn(store, 'dispatch');
    const fixture = TestBed.createComponent(AccountDetail);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.back-button').click();
    expect(dispatch).toHaveBeenCalledWith(accountDetailsClosed());
    await fixture.whenStable();
    let selectedAccountId: string | null = 'unset';
    store.select(selectSelectedAccountId).subscribe((id) => (selectedAccountId = id));
    expect(selectedAccountId).toBeNull();
  });
});
