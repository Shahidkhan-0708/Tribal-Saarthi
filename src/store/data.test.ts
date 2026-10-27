// @vitest-environment jsdom
import { beforeEach, expect, it } from 'vitest';
import { useData } from './data';
import { dbRead } from '@/lib/db';
import type { DocKey, Application, VerificationSource, AuditEntry } from '@/types';
import { approvalBlock } from '@/engines/verification';

beforeEach(() => useData.getState().resetDemo());
it.each<DocKey>(['st_certificate', 'income_certificate', 'marksheet'])('corrects only the selected %s deficiency and keeps review pending', (docKey) => {
  const data = useData.getState();
  expect(data.raiseDeficiency('app_asha_tc_2026', 'Officer', docKey, 'Upload a readable version', '2099-01-01')).toBe(true);
  const app = () => useData.getState().applications.find((a) => a.id === 'app_asha_tc_2026')!;
  expect(app().deficiency?.docKey).toBe(docKey);
  const wrong = data.documents.find((d) => d.studentId === 'stu_asha' && d.type !== docKey)!;
  expect(data.correctDeficiency(app().id, wrong.id)).toBe(false);
  const correction = data.uploadDocument('stu_asha', docKey, 'Corrected version', 'Name: Asha Kiran Ekka');
  expect(data.correctDeficiency(app().id, correction)).toBe(true);
  expect(app().deficiency).toBeUndefined();
  expect(app().status).not.toBe('sanctioned');
  expect(dbRead<Application[]>('applications', []).find((a) => a.id === app().id)?.deficiency).toBeUndefined();
});
it('rejects an unrelated document type, foreign correction and invalid deadline', () => {
  const data = useData.getState();
  expect(data.raiseDeficiency('app_asha_tc_2026', 'Officer', 'research_proposal', 'Missing', '2099-01-01')).toBe(false);
  expect(data.raiseDeficiency('app_asha_tc_2026', 'Officer', 'st_certificate', 'Missing', 'invalid')).toBe(false);
  expect(data.raiseDeficiency('app_asha_tc_2026', 'Officer', 'st_certificate', 'Missing', '2099-02-31')).toBe(false);
  data.raiseDeficiency('app_asha_tc_2026', 'Officer', 'st_certificate', 'Missing', '2099-01-01');
  expect(data.correctDeficiency('app_asha_tc_2026', 'doc_sunita_st')).toBe(false);
  expect(data.correctDeficiency('app_asha_tc_2026', 'doc_asha_st')).toBe(false);
});

it('persists distinct application-document links, deduplicates and recalculates reuse on replacement/removal', () => {
  useData.setState({ applications: [] });
  const data = useData.getState();
  const one = data.submitApplication('stu_asha', 'pms_st')!;
  const two = data.submitApplication('stu_asha', 'top_class')!;
  const count = (id: string) => useData.getState().documents.find((d) => d.id === id)!.reuseCount;
  expect(count('doc_asha_st')).toBe(2);
  expect(data.attachDocsToApplication(one, ['doc_asha_st', 'doc_asha_st'])).toBe(true);
  expect(count('doc_asha_st')).toBe(2);
  expect(data.attachDocsToApplication(one, ['doc_sunita_st'])).toBe(false);
  const replacement = data.uploadDocument('stu_asha', 'st_certificate', 'Replacement', 'Name: Asha Kiran Ekka');
  expect(useData.getState().documents.find((d) => d.id === replacement)?.version).toBe(2);
  data.attachDocsToApplication(one, [replacement]);
  expect(count('doc_asha_st')).toBe(1);
  expect(count(replacement)).toBe(1);
  data.attachDocsToApplication(two, []);
  expect(count('doc_asha_st')).toBe(0);
  expect(dbRead<Application[]>('applications', []).find((a) => a.id === one)?.documentIds).toEqual([replacement]);
});

it('routes source-down, mismatch and verified results deterministically and protects terminal states', () => {
  const data = useData.getState();
  const id = data.submitApplication('stu_asha', 'pms_st')!;
  const app = () => useData.getState().applications.find((a) => a.id === id)!;
  expect(app().status).toBe('institute_stage');
  data.setSourceHealth('income', false);
  data.runVerification(id);
  expect(app().status).toBe('pending_verification');
  expect(useData.getState().verificationLogs.some((v) => v.applicationId === id && v.state === 'source_down')).toBe(true);
  data.setSourceHealth('income', true);
  useData.setState({ documents: useData.getState().documents.map((d) => d.id === 'doc_asha_st' ? { ...d, status: 'mismatch' } : d) });
  data.runVerification(id);
  expect(app().status).toBe('manual_review');
  useData.setState({ documents: useData.getState().documents.map((d) => d.id === 'doc_asha_st' ? { ...d, status: 'verified' } : d) });
  data.runVerification(id);
  expect(app().status).toBe('institute_stage');
  data.runVerification('app_asha_pms_2025');
  expect(useData.getState().applications.find((a) => a.id === 'app_asha_pms_2025')?.status).toBe('disbursed');
});

it.each<VerificationSource>(['identity', 'st_certificate', 'income', 'institution', 'academic'])('blocks institute and department approvals with missing %s checks', (source) => {
  const data = useData.getState();
  const id = data.submitApplication('stu_asha', 'pms_st')!;
  const checks = useData.getState().verificationLogs;
  useData.setState({ verificationLogs: checks.filter((v) => v.applicationId !== id || v.source !== source) });
  const app = () => useData.getState().applications.find((a) => a.id === id)!;
  expect(approvalBlock(app(), data.schemes[0], data.documents, useData.getState().verificationLogs)).toContain('verified');
  data.completeInstituteVerification(id, 'Officer');
  expect(app().status).toBe('institute_stage');
  useData.setState({ applications: useData.getState().applications.map((a) => a.id === id ? { ...a, status: 'department_stage' } : a) });
  data.completeDeptVerification(id, 'Officer');
  expect(app().status).toBe('department_stage');
});
it('blocks missing required attachments and permits a fully reviewed institute stage', () => {
  const data = useData.getState();
  const id = data.submitApplication('stu_asha', 'pms_st')!;
  data.completeInstituteVerification(id, 'Officer');
  expect(useData.getState().applications.find((a) => a.id === id)?.status).toBe('department_stage');
  useData.setState({ documents: useData.getState().documents.filter((d) => d.id !== 'doc_asha_bank') });
  data.completeDeptVerification(id, 'Officer');
  expect(useData.getState().applications.find((a) => a.id === id)?.status).toBe('department_stage');
});

it('requires department approval and a signature, stores sanction across reload and pays only once', () => {
  const data = useData.getState();
  const id = data.submitApplication('stu_asha', 'pms_st')!;
  const app = () => useData.getState().applications.find((a) => a.id === id)!;
  const signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
  data.pushDbt(id);
  expect(app().status).toBe('institute_stage');
  expect(data.sanctionApplication(id, 'Officer', signature)).toBe(false);
  data.completeInstituteVerification(id, 'Officer');
  data.completeDeptVerification(id, 'Officer');
  expect(app().status).toBe('department_stage');
  expect(data.sanctionApplication(id, 'Officer', '')).toBe(false);
  expect(data.sanctionApplication(id, 'Officer', signature)).toBe(true);
  expect(app().status).toBe('sanctioned');
  expect(app().disbursedAmount).toBeUndefined();
  expect(dbRead<Application[]>('applications', []).find((a) => a.id === id)?.signatureUrl).toBe(signature);
  expect(dbRead<AuditEntry[]>('audit', []).some((entry) => entry.action === 'sanction_application' && entry.entity === `application:${id}`)).toBe(true);
  data.pushDbt(id);
  expect(app().status).toBe('disbursed');
  expect(app().disbursedAmount).toBe(app().sanctionedAmount);
  const transaction = app().pfmsTransactionId;
  data.pushDbt(id);
  expect(app().pfmsTransactionId).toBe(transaction);
});

it.each(['source_down', 'mismatch', 'pending'] as const)('blocks approval for an unresolved %s check', (state) => {
  const data = useData.getState();
  const id = data.submitApplication('stu_asha', 'pms_st')!;
  const log = useData.getState().verificationLogs.find((v) => v.applicationId === id && v.source === 'income')!;
  useData.setState({ verificationLogs: useData.getState().verificationLogs.map((v) => v.id === log.id ? { ...v, state } : v) });
  if (state === 'source_down') data.resolveManualReview(log.id, 'Officer', true);
  data.completeInstituteVerification(id, 'Officer');
  expect(useData.getState().applications.find((a) => a.id === id)?.status).toBe('institute_stage');
  expect(useData.getState().verificationLogs.find((v) => v.id === log.id)?.state).toBe(state);
});
it('correcting an unrelated document does not clear another document deficiency', () => {
  const data = useData.getState();
  data.raiseDeficiency('app_asha_tc_2026', 'Officer', 'income_certificate', 'Income unreadable', '2099-01-01');
  data.resubmitDocument('doc_asha_st', 'Name: Asha Kiran Ekka\nDOB: 12/05/2006\nTribe: Oraon');
  expect(useData.getState().applications.find((a) => a.id === 'app_asha_tc_2026')?.deficiency?.docKey).toBe('income_certificate');
});
