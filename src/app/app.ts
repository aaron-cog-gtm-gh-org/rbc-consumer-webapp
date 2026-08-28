import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AccountDetail } from './components/account-detail/account-detail';
import { AccountList } from './components/account-list/account-list';
import { Header } from './components/header/header';
import { InvestmentsList } from './components/investments-list/investments-list';
import { Nav } from './components/nav/nav';
import { QuickTransfer } from './components/quick-transfer/quick-transfer';
import { Subnav } from './components/subnav/subnav';
import { TransactionHistory } from './components/transaction-history/transaction-history';
import { WelcomeBar } from './components/welcome-bar/welcome-bar';
import { selectSelectedAccountId } from './store/ui/ui.selectors';

@Component({
  imports: [
    Header,
    Nav,
    Subnav,
    WelcomeBar,
    AccountList,
    InvestmentsList,
    QuickTransfer,
    AccountDetail,
    TransactionHistory,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(Store);

  protected readonly selectedAccountId = toSignal(this.store.select(selectSelectedAccountId), {
    initialValue: null,
  });
}
