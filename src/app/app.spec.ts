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
});
