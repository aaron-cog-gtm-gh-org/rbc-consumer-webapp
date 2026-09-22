export type AccountKind = 'bank' | 'investment';

export interface AccountTransaction {
  date: string;
  description: string;
  amount: number;
}

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  kind: AccountKind;
  transactions?: AccountTransaction[];
}

export interface AccountsState {
  userName: string;
  userFirstName: string;
  statementDate: string;
  accounts: Account[];
}
