import type { BeneficiaryResponse } from '../generated/edistrict/api';

export async function mockEdistrictBeneficiary(aadhaar: string): Promise<BeneficiaryResponse> {
  if (!/^\d{12}$/.test(aadhaar)) {
    throw new Error('Invalid Aadhaar format');
  }
  const lastDigit = Number(aadhaar.slice(-1));
  if (lastDigit === 0) {
    throw new Error('NOT_FOUND');
  }
  return {
    aadhaar,
    name: 'Demo Beneficiary',
    caste: 'Scheduled Tribe',
    income: 45000,
    address: 'Tribal Village, District X, State Y',
  };
}