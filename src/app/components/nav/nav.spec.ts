import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { Nav } from './nav';

describe('Nav', () => {
  let fixture: ComponentFixture<Nav>;
  let element: HTMLElement;

  const tabs = () => Array.from(element.querySelectorAll<HTMLButtonElement>('.nav__tab'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(Nav);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('marks the active tab from the store and renders the statement date', () => {
    expect(tabs().map((tab) => tab.textContent?.trim())).toEqual([
      'Products & Services',
      'My Accounts',
      'Customer Service',
    ]);
    expect(tabs()[1].classList).toContain('nav__tab--active');
    expect(tabs()[1].getAttribute('aria-current')).toBe('page');
    expect(element.querySelector('.nav__date')?.textContent).toContain('Thursday, August 27, 2026');
  });

  it('activates the clicked tab', async () => {
    tabs()[2].click();
    await fixture.whenStable();

    expect(tabs()[2].classList).toContain('nav__tab--active');
    expect(tabs()[1].classList).not.toContain('nav__tab--active');
  });
});
