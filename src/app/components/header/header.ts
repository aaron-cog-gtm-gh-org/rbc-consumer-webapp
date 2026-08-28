import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectUserName } from '../../store/accounts/accounts.selectors';
import { userMenuToggled } from '../../store/ui/ui.actions';
import { selectUserMenuOpen } from '../../store/ui/ui.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly store = inject(Store);

  protected readonly userName = toSignal(this.store.select(selectUserName), {
    initialValue: '',
  });
  protected readonly userMenuOpen = toSignal(this.store.select(selectUserMenuOpen), {
    initialValue: false,
  });

  protected readonly userMenuItems = [
    'Profile & Account Settings',
    'My Alerts',
    'Change My Password',
    'Manage Linked Accounts',
  ];

  protected toggleUserMenu(): void {
    this.store.dispatch(userMenuToggled());
  }
}
