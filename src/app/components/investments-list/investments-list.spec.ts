import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { InvestmentsList } from './investments-list';

describe('InvestmentsList', () => {
  let fixture: ComponentFixture<InvestmentsList>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentsList],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentsList);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('renders only the investment accounts', () => {
    const rows = Array.from(element.querySelectorAll('.row'));

    expect(rows).toHaveLength(1);
    expect(rows[0].querySelector('.row__name')?.textContent?.trim()).toBe('RRSP');
    expect(rows[0].querySelector('.row__number')?.textContent?.trim()).toBe('05812-7741902');
    expect(rows[0].querySelector('.row__balance')?.textContent?.trim()).toBe('$8,550.00');
  });

  it('renders the investments total', () => {
    expect(element.querySelector('.total')?.textContent).toContain('$8,550.00');
  });
});
