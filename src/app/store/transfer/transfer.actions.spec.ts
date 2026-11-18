import {
  transferCompleted,
  transferConfirmationDismissed,
  transferFormChanged,
  transferRejected,
  transferSubmitted,
} from './transfer.actions';

describe('transfer actions', () => {
  it('creates transferFormChanged with partial form changes', () => {
    expect(transferFormChanged({ amount: '10' })).toEqual({
      type: '[Transfer] Form Changed',
      amount: '10',
    });
  });

  it('creates payload-free actions', () => {
    expect(transferSubmitted()).toEqual({ type: '[Transfer] Submitted' });
    expect(transferConfirmationDismissed()).toEqual({ type: '[Transfer] Confirmation Dismissed' });
  });

  it('creates transferCompleted and transferRejected with their payloads', () => {
    expect(transferCompleted({ confirmation: 'Done' })).toEqual({
      type: '[Transfer] Completed',
      confirmation: 'Done',
    });
    expect(transferRejected({ error: 'Nope' })).toEqual({
      type: '[Transfer] Rejected',
      error: 'Nope',
    });
  });
});
