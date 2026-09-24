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
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the bank accounts and their total from the store', () => {
    const rows = element.querySelectorAll('.row');

    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('RBC Day to Day Banking');
    expect(rows[0].textContent).toContain('$5,407.48');
    expect(rows[1].textContent).toContain('RBC High Interest eSavings');
    expect(element.querySelector('.total')?.textContent).toContain('$17,859.48');
    expect(element.textContent).not.toContain('RRSP');
  });

  it('opens one options menu at a time', async () => {
    const triggers = element.querySelectorAll<HTMLButtonElement>('.options__trigger');

    triggers[0].click();
    await fixture.whenStable();

    expect(element.querySelectorAll('.options__list').length).toBe(1);
    expect(element.querySelectorAll('.options__list li').length).toBe(4);
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');

    triggers[1].click();
    await fixture.whenStable();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('closes the options menu when its trigger is clicked twice', async () => {
    const trigger = element.querySelector<HTMLButtonElement>('.options__trigger')!;

    trigger.click();
    await fixture.whenStable();
    trigger.click();
    await fixture.whenStable();

    expect(element.querySelector('.options__list')).toBeNull();
  });
});
