import { Account } from '../accounts/accounts.models';

export const parseAmount = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (trimmed === '' || !/^-?\d*\.?\d*$/.test(trimmed)) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateTransfer = (
  form: { fromAccountId: string; toAccountId: string; amount: string },
  accounts: Account[],
): string | null => {
  const amount = parseAmount(form.amount);
  if (amount === null || amount <= 0) {
    return 'Enter an amount greater than $0.00.';
  }
  if ((form.amount.trim().split('.')[1]?.length ?? 0) > 2) {
    return 'Enter an amount with at most two decimal places.';
  }
  if (form.fromAccountId === form.toAccountId) {
    return 'Choose two different accounts.';
  }
  const from = accounts.find((account) => account.id === form.fromAccountId);
  if (!from) {
    return 'Choose an account to transfer from.';
  }
  if (from.balance < amount) {
    return 'Insufficient funds in the selected account.';
  }
  return null;
};
