import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { initialAccountsState } from '../../store/accounts/accounts.reducer';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { searchQueryChanged } from '../../store/ui/ui.actions';
import { initialUiState } from '../../store/ui/ui.reducer';
import { WelcomeBar } from './welcome-bar';

const initialState: AppState = {
  accounts: { ...initialAccountsState, userFirstName: 'Test' },
  transfer: initialTransferState,
  ui: { ...initialUiState, unreadMessages: 5, searchQuery: 'rrsp' },
};

describe('WelcomeBar', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeBar],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(WelcomeBar);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('greets the user by first name', async () => {
    const { element } = await render();
    expect(element.querySelector('h1')?.textContent).toContain('Welcome, Test');
  });

  it('renders every shortcut with an icon', async () => {
    const { element } = await render();
    const labels = element.querySelectorAll('.shortcut__label');
    expect(Array.from(labels, (label) => label.textContent?.trim())).toEqual([
      'Statements & Documents',
      'Messages & Alerts',
      'eBills',
      'Offers For You',
      'Beyond Banking',
      'Print',
    ]);
    expect(element.querySelectorAll('.shortcut app-icon').length).toBe(6);
    expect(element.querySelector('.search app-icon svg')).not.toBeNull();
  });

  it('shows the unread badge on Messages & Alerts only', async () => {
    const { element } = await render();
    const badges = element.querySelectorAll('.shortcut__badge');
    expect(badges.length).toBe(1);
    expect(badges[0].textContent?.trim()).toBe('5');
    expect(badges[0].closest('.shortcut')?.textContent).toContain('Messages & Alerts');
  });

  it('hides the badge when there are no unread messages', async () => {
    const { fixture, element } = await render();
    store.setState({ ...initialState, ui: { ...initialState.ui, unreadMessages: 0 } });
    await fixture.whenStable();
    expect(element.querySelector('.shortcut__badge')).toBeNull();
  });

  it('binds the search input to the stored query', async () => {
    const { element } = await render();
    expect(element.querySelector<HTMLInputElement>('#site-search')?.value).toBe('rrsp');
  });

  it('dispatches searchQueryChanged as the user types', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { element } = await render();
    const input = element.querySelector<HTMLInputElement>('#site-search')!;
    input.value = 'mortgage';
    input.dispatchEvent(new Event('input'));
    expect(dispatch).toHaveBeenCalledWith(searchQueryChanged({ query: 'mortgage' }));
  });

  it('prevents the search form from submitting', async () => {
    const { element } = await render();
    const event = new Event('submit', { cancelable: true });
    element.querySelector('form')?.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
