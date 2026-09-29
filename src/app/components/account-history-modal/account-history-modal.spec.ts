import { TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { accountHistoryClosed } from '../../store/ui/ui.actions';
import { AccountHistoryModal } from './account-history-modal';

describe('AccountHistoryModal', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountHistoryModal],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
  });

  const render = async (accountId: string) => {
    const fixture = TestBed.createComponent(AccountHistoryModal);
    fixture.componentRef.setInput('accountId', accountId);
    await fixture.whenStable();
    const dispatch = vi.spyOn(TestBed.inject(Store), 'dispatch');
    return { element: fixture.nativeElement as HTMLElement, dispatch };
  };

  it('renders the account name and its transactions', async () => {
    const { element } = await render('day-to-day');

    expect(element.querySelector('[role="dialog"]')).toBeTruthy();
    expect(element.textContent).toContain('RBC Day to Day Banking');
    expect(element.querySelectorAll('tbody tr').length).toBe(6);
    expect(element.textContent).toContain('Payroll deposit, Northwind Ltd.');
    expect(element.textContent).toContain('+$2,350.00');
    expect(element.textContent).toContain('-$86.37');
  });

  it('dispatches accountHistoryClosed from the close button', async () => {
    const { element, dispatch } = await render('esavings');

    element.querySelector<HTMLButtonElement>('.dialog__close')?.click();

    expect(dispatch).toHaveBeenCalledWith(accountHistoryClosed());
  });

  it('dispatches accountHistoryClosed when the backdrop is clicked', async () => {
    const { element, dispatch } = await render('esavings');

    element.querySelector<HTMLElement>('.backdrop')?.click();

    expect(dispatch).toHaveBeenCalledWith(accountHistoryClosed());
  });

  it('stays open when clicking inside the dialog', async () => {
    const { element, dispatch } = await render('esavings');

    element.querySelector<HTMLElement>('.dialog__body')?.click();

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches accountHistoryClosed on Escape', async () => {
    const { dispatch } = await render('esavings');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(dispatch).toHaveBeenCalledWith(accountHistoryClosed());
  });
});
