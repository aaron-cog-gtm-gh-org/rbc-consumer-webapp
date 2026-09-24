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
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders only the investment accounts and their total', () => {
    const rows = element.querySelectorAll('.row');

    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('RRSP');
    expect(rows[0].textContent).toContain('05812-7741902');
    expect(rows[0].textContent).toContain('$8,550.00');
    expect(element.querySelector('.total')?.textContent).toContain('$8,550.00');
  });
});
