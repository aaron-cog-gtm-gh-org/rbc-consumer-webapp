export interface TransferState {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  currency: string;
  submitting: boolean;
  confirmation: string | null;
  error: string | null;
}
