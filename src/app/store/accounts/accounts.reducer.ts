import { createReducer, on } from '@ngrx/store';
import { accountsTransferApplied } from './accounts.actions';
import { AccountsState } from './accounts.models';

export const accountsFeatureKey = 'accounts';

export const initialAccountsState: AccountsState = {
  userName: 'GENE RAYMOND',
  userFirstName: 'Gene',
  statementDate: 'Thursday, August 27, 2026',
  accounts: [
    {
      id: 'day-to-day',
      name: 'RBC Day to Day Banking',
      number: '05812-5008874',
      balance: 5407.48,
      kind: 'bank',
      transactions: [
        {
          id: 'dtd-1',
          date: 'Aug 26, 2026',
          description: 'Interac Purchase - Loblaws',
          amount: -84.32,
          balance: 5407.48,
        },
        {
          id: 'dtd-2',
          date: 'Aug 24, 2026',
          description: 'Bill Payment - Rogers',
          amount: -128.75,
          balance: 5491.8,
        },
        {
          id: 'dtd-3',
          date: 'Aug 21, 2026',
          description: 'Payroll Deposit - Northwind Ltd',
          amount: 2340.16,
          balance: 5620.55,
        },
        {
          id: 'dtd-4',
          date: 'Aug 19, 2026',
          description: 'Interac e-Transfer Sent - J. Tremblay',
          amount: -200,
          balance: 3280.39,
        },
        {
          id: 'dtd-5',
          date: 'Aug 17, 2026',
          description: 'ATM Withdrawal - Bank Street',
          amount: -120,
          balance: 3480.39,
        },
        {
          id: 'dtd-6',
          date: 'Aug 14, 2026',
          description: 'Pre-Authorized Debit - Enbridge',
          amount: -96.4,
          balance: 3600.39,
        },
        {
          id: 'dtd-7',
          date: 'Aug 12, 2026',
          description: 'Interac Purchase - Petro-Canada',
          amount: -71.05,
          balance: 3696.79,
        },
        {
          id: 'dtd-8',
          date: 'Aug 10, 2026',
          description: 'Transfer from eSavings',
          amount: 500,
          balance: 3767.84,
        },
      ],
    },
    {
      id: 'esavings',
      name: 'RBC High Interest eSavings',
      number: '05812-5102336',
      balance: 12452.0,
      kind: 'bank',
      transactions: [
        {
          id: 'sav-1',
          date: 'Aug 25, 2026',
          description: 'Interest Payment',
          amount: 18.64,
          balance: 12452.0,
        },
        {
          id: 'sav-2',
          date: 'Aug 20, 2026',
          description: 'Transfer from Day to Day Banking',
          amount: 750,
          balance: 12433.36,
        },
        {
          id: 'sav-3',
          date: 'Aug 12, 2026',
          description: 'Transfer to Day to Day Banking',
          amount: -500,
          balance: 11683.36,
        },
        {
          id: 'sav-4',
          date: 'Jul 31, 2026',
          description: 'Interest Payment',
          amount: 17.21,
          balance: 12183.36,
        },
        {
          id: 'sav-5',
          date: 'Jul 15, 2026',
          description: 'Payroll Deposit - Savings Split',
          amount: 400,
          balance: 12166.15,
        },
        {
          id: 'sav-6',
          date: 'Jul 2, 2026',
          description: 'Transfer from Day to Day Banking',
          amount: 1000,
          balance: 11766.15,
        },
      ],
    },
    {
      id: 'rrsp',
      name: 'RRSP',
      number: '05812-7741902',
      balance: 8550.0,
      kind: 'investment',
      transactions: [
        {
          id: 'rrsp-1',
          date: 'Aug 22, 2026',
          description: 'Contribution - Pre-Authorized',
          amount: 250,
          balance: 8550.0,
        },
        {
          id: 'rrsp-2',
          date: 'Aug 15, 2026',
          description: 'Dividend Reinvestment',
          amount: 62.4,
          balance: 8300.0,
        },
        {
          id: 'rrsp-3',
          date: 'Jul 22, 2026',
          description: 'Contribution - Pre-Authorized',
          amount: 250,
          balance: 8237.6,
        },
        {
          id: 'rrsp-4',
          date: 'Jul 10, 2026',
          description: 'Management Fee',
          amount: -21.75,
          balance: 7987.6,
        },
        {
          id: 'rrsp-5',
          date: 'Jun 22, 2026',
          description: 'Contribution - Pre-Authorized',
          amount: 250,
          balance: 8009.35,
        },
        {
          id: 'rrsp-6',
          date: 'Jun 5, 2026',
          description: 'Dividend Reinvestment',
          amount: 58.9,
          balance: 7759.35,
        },
      ],
    },
  ],
};

export const accountsReducer = createReducer(
  initialAccountsState,
  on(accountsTransferApplied, (state, { fromAccountId, toAccountId, amount }) => ({
    ...state,
    accounts: state.accounts.map((account) => {
      if (account.id === fromAccountId) {
        return { ...account, balance: account.balance - amount };
      }
      if (account.id === toAccountId) {
        return { ...account, balance: account.balance + amount };
      }
      return account;
    }),
  })),
);
