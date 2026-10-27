import type { PaymentRequest, PaymentResponse } from '../generated/pfms/api';

export async function mockPfmsPayment(req: PaymentRequest): Promise<PaymentResponse> {
  if (req.amount <= 0) {
    return { txnRef: '', status: 'FAILED', errorCode: 'INVALID_AMOUNT', errorMessage: 'Amount must be positive' };
  }
  const txnRef = `TXN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  return {
    txnRef,
    status: 'INITIATED',
  };
}