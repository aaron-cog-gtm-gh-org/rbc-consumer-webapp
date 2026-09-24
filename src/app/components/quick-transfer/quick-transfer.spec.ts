import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { selectAllAccounts } from '../../store/accounts/accounts.selectors';
import * as transferEffects from '../../store/transfer/transfer.effects';
import { selectTransferForm } from '../../store/transfer/transfer.selectors';
import { QuickTransfer } from './quick-transfer';

describe('QuickTransfer', () => {
  let fixture: ComponentFixture<QuickTransfer>;
  let store: Store;
  let element: HTMLElement;

  const amountInput = () => element.querySelector<HTMLInputElement>('.field__amount input')!;
  const selects = () => Array.from(element.querySelectorAll<HTMLSelectElement>('select'));
  const submitButton = () => element.querySelector<HTMLButtonElement>('button.submit')!;

  const typeAmount = async (value: string) => {
    const input = amountInput();
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const submit = async () => {
    submitButton().click();
    await fixture.whenStable();
  };

  const settleTransfer = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await fixture.whenStable();
  };

  const currentForm = async () =>
    await new Promise<{ amount: string; fromAccountId: string; toAccountId: string }>((resolve) =>
      store.select(selectTransferForm).subscribe(resolve).unsubscribe(),
    );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTransfer],
      providers: [provideStore(rootReducers), provideEffects(transferEffects)],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickTransfer);
    store = TestBed.inject(Store);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the accounts from the store in both account selects', async () => {
    const accounts = await new Promise<{ name: string }[]>((resolve) =>
      store.select(selectAllAccounts).subscribe(resolve).unsubscribe(),
    );
    const [from, to] = selects();

    expect(Array.from(from.options).map((option) => option.textContent?.trim())).toEqual(
      accounts.map((account) => account.name),
    );
    expect(to.options.length).toBe(accounts.length);
  });

  it('dispatches account and currency changes to the store', async () => {
    const [from, to, currency] = selects();

    from.value = 'rrsp';
    from.dispatchEvent(new Event('change'));
    to.value = 'day-to-day';
    to.dispatchEvent(new Event('change'));
    currency.value = 'USD';
    currency.dispatchEvent(new Event('change'));
    await fixture.whenStable();

    expect(await currentForm()).toMatchObject({
      fromAccountId: 'rrsp',
      toAccountId: 'day-to-day',
      currency: 'USD',
    });
  });

  it('dispatches the typed amount to the store', async () => {
    await typeAmount('250.75');

    expect((await currentForm()).amount).toBe('250.75');
    expect(amountInput().value).toBe('250.75');
  });

  it('keeps a typed negative amount so the effect can reject it', async () => {
    await typeAmount('-50');

    expect((await currentForm()).amount).toBe('-50');
    expect(amountInput().value).toBe('-50');
  });

  it('shows a confirmation and moves money for a valid transfer', async () => {
    await typeAmount('400');
    await submit();
    await settleTransfer();

    expect(element.querySelector('.alert--success')?.textContent).toContain(
      'Transfer complete. $400.00 moved from RBC Day to Day Banking to RBC High Interest eSavings.',
    );
    expect(amountInput().value).toBe('');
  });

  it('dismisses the confirmation', async () => {
    await typeAmount('10');
    await submit();
    await settleTransfer();

    element.querySelector<HTMLButtonElement>('.alert__dismiss')!.click();
    await fixture.whenStable();

    expect(element.querySelector('.alert--success')).toBeNull();
  });

  it('shows the rejection error for a negative amount', async () => {
    await typeAmount('-50');
    await submit();
    await settleTransfer();

    expect(element.querySelector('.alert--error')?.textContent).toContain(
      'Enter an amount greater than $0.00.',
    );
    expect(element.querySelector('.alert--success')).toBeNull();
  });

  it('shows the rejection error when both accounts match', async () => {
    const [, to] = selects();
    to.value = 'day-to-day';
    to.dispatchEvent(new Event('change'));
    await typeAmount('25');
    await submit();
    await settleTransfer();

    expect(element.querySelector('.alert--error')?.textContent).toContain(
      'Choose two different accounts.',
    );
  });

  it('shows the rejection error when funds are insufficient', async () => {
    await typeAmount('999999');
    await submit();
    await settleTransfer();

    expect(element.querySelector('.alert--error')?.textContent).toContain(
      'Insufficient funds in the selected account.',
    );
  });

  it('renders the quick links', () => {
    expect(element.querySelectorAll('.card__links a').length).toBe(3);
  });
});
