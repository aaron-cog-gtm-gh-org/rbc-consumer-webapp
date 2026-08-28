import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectUserFirstName } from '../../store/accounts/accounts.selectors';
import { searchQueryChanged } from '../../store/ui/ui.actions';
import { selectSearchQuery, selectUnreadMessages } from '../../store/ui/ui.selectors';
import { Icon, IconName } from '../icon/icon';

interface Shortcut {
  label: string;
  icon: IconName;
  badge?: boolean;
}

@Component({
  selector: 'app-welcome-bar',
  imports: [Icon],
  templateUrl: './welcome-bar.html',
  styleUrl: './welcome-bar.scss',
})
export class WelcomeBar {
  private readonly store = inject(Store);

  protected readonly shortcuts: Shortcut[] = [
    { label: 'Statements & Documents', icon: 'statements' },
    { label: 'Messages & Alerts', icon: 'messages', badge: true },
    { label: 'eBills', icon: 'ebills' },
    { label: 'Offers For You', icon: 'offers' },
    { label: 'Beyond Banking', icon: 'beyond' },
    { label: 'Print', icon: 'print' },
  ];

  protected readonly firstName = toSignal(this.store.select(selectUserFirstName), {
    initialValue: '',
  });
  protected readonly unreadMessages = toSignal(this.store.select(selectUnreadMessages), {
    initialValue: 0,
  });
  protected readonly searchQuery = toSignal(this.store.select(selectSearchQuery), {
    initialValue: '',
  });

  protected onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.store.dispatch(searchQueryChanged({ query }));
  }
}
