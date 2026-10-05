import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { App } from './app';
import { rootReducers } from './store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideStore(rootReducers)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the welcome heading and account totals', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome, Gene');
    expect(compiled.textContent).toContain('RBC Day to Day Banking');
    expect(compiled.textContent).toContain('$17,859.48');
  });

  it('opens account history from the Options menu and dismisses it', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-account-history')).toBeNull();

    el.querySelector<HTMLButtonElement>('.options__trigger')!.click();
    await fixture.whenStable();

    const historyItem = Array.from(
      el.querySelectorAll<HTMLButtonElement>('.options__list button'),
    ).find((button) => button.textContent?.includes('View Account History'));
    expect(historyItem).toBeTruthy();
    historyItem!.click();
    await fixture.whenStable();

    const history = el.querySelector('app-account-history');
    expect(history?.textContent).toContain('RBC Day to Day Banking');
    expect(history?.querySelectorAll('tbody tr').length).toBeGreaterThan(0);
    expect(el.querySelector('.options__list')).toBeNull();

    history!.querySelector<HTMLButtonElement>('.history__close')!.click();
    await fixture.whenStable();
    expect(el.querySelector('app-account-history')).toBeNull();
  });
});
