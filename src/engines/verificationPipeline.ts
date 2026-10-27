// ============================================================
// SIH 2026 — Verification Pipeline Engine (Step 2)
// Connects domain contracts directly to simulated OpenAPI nodes
// (UIDAI, e-District, DigiLocker, NSP, PFMS)
// ============================================================

import type { 
  StudentProfile, 
  ScholarshipScheme, 
  ScholarshipApplication, 
  VerificationNode,
  ApplicationStatus 
} from '../types';
import { mockAadhaarOtp } from '../mocks/uidai';
import { mockEdistrictBeneficiary } from '../mocks/edistrict';
import { mockDigiLockerFetch } from '../mocks/digilocker';
import { mockScholarshipEligibility } from '../mocks/nsp';
import { mockPfmsPayment } from '../mocks/pfms';

export interface VerificationPipelineResult {
  applicationId: string;
  overallStatus: ApplicationStatus;
  nodes: VerificationNode[];
  deficiencyRemarks?: string;
  sanctionedAmount?: number;
  dbtTxnRef?: string;
}

/**
 * Runs a simulated verification pipeline evaluating all 4 compliance nodes:
 * 1. Identity (UIDAI)
 * 2. Socio-Economic (e-District)
 * 3. Academic (NSP)
 * 4. Disbursement (PFMS)
 */
export async function executeVerificationPipeline(
  student: StudentProfile,
  scheme: ScholarshipScheme,
  applicationId: string,
  options?: {
    forceIncomeMismatch?: boolean;
    simulateSourceDownNode?: 'uidai' | 'edistrict' | 'nsp' | 'pfms';
  }
): Promise<VerificationPipelineResult> {
  const now = new Date().toISOString();
  const nodes: VerificationNode[] = [];
  let overallStatus: ApplicationStatus = 'submitted';
  let deficiencyRemarks: string | undefined;
  let sanctionedAmount = scheme.disbursementAmount;
  let dbtTxnRef: string | undefined;

  // -------------------------------------------------------------
  // Node 1: Identity (UIDAI Aadhaar OTP)
  // -------------------------------------------------------------
  try {
    if (options?.simulateSourceDownNode === 'uidai') {
      nodes.push({
        id: `VN-${applicationId}-UIDAI`,
        applicationId,
        nodeName: 'Identity (UIDAI)',
        state: 'source_down',
        remarks: 'UIDAI CIDR gateway connection timeout (buffer fallback active).',
        updatedAt: now,
      });
      overallStatus = 'pending_verification';
    } else {
      // Simulate verifying last 4 with standard test Aadhaar
      const simulatedUid = `12345678${student.aadhaarLast4.padStart(4, '0')}`;
      const uidaiRes = await mockAadhaarOtp({ uid: simulatedUid, otp: '123456' });

      if (uidaiRes.status === 'SUCCESS') {
        nodes.push({
          id: `VN-${applicationId}-UIDAI`,
          applicationId,
          nodeName: 'Identity (UIDAI)',
          state: 'verified',
          remarks: `UIDAI OTP authenticated. Legal name "${student.name}" matches population registry.`,
          updatedAt: now,
        });
      } else {
        nodes.push({
          id: `VN-${applicationId}-UIDAI`,
          applicationId,
          nodeName: 'Identity (UIDAI)',
          state: 'mismatch',
          remarks: `Aadhaar verification error: ${uidaiRes.errorMessage || 'Invalid record'}`,
          updatedAt: now,
        });
        overallStatus = 'deficiency_stage';
        deficiencyRemarks = `UIDAI demographic mismatch: ${uidaiRes.errorMessage}`;
      }
    }
  } catch (err) {
    nodes.push({
      id: `VN-${applicationId}-UIDAI`,
      applicationId,
      nodeName: 'Identity (UIDAI)',
      state: 'source_down',
      remarks: 'Simulated UIDAI connectivity timeout.',
      updatedAt: now,
    });
    overallStatus = 'pending_verification';
  }

  // -------------------------------------------------------------
  // Node 2: Socio-Economic (e-District / State Revenue Registry)
  // -------------------------------------------------------------
  try {
    if (options?.simulateSourceDownNode === 'edistrict') {
      nodes.push({
        id: `VN-${applicationId}-EDIST`,
        applicationId,
        nodeName: 'Socio-Economic (e-District)',
        state: 'source_down',
        remarks: 'State e-District portal unreachable. Enqueued in offline sync ledger.',
        updatedAt: now,
      });
      if (overallStatus !== 'deficiency_stage') overallStatus = 'pending_verification';
    } else if (options?.forceIncomeMismatch || student.annualFamilyIncome > scheme.maxIncomeLimit) {
      nodes.push({
        id: `VN-${applicationId}-EDIST`,
        applicationId,
        nodeName: 'Socio-Economic (e-District)',
        state: 'mismatch',
        remarks: `Income mismatch: Recorded ₹${student.annualFamilyIncome.toLocaleString('en-IN')} exceeds scheme cap of ₹${scheme.maxIncomeLimit.toLocaleString('en-IN')}.`,
        updatedAt: now,
      });
      overallStatus = 'deficiency_stage';
      deficiencyRemarks = `Family Income Certificate value (₹${student.annualFamilyIncome.toLocaleString('en-IN')}) does not align with your recorded e-District revenue registry entry.`;
    } else {
      nodes.push({
        id: `VN-${applicationId}-EDIST`,
        applicationId,
        nodeName: 'Socio-Economic (e-District)',
        state: 'verified',
        remarks: `ST caste record & income certificate verified via ${student.domicileState} Revenue Registry.`,
        updatedAt: now,
      });
    }
  } catch (err) {
    nodes.push({
      id: `VN-${applicationId}-EDIST`,
      applicationId,
      nodeName: 'Socio-Economic (e-District)',
      state: 'source_down',
      remarks: 'State registry connector down.',
      updatedAt: now,
    });
    if (overallStatus !== 'deficiency_stage') overallStatus = 'pending_verification';
  }

  // -------------------------------------------------------------
  // Node 3: Academic & Scheme Eligibility (NSP Audit Engine)
  // -------------------------------------------------------------
  if (overallStatus === 'deficiency_stage') {
    nodes.push({
      id: `VN-${applicationId}-NSP`,
      applicationId,
      nodeName: 'Academic (NSP)',
      state: 'pending',
      remarks: 'Audit evaluation halted pending resolution of socio-economic deficiency.',
      updatedAt: now,
    });
  } else {
    try {
      if (options?.simulateSourceDownNode === 'nsp') {
        nodes.push({
          id: `VN-${applicationId}-NSP`,
          applicationId,
          nodeName: 'Academic (NSP)',
          state: 'source_down',
          remarks: 'National Scholarship Portal de-duplication service degraded.',
          updatedAt: now,
        });
        overallStatus = 'pending_verification';
      } else {
        const nspRes = await mockScholarshipEligibility({
          studentId: student.id,
          schemeId: scheme.id,
        });

        if (nspRes.eligible) {
          nodes.push({
            id: `VN-${applicationId}-NSP`,
            applicationId,
            nodeName: 'Academic (NSP)',
            state: 'verified',
            remarks: `NSP deduplication clean. No duplicate Central/State fellowship recorded.`,
            updatedAt: now,
          });
          overallStatus = 'sanctioned';
        } else {
          nodes.push({
            id: `VN-${applicationId}-NSP`,
            applicationId,
            nodeName: 'Academic (NSP)',
            state: 'mismatch',
            remarks: nspRes.remarks || 'Ineligible under NSP statutory rules.',
            updatedAt: now,
          });
          overallStatus = 'deficiency_stage';
          deficiencyRemarks = nspRes.remarks;
        }
      }
    } catch (err) {
      nodes.push({
        id: `VN-${applicationId}-NSP`,
        applicationId,
        nodeName: 'Academic (NSP)',
        state: 'source_down',
        remarks: 'NSP gateway service unavailable.',
        updatedAt: now,
      });
      overallStatus = 'pending_verification';
    }
  }

  // -------------------------------------------------------------
  // Node 4: Direct Benefit Transfer (PFMS DBT)
  // -------------------------------------------------------------
  if (overallStatus === 'sanctioned') {
    try {
      if (options?.simulateSourceDownNode === 'pfms') {
        nodes.push({
          id: `VN-${applicationId}-PFMS`,
          applicationId,
          nodeName: 'Disbursement (PFMS)',
          state: 'source_down',
          remarks: 'PFMS DBT gateway experiencing latency. Batch enqueued.',
          updatedAt: now,
        });
      } else {
        const pfmsRes = await mockPfmsPayment({
          beneficiaryId: student.id,
          amount: sanctionedAmount,
          purpose: `DBT-${scheme.id}`,
        });

        if (pfmsRes.status === 'INITIATED') {
          dbtTxnRef = pfmsRes.txnRef;
          nodes.push({
            id: `VN-${applicationId}-PFMS`,
            applicationId,
            nodeName: 'Disbursement (PFMS)',
            state: 'verified',
            remarks: `PFMS DBT payment dispatched. Bank Ref: ${dbtTxnRef}.`,
            updatedAt: now,
          });
          overallStatus = 'disbursed';
        } else {
          nodes.push({
            id: `VN-${applicationId}-PFMS`,
            applicationId,
            nodeName: 'Disbursement (PFMS)',
            state: 'mismatch',
            remarks: pfmsRes.errorMessage || 'PFMS NPCI mapper failed.',
            updatedAt: now,
          });
        }
      }
    } catch (err) {
      nodes.push({
        id: `VN-${applicationId}-PFMS`,
        applicationId,
        nodeName: 'Disbursement (PFMS)',
        state: 'source_down',
        remarks: 'PFMS payment gateway unreachable.',
        updatedAt: now,
      });
    }
  } else {
    nodes.push({
      id: `VN-${applicationId}-PFMS`,
      applicationId,
      nodeName: 'Disbursement (PFMS)',
      state: 'pending',
      remarks: 'Awaiting completion of earlier verification stages before release.',
      updatedAt: now,
    });
  }

  return {
    applicationId,
    overallStatus,
    nodes,
    deficiencyRemarks,
    sanctionedAmount,
    dbtTxnRef,
  };
}
