import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { initialAccountsState } from '../../store/accounts/accounts.reducer';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { userMenuToggled } from '../../store/ui/ui.actions';
import { initialUiState } from '../../store/ui/ui.reducer';
import { Header } from './header';

const initialState: AppState = {
  accounts: { ...initialAccountsState, userName: 'TEST USER' },
  transfer: initialTransferState,
  ui: initialUiState,
};

describe('Header', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the logo, user name, and sign out button', async () => {
    const { element } = await render();
    expect(element.querySelector('.logo')?.getAttribute('aria-label')).toBe('RBC Royal Bank home');
    expect(element.querySelector('.user-menu__trigger')?.textContent).toContain('TEST USER');
    expect(element.querySelector('.sign-out')?.textContent).toContain('Sign Out');
  });

  it('hides the user menu when closed', async () => {
    const { element } = await render();
    expect(element.querySelector('.user-menu__list')).toBeNull();
    expect(element.querySelector('.user-menu__trigger')?.getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('dispatches userMenuToggled when the user name is clicked', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { element } = await render();
    element.querySelector<HTMLButtonElement>('.user-menu__trigger')?.click();
    expect(dispatch).toHaveBeenCalledWith(userMenuToggled());
  });

  it('renders the user menu items when open', async () => {
    const { fixture, element } = await render();
    store.setState({ ...initialState, ui: { ...initialUiState, userMenuOpen: true } });
    await fixture.whenStable();
    const items = element.querySelectorAll('.user-menu__list li');
    expect(Array.from(items, (item) => item.textContent?.trim())).toEqual([
      'Profile & Account Settings',
      'My Alerts',
      'Change My Password',
      'Manage Linked Accounts',
    ]);
    expect(element.querySelector('.user-menu__trigger')?.getAttribute('aria-expanded')).toBe(
      'true',
    );
  });
});
