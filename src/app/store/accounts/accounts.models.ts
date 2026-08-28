export type AccountKind = 'bank' | 'investment';

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  kind: AccountKind;
}

export interface AccountsState {
  userName: string;
  userFirstName: string;
  statementDate: string;
  accounts: Account[];
}
