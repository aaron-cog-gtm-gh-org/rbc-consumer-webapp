import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { rootReducers } from '../../store';
import { selectSearchQuery } from '../../store/ui/ui.selectors';
import { WelcomeBar } from './welcome-bar';

describe('WelcomeBar', () => {
  let fixture: ComponentFixture<WelcomeBar>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeBar],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeBar);
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('greets the user from the store', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Welcome, Gene');
  });

  it('renders the shortcuts with the unread message badge', () => {
    const labels = Array.from(element.querySelectorAll('.shortcut__label')).map((label) =>
      label.textContent?.trim(),
    );

    expect(labels).toEqual([
      'Statements & Documents',
      'Messages & Alerts',
      'eBills',
      'Offers For You',
      'Beyond Banking',
      'Print',
    ]);
    expect(element.querySelector('.shortcut__badge')?.textContent?.trim()).toBe('3');
  });

  it('dispatches search input to the store', async () => {
    const search = element.querySelector<HTMLInputElement>('#site-search')!;

    search.value = 'e-transfer';
    search.dispatchEvent(new Event('input'));

    const store = TestBed.inject(Store);
    await expect(firstValueFrom(store.select(selectSearchQuery))).resolves.toBe('e-transfer');
  });
});
