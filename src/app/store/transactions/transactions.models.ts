export type TransactionType = 'debit' | 'credit';

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: TransactionType;
}

export interface TransactionsState {
  transactions: Transaction[];
}
