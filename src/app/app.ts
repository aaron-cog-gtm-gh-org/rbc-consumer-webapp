import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AccountHistoryModal } from './components/account-history-modal/account-history-modal';
import { AccountList } from './components/account-list/account-list';
import { Header } from './components/header/header';
import { InvestmentsList } from './components/investments-list/investments-list';
import { Nav } from './components/nav/nav';
import { QuickTransfer } from './components/quick-transfer/quick-transfer';
import { Subnav } from './components/subnav/subnav';
import { WelcomeBar } from './components/welcome-bar/welcome-bar';
import {
  selectAccountHistoryAccountId,
  selectAccountHistoryModalOpen,
} from './store/ui/ui.selectors';

@Component({
  imports: [
    Header,
    Nav,
    Subnav,
    WelcomeBar,
    AccountList,
    InvestmentsList,
    QuickTransfer,
    AccountHistoryModal,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(Store);

  protected readonly accountHistoryOpen = toSignal(
    this.store.select(selectAccountHistoryModalOpen),
    { initialValue: false },
  );
  protected readonly accountHistoryAccountId = toSignal(
    this.store.select(selectAccountHistoryAccountId),
    { initialValue: null },
  );
}
