export type AccountKind = 'bank' | 'investment';

export interface AccountTransaction {
  id: string;
  /** ISO calendar date, e.g. `2026-08-27`. */
  date: string;
  description: string;
  /** Signed amount: positive for credits, negative for debits. */
  amount: number;
  /** Account balance immediately after this transaction posted. */
  balance: number;
}

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  kind: AccountKind;
  /** Posted transactions, newest first. */
  history: AccountTransaction[];
}

export interface AccountsState {
  userName: string;
  userFirstName: string;
  statementDate: string;
  /** ISO form of `statementDate`, used to date newly posted transactions. */
  statementIsoDate: string;
  accounts: Account[];
}
