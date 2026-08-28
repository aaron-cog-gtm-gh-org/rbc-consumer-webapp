export interface TransferState {
  fromAccountId: string;
  toAccountId: string;
  amount: number | null;
  currency: string;
  submitting: boolean;
  confirmation: string | null;
  error: string | null;
}
