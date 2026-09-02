import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { rootReducers } from '../../store';
import {
  transferCompleted,
  transferConfirmationDismissed,
  transferFormChanged,
  transferSubmitted,
} from '../../store/transfer/transfer.actions';
import { selectTransferForm } from '../../store/transfer/transfer.selectors';
import { QuickTransfer } from './quick-transfer';

describe('QuickTransfer', () => {
  let fixture: ComponentFixture<QuickTransfer>;
  let store: Store;
  let dispatch: ReturnType<typeof vi.spyOn>;
  let element: HTMLElement;

  const selects = (): HTMLSelectElement[] =>
    Array.from(element.querySelectorAll<HTMLSelectElement>('select'));

  const amountInput = (): HTMLInputElement =>
    element.querySelector<HTMLInputElement>('input[inputmode="decimal"]')!;

  const change = (element: HTMLSelectElement, value: string): void => {
    element.value = value;
    element.dispatchEvent(new Event('change'));
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTransfer],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    store = TestBed.inject(Store);
    dispatch = vi.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(QuickTransfer);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('dispatches form changes for the from, to and currency selects', () => {
    const [from, to, currency] = selects();

    change(from, 'rrsp');
    change(to, 'day-to-day');
    change(currency, 'USD');

    expect(dispatch).toHaveBeenCalledWith(transferFormChanged({ fromAccountId: 'rrsp' }));
    expect(dispatch).toHaveBeenCalledWith(transferFormChanged({ toAccountId: 'day-to-day' }));
    expect(dispatch).toHaveBeenCalledWith(transferFormChanged({ currency: 'USD' }));
  });

  it('dispatches form changes for the amount input', async () => {
    amountInput().value = '250.25';
    amountInput().dispatchEvent(new Event('input'));

    expect(dispatch).toHaveBeenCalledWith(transferFormChanged({ amount: '250.25' }));
    await expect(firstValueFrom(store.select(selectTransferForm))).resolves.toMatchObject({
      amount: '250.25',
    });
  });

  it('submits the form without reloading the page', () => {
    const submit = new Event('submit', { cancelable: true });

    element.querySelector('form')!.dispatchEvent(submit);

    expect(dispatch).toHaveBeenCalledWith(transferSubmitted());
    expect(submit.defaultPrevented).toBe(true);
  });

  it('dismisses the confirmation', async () => {
    store.dispatch(transferCompleted({ confirmation: 'Transfer complete.' }));
    await fixture.whenStable();

    element.querySelector<HTMLButtonElement>('.alert__dismiss')!.click();

    expect(dispatch).toHaveBeenCalledWith(transferConfirmationDismissed());
  });

  // Regression trap documented in .agents/skills/testing-rbc-webapp/SKILL.md: a leading `-` can
  // make the input report an empty value, which silently wipes the typed amount. This asserts the
  // CURRENT behaviour (amount cleared); flip the expectation once the input preserves the sign.
  it('currently clears the amount when the input reports an empty value for a leading minus', async () => {
    amountInput().value = '50';
    amountInput().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    amountInput().value = '';
    amountInput().dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(dispatch).toHaveBeenCalledWith(transferFormChanged({ amount: '' }));
    const form = await firstValueFrom(store.select(selectTransferForm));
    expect(form.amount).toBe('');
    expect(amountInput().value).toBe('');
  });
});
