export type AccountKind = 'bank' | 'investment';

export interface BalancePoint {
  label: string;
  balance: number;
}

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  kind: AccountKind;
  history: BalancePoint[];
}

export interface AccountsState {
  userName: string;
  userFirstName: string;
  statementDate: string;
  accounts: Account[];
}
