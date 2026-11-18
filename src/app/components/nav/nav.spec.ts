import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { initialAccountsState } from '../../store/accounts/accounts.reducer';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { navTabSelected } from '../../store/ui/ui.actions';
import { initialUiState } from '../../store/ui/ui.reducer';
import { Nav } from './nav';

const initialState: AppState = {
  accounts: { ...initialAccountsState, statementDate: 'Monday, January 5, 2026' },
  transfer: initialTransferState,
  ui: { ...initialUiState, activeNavTab: 'My Accounts' },
};

describe('Nav', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(Nav);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(element.querySelectorAll<HTMLButtonElement>('.nav__tab'));
    return { fixture, element, tabs };
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the primary tabs and statement date', async () => {
    const { element, tabs } = await render();
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual([
      'Products & Services',
      'My Accounts',
      'Customer Service',
    ]);
    expect(element.querySelector('.nav__date')?.textContent).toContain('Monday, January 5, 2026');
  });

  it('marks only the active tab', async () => {
    const { tabs } = await render();
    expect(tabs.map((tab) => tab.classList.contains('nav__tab--active'))).toEqual([
      false,
      true,
      false,
    ]);
    expect(tabs[1].getAttribute('aria-current')).toBe('page');
    expect(tabs[0].hasAttribute('aria-current')).toBe(false);
  });

  it('dispatches navTabSelected when a tab is clicked', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { tabs } = await render();
    tabs[2].click();
    expect(dispatch).toHaveBeenCalledWith(navTabSelected({ tab: 'Customer Service' }));
  });

  it('moves the active marker when the store changes', async () => {
    const { fixture, tabs } = await render();
    store.setState({
      ...initialState,
      ui: { ...initialUiState, activeNavTab: 'Customer Service' },
    });
    await fixture.whenStable();
    expect(tabs[2].classList.contains('nav__tab--active')).toBe(true);
    expect(tabs[1].classList.contains('nav__tab--active')).toBe(false);
  });
});
