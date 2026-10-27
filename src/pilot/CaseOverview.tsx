import { ScholarOverview, type ChecklistItem } from '@/components/casefile/Casefile';
import type { PilotSnapshot } from './types';

export default function CaseOverview({ snapshot: s, navigate }: { snapshot: PilotSnapshot; navigate: (section: string) => void }) {
  const student = s.students.find(r => r.id === s.account.id);
  if (!student) return <section className="pilot-panel"><h1>Your pilot workspace</h1><p>Complete your student profile to start your scholarship application.</p><button onClick={() => navigate('profile')}>Complete your profile</button></section>;
  const applications = s.applications.filter(a => a.data.studentId === student.id);
  const application = applications.find(a => !['disbursed', 'rejected', 'withdrawn'].includes(a.data.status)) ?? applications[0];
  const scheme = s.schemes.find(r => r.id === application?.data.schemeId);
  const institution = s.institutions.find(r => r.id === student.data.institutionId);
  const documents = s.documents.filter(r => r.data.studentId === student.id);
  const record = (type: string): ChecklistItem['status'] => {
    const doc = documents.find(r => r.data.type === type);
    return !doc ? 'missing' : doc.data.status === 'verified' ? 'checked' : 'review';
  };
  return <><h2 className="case-sr-only">Your pilot workspace</h2><ScholarOverview name={student.data.name} scheme={scheme?.data.name ?? 'Find a scholarship'} academicYear={application?.data.academicYear ?? '2026–27'} application={application && { id: application.id, status: application.data.status }} amount={application?.data.sanctionedAmount ? `₹${application.data.sanctionedAmount.toLocaleString('en-IN')}` : scheme ? `₹${scheme.data.sanctionAmount.toLocaleString('en-IN')}` : 'See available schemes'} documents={[
    { title: 'Identity details', detail: `Aadhaar ending ${student.data.aadhaarLast4 || 'not provided'}`, status: record('aadhaar') },
    { title: 'ST community certificate', detail: `${student.data.tribe} community · ${student.data.domicileDistrict}`, status: record('st_certificate') },
    { title: 'Income certificate', detail: `Family income: ₹${student.data.familyIncome.toLocaleString('en-IN')} per year`, status: record('income_certificate') },
    { title: 'College enrolment', detail: `${institution?.data.name ?? 'Your institution'} · ${student.data.course}`, status: record('admission_proof') },
  ]} updates={s.notifications.slice(0, 2).map(r => ({ title: r.data.title, detail: r.data.body, time: new Date(r.data.createdAt).toLocaleString('en-IN') }))} navigate={section => navigate(section === 'history' ? 'applications' : section)} /></>;
}
