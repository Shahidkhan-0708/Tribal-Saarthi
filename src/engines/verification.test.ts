import { describe, it, expect } from 'vitest';
import { runPipeline, DEFAULT_SOURCE_HEALTH, type SourceHealth } from './verification';
import type { StudentDocument } from '@/types';

describe('Multi-source Verification Pipeline & Honest Degradation Engine', () => {
  const mockDocs: StudentDocument[] = [
    {
      id: 'doc_st_1',
      studentId: 'stud_asha',
      type: 'st_certificate',
      title: 'ST Certificate',
      version: 1,
      ocrText: 'TRIBAL WELFARE DEPARTMENT\nCertificate No: JH/ST/2022/8812\nName: Asha Ekka\nTribe: Oraon',
      status: 'verified',
      reuseCount: 2,
      ocrFields: {
        certificateNo: 'JH/ST/2022/8812',
        name: 'Asha Ekka',
        tribe: 'Oraon',
      },
      uploadedAt: '2026-08-01T10:00:00Z',
      verifiedAt: '2026-08-01T10:05:00Z',
    },
    {
      id: 'doc_inc_1',
      studentId: 'stud_asha',
      type: 'income_certificate',
      title: 'Income Certificate',
      version: 1,
      ocrText: 'INCOME CERTIFICATE\nAnnual family income: Rs. 1,20,000',
      status: 'verified',
      reuseCount: 1,
      ocrFields: {
        income: 120000,
      },
      uploadedAt: '2026-08-01T10:00:00Z',
      verifiedAt: '2026-08-01T10:05:00Z',
    },
    {
      id: 'doc_acad_1',
      studentId: 'stud_asha',
      type: 'marksheet',
      title: 'Marksheet',
      version: 1,
      ocrText: 'MARKSHEET\nMarks: 85',
      status: 'verified',
      reuseCount: 1,
      ocrFields: {
        marks: 85,
      },
      uploadedAt: '2026-08-01T10:00:00Z',
      verifiedAt: '2026-08-01T10:05:00Z',
    },
  ];

  const profile = {
    aadhaarLast4: '4192',
    institutionId: 'inst_bit_mesra',
  };

  const knownInstitutions = ['inst_bit_mesra', 'inst_iit_kgp', 'inst_govt_pg_mandla'];

  it('passes all 5 verification layers when all sources and documents are valid', () => {
    const res = runPipeline('app_test_1', mockDocs, profile, knownInstitutions, DEFAULT_SOURCE_HEALTH);

    expect(res.clean).toBe(true);
    expect(res.outcome).toBe('all_verified');
    expect(res.logs.length).toBe(5);
    expect(res.logs.every((l) => l.state === 'verified')).toBe(true);
  });

  it('demonstrates honest degradation: killing the income source leaves application PENDING, never auto-rejected or auto-passed', () => {
    const sabotagedHealth: SourceHealth = {
      ...DEFAULT_SOURCE_HEALTH,
      income: false, // simulated state e-District API down
    };

    const res = runPipeline('app_test_2', mockDocs, profile, knownInstitutions, sabotagedHealth);

    expect(res.clean).toBe(false);
    expect(res.outcome).toBe('blocked_pending');

    const incomeLog = res.logs.find((l) => l.source === 'income');
    expect(incomeLog).toBeDefined();
    expect(incomeLog?.state).toBe('source_down');
    expect(incomeLog?.reason).toContain('source unreachable');
    expect(incomeLog?.reason).toContain('PENDING');
  });

  it('demonstrates zero-auto-rejection: document data mismatch is routed to manual review for human nodal officer', () => {
    const mismatchDocs: StudentDocument[] = [
      {
        ...mockDocs[0],
        status: 'mismatch',
        discrepancy: 'Name spelled as Ashaa Ekka on certificate vs Asha Ekka on Aadhaar',
      },
      mockDocs[1],
      mockDocs[2],
    ];

    const res = runPipeline('app_test_3', mismatchDocs, profile, knownInstitutions, DEFAULT_SOURCE_HEALTH);

    expect(res.clean).toBe(false);
    expect(res.outcome).toBe('exceptions');

    const stLog = res.logs.find((l) => l.source === 'st_certificate');
    expect(stLog).toBeDefined();
    expect(stLog?.state).toBe('manual_review');
    expect(stLog?.reason).toContain('Application NOT auto-rejected');
  });

  it('handles unknown institution by routing to manual review rather than dropping applicant', () => {
    const unlistedProfile = {
      ...profile,
      institutionId: 'inst_unknown_rural_college',
    };

    const res = runPipeline('app_test_4', mockDocs, unlistedProfile, knownInstitutions, DEFAULT_SOURCE_HEALTH);

    expect(res.clean).toBe(false);
    const instLog = res.logs.find((l) => l.source === 'institution');
    expect(instLog?.state).toBe('manual_review');
    expect(instLog?.reason).toContain('routed to nodal officer');
  });

  it('prioritizes source_down over exceptions when multiple failovers occur simultaneously', () => {
    const dualFailHealth: SourceHealth = {
      ...DEFAULT_SOURCE_HEALTH,
      identity: false,
    };
    const missingDocs: StudentDocument[] = []; // will trigger exceptions on other layers

    const res = runPipeline('app_test_5', missingDocs, profile, knownInstitutions, dualFailHealth);

    expect(res.outcome).toBe('blocked_pending');
    expect(res.clean).toBe(false);
    expect(res.logs.some((l) => l.state === 'source_down')).toBe(true);
    expect(res.logs.some((l) => l.state === 'manual_review')).toBe(true);
  });
});
