// ============================================================
// Adimool — SIH 2026 · PS 26238 — Domain Types
// ============================================================

export type Role = 'student' | 'institution' | 'nodal' | 'admin';

/** A person authorized to log into the prototype. */
export interface User {
  id: string;
  name: string;
  role: Role;
  studentId?: string; // for role === 'student'
  designation?: string;
}

export type CourseLevel = 'post-matric' | 'undergrad' | 'postgrad' | 'research' | 'overseas';

export type TribeCategory = 'ST' | 'PVTG';

export interface StudentProfile {
  id: string; // e.g., "STU-2024-00123"
  aadhaarLast4: string; // Verified via UIDAI OTP
  name: string; // Legal name cross-checked with Aadhaar
  dob: string; // YYYY-MM-DD for eligibility checking
  tribe: string; // e.g., "Baiga", "Oraon", "Santhal"
  category: TribeCategory;
  annualFamilyIncome: number; // Parsed from e-District Registry
  domicileState: string;
  domicileDistrict: string;
  institutionId: string;
  courseLevel: CourseLevel;
}

/** ST / PVTG – specific student profile. */
export interface Student {
  id: string;
  name: string;
  gender: 'F' | 'M';
  dob: string; // ISO yyyy-mm-dd
  aadhaarLast4: string;
  tribe: string; // e.g. "Oraon", "Baiga", "Santal"
  isPVTG: boolean;
  category: 'ST';
  familyIncome: number; // annual, INR
  annualFamilyIncome?: number; // alias for StudentProfile interoperability
  fatherName: string;
  domicileState: string;
  domicileDistrict: string;
  homeVillage: string;
  language: string; // preferred UI language code
  courseLevel: CourseLevel;
  course: string;
  institutionId: string;
  year: string;
  parentId?: string; // family-view consent holder
  familyViewConsent: boolean;
  apaarId?: string; // 12-digit One Nation One Student ID (NEP 2020)
  abcCredits?: number; // Academic Bank of Credits score
}

export type Portal = 'NSP' | 'SFMP' | 'NOS';
export type DocKey =
  | 'st_certificate'
  | 'income_certificate'
  | 'domicile'
  | 'marksheet'
  | 'admission_proof'
  | 'bank_passbook'
  | 'aadhaar'
  | 'research_proposal';

export type RuleFieldPreview =
  | 'category'
  | 'tribe'
  | 'isPVTG'
  | 'familyIncome'
  | 'courseLevel'
  | 'course'
  | 'institutionId'
  | 'domicileState'
  | 'marks'
  | 'attendance'
  | 'admission'
  | 'noOtherFellowship';

/** One declarative, auditable eligibility rule. */
export interface EligibilityRule {
  id: string;
  label: string; // human-facing, English; i18n overrides add more languages
  field: RuleFieldPreview;
  /** Human-readable rule parameter detail, e.g. "≤ ₹2,50,000" */
  param: string;
  // evaluation payload
  op: 'max' | 'min' | 'eq' | 'in';
  threshold?: number;
  allowedValues?: string[];
}

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  portal: Portal;
  ministry: string;
  courseLevels: CourseLevel[];
  amount: string;
  benefits: string[];
  deadline: string; // ISO date
  requiredDocs: DocKey[];
  rules: EligibilityRule[];
  notes: string;
  offeringMinistry?: string;
  maxIncomeLimit?: number;
  minMarksPercentage?: number;
  allowedCourseLevels?: CourseLevel[];
  disbursementAmount?: number;
}

export interface ScholarshipScheme {
  id: string; // e.g., "POST_MATRIC_ST"
  name: string;
  offeringMinistry: string;
  maxIncomeLimit: number;
  minMarksPercentage: number;
  allowedCourseLevels: CourseLevel[];
  disbursementAmount: number;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'pending_verification'
  | 'deficiency'
  | 'deficiency_stage'
  | 'manual_review'
  | 'institute_stage'
  | 'department_stage'
  | 'sanctioned'
  | 'disbursed'
  | 'rejected';

export interface Application {
  id: string;
  studentId: string;
  schemeId: string;
  academicYear: string;
  status: ApplicationStatus;
  documentIds?: string[];
  verificationReturnStage?: 'institute_stage' | 'department_stage';
  submittedAt?: string;
  sanctionedAmount?: number;
  departmentApprovedAt?: string;
  signatureUrl?: string;
  signedBy?: string;
  signedAt?: string;
  disbursedAmount?: number;
  dbtStatus?: 'pending' | 'successful' | 'failed';
  dbtDate?: string;
  bankAccountLast4?: string;
  pfmsTransactionId?: string; // PFMS transaction identifier for disbursement
  dbtTxnRef?: string; // Unified transaction reference
  deficiencyRemarks?: string;
  updatedAt?: string;
  deficiency?: {
    docKey: DocKey;
    reason: string;
    deadline: string;
    raisedBy: string;
    documentId?: string;
    documentVersion?: number;
  };
  rejectionReason?: string;
}

export interface ScholarshipApplication {
  id: string;
  studentId: string;
  schemeId: string;
  status: ApplicationStatus;
  deficiencyRemarks?: string;
  sanctionedAmount?: number;
  dbtTxnRef?: string;
  updatedAt: string;
}

export interface VerificationNode {
  id: string;
  applicationId: string;
  nodeName: 'Identity (UIDAI)' | 'Socio-Economic (e-District)' | 'Academic (NSP)' | 'Disbursement (PFMS)';
  state: 'verified' | 'mismatch' | 'source_down' | 'pending';
  remarks: string;
  updatedAt: string;
}

export interface OcrFields {
  name?: string;
  dob?: string;
  tribe?: string;
  income?: number;
  certificateNo?: string;
  ['attendance%']?: number;
  marks?: number;
  institution?: string;
  issueDate?: string;
  tehsildarSeal?: boolean;
}

export type DocumentStatus = 'unverified' | 'verified' | 'mismatch';

export interface StudentDocument {
  id: string;
  studentId: string;
  type: DocKey;
  title: string;
  version: number;
  uploadedAt: string;
  verifiedAt?: string;
  status: DocumentStatus;
  ocrText: string; // simulated OCR extraction source
  ocrFields: OcrFields;
  discrepancy?: string; // human-readable mismatch explanation
  reuseCount: number; // how many applications reused this doc
}

export interface Document extends StudentDocument {}

export type VerificationSource =
  | 'identity'
  | 'st_certificate'
  | 'income'
  | 'institution'
  | 'academic';

export type VerificationState =
  | 'verified'
  | 'mismatch'
  | 'source_down'
  | 'manual_review'
  | 'pending';

export interface VerificationLog {
  id: string;
  applicationId: string;
  source: VerificationSource;
  stage?: 'institute' | 'department';
  /** the simulated government connector this check was run against */
  connector: string;
  state: VerificationState;
  reason: string;
  reviewer?: string; // who resolved a manual_review
  createdAt: string;
  resolvedAt?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'premier' | 'state' | 'govt_college';
  state: string;
  district: string;
  inSchemeBasket: boolean; // in Top-Class institute basket?
}

/** Officer who can review / resolve cases in queues. */
export interface Officer {
  id: string;
  name: string;
  role: Role;
  designation: string;
  institutionId?: string;
}

export interface Grievance {
  id: string;
  studentId: string;
  category: string;
  subject: string;
  body: string;
  status: 'open' | 'in_review' | 'resolved';
  createdAt: string;
  assignedTo?: string;
}

export interface Notification {
  id: string;
  userId: string; // userId or studentId
  title: string;
  body: string;
  channel: 'in_app' | 'sms' | 'email';
  category: 'verification' | 'deficiency' | 'deadline' | 'payment' | 'info';
  severity: 'info' | 'warning' | 'success';
  createdAt: string;
  readAt?: string;
}

export interface AuditEntry {
  id: string;
  ts: string;
  actor: string; // userId, engine, or connector
  action: string;
  entity: string; // e.g. "document:doc_st_1"
  detail?: string;
}

/** Public aggregates used by the coverage analytics. */
export interface CoverageSnapshot {
  district: string;
  state: string;
  stPopulation: number; // Census 2011 ST population
  stEnrolled: number; // UDISE+ ST enrollment
  availing: number; // students receiving scholarship benefit (demo seeded from app usage)
  source: string; // citation, e.g. "UDISE+ 2021-22, Min. of Education"
  year: string;
}

// ---------------- Session / network ----------------

export type LangCode = 'en' | 'hi' | 'or' | 'te' | 'bh' | 'sant' | 'ho';

export interface SyncQueueItem {
  id: string;
  entity: string;
  action: string;
  payload: unknown;
  ts: string;
  status?: 'queued' | 'syncing' | 'synced' | 'conflict';
  retryCount?: number;
  conflictResolution?: string;
}
