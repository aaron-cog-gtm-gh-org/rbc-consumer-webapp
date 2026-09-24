import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let element: HTMLElement;

  const trigger = () => element.querySelector<HTMLButtonElement>('.user-menu__trigger')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the signed-in user name from the store', () => {
    expect(trigger().textContent).toContain('GENE RAYMOND');
    expect(element.querySelector('.user-menu__list')).toBeNull();
  });

  it('toggles the user menu', async () => {
    trigger().click();
    await fixture.whenStable();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelectorAll('.user-menu__list li').length).toBe(4);

    trigger().click();
    await fixture.whenStable();

    expect(element.querySelector('.user-menu__list')).toBeNull();
  });
});
