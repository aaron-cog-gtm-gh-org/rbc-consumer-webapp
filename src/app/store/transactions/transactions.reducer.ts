import { createReducer, on } from '@ngrx/store';
import { transactionsCleared, transactionsLoaded } from './transactions.actions';
import { TransactionsState } from './transactions.models';

export const transactionsFeatureKey = 'transactions';

export const initialTransactionsState: TransactionsState = {
  transactions: [
    {
      id: 'day-to-day-1',
      accountId: 'day-to-day',
      date: 'Aug 27, 2026',
      description: 'Payroll Deposit - CONTOSO LTD',
      amount: 2310.55,
      balance: 5407.48,
      type: 'credit',
    },
    {
      id: 'day-to-day-2',
      accountId: 'day-to-day',
      date: 'Aug 26, 2026',
      description: 'Interac e-Transfer to J. Tremblay',
      amount: 180.0,
      balance: 3096.93,
      type: 'debit',
    },
    {
      id: 'day-to-day-3',
      accountId: 'day-to-day',
      date: 'Aug 24, 2026',
      description: 'LOBLAWS #1420',
      amount: 142.37,
      balance: 3276.93,
      type: 'debit',
    },
    {
      id: 'day-to-day-4',
      accountId: 'day-to-day',
      date: 'Aug 22, 2026',
      description: 'Pre-Authorized Payment - RBC Insurance',
      amount: 96.4,
      balance: 3419.3,
      type: 'debit',
    },
    {
      id: 'esavings-1',
      accountId: 'esavings',
      date: 'Aug 25, 2026',
      description: 'Transfer from RBC Day to Day Banking',
      amount: 1000.0,
      balance: 12452.0,
      type: 'credit',
    },
    {
      id: 'esavings-2',
      accountId: 'esavings',
      date: 'Aug 15, 2026',
      description: 'Interest Payment',
      amount: 27.85,
      balance: 11452.0,
      type: 'credit',
    },
    {
      id: 'esavings-3',
      accountId: 'esavings',
      date: 'Aug 03, 2026',
      description: 'Transfer to RBC Day to Day Banking',
      amount: 500.0,
      balance: 11424.15,
      type: 'debit',
    },
    {
      id: 'rrsp-1',
      accountId: 'rrsp',
      date: 'Aug 20, 2026',
      description: 'Contribution - Monthly Plan',
      amount: 400.0,
      balance: 8550.0,
      type: 'credit',
    },
    {
      id: 'rrsp-2',
      accountId: 'rrsp',
      date: 'Aug 10, 2026',
      description: 'Management Fee',
      amount: 18.75,
      balance: 8150.0,
      type: 'debit',
    },
    {
      id: 'rrsp-3',
      accountId: 'rrsp',
      date: 'Jul 20, 2026',
      description: 'Contribution - Monthly Plan',
      amount: 400.0,
      balance: 8168.75,
      type: 'credit',
    },
  ],
};

export const transactionsReducer = createReducer(
  initialTransactionsState,
  on(transactionsLoaded, (state, { transactions }) => ({ ...state, transactions })),
  on(transactionsCleared, (state) => ({ ...state, transactions: [] })),
);
