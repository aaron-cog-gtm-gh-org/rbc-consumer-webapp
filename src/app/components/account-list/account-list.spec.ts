import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { AccountList } from './account-list';

describe('AccountList', () => {
  let fixture: ComponentFixture<AccountList>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountList],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountList);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders every bank account with its number and balance', () => {
    const rows = Array.from(element.querySelectorAll('.row'));

    expect(rows).toHaveLength(2);
    expect(rows[0].querySelector('.row__name')?.textContent?.trim()).toBe('RBC Day to Day Banking');
    expect(rows[0].querySelector('.row__number')?.textContent?.trim()).toBe('05812-5008874');
    expect(rows[0].querySelector('.row__balance')?.textContent?.trim()).toBe('$5,407.48');
    expect(rows[1].querySelector('.row__name')?.textContent?.trim()).toBe(
      'RBC High Interest eSavings',
    );
    expect(rows[1].querySelector('.row__number')?.textContent?.trim()).toBe('05812-5102336');
    expect(rows[1].querySelector('.row__balance')?.textContent?.trim()).toBe('$12,452.00');
  });

  it('renders the bank accounts total', () => {
    expect(element.querySelector('.total')?.textContent).toContain('$17,859.48');
  });

  it('does not render investment accounts', () => {
    expect(element.textContent).not.toContain('RRSP');
  });

  it('opens and closes the options menu through the store', async () => {
    const trigger = element.querySelector<HTMLButtonElement>('.options__trigger')!;

    trigger.click();
    await fixture.whenStable();
    expect(element.querySelector('.options__list')).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    await fixture.whenStable();
    expect(element.querySelector('.options__list')).toBeNull();
  });
});
