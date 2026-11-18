import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { AccountsState } from '../../store/accounts/accounts.models';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { initialUiState } from '../../store/ui/ui.reducer';
import { InvestmentsList } from './investments-list';

const accounts: AccountsState = {
  userName: 'TEST USER',
  userFirstName: 'Test',
  statementDate: 'Monday, January 5, 2026',
  accounts: [
    { id: 'chequing', name: 'Test Chequing', number: '00001-1', balance: 50, kind: 'bank' },
    { id: 'tfsa', name: 'Test TFSA', number: '00001-3', balance: 1000.25, kind: 'investment' },
    { id: 'rrsp', name: 'Test RRSP', number: '00001-4', balance: 2000, kind: 'investment' },
  ],
};

const initialState: AppState = { accounts, transfer: initialTransferState, ui: initialUiState };

describe('InvestmentsList', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentsList],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(InvestmentsList);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders each investment account with its number, balance, and the total', async () => {
    const { element } = await render();
    const rows = element.querySelectorAll('.row');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.row__name')?.textContent).toContain('Test TFSA');
    expect(rows[0].querySelector('.row__number')?.textContent).toContain('00001-3');
    expect(rows[0].querySelector('.row__balance')?.textContent).toContain('$1,000.25');
    expect(rows[1].querySelector('.row__name')?.textContent).toContain('Test RRSP');
    expect(element.querySelector('.total')?.textContent).toContain('$3,000.25');
    expect(element.textContent).not.toContain('Test Chequing');
  });

  it('renders the section heading and actions', async () => {
    const { element } = await render();
    expect(element.querySelector('h2')?.textContent).toContain('Investments');
    expect(element.querySelector('.add-button')?.textContent).toContain('Purchase an Investment');
  });

  it('re-renders when investment balances change', async () => {
    const { fixture, element } = await render();
    store.setState({
      ...initialState,
      accounts: {
        ...accounts,
        accounts: accounts.accounts.map((account) =>
          account.id === 'rrsp' ? { ...account, balance: 500 } : account,
        ),
      },
    });
    await fixture.whenStable();
    expect(element.querySelector('.total')?.textContent).toContain('$1,500.25');
  });
});
