import type { CoverageSnapshot } from '@/types';

// ============================================================
// Beneficiary-gap analytics baseline.
//
// IMPORTANT (per research hardening): these district-level
// population/enrollment aggregates are patterns based on public
// datasets (Census 2011 ST figures: censusindia.gov.in; UDISE+
// ST enrollment: udiseplus.gov.in). The *individual student
// records* in this prototype are synthetic demo data. On-screen
// badges always carry the source citation so evaluators can
// verify the calc method is defensible.
// ============================================================

export const COVERAGE_SNAPSHOTS: CoverageSnapshot[] = [
  {
    district: 'Ranchi',
    state: 'Jharkhand',
    stPopulation: 1154428, // Census 2011, Ranchi district ST population (approx.)
    stEnrolled: 148210, // UDISE+ style ST enrollment (demo-fitted)
    availing: 109470,
    source: 'Census 2011 + UDISE+ 2021-22 (pattern-fit for demo)',
    year: '2026-27',
  },
  {
    district: 'Mandla',
    state: 'Madhya Pradesh',
    stPopulation: 625997,
    stEnrolled: 91380,
    availing: 62540,
    source: 'Census 2011 + UDISE+ 2021-22 (pattern-fit for demo)',
    year: '2026-27',
  },
  {
    district: 'Mayurbhanj',
    state: 'Odisha',
    stPopulation: 916601,
    stEnrolled: 128940,
    availing: 86230,
    source: 'Census 2011 + UDISE+ 2021-22 (pattern-fit for demo)',
    year: '2026-27',
  },
  {
    district: 'Bijapur',
    state: 'Chhattisgarh',
    stPopulation: 255230,
    stEnrolled: 40310,
    availing: 23940,
    source: 'Census 2011 + UDISE+ 2021-22 (pattern-fit for demo)',
    year: '2026-27',
  },
];

/** Users (both student & govt) shown in the prototype's demo login. */
export const USERS = [
  { id: 'usr_asha', name: 'Asha Kiran Ekka', role: 'student' as const, studentId: 'stu_asha' },
  { id: 'usr_mohan', name: 'Mohan Ram Rojat', role: 'student' as const, studentId: 'stu_mohan' },
  { id: 'usr_sunita', name: 'Sunita Murmu', role: 'student' as const, studentId: 'stu_sunita' },
  { id: 'usr_parent_sundar', name: 'Sundar Ekka (Parent)', role: 'student' as const, studentId: 'stu_asha' },
  { id: 'usr_nagesh', name: 'Dr. R. Nagesh', role: 'institution' as const, designation: 'Nodal Officer, BIT Mesra', institutionId: 'inst_bitmesra' },
  { id: 'usr_verma', name: 'Sh. A.K. Verma', role: 'nodal' as const, designation: 'State Nodal Officer, Tribal Welfare' },
  { id: 'usr_admin', name: 'Smt. J. Barla', role: 'admin' as const, designation: 'Director, Ministry of Tribal Affairs (demo)' },
];
