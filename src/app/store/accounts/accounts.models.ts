export type AccountKind = 'bank' | 'investment';

export interface BalanceHistoryPoint {
  date: string;
  balance: number;
}

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  kind: AccountKind;
  balanceHistory: BalanceHistoryPoint[];
}

export interface AccountsState {
  userName: string;
  userFirstName: string;
  statementDate: string;
  accounts: Account[];
}
