import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { AccountsState } from '../../store/accounts/accounts.models';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { accountMenuToggled } from '../../store/ui/ui.actions';
import { initialUiState } from '../../store/ui/ui.reducer';
import { AccountList } from './account-list';

const accounts: AccountsState = {
  userName: 'TEST USER',
  userFirstName: 'Test',
  statementDate: 'Monday, January 5, 2026',
  accounts: [
    { id: 'chequing', name: 'Test Chequing', number: '00001-1', balance: 1234.5, kind: 'bank' },
    { id: 'savings', name: 'Test Savings', number: '00001-2', balance: 100, kind: 'bank' },
    { id: 'tfsa', name: 'Test TFSA', number: '00001-3', balance: 999, kind: 'investment' },
  ],
};

const initialState: AppState = { accounts, transfer: initialTransferState, ui: initialUiState };

describe('AccountList', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountList],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(AccountList);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders each bank account with its number, balance, and the total', async () => {
    const { element } = await render();
    const rows = element.querySelectorAll('.row');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.row__name')?.textContent).toContain('Test Chequing');
    expect(rows[0].querySelector('.row__number')?.textContent).toContain('00001-1');
    expect(rows[0].querySelector('.row__balance')?.textContent).toContain('$1,234.50');
    expect(element.querySelector('.total')?.textContent).toContain('$1,334.50');
    expect(element.textContent).not.toContain('Test TFSA');
  });

  it('keeps option menus closed by default', async () => {
    const { element } = await render();
    expect(element.querySelector('.options__list')).toBeNull();
    const triggers = element.querySelectorAll<HTMLButtonElement>('.options__trigger');
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('dispatches accountMenuToggled when Options is clicked', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { element } = await render();
    element.querySelectorAll<HTMLButtonElement>('.options__trigger')[1].click();
    expect(dispatch).toHaveBeenCalledWith(accountMenuToggled({ accountId: 'savings' }));
  });

  it('shows the options menu only for the open account', async () => {
    store.setState({ ...initialState, ui: { ...initialUiState, openAccountMenuId: 'savings' } });
    const { element } = await render();
    const rows = element.querySelectorAll('.row');
    expect(rows[0].querySelector('.options__list')).toBeNull();
    const items = rows[1].querySelectorAll('.options__list li');
    expect(Array.from(items, (item) => item.textContent?.trim())).toEqual([
      'View Details',
      'Pay Bills & Transfer Funds',
      'Set Up an Alert',
      'Void Cheque Information',
    ]);
    expect(rows[1].querySelector('.options__trigger')?.getAttribute('aria-expanded')).toBe('true');
  });
});
