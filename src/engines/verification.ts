import type {
  StudentDocument,
  VerificationLog,
  VerificationSource,
  VerificationState,
  Application,
  Scheme,
} from '@/types';

// ============================================================
// Multi-level Verification Pipeline
//
// Runs every application through five simulated government
// source connectors. THE CORE DESIGN PRINCIPLE (from research):
//
//   verified      → continue
//   mismatch      → route to HUMAN REVIEW — never auto-reject
//   source_down   → mark PENDING (not pass!) — route to review
//
// Every state transition is auditable and explainable.
// ============================================================

export interface Connector {
  source: VerificationSource;
  label: string;
  /** Display name of the simulated government system this adapts. */
  system: string;
}

export const CONNECTORS: Record<VerificationSource, Connector> = {
  identity: { source: 'identity', label: 'Identity Check', system: 'Aadhaar e-KYC (SIMULATED)' },
  st_certificate: { source: 'st_certificate', label: 'ST / PVTG Certificate', system: 'State ST Certificate DB (SIMULATED)' },
  income: { source: 'income', label: 'Income Certificate', system: 'State e-District (SIMULATED)' },
  institution: { source: 'institution', label: 'Institution Count', system: 'AISHE / Institute DB (SIMULATED)' },
  academic: { source: 'academic', label: 'Academic Record', system: 'Institution SSO (SIMULATED)' },
};

/** Demo switchboard: which simulated sources are up right now. */
export type SourceHealth = Record<VerificationSource, boolean>;

export const DEFAULT_SOURCE_HEALTH: SourceHealth = {
  identity: true,
  st_certificate: true,
  income: true,
  institution: true,
  academic: true,
};

export function approvalBlock(app: Application, scheme: Scheme | undefined, documents: StudentDocument[], logs: VerificationLog[]): string | null {
  if (app.deficiency) return 'Resolve the active document deficiency first.';
  if (!scheme) return 'Scheme configuration is missing.';
  for (const source of Object.keys(CONNECTORS) as VerificationSource[]) {
    const checks = logs.filter((v) => v.applicationId === app.id && v.source === source && !v.stage);
    if (!checks.length || checks.some((v) => v.state !== 'verified')) return `${CONNECTORS[source].label} must be verified.`;
  }
  for (const type of scheme.requiredDocs) {
    if (!documents.some((d) => app.documentIds?.includes(d.id) && d.studentId === app.studentId && d.type === type && d.status === 'verified')) return `${type.replace(/_/g, ' ')} must be attached and reviewed.`;
  }
  return null;
}

export interface PendingCheck {
  source: VerificationSource;
  log: VerificationLog;
}

export type PipelineOutcome = 'all_verified' | 'exceptions' | 'blocked_pending';

export interface PipelineResult {
  logs: VerificationLog[];
  outcome: PipelineOutcome;
  /** true if every check passed — only then does the app advance automatically */
  clean: boolean;
}

let _idCounter = 0;
function genId(prefix: string): string {
  _idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${_idCounter}`;
}

/** Does the wallet have a verified (or flagged) doc of this type? */
function findDoc(docs: StudentDocument[], type: string): StudentDocument | undefined {
  return docs.find((d) => d.type === type);
}

/**
 * Compare DB / document against what unified verification expects.
 * Simulated connector behavior:
 *   - st_certificate: certificate must exist and, if OCR ran, DOB/tribe must match
 *   - income:         certificate must exist & verified in wallet
 *   - identity:       aadhaar last-4 must be present in profile
 *   - institution:    institution must exist in our seeded registry
 *   - academic:       marksheet must exist
 */
export function runPipeline(
  applicationId: string,
  docs: StudentDocument[],
  profile: { aadhaarLast4: string; institutionId: string },
  knownInstitutions: string[],
  health: SourceHealth = DEFAULT_SOURCE_HEALTH,
  nowIso?: string,
): PipelineResult {
  const now = nowIso ?? new Date().toISOString();
  const logs: VerificationLog[] = [];
  let exceptions = 0;
  let pending = 0;

  const push = (
    source: VerificationSource,
    state: VerificationState,
    reason: string,
    reviewer?: string,
  ) => {
    logs.push({
      id: genId('vl'),
      applicationId,
      source,
      connector: CONNECTORS[source].system,
      state,
      reason,
      reviewer,
      createdAt: now,
      resolvedAt: state === 'verified' ? now : undefined,
    });
  };

  // 1. Identity (Aadhaar)
  if (!health.identity) {
    push('identity', 'source_down', 'Aadhaar e-KYC source unreachable — verification PENDING (not auto-passed)');
    pending += 1;
  } else if (profile.aadhaarLast4 && /^\d{4}$/.test(profile.aadhaarLast4)) {
    push('identity', 'verified', `Aadhaar demographic match OK (last-4 ${profile.aadhaarLast4})`);
  } else {
    push('identity', 'manual_review', 'Aadhaar details incomplete — routed to nodal officer');
    exceptions += 1;
  }

  // 2. ST / PVTG certificate
  const stDoc = findDoc(docs, 'st_certificate');
  if (!health.st_certificate) {
    push('st_certificate', 'source_down', 'State ST certificate DB unreachable — verification PENDING (not auto-passed)');
    pending += 1;
  } else if (!stDoc) {
    push('st_certificate', 'manual_review', 'No ST certificate in wallet — routed to nodal officer');
    exceptions += 1;
  } else if (stDoc.status === 'verified') {
    push('st_certificate', 'verified', `ST certificate ${stDoc.ocrFields.certificateNo ?? ''} validated against source registry`);
  } else if (stDoc.status === 'mismatch') {
    push(
      'st_certificate',
      'manual_review',
      `Certificate data mismatch (${stDoc.discrepancy ?? 'details differ'}) — routed to state nodal officer. Application NOT auto-rejected.`,
    );
    exceptions += 1;
  } else {
    push('st_certificate', 'manual_review', 'ST certificate uploaded but not yet source-verified');
    exceptions += 1;
  }

  // 3. Income certificate
  const incDoc = findDoc(docs, 'income_certificate');
  if (!health.income) {
    push('income', 'source_down', 'State e-District income source unreachable — verification PENDING (not auto-passed)');
    pending += 1;
  } else if (!incDoc) {
    push('income', 'manual_review', 'No income certificate in wallet — routed to nodal officer');
    exceptions += 1;
  } else if (incDoc.status === 'verified') {
    push('income', 'verified', `Income certificate ${incDoc.ocrFields.certificateNo ?? ''} cross-checked with issuing authority`);
  } else if (incDoc.status === 'mismatch') {
    push('income', 'manual_review', 'Income certificate data mismatch — manual review created');
    exceptions += 1;
  } else {
    push('income', 'manual_review', 'Income certificate not yet source-verified');
    exceptions += 1;
  }

  // 4. Institution
  const instOk = knownInstitutions.includes(profile.institutionId);
  if (!health.institution) {
    push('institution', 'source_down', 'AISHE source unreachable — verification PENDING (not auto-passed)');
    pending += 1;
  } else if (instOk) {
    push('institution', 'verified', 'Institution recognized in AISHE registry (simulated)');
  } else {
    push('institution', 'manual_review', 'Institution not in registry — routed to nodal officer');
    exceptions += 1;
  }

  // 5. Academic (marksheet)
  const msDoc = findDoc(docs, 'marksheet');
  if (!health.academic) {
    push('academic', 'source_down', 'Institution SSO unreachable — verification PENDING (not auto-passed)');
    pending += 1;
  } else if (msDoc && msDoc.status === 'verified') {
    push('academic', 'verified', 'Academic record matched with institution records');
  } else {
    push('academic', 'manual_review', 'Academic record pending institutional confirmation');
    exceptions += 1;
  }

  const outcome: PipelineOutcome =
    pending > 0 ? 'blocked_pending' : exceptions > 0 ? 'exceptions' : 'all_verified';

  return { logs, outcome, clean: exceptions === 0 && pending === 0 };
}
