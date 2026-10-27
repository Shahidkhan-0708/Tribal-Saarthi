import { create } from 'zustand';
import type {
  Application,
  AuditEntry,
  DocKey,
  Grievance,
  Notification,
  Scheme,
  Student,
  StudentDocument,
  VerificationLog,
} from '@/types';
import { SCHEMES } from '@/data/schemes';
import { STUDENTS } from '@/data/students';
import {
  APPLICATIONS,
  DOCUMENTS,
  VERIFICATION_LOGS,
  BANK_LAST4,
} from '@/data/applications';
import { dbRead, dbResetAll, dbWrite } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { runPipeline, approvalBlock, CONNECTORS, DEFAULT_SOURCE_HEALTH, type SourceHealth } from '@/engines/verification';
import { parseCertificateText, crossCheckDocument } from '@/engines/ocr';
import { INSTITUTIONS } from '@/data/students';

// ============================================================
// Master data store — the backend + database of the prototype.
// ============================================================

interface DataState {
  students: Student[];
  schemes: Scheme[];
  documents: StudentDocument[];
  applications: Application[];
  verificationLogs: VerificationLog[];
  notifications: Notification[];
  grievances: Grievance[];
  audit: AuditEntry[];
  sourceHealth: SourceHealth;
  isSyncing: boolean;
  syncWithBackend: () => Promise<void>;

  resetDemo: () => void;

  // student actions
  updateStudentIncome: (studentId: string, income: number) => void;
  submitApplication: (studentId: string, schemeId: string) => string | null;
  uploadDocument: (studentId: string, docKey: DocKey, title: string, ocrText: string) => string;
  resubmitDocument: (documentId: string, ocrText: string) => void;
  reviewDocument: (documentId: string, officer: string) => void;
  attachDocsToApplication: (applicationId: string, docIds: string[]) => boolean;

  // pipeline
  runVerification: (applicationId: string) => void;
  setSourceHealth: (source: keyof SourceHealth, up: boolean) => void;

  // officer actions
  resolveManualReview: (logId: string, reviewer: string, approve: boolean, note?: string) => void;
  completeInstituteVerification: (applicationId: string, officer: string) => void;
  completeDeptVerification: (applicationId: string, officer: string) => void;
  sanctionApplication: (applicationId: string, officer: string, signatureUrl: string) => boolean;
  pushDbt: (applicationId: string) => void;
  raiseDeficiency: (applicationId: string, officer: string, docKey: DocKey, reason: string, deadline: string) => boolean;
  correctDeficiency: (applicationId: string, documentId: string) => boolean;

  // notifications
  markRead: (notificationId: string) => void;
  pushNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'readAt'>) => void;
  broadcast: (officer: string, title: string, body: string, audience: 'all' | 'district' | 'deficiency', district: string) => number;

  // grievances
  createGrievance: (studentId: string, category: string, subject: string, body: string) => string;
  resolveGrievance: (id: string) => void;
}

const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'stu_mohan',
    title: 'Action required: ST certificate needs correction',
    body: 'Our simulated MP ST certificate registry could not match your date of birth. Your application has NOT been rejected — please upload a corrected certificate. A state nodal officer will review it.',
    channel: 'in_app',
    category: 'deficiency',
    severity: 'warning',
    createdAt: '2026-08-28T09:10:00+05:30',
  },
  {
    id: 'notif_2',
    userId: 'stu_asha',
    title: 'Application moved to Departmental verification',
    body: 'Your Top-Class scholarship application completed institute verification at BIT Mesra and is now with the state welfare department (typically 2–4 weeks).',
    channel: 'in_app',
    category: 'verification',
    severity: 'info',
    createdAt: '2026-09-03T14:25:00+05:30',
  },
  {
    id: 'notif_3',
    userId: 'stu_asha',
    title: 'PMS-ST 2025-26 disbursed',
    body: '₹35,000 was transferred via DBT (PFMS simulated) to your account …4821 on 30 Jan 2026.',
    channel: 'in_app',
    category: 'payment',
    severity: 'success',
    createdAt: '2026-01-30T12:00:00+05:30',
  },
  {
    id: 'notif_4',
    userId: 'stu_sunita',
    title: 'Income certificate pending verification',
    body: 'Your income certificate has been uploaded but the state e-District source has not confirmed it yet. No action needed from you right now.',
    channel: 'sms',
    category: 'verification',
    severity: 'info',
    createdAt: '2026-09-14T10:00:00+05:30',
  },
];

const SEED_GRIEVANCES: Grievance[] = [
  {
    id: 'grv_1',
    studentId: 'stu_mohan',
    category: 'Verification',
    subject: 'My ST certificate has the wrong DOB printed',
    body: 'The certificate issued in January shows year of birth 2005 instead of 2004. I have applied for a corrected copy from Mandla SDM office. Please do not reject my application.',
    status: 'in_review',
    createdAt: '2026-08-29T08:00:00+05:30',
    assignedTo: 'State Nodal Officer',
  },
  {
    id: 'grv_2',
    studentId: 'stu_sunita',
    category: 'Payment',
    subject: 'When will Class 11 scholarship be credited?',
    body: 'I applied in September. The institute verification is done. How long until disbursal?',
    status: 'open',
    createdAt: '2026-10-02T16:30:00+05:30',
  },
];

function isoNow(): string {
  return new Date().toISOString();
}

let counter = 0;
function uid(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter}`;
}

const rawStudents = dbRead<Student[]>('students', STUDENTS);
const initialStudents = Array.isArray(rawStudents) && rawStudents.length > 0 ? rawStudents : STUDENTS;
const initialApplications = dbRead<Application[]>('applications', APPLICATIONS).map((app) => ({ ...app, documentIds: app.documentIds ?? APPLICATIONS.find((seed) => seed.id === app.id)?.documentIds ?? [] }));

function withReuseCounts(documents: StudentDocument[], applications: Application[]): StudentDocument[] {
  return documents.map((doc) => ({ ...doc, reuseCount: applications.filter((app) => app.documentIds?.includes(doc.id)).length }));
}

export function demoSanctionAmount(schemeId: string): number {
  return schemeId === 'pms_st' ? 35000 : schemeId === 'top_class' ? 92000 : 37000;
}

export function broadcastRecipients(students: Student[], applications: Application[], audience: 'all' | 'district' | 'deficiency', district: string): Student[] {
  return students.filter((s) => audience === 'all' || (audience === 'district' ? s.domicileDistrict === district : applications.some((a) => a.studentId === s.id && a.status === 'deficiency')));
}

export const useData = create<DataState>((set, get) => ({
  students: initialStudents,
  schemes: SCHEMES,
  documents: withReuseCounts(dbRead<StudentDocument[]>('documents', DOCUMENTS), initialApplications),
  applications: initialApplications,
  verificationLogs: dbRead<VerificationLog[]>('vlogs', VERIFICATION_LOGS),
  notifications: dbRead<Notification[]>('notifs', SEED_NOTIFICATIONS),
  grievances: dbRead<Grievance[]>('grievances', SEED_GRIEVANCES),
  audit: dbRead<AuditEntry[]>('audit', []),
    sourceHealth: dbRead<SourceHealth>('source_health', DEFAULT_SOURCE_HEALTH),
  isSyncing: false,

  syncWithBackend: async () => {
    try {
      const { fetchBackendSnapshot, isConfigured } = await import('@/pilot/api');
      if (!isConfigured) return;
      useData.setState({ isSyncing: true });
      const snap = await fetchBackendSnapshot();

      const serverApps: Application[] = (snap.applications || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          studentId: d.studentId || '',
          schemeId: d.schemeId || '',
          academicYear: d.academicYear || '2026-27',
          status: d.status || 'submitted',
          documentIds: Array.isArray(d.documentIds) ? d.documentIds : [],
          submittedAt: d.submittedAt,
          sanctionedAmount: d.sanctionedAmount,
          disbursedAmount: d.disbursedAmount,
          dbtStatus: d.dbtStatus,
          signatureUrl: d.signaturePath,
          rejectionReason: d.rejectionReason,
          bankAccountLast4: d.profileSnapshot?.aadhaarLast4 || '4821',
          pfmsTransactionId: d.dbtTxnRef || (d.dbtStatus === 'successful' ? `PFMS-2026-${row.id.slice(0, 8).toUpperCase()}` : undefined),
          deficiency: d.deficiency,
        };
      });

      const serverStudents: Student[] = (snap.students || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          name: d.name || 'Scholar',
          gender: d.gender || 'F',
          dob: d.dob || '2004-01-01',
          aadhaarLast4: d.aadhaarLast4 || '4821',
          tribe: d.tribe || 'Santhal',
          isPVTG: Boolean(d.isPVTG),
          category: 'ST',
          familyIncome: Number(d.familyIncome || 100000),
          fatherName: d.fatherName || 'Parent',
          domicileState: d.domicileState || 'Jharkhand',
          domicileDistrict: d.domicileDistrict || 'Ranchi',
          homeVillage: d.homeVillage || 'Village',
          language: d.language || 'en',
          courseLevel: d.courseLevel || 'undergrad',
          course: d.course || 'B.Tech',
          institutionId: d.institutionId || 'inst_bit_mesra',
          year: d.year || '2',
          familyViewConsent: Boolean(d.familyViewConsent),
        };
      });

      const serverDocs: StudentDocument[] = (snap.documents || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          studentId: d.studentId || '',
          type: d.type || 'st_certificate',
          title: d.title || 'Official Document',
          version: Number(row.version || 1),
          uploadedAt: d.uploadedAt || new Date().toISOString(),
          status: d.status || 'verified',
          ocrText: d.title || 'Verified Digital Certificate',
          ocrFields: d.fields || {},
          reuseCount: serverApps.filter((a) => a.documentIds?.includes(row.id)).length,
        };
      });

      const serverSchemes: Scheme[] = (snap.schemes || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          name: d.name || row.id,
          shortName: d.shortName || d.name || row.id,
          portal: d.portal || 'NSP',
          ministry: d.ministry || 'Ministry of Tribal Affairs',
          courseLevels: d.courseLevels || ['undergrad'],
          amount: d.amount || `₹${d.sanctionAmount || 30000}`,
          benefits: d.benefits || ['Tuition support', 'Maintenance allowance'],
          deadline: d.deadline || '2026-11-30',
          requiredDocs: d.requiredDocs || ['st_certificate', 'income_certificate'],
          rules: d.rules || [],
          notes: d.notes || '',
          sanctionAmount: d.sanctionAmount || 30000,
        };
      });

      const serverGrievances: Grievance[] = (snap.grievances || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          studentId: d.studentId || '',
          category: d.category || 'General',
          subject: d.subject || 'Support Request',
          body: d.body || '',
          status: d.status || 'open',
          createdAt: d.createdAt || new Date().toISOString(),
          assignedTo: d.assignedTo,
        };
      });

      const serverNotifs: Notification[] = (snap.notifications || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          userId: d.userId || '',
          title: d.title || 'Update',
          body: d.body || '',
          channel: 'in_app' as const,
          category: (d.category as any) || 'info',
          severity: d.category === 'deficiency' ? ('warning' as const) : ('info' as const),
          createdAt: d.createdAt || new Date().toISOString(),
        };
      });

      const serverAudit: AuditEntry[] = (snap.audit || []).map((row: any) => {
        const d = row.data || {};
        return {
          id: row.id,
          actor: d.actorId || 'system',
          action: d.action || 'action',
          entity: d.entityId || 'system',
          ts: d.createdAt || new Date().toISOString(),
          detail: typeof d.detail === 'string' ? d.detail : JSON.stringify(d.detail || ''),
        };
      });

      const current = useData.getState();
      const mergedApps = [...serverApps, ...current.applications.filter((a) => !serverApps.some((sa) => sa.id === a.id))];
      const mergedStudents = [...serverStudents, ...current.students.filter((s) => !serverStudents.some((ss) => ss.id === s.id))];
      const mergedDocs = withReuseCounts(
        [...serverDocs, ...current.documents.filter((d) => !serverDocs.some((sd) => sd.id === d.id))],
        mergedApps
      );
      const mergedSchemes = [...serverSchemes, ...current.schemes.filter((sc) => !serverSchemes.some((ssc) => ssc.id === sc.id))];
      const mergedGrievances = [...serverGrievances, ...current.grievances.filter((g) => !serverGrievances.some((sg) => sg.id === g.id))];
      const mergedNotifs = [...serverNotifs, ...current.notifications.filter((n) => !serverNotifs.some((sn) => sn.id === n.id))];
      const mergedAudit = [...serverAudit, ...current.audit.filter((a) => !serverAudit.some((sa) => sa.id === a.id))];

      dbWrite('applications', mergedApps);
      dbWrite('students', mergedStudents);
      dbWrite('documents', mergedDocs);
      dbWrite('grievances', mergedGrievances);
      dbWrite('notifs', mergedNotifs);
      dbWrite('audit', mergedAudit);

      useData.setState({
        applications: mergedApps,
        students: mergedStudents,
        documents: mergedDocs,
        schemes: mergedSchemes,
        grievances: mergedGrievances,
        notifications: mergedNotifs,
        audit: mergedAudit,
        isSyncing: false,
      });
    } catch (e) {
      console.warn('Backend sync failed, maintaining local cache:', e);
      useData.setState({ isSyncing: false });
    }
  },

  resetDemo: () => {
    dbResetAll();
    const freshAudit = logAudit([], 'system', 'reset_demo', 'demo_state', 'Demo state reset to seed');
    set({
      students: STUDENTS,
      documents: withReuseCounts(DOCUMENTS, APPLICATIONS),
      applications: APPLICATIONS,
      verificationLogs: VERIFICATION_LOGS,
      notifications: SEED_NOTIFICATIONS,
      grievances: SEED_GRIEVANCES,
      audit: freshAudit,
      sourceHealth: DEFAULT_SOURCE_HEALTH,
    });
  },

  updateStudentIncome: (studentId, income) => {
    const students = get().students.map((s) => s.id === studentId ? { ...s, familyIncome: income } : s);
    dbWrite('students', students);
    set({ students });
  },

  submitApplication: (studentId, schemeId) => {
    const scheme = get().schemes.find((s) => s.id === schemeId);
    if (!scheme || !get().students.some((s) => s.id === studentId)) return null;
    const open = get().applications.find(
      (a) => a.studentId === studentId && a.schemeId === schemeId && a.status !== 'disbursed' && a.status !== 'rejected',
    );
    if (open) return null;
    const id = uid('app');
    const app: Application = {
      id,
      studentId,
      schemeId,
      academicYear: '2026-27',
      status: 'submitted',
      documentIds: scheme.requiredDocs.flatMap((type) => {
        const doc = get().documents.filter((d) => d.studentId === studentId && d.type === type).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0];
        return doc ? [doc.id] : [];
      }),
      submittedAt: isoNow(),
      bankAccountLast4: BANK_LAST4[studentId],
    };
    const applications = [...get().applications, app];
    dbWrite('applications', applications);
    const documents = withReuseCounts(get().documents, applications);
    dbWrite('documents', documents);
    set({ applications, documents, audit: logAudit(get().audit, studentId, 'submit_application', `application:${id}`, `scheme:${schemeId}`) });

    // auto-run the verification pipeline on submission
    get().runVerification(id);
    try {
      import('@/pilot/api').then(({ invoke, isConfigured }) => {
        if (isConfigured) {
          invoke('submit_application', { studentId, schemeId, academicYear: '2026-27' }).catch((e) =>
            console.warn('Backend workflow dispatch note:', e)
          );
        }
      });
    } catch {}
    return id;
  },

  uploadDocument: (studentId, docKey, title, ocrText) => {
    const id = uid('doc');
    const doc: StudentDocument = {
      id,
      studentId,
      type: docKey,
      title,
      version: 1 + Math.max(0, ...get().documents.filter((d) => d.studentId === studentId && d.type === docKey).map((d) => d.version)),
      uploadedAt: isoNow(),
      status: 'unverified',
      ocrText,
      ocrFields: parseCertificateText(ocrText),
      reuseCount: 0,
    };
    const documents = [...get().documents, doc];
    dbWrite('documents', documents);
    set({ documents, audit: logAudit(get().audit, studentId, 'upload_document', `document:${id}`) });
    return id;
  },

  resubmitDocument: (documentId, ocrText) => {
    const doc = get().documents.find((d) => d.id === documentId);
    if (!doc || !ocrText.trim()) return;
    const student = get().students.find((s) => s.id === doc.studentId);
    if (!student) return;
    const check = crossCheckDocument({ ...doc, ocrFields: parseCertificateText(ocrText) }, student);
    // shortcut: demo edits a document version in place; use immutable file versions for the pilot.
    const documents = get().documents.map((d) =>
      d.id === documentId
        ? {
            ...d,
            version: d.version + 1,
            ocrText,
            ocrFields: parseCertificateText(ocrText),
            uploadedAt: isoNow(),
            status: check.verdict === 'mismatch' ? 'mismatch' as const : 'unverified' as const,
            verifiedAt: undefined,
            discrepancy: check.discrepancies.join('; ') || undefined,
          }
        : d,
    );
    dbWrite('documents', documents);

    // If student had an application stuck in deficiency, clear it and advance back to verification
    if (doc && check.verdict === 'match') {
      const studentApps = get().applications.filter(
        (a) => a.studentId === doc.studentId && a.status === 'deficiency' && a.deficiency?.docKey === doc.type && a.documentIds?.includes(doc.id),
      );
      if (studentApps.length > 0) {
        const applications = get().applications.map((a) =>
          studentApps.some((app) => app.id === a.id)
            ? { ...a, status: 'submitted' as const, deficiency: undefined }
            : a,
        );
        dbWrite('applications', applications);
        set({ applications });

        set({ documents });
      }
    }

    set({
      documents,
      audit: logAudit(
        get().audit,
        'student',
        'resubmit_document',
        `document:${documentId}`,
        'version incremented · awaiting review',
      ),
    });
    get().applications.filter((a) => a.documentIds?.includes(documentId)).forEach((a) => get().runVerification(a.id));
  },

  attachDocsToApplication: (applicationId, docIds) => {
    const app = get().applications.find((a) => a.id === applicationId);
    if (!app || ['sanctioned', 'disbursed', 'rejected'].includes(app.status)) return false;
    const ids = [...new Set(docIds)];
    const attached = ids.map((id) => get().documents.find((d) => d.id === id));
    if (attached.some((d) => !d || d.studentId !== app.studentId) || new Set(attached.map((d) => d!.type)).size !== ids.length) return false;
    const applications = get().applications.map((a) => a.id === applicationId ? { ...a, documentIds: ids } : a);
    const documents = withReuseCounts(get().documents, applications);
    dbWrite('applications', applications);
    dbWrite('documents', documents);
    set({
      applications,
      documents,
      audit: logAudit(get().audit, 'student', 'attach_documents', `application:${applicationId}`, docIds.join(',')),
    });
    get().runVerification(applicationId);
    return true;
  },

  reviewDocument: (documentId, officer) => {
    const documents = get().documents.map((d) => d.id === documentId ? { ...d, status: 'verified' as const, verifiedAt: isoNow() } : d);
    dbWrite('documents', documents);
    set({ documents, audit: logAudit(get().audit, officer, 'review_document', `document:${documentId}`, 'Human review in demo; no government verification') });
    get().applications.filter((a) => a.documentIds?.includes(documentId)).forEach((a) => get().runVerification(a.id));
  },

  runVerification: (applicationId) => {
    const app = get().applications.find((a) => a.id === applicationId);
    if (!app || ['sanctioned', 'disbursed', 'rejected'].includes(app.status)) return;
    const student = get().students.find((s) => s.id === app.studentId);
    if (!student) return;

    const docs = get().documents.filter((d) => d.studentId === student.id && app.documentIds?.includes(d.id));
    const knownInstitutions = INSTITUTIONS.map((i) => i.id);
    const result = runPipeline(
      applicationId,
      docs,
      { aadhaarLast4: student.aadhaarLast4, institutionId: student.institutionId },
      knownInstitutions,
      get().sourceHealth,
    );

    const droppedOld = get().verificationLogs.filter((v) => v.applicationId !== applicationId);
    const verificationLogs = [...droppedOld, ...result.logs];
    dbWrite('vlogs', verificationLogs);

    const verificationReturnStage = app.status === 'department_stage' ? 'department_stage' : app.verificationReturnStage ?? 'institute_stage';
    const status: Application['status'] = app.deficiency ? 'deficiency' : result.outcome === 'blocked_pending' ? 'pending_verification' : result.outcome === 'exceptions' ? 'manual_review' : verificationReturnStage;

    set({
      verificationLogs,
      audit: logAudit(
        get().audit,
        'verification_engine',
        'run_pipeline',
        `application:${applicationId}`,
        `outcome:${result.outcome} checks:${result.logs.length}`,
      ),
    });

    // surface notifications for exceptions & pending
    result.logs
      .filter((l) => l.state === 'manual_review' || l.state === 'source_down')
      .forEach((l) => {
        get().pushNotification({
          userId: student.id,
          title: l.state === 'source_down' ? `${l.connector} unreachable` : 'Verification needs officer review',
          body: l.reason,
          channel: 'in_app',
          category: 'verification',
          severity: l.state === 'source_down' ? 'warning' : 'info',
        });
      });

    // update app status if changed
    const applications = get().applications.map((a) => (a.id === applicationId ? { ...a, status, verificationReturnStage, departmentApprovedAt: undefined } : a));
    dbWrite('applications', applications);
    set({ applications });
  },

  setSourceHealth: (source, up) => {
    const health = { ...get().sourceHealth, [source]: up };
    dbWrite('source_health', health);
    set({ sourceHealth: health, audit: logAudit(get().audit, 'demo_operator', 'set_source_health', `connector:${source}`, up ? 'up' : 'down') });
  },

  resolveManualReview: (logId, reviewer, approve, note) => {
    const log = get().verificationLogs.find((v) => v.id === logId);
    if (!log || !['manual_review', 'mismatch'].includes(log.state)) return;
    const app = get().applications.find((a) => a.id === log.applicationId);
    if (!app || ['sanctioned', 'disbursed', 'rejected'].includes(app.status)) return;
    const verificationLogs = get().verificationLogs.map((v) =>
      v.id === logId
        ? {
            ...v,
            state: approve ? ('verified' as const) : ('mismatch' as const),
            reason: approve ? `Approved after manual review — ${note ?? log.reason}` : `Rejected after manual review — ${note ?? log.reason}`,
            reviewer,
            resolvedAt: isoNow(),
          }
        : v,
    );
    dbWrite('vlogs', verificationLogs);
    const type = log.source === 'st_certificate' ? 'st_certificate' : log.source === 'income' ? 'income_certificate' : log.source === 'academic' ? 'marksheet' : undefined;
    const documents = get().documents.map((d) => type && app.documentIds?.includes(d.id) && d.type === type ? { ...d, status: approve ? 'verified' as const : 'mismatch' as const, verifiedAt: approve ? isoNow() : undefined } : d);
    dbWrite('documents', documents);
    set({ verificationLogs, documents, audit: logAudit(get().audit, reviewer, approve ? 'approve_review' : 'reject_review', `verification:${logId}`, note) });

    // if approved and all other checks for this app are verified → advance to department stage
    const appLogs = get().verificationLogs.filter((v) => v.applicationId === log.applicationId);
    const allDone = Object.keys(CONNECTORS).every((source) => appLogs.some((v) => v.source === source && !v.stage && v.state === 'verified')) && appLogs.filter((v) => !v.stage).every((v) => v.state === 'verified');
    const status: Application['status'] = app.deficiency ? 'deficiency' : appLogs.some((v) => v.state === 'source_down') ? 'pending_verification' : allDone ? app.verificationReturnStage ?? 'institute_stage' : 'manual_review';
    const applications = get().applications.map((a) => a.id === app.id ? { ...a, status } : a);
    dbWrite('applications', applications);
    set({ applications });
  },

  completeInstituteVerification: (applicationId, officer) => {
    const app = get().applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'institute_stage' || approvalBlock(app, get().schemes.find((s) => s.id === app.schemeId), get().documents, get().verificationLogs)) return;
    const applications = get().applications.map((a) =>
      a.id === applicationId && a.status === 'institute_stage' ? { ...a, status: 'department_stage' as const, verificationReturnStage: 'department_stage' as const } : a,
    );
    dbWrite('applications', applications);
    set({ applications, audit: logAudit(get().audit, officer, 'institute_verified', `application:${applicationId}`) });

    // mark pending academic log verified
    const verificationLogs = get().verificationLogs.map((v) =>
      v.applicationId === applicationId && v.state === 'pending' && v.source === 'academic'
        ? { ...v, state: 'verified' as const, reason: 'Institute verification completed by nodal officer', reviewer: officer, resolvedAt: isoNow() }
        : v,
    );
    dbWrite('vlogs', verificationLogs);
    set({ verificationLogs });
  },

  completeDeptVerification: (applicationId, officer) => {
    const app = get().applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'department_stage' || approvalBlock(app, get().schemes.find((s) => s.id === app.schemeId), get().documents, get().verificationLogs)) return;
    const applications = get().applications.map((a) =>
      a.id === applicationId ? { ...a, departmentApprovedAt: isoNow() } : a,
    );
    dbWrite('applications', applications);
    set({ applications, audit: logAudit(get().audit, officer, 'dept_verified', `application:${applicationId}`) });
    const verificationLogs = get().verificationLogs.map((v) => v.applicationId === applicationId && v.stage === 'department' ? { ...v, state: 'verified' as const, reviewer: officer, resolvedAt: isoNow(), reason: 'Department verification completed' } : v);
    dbWrite('vlogs', verificationLogs);
    set({ verificationLogs });
  },

  sanctionApplication: (applicationId, officer, signatureUrl) => {
    const app = get().applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'department_stage' || !app.departmentApprovedAt || !officer.trim() || !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(signatureUrl) || signatureUrl.length > 200000 || approvalBlock(app, get().schemes.find((s) => s.id === app.schemeId), get().documents, get().verificationLogs)) return false;
    const amount = demoSanctionAmount(app.schemeId);
    const applications = get().applications.map((a) =>
      a.id === applicationId ? { ...a, status: 'sanctioned' as const, sanctionedAmount: amount, signatureUrl, signedBy: officer, signedAt: isoNow(), dbtStatus: 'pending' as const } : a,
    );
    dbWrite('applications', applications);
    set({ applications, audit: logAudit(get().audit, officer, 'sanction_application', `application:${applicationId}`, `amount:₹${amount} · demo signature stored`) });
    try {
      import('@/pilot/api').then(({ invoke, isConfigured }) => {
        if (isConfigured) {
          invoke('sanction', { applicationId, signatureUrl, sanctionedAmount: amount }).catch((e) =>
            console.warn('Backend sanction dispatch note:', e)
          );
        }
      });
    } catch {}
    return true;
  },

  pushDbt: (applicationId) => {
    const app = get().applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'sanctioned' || !app.signatureUrl || !app.sanctionedAmount) return;
    const hasSourceDown = get().verificationLogs.some((l) => l.applicationId === applicationId && l.state === 'source_down');
    if (hasSourceDown) {
      console.warn('[Workflow Engine Lock] Cannot disburse payment: active source_down block exists.');
      return;
    }
    const applications = get().applications.map((a) =>
      a.id === applicationId ? { ...a, status: 'disbursed' as const, disbursedAmount: a.sanctionedAmount, dbtStatus: 'successful' as const, dbtDate: isoNow(), pfmsTransactionId: uid('SIM_PFMS') } : a,
    );
    dbWrite('applications', applications);
    set({ applications, audit: logAudit(get().audit, 'pfms_connector', 'dbt_transfer', `application:${applicationId}`, 'PFMS (SIMULATED)') });
  },

  raiseDeficiency: (applicationId, officer, docKey, reason, deadline) => {
    const app = get().applications.find((a) => a.id === applicationId);
    const scheme = get().schemes.find((s) => s.id === app?.schemeId);
    const allowed = scheme?.requiredDocs.includes(docKey) || get().documents.some((d) => app?.documentIds?.includes(d.id) && d.type === docKey);
    if (!app || !allowed || ['sanctioned', 'disbursed', 'rejected'].includes(app.status) || !reason.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(deadline) || Number.isNaN(Date.parse(deadline)) || new Date(deadline).toISOString().slice(0, 10) !== deadline || deadline < isoNow().slice(0, 10)) return false;
    const attachedDoc = get().documents.find((d) => app.documentIds?.includes(d.id) && d.type === docKey);
    const applications = get().applications.map((a) =>
      a.id === applicationId
        ? {
            ...a,
            status: 'deficiency' as const,
            verificationReturnStage: app.status === 'department_stage' ? 'department_stage' as const : app.verificationReturnStage,
            departmentApprovedAt: undefined,
            deficiency: {
              docKey,
              reason: reason.trim(),
              deadline,
              raisedBy: officer,
              documentId: attachedDoc?.id,
              documentVersion: attachedDoc?.version,
            },
          }
        : a,
    );
    dbWrite('applications', applications);
    set({
      applications,
      audit: logAudit(get().audit, officer, 'raise_deficiency', `application:${applicationId}`, `${docKey}: ${reason} · due ${deadline}`),
    });
    get().pushNotification({
      userId: app.studentId,
      title: 'Action required: Document deficiency flagged',
      body: `${docKey}: "${reason}". Upload a correction by ${deadline} in your Document Wallet.`,
      channel: 'in_app',
      category: 'deficiency',
      severity: 'warning',
    });
    return true;
  },

  correctDeficiency: (applicationId, documentId) => {
    const app = get().applications.find((a) => a.id === applicationId);
    const doc = get().documents.find((d) => d.id === documentId);
    if (!app || app.status !== 'deficiency' || !app.deficiency || !doc || doc.studentId !== app.studentId || doc.type !== app.deficiency.docKey || doc.status === 'mismatch' || (doc.id === app.deficiency.documentId && doc.version <= (app.deficiency.documentVersion ?? 0))) return false;
    const ids = (app.documentIds ?? []).filter((id) => get().documents.find((d) => d.id === id)?.type !== doc.type);
    if (!get().attachDocsToApplication(app.id, [...ids, doc.id])) return false;
    const applications = get().applications.map((a) => a.id === app.id ? { ...a, status: 'submitted' as const, deficiency: undefined } : a);
    dbWrite('applications', applications);
    set({ applications, audit: logAudit(get().audit, doc.studentId, 'correct_deficiency', `application:${app.id}`, `document:${doc.id} v${doc.version} · awaiting review`) });
    get().runVerification(app.id);
    return true;
  },

  markRead: (notificationId) => {
    const notifications = get().notifications.map((n) =>
      n.id === notificationId ? { ...n, readAt: isoNow() } : n,
    );
    dbWrite('notifs', notifications);
    set({ notifications });
  },

  broadcast: (officer, title, body, audience, district) => {
    if (!title.trim() || !body.trim() || !['all', 'district', 'deficiency'].includes(audience)) return 0;
    const recipients = broadcastRecipients(get().students, get().applications, audience, district);
    recipients.forEach((student) => get().pushNotification({ userId: student.id, title: `[DEMO NOTICE] ${title.trim()}`, body: body.trim(), channel: 'in_app', category: 'info', severity: audience === 'deficiency' ? 'warning' : 'info' }));
    set({ audit: logAudit(get().audit, officer, 'broadcast', 'notifications', `${audience} ${district} · ${recipients.length} in-app notices · no SMS/IVR sent`) });
    return recipients.length;
  },

  pushNotification: (n) => {
    const item: Notification = { ...n, id: uid('notif'), createdAt: isoNow() };
    const notifications = [item, ...get().notifications];
    dbWrite('notifs', notifications);
    set({ notifications });
  },

  createGrievance: (studentId, category, subject, body) => {
    const id = uid('grv');
    const g: Grievance = { id, studentId, category, subject, body, status: 'open', createdAt: isoNow() };
    const grievances = [...get().grievances, g];
    dbWrite('grievances', grievances);
    set({ grievances, audit: logAudit(get().audit, studentId, 'create_grievance', `grievance:${id}`) });
    try {
      import('@/pilot/api').then(({ invoke, isConfigured }) => {
        if (isConfigured) {
          invoke('create_grievance', { studentId, category, subject, body }).catch((e) =>
            console.warn('Backend grievance dispatch note:', e)
          );
        }
      });
    } catch {}
    return id;
  },

  resolveGrievance: (id) => {
    const grievances = get().grievances.map((g) => (g.id === id ? { ...g, status: 'resolved' as const } : g));
    dbWrite('grievances', grievances);
    set({ grievances, audit: logAudit(get().audit, 'officer', 'resolve_grievance', `grievance:${id}`) });
  },
}));

useData.subscribe((state, previous) => {
  if (state.audit !== previous.audit) dbWrite('audit', state.audit);
});
