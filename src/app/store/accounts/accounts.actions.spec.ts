import { accountsTransferApplied } from './accounts.actions';

describe('accounts actions', () => {
  it('creates accountsTransferApplied with its payload', () => {
    expect(
      accountsTransferApplied({ fromAccountId: 'day-to-day', toAccountId: 'esavings', amount: 25 }),
    ).toEqual({
      type: '[Accounts] Transfer Applied',
      fromAccountId: 'day-to-day',
      toAccountId: 'esavings',
      amount: 25,
    });
  });
});
