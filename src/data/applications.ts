import type { Application, StudentDocument, VerificationLog } from '@/types';
import { SCHEMES } from './schemes';

// ============================================================
// Seed documents & applications for the three demo students.
// Application states are deliberately spread across the whole
// lifecycle so the demo can walk the full state machine.
// ============================================================

// ---------------- Asha (ST, B.Tech) ----------------

export const DOCUMENTS: StudentDocument[] = [
  { id: 'doc_asha_admission', studentId: 'stu_asha', type: 'admission_proof', title: 'BIT Mesra Admission Letter (demo)', version: 1, uploadedAt: '2025-07-02', verifiedAt: '2025-07-10', status: 'verified', ocrText: 'Name: Asha Kiran Ekka\nBIT Mesra Admission', ocrFields: { name: 'Asha Kiran Ekka' }, reuseCount: 0 },
  {
    id: 'doc_asha_st',
    studentId: 'stu_asha',
    type: 'st_certificate',
    title: 'ST Certificate (Oraon)',
    version: 1,
    uploadedAt: '2025-07-02',
    verifiedAt: '2025-07-10',
    status: 'verified',
    ocrText: `TRIBAL WELFARE DEPARTMENT, GOVT. OF JHARKHAND
SCHEDULED TRIBE CERTIFICATE
Certificate No: ST/RAN/2025/011284
Name: Asha Kiran Ekka
DOB: 12/05/2006
Tribe: Oraon
Father: Sundar Ekka
Address: Bariatu, Ranchi, Jharkhand`,
    ocrFields: { name: 'Asha Kiran Ekka', dob: '12/05/2006', tribe: 'Oraon', certificateNo: 'ST/RAN/2025/011284' },
    reuseCount: 3,
  },
  {
    id: 'doc_asha_income',
    studentId: 'stu_asha',
    type: 'income_certificate',
    title: 'Family Income Certificate',
    version: 1,
    uploadedAt: '2025-07-02',
    verifiedAt: '2025-07-11',
    status: 'verified',
    ocrText: `RYTHU BUJUNA / INCOME CERTIFICATE — GOVT. TOOLKI
Certificate No: INC/RAN/2025/04471
Applicant: Asha Kiran Ekka
Annual family income: Rs. 1,80,000
Issued: 2025-06-28 by Tahsildar, Ranchi`,
    ocrFields: { income: 180000, certificateNo: 'INC/RAN/2025/04471' },
    reuseCount: 3,
  },
  {
    id: 'doc_asha_marksheet',
    studentId: 'stu_asha',
    type: 'marksheet',
    title: 'B.Tech Sem 2 Marksheet',
    version: 1,
    uploadedAt: '2025-07-05',
    verifiedAt: '2025-07-10',
    status: 'verified',
    ocrText: `BIRLA INSTITUTE OF TECHNOLOGY, MESRA
SEMESTER 2 EXAMINATION — CGPA 8.7 / 10
Student: Asha Kiran Ekka   Roll: 2024CS1042
Attendance (Sem 2): 83%`,
    ocrFields: { marks: 87, institution: 'BIT Mesra' },
    reuseCount: 2,
  },
  {
    id: 'doc_asha_domicile',
    studentId: 'stu_asha',
    type: 'domicile',
    title: 'Domicile Certificate',
    version: 1,
    uploadedAt: '2025-07-02',
    verifiedAt: '2025-07-10',
    status: 'verified',
    ocrText: `DOMICILE CERTIFICATE — GOVT. OF JHARKHAND
Name: Asha Kiran Ekka
Resident of: Bariatu, Ranchi, Jharkhand since birth
Verified: 2025-07-10`,
    ocrFields: { name: 'Asha Kiran Ekka' },
    reuseCount: 3,
  },
  {
    id: 'doc_asha_bank',
    studentId: 'stu_asha',
    type: 'bank_passbook',
    title: 'Bank Passbook (DBT-linked)',
    version: 1,
    uploadedAt: '2025-07-05',
    verifiedAt: '2025-07-12',
    status: 'verified',
    ocrText: `STATE BANK OF INDIA — BARIATU BRANCH
A/c holder: Asha Kiran Ekka
A/c no: XXXXXXX4821 (IFSC SBIN0012301)`,
    ocrFields: { name: 'Asha Kiran Ekka' },
    reuseCount: 3,
  },

  // ---------------- Mohan (PVTG, has a DOB mismatch) ----------------

  {
    id: 'doc_mohan_st',
    studentId: 'stu_mohan',
    type: 'st_certificate',
    title: 'ST Certificate (Baiga)',
    version: 1,
    uploadedAt: '2026-01-09',
    status: 'mismatch',
    ocrText: `TRIBAL WELFARE DEPARTMENT, GOVT. OF MADHYA PRADESH
SCHEDULED TRIBE CERTIFICATE
Certificate No: ST/MDL/2026/004412
Name: Mohan Ram Rojat
DOB: 25/08/2004
Tribe: Baiga
Father: Ram Prasad Rojat
Address: Bijhera, Mandla, M.P.`,
    ocrFields: { name: 'Mohan Ram Rojat', dob: '25/08/2005', tribe: 'Baiga', certificateNo: 'ST/MDL/2026/004412' },
    discrepancy: "OCR-extracted DOB on the certificate (25/08/2005) does not match the profile DOB (25/08/2004). Routed to manual review — the application is NOT auto-rejected.",
    reuseCount: 1,
  },
  {
    id: 'doc_mohan_income',
    studentId: 'stu_mohan',
    type: 'income_certificate',
    title: 'Family Income Certificate',
    version: 1,
    uploadedAt: '2026-01-09',
    verifiedAt: '2026-01-15',
    status: 'verified',
    ocrText: `INCOME CERTIFICATE — GOVT. OF MADHYA PRADESH
Certificate No: INC/MDL/2026/00219
Applicant: Ram Prasad Rojat (father of Mohan Ram Rojat)
Annual family income: Rs. 92,000
Issued: 2026-01-06 by SDM, Mandla`,
    ocrFields: { income: 92000, certificateNo: 'INC/MDL/2026/00219' },
    reuseCount: 1,
  },
  {
    id: 'doc_mohan_marksheet',
    studentId: 'stu_mohan',
    type: 'marksheet',
    title: 'B.A. Sem 4 Marksheet',
    version: 1,
    uploadedAt: '2026-01-12',
    verifiedAt: '2026-01-15',
    status: 'verified',
    ocrText: `GOVT. P.G. COLLEGE, MANDLA
B.A. (POLITICAL SCIENCE) SEM 4 — 64%
Student: Mohan Ram Rojat   Enrollment: MP-GPGC-2022-1189`,
    ocrFields: { marks: 64, institution: 'Govt. PG College, Mandla' },
    reuseCount: 1,
  },
  {
    id: 'doc_mohan_bank',
    studentId: 'stu_mohan',
    type: 'bank_passbook',
    title: 'Bank Passbook (DBT-linked)',
    version: 1,
    uploadedAt: '2026-01-12',
    verifiedAt: '2026-01-15',
    status: 'verified',
    ocrText: `CENTRAL BANK OF INDIA — MANDLA BRANCH
A/c holder: Mohan Ram Rojat
A/c no: XXXXXXX9137 (IFSC CBIN0289873)`,
    ocrFields: { name: 'Mohan Ram Rojat' },
    reuseCount: 1,
  },

  // ---------------- Sunita (Santal, mid pipeline) ----------------

  {
    id: 'doc_sunita_st',
    studentId: 'stu_sunita',
    type: 'st_certificate',
    title: 'ST Certificate (Santal)',
    version: 1,
    uploadedAt: '2026-02-20',
    verifiedAt: '2026-02-28',
    status: 'verified',
    ocrText: `TRIBAL WELFARE DEPARTMENT, GOVT. OF ODISHA
SCHEDULED TRIBE CERTIFICATE
Certificate No: ST/MBJ/2026/12017
Name: Sunita Murmu
DOB: 19/01/2008
Tribe: Santal
Father: Lakhan Murmu
Address: Badamundi, Mayurbhanj, Odisha`,
    ocrFields: { name: 'Sunita Murmu', dob: '19/01/2008', tribe: 'Santal', certificateNo: 'ST/MBJ/2026/12017' },
    reuseCount: 1,
  },
  {
    id: 'doc_sunita_income',
    studentId: 'stu_sunita',
    type: 'income_certificate',
    title: 'Family Income Certificate',
    version: 1,
    uploadedAt: '2026-02-20',
    status: 'unverified',
    ocrText: `INCOME CERTIFICATE — GOVT. OF ODISHA
Certificate No: INC/MBJ/2026/8834
Applicant: Lakhan Murmu (father of Sunita Murmu)
Annual family income: Rs. 1,20,000`,
    ocrFields: { income: 120000, certificateNo: 'INC/MBJ/2026/8834' },
    reuseCount: 0,
  },
  {
    id: 'doc_sunita_marksheet',
    studentId: 'stu_sunita',
    type: 'marksheet',
    title: 'Class 10 Board Marksheet',
    version: 1,
    uploadedAt: '2026-02-21',
    verifiedAt: '2026-02-28',
    status: 'verified',
    ocrText: `BOARD OF SECONDARY EDUCATION, ODISHA
CLASS 10 — 71%
Student: Sunita Murmu   Roll: 26MBJ10443`,
    ocrFields: { marks: 71, institution: 'BSE Odisha' },
    reuseCount: 1,
  },
  {
    id: 'doc_sunita_bank',
    studentId: 'stu_sunita',
    type: 'bank_passbook',
    title: 'Bank Passbook (DBT-linked)',
    version: 1,
    uploadedAt: '2026-02-21',
    verifiedAt: '2026-02-28',
    status: 'verified',
    ocrText: `STATE BANK OF INDIA — BADAMUNDI BRANCH
A/c holder: Sunita Murmu
A/c no: XXXXXXX2260 (IFSC SBIN0004502)`,
    ocrFields: { name: 'Sunita Murmu' },
    reuseCount: 1,
  },
];

// ---------------- Applications ----------------

const SEEDED_APPLICATIONS: Application[] = [
  // Asha — PMS-ST renewed 2 yrs ago (disbursed). Top-Class mid-flight at dept stage.
  {
    id: 'app_asha_pms_2024',
    studentId: 'stu_asha',
    schemeId: 'pms_st',
    academicYear: '2024-25',
    status: 'disbursed',
    submittedAt: '2024-08-02',
    sanctionedAmount: 32000,
    disbursedAmount: 32000,
    dbtStatus: 'successful',
    dbtDate: '2025-02-18',
    bankAccountLast4: '4821',
    pfmsTransactionId: 'PFMS20250218001',
  },
  {
    id: 'app_asha_pms_2025',
    studentId: 'stu_asha',
    schemeId: 'pms_st',
    academicYear: '2025-26',
    status: 'disbursed',
    submittedAt: '2025-08-05',
    sanctionedAmount: 35000,
    disbursedAmount: 35000,
    dbtStatus: 'successful',
    dbtDate: '2026-01-30',
    bankAccountLast4: '4821',
    pfmsTransactionId: 'PFMS20260130002',
  },
  {
    id: 'app_asha_tc_2026',
    studentId: 'stu_asha',
    schemeId: 'top_class',
    academicYear: '2026-27',
    status: 'department_stage',
    submittedAt: '2026-09-01',
    dbtStatus: 'pending',
  },
  // Mohan — Pipeline with a certificate mismatch flagged → manual review
  {
    id: 'app_mohan_pms_2026',
    studentId: 'stu_mohan',
    schemeId: 'pms_st',
    academicYear: '2026-27',
    status: 'deficiency',
    deficiency: { docKey: 'st_certificate', reason: 'Certificate DOB differs from the student profile. Upload a corrected version for officer review.', deadline: '2026-11-15', raisedBy: 'State Nodal Officer', documentId: 'doc_mohan_st', documentVersion: 1 },
    submittedAt: '2026-08-28',
  },
  // Sunita — first-ever application, PMS-ST, institute stage
  {
    id: 'app_sunita_pms_2026',
    studentId: 'stu_sunita',
    schemeId: 'pms_st',
    academicYear: '2026-27',
    status: 'manual_review',
    submittedAt: '2026-09-12',
  },
];

// ---------------- Verification logs ----------------

export const APPLICATIONS: Application[] = SEEDED_APPLICATIONS.map((app) => ({
  ...app,
  documentIds: DOCUMENTS.filter((doc) => doc.studentId === app.studentId && SCHEMES.find((s) => s.id === app.schemeId)?.requiredDocs.includes(doc.type)).map((doc) => doc.id),
}));

export const VERIFICATION_LOGS: VerificationLog[] = [
  // Asha Top-Class — institute verified, dept stage)
  { id: 'vl_asha_tc_identity', applicationId: 'app_asha_tc_2026', source: 'identity', connector: 'Aadhaar/Organ Config (SIMULATED)', state: 'verified', reason: 'Aadhaar demographic match OK', createdAt: '2026-09-01T10:15:00+05:30', resolvedAt: '2026-09-01T10:15:30+05:30' },
  { id: 'vl_asha_tc_st', applicationId: 'app_asha_tc_2026', source: 'st_certificate', connector: 'State ST Cert DB (SIMULATED)', state: 'verified', reason: 'ST cert no ST/RAN/2025/011284 active', createdAt: '2026-09-01T10:16:00+05:30', resolvedAt: '2026-09-01T10:16:10+05:30' },
  { id: 'vl_asha_tc_income', applicationId: 'app_asha_tc_2026', source: 'income', connector: 'State e-District (SIMULATED)', state: 'verified', reason: 'Income certificate valid, & 1.8L \u2264 6L cap', createdAt: '2026-09-01T10:17:00+05:30', resolvedAt: '2026-09-01T10:17:20+05:30' },
  { id: 'vl_asha_tc_institution', applicationId: 'app_asha_tc_2026', source: 'institution', connector: 'AISHE (SIMULATED)', state: 'verified', reason: 'BIT Mesra in Top-Class basket', createdAt: '2026-09-01T10:18:00+05:30', resolvedAt: '2026-09-01T10:18:05+05:30' },
  { id: 'vl_asha_tc_institute', applicationId: 'app_asha_tc_2026', source: 'academic', connector: 'Institution SSO (SIMULATED)', state: 'verified', reason: 'Institute verification completed by nodal officer', createdAt: '2026-09-03T11:00:00+05:30', reviewer: 'Dr. R. Nagesh (Nodal, BIT Mesra)', resolvedAt: '2026-09-03T14:20:00+05:30' },
  { id: 'vl_asha_tc_dept', applicationId: 'app_asha_tc_2026', source: 'academic', stage: 'department', connector: 'State Welfare Dept (SIMULATED)', state: 'pending', reason: 'Awaiting department verification', createdAt: '2026-09-03T14:21:00+05:30' },

  // Mohan — ST cert mismatch → manual review at state level
  { id: 'vl_mohan_identity', applicationId: 'app_mohan_pms_2026', source: 'identity', connector: 'Aadhaar/Organ Config (SIMULATED)', state: 'verified', reason: 'Aadhaar demographic match OK', createdAt: '2026-08-28T09:00:00+05:30', resolvedAt: '2026-08-28T09:00:20+05:30' },
  { id: 'vl_mohan_st', applicationId: 'app_mohan_pms_2026', source: 'st_certificate', connector: 'MP ST Cert DB (SIMULATED)', state: 'manual_review', reason: 'Certificate DOB mismatch (2005 vs 2004) — routed to state nodal officer, application NOT rejected', createdAt: '2026-08-28T09:05:00+05:30' },
  { id: 'vl_mohan_income', applicationId: 'app_mohan_pms_2026', source: 'income', connector: 'State e-District (SIMULATED)', state: 'verified', reason: 'Income certificate valid, \u20B992k \u2264 \u20B92.5L', createdAt: '2026-08-28T09:06:00+05:30', resolvedAt: '2026-08-28T09:06:15+05:30' },
];

export const BANK_LAST4: Record<string, string> = {
  stu_asha: '4821',
  stu_mohan: '9137',
  stu_sunita: '2260',
};
