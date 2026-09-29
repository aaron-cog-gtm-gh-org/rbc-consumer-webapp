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

  it('opens account history from the Options menu and closes it again', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.options__trigger')?.click();
    await fixture.whenStable();

    const historyItem = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('button.options__item'),
    ).find((button) => button.textContent?.trim() === 'Account History');
    expect(historyItem).toBeTruthy();

    historyItem?.click();
    await fixture.whenStable();

    const dialog = compiled.querySelector('app-account-history-modal [role="dialog"]');
    expect(dialog?.textContent).toContain('RBC Day to Day Banking');
    expect(compiled.querySelector('.options__list')).toBeNull();

    compiled.querySelector<HTMLButtonElement>('.dialog__done')?.click();
    await fixture.whenStable();

    expect(compiled.querySelector('app-account-history-modal')).toBeNull();
  });
});
