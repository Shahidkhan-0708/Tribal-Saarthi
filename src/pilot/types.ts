import type { Student, Scheme, DocKey, ApplicationStatus, LangCode } from '@/types';

export type PilotRole = 'student' | 'institution' | 'nodal' | 'admin' | 'family';
export interface PilotAccount { id: string; email: string; name: string; role: PilotRole; institutionId?: string; state?: string; active: boolean; version?: number; lifecycle?: { inviteSentAt?: string; erasureRequestedAt?: string; erasureStatus?: string; erasureReason?:string; erasureReviewReason?:string; erasureReviewDueAt?:string } }
export interface PilotRecord<T = Record<string, unknown>> { id: string; version: number; data: T }
export interface PilotDocument { studentId: string; type: DocKey; title: string; objectPath: string; checksum: string; mimeType: string; size: number; uploadedAt: string; status: 'unverified' | 'verified' | 'mismatch'; reviewReason?: string; reviewerId?: string; previousVersionId?: string; fields?: Record<string, string | number> }
export interface PilotApplication { studentId: string; schemeId: string; academicYear: string; status: ApplicationStatus | 'withdrawn' | 'appealed'; documentIds: string[]; profileSnapshot?: Student; ruleSnapshot?: Scheme; eligibility?: unknown; submittedAt?: string; returnStage?: ApplicationStatus; sanctionedAmount?: number; disbursedAmount?: number; dbtStatus?: 'pending' | 'successful' | 'failed'; rejectionReason?: string; receiptToken?: string; receiptHash?: string; signaturePath?: string; previousApplicationId?:string; eligibilityDelta?:unknown; withdrawalReason?:string; appealReason?:string; receiptRevokedAt?:string; receiptExpiresAt?:string }
export interface PilotDeficiency { applicationId: string; documentType: DocKey; reason: string; deadline: string; raisedBy: string; status: 'open' | 'corrected' | 'resolved'; correctionDocumentId?: string }
export interface PilotVerification { applicationId: string; source: string; state: string; reason: string; runId: string; createdAt: string; reviewerId?: string; simulated: boolean; adapter?:{source:string;mode:string;timestamp:string;requestId:string;reference:string|null;rawStatus:string} }
export interface PilotGrievance { studentId: string; category: string; subject: string; body: string; status: 'open' | 'in_review' | 'resolved'; assignedTo?: string; messages: { actorId: string; body: string; createdAt: string }[]; events?: {event:string;actorId:string;body:string;createdAt:string;changes?:unknown}[]; evidenceIds?:string[]; priority?:string; dueAt?:string; resolutionReason?: string; createdAt: string }
export interface PilotNotification { userId: string; title: string; body: string; category: string; createdAt: string; readAt?: string }
export interface PilotFamilyGrant { studentId: string; familyUserId: string; familyEmail?: string; active: boolean; grantedAt: string }
export interface PilotPayment { applicationId: string; amount: number; status: 'pending' | 'successful' | 'failed'; simulated: boolean; transactionId?: string; reason?: string; createdAt: string }
export interface PilotBaseline { state: string; district: string; academicYear: string; population: string; enrolled: number; beneficiaries?: number; sourceUrl: string; importedAt: string; synthetic: boolean }
export interface PilotSnapshot {
  pages?:Record<string,{page:number;search:string;hasMore:boolean;ids:string[]}>;
  metrics?:import('./analytics').PilotAnalytics;
  consents?: PilotRecord<{studentId:string;purpose:string;provider?:string;active:boolean;policyVersion:string;changedAt:string}>[];
  consentEvents?: PilotRecord<{purpose:string;active:boolean;recordedAt:string;consentVersion:number}>[];
  privacyPolicies?: PilotRecord<{days:Record<string,number>;reason:string;reviewDueAt:string}>[];
  account: PilotAccount;
  accounts: PilotAccount[];
  students: PilotRecord<Student>[];
  schemes: PilotRecord<Scheme & { academicYear: string; active: boolean; sanctionAmount: number }>[];
  institutions: PilotRecord<{ name: string; state: string; district: string; inSchemeBasket: boolean; active?:boolean;deactivationReason?:string }>[];
  documents: PilotRecord<PilotDocument>[];
  applications: PilotRecord<PilotApplication>[];
  deficiencies: PilotRecord<PilotDeficiency>[];
  verifications: PilotRecord<PilotVerification>[];
  grievances: PilotRecord<PilotGrievance>[];
  grievanceCategories?: PilotRecord<{name:string;active:boolean;slaDays:number}>[];
  deliveries?: PilotRecord<{notificationId:string;userId:string;channel:string;event:string;status:string;providerId?:string;code?:string;retryAt:string;claimedAt?:string;attempts:{at:string;status:string;code:string;providerId?:string}[]}>[];
  schemeDrafts?: PilotRecord<{config:PilotSnapshot['schemes'][number]['data'];baseVersion:number;publishedAt?:string}>[];
  configurationHistory?: PilotRecord<{kind:string;entityId:string;configurationVersion:number;config:Record<string,unknown>;createdAt:string}>[];
  notifications: PilotRecord<PilotNotification>[];
  familyGrants: PilotRecord<PilotFamilyGrant>[];
  payments: PilotRecord<PilotPayment>[];
  baselines: PilotRecord<PilotBaseline>[];
  audit: PilotRecord<{ actorId: string; action: string; entityId: string; createdAt: string; detail?: unknown }>[];
  notes: PilotRecord<{ applicationId: string; actorId: string; body: string; createdAt: string }>[];
}
export interface PilotTarget { id: string; version: number }
export type PilotAction = 'save_profile' | 'register_document' | 'review_document' | 'save_draft' | 'submit_application' | 'run_verification' | 'review_verification' | 'raise_deficiency' | 'correct_deficiency' | 'approve_institute' | 'approve_department' | 'reject_application' | 'sanction' | 'request_payment' | 'payment_result' | 'create_grievance' | 'update_grievance' | 'mark_notification_read' | 'broadcast' | 'grant_family' | 'revoke_family' | 'add_note' | 'import_baselines' | 'save_scheme' | 'save_institution' | 'save_grievance_category' | 'revoke_receipt' | 'expire_receipt' | 'renew_application' | 'withdraw_application' | 'appeal_application' | 'resolve_appeal' | 'draft_scheme' | 'publish_scheme' | 'rollback_scheme' | 'dry_run_scheme' | 'deactivate_institution' | 'set_source_health';
export interface OfflineOperation { sequence?:number; id: string; userId: string; action: PilotAction; payload: Record<string, unknown>; target?: PilotTarget; createdAt: string; status: 'queued' | 'conflict' | 'failed'; error?: string; file?: Blob; fileName?: string; baseSnapshot?: Record<string, unknown>; attemptId?: string }
export type PilotLanguage = Extract<LangCode, 'en' | 'hi'>;
