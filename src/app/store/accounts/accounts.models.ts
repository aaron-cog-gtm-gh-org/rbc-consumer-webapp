export type AccountKind = 'bank' | 'investment';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
}

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  kind: AccountKind;
  transactions: Transaction[];
}

export interface AccountsState {
  userName: string;
  userFirstName: string;
  statementDate: string;
  accounts: Account[];
}
