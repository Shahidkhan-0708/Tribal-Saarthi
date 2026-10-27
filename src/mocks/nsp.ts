import type { EligibilityRequest, EligibilityResponse } from '../generated/nsp/api';

export async function mockScholarshipEligibility(req: EligibilityRequest): Promise<EligibilityResponse> {
  const hash = req.studentId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const eligible = hash % 3 !== 0;
  const amount = eligible ? 15000 + (hash % 5) * 5000 : 0;
  return {
    eligible,
    amount,
    remarks: eligible ? 'Eligible for post-matric tribal scholarship' : 'Income above threshold or duplicate application',
  };
}