import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, provideStore } from '@ngrx/store';
import { rootReducers } from '../../store';
import { selectSearchQuery } from '../../store/ui/ui.selectors';
import { WelcomeBar } from './welcome-bar';

describe('WelcomeBar', () => {
  let fixture: ComponentFixture<WelcomeBar>;
  let store: Store;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeBar],
      providers: [provideStore(rootReducers)],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeBar);
    store = TestBed.inject(Store);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('greets the customer and renders the shortcuts with the unread badge', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Welcome, Gene');
    expect(element.querySelectorAll('.shortcut').length).toBe(6);
    expect(element.querySelector('.shortcut__badge')?.textContent).toContain('3');
  });

  it('dispatches the search query as the customer types', async () => {
    const input = element.querySelector<HTMLInputElement>('#site-search')!;
    input.value = 'e-transfer';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    const query = await new Promise<string>((resolve) =>
      store.select(selectSearchQuery).subscribe(resolve).unsubscribe(),
    );

    expect(query).toBe('e-transfer');
    expect(input.value).toBe('e-transfer');
  });
});
