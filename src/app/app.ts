import { Component } from '@angular/core';
import { AccountList } from './components/account-list/account-list';
import { BalanceHistory } from './components/balance-history/balance-history';
import { Header } from './components/header/header';
import { InvestmentsList } from './components/investments-list/investments-list';
import { Nav } from './components/nav/nav';
import { QuickTransfer } from './components/quick-transfer/quick-transfer';
import { Subnav } from './components/subnav/subnav';
import { WelcomeBar } from './components/welcome-bar/welcome-bar';

@Component({
  imports: [
    Header,
    Nav,
    Subnav,
    WelcomeBar,
    AccountList,
    InvestmentsList,
    QuickTransfer,
    BalanceHistory,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
