import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { initialAccountsState } from '../../store/accounts/accounts.reducer';
import {
  transferConfirmationDismissed,
  transferFormChanged,
  transferSubmitted,
} from '../../store/transfer/transfer.actions';
import { TransferState } from '../../store/transfer/transfer.models';
import { initialTransferState } from '../../store/transfer/transfer.reducer';
import { initialUiState } from '../../store/ui/ui.reducer';
import { QuickTransfer } from './quick-transfer';

const initialState: AppState = {
  accounts: initialAccountsState,
  transfer: { ...initialTransferState, amount: '25.00' },
  ui: initialUiState,
};

describe('QuickTransfer', () => {
  let store: MockStore<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTransfer],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  const render = async () => {
    const fixture = TestBed.createComponent(QuickTransfer);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const [fromSelect, toSelect, currencySelect] = Array.from(
      element.querySelectorAll<HTMLSelectElement>('select'),
    );
    return {
      fixture,
      element,
      fromSelect,
      toSelect,
      currencySelect,
      amountInput: element.querySelector<HTMLInputElement>('input')!,
      submitButton: element.querySelector<HTMLButtonElement>('button[type="submit"]')!,
    };
  };

  const setTransfer = async (
    fixture: Awaited<ReturnType<typeof render>>['fixture'],
    transfer: Partial<TransferState>,
  ) => {
    store.setState({ ...initialState, transfer: { ...initialState.transfer, ...transfer } });
    await fixture.whenStable();
  };

  it('should create', async () => {
    const { fixture } = await render();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders every account in the from and to selects with the form selection', async () => {
    const { fromSelect, toSelect } = await render();
    const names = (select: HTMLSelectElement) =>
      Array.from(select.options, (option) => option.textContent?.trim());
    const expected = ['RBC Day to Day Banking', 'RBC High Interest eSavings', 'RRSP'];
    expect(names(fromSelect)).toEqual(expected);
    expect(names(toSelect)).toEqual(expected);
    expect(fromSelect.value).toBe('day-to-day');
    expect(toSelect.value).toBe('esavings');
  });

  it('renders the amount, currency options, and quick links', async () => {
    const { element, amountInput, currencySelect } = await render();
    expect(amountInput.value).toBe('25.00');
    expect(Array.from(currencySelect.options, (option) => option.value)).toEqual(['CAD', 'USD']);
    expect(currencySelect.value).toBe('CAD');
    expect(
      Array.from(element.querySelectorAll('.card__links a'), (link) => link.textContent?.trim()),
    ).toEqual([
      'Pay Bills & Transfer Funds',
      'Send an Interac e-Transfer',
      'International Money Transfer',
    ]);
  });

  it('dispatches transferFormChanged for each form field', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { fromSelect, toSelect, currencySelect, amountInput } = await render();

    fromSelect.value = 'esavings';
    fromSelect.dispatchEvent(new Event('change'));
    toSelect.value = 'rrsp';
    toSelect.dispatchEvent(new Event('change'));
    currencySelect.value = 'USD';
    currencySelect.dispatchEvent(new Event('change'));
    amountInput.value = '12.34';
    amountInput.dispatchEvent(new Event('input'));

    expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
      transferFormChanged({ fromAccountId: 'esavings' }),
      transferFormChanged({ toAccountId: 'rrsp' }),
      transferFormChanged({ currency: 'USD' }),
      transferFormChanged({ amount: '12.34' }),
    ]);
  });

  it('dispatches transferSubmitted and prevents the native submit', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { element } = await render();
    const event = new Event('submit', { cancelable: true });
    element.querySelector('form')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(transferSubmitted());
  });

  it('submits when the Submit button is clicked', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { submitButton } = await render();
    submitButton.click();
    expect(dispatch).toHaveBeenCalledWith(transferSubmitted());
  });

  it('disables the submit button while submitting', async () => {
    const { fixture, submitButton } = await render();
    expect(submitButton.disabled).toBe(false);
    expect(submitButton.textContent?.trim()).toBe('Submit');
    await setTransfer(fixture, { submitting: true });
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent?.trim()).toBe('Submitting…');
  });

  it('shows no alerts by default', async () => {
    const { element } = await render();
    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(element.querySelector('[role="status"]')).toBeNull();
  });

  it('shows the validation error from the store', async () => {
    const { fixture, element } = await render();
    await setTransfer(fixture, { error: 'Insufficient funds in the selected account.' });
    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Insufficient funds in the selected account.',
    );
  });

  it('shows the confirmation and dispatches transferConfirmationDismissed on dismiss', async () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const { fixture, element } = await render();
    await setTransfer(fixture, { confirmation: 'Transfer complete.' });
    const status = element.querySelector('[role="status"]')!;
    expect(status.textContent).toContain('Transfer complete.');
    status.querySelector<HTMLButtonElement>('.alert__dismiss')!.click();
    expect(dispatch).toHaveBeenCalledWith(transferConfirmationDismissed());
  });
});
