import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { initialAccountsState } from '../../store/accounts/accounts.reducer';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { subNavTabSelected } from '../../store/ui/ui.actions';
import { initialUiState } from '../../store/ui/ui.reducer';
import { Subnav } from './subnav';

const initialState: AppState = {
  accounts: initialAccountsState,
  transfer: initialTransferState,
  ui: { ...initialUiState, activeSubNavTab: 'Accounts Summary' },
};

describe('Subnav', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subnav],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(Subnav);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('.subnav__tab'));
    return { fixture, tabs };
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the secondary tabs with the active one highlighted', async () => {
    const { tabs } = await render();
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual([
      'Accounts Summary',
      'Profile & Account Settings',
    ]);
    expect(tabs[0].classList.contains('subnav__tab--active')).toBe(true);
    expect(tabs[1].classList.contains('subnav__tab--active')).toBe(false);
  });

  it('dispatches subNavTabSelected when a tab is clicked', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { tabs } = await render();
    tabs[1].click();
    expect(dispatch).toHaveBeenCalledWith(subNavTabSelected({ tab: 'Profile & Account Settings' }));
  });

  it('moves the active marker when the store changes', async () => {
    const { fixture, tabs } = await render();
    store.setState({
      ...initialState,
      ui: { ...initialUiState, activeSubNavTab: 'Profile & Account Settings' },
    });
    await fixture.whenStable();
    expect(tabs[0].classList.contains('subnav__tab--active')).toBe(false);
    expect(tabs[1].classList.contains('subnav__tab--active')).toBe(true);
  });
});
