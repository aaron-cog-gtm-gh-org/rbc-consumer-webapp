import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { Subnav } from './subnav';

describe('Subnav', () => {
  let fixture: ComponentFixture<Subnav>;
  let element: HTMLElement;

  const tabs = () => Array.from(element.querySelectorAll<HTMLButtonElement>('.subnav__tab'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subnav],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(Subnav);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('marks the accounts summary tab active by default', () => {
    expect(tabs().map((tab) => tab.textContent?.trim())).toEqual([
      'Accounts Summary',
      'Profile & Account Settings',
    ]);
    expect(tabs()[0].classList).toContain('subnav__tab--active');
  });

  it('activates the clicked tab', async () => {
    tabs()[1].click();
    await fixture.whenStable();

    expect(tabs()[1].classList).toContain('subnav__tab--active');
    expect(tabs()[0].classList).not.toContain('subnav__tab--active');
  });
});
