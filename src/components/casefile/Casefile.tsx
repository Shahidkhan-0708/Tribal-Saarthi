import type { ReactNode } from 'react';
import { BookOpen, Check, Clock3, FileText, LockKeyhole, ShieldCheck } from 'lucide-react';
import type { ApplicationStatus } from '@/types';

export function GovernmentBanner({ children = 'Sample records · Local demonstration' }: { children?: ReactNode }) {
  return <div className="case-government"><span><span className="case-seal" />Tribe Saarthi · Scholarship support for tribal students</span><span><LockKeyhole size={14} />{children}</span></div>;
}

export function Brand({ children, onClick }: { children?: ReactNode; onClick?: () => void }) {
  return <div className="case-brand"><button type="button" className="case-monogram" onClick={onClick} aria-label={onClick ? 'Navigation menu' : 'Tribe Saarthi'}>TS</button><div><strong>Tribe Saarthi</strong><small>{children ?? 'Scholarship support for tribal students'}</small></div></div>;
}

export function AuthLayout({ children, recovery = false, language }: { children: ReactNode; recovery?: boolean; language?: ReactNode }) {
  return (
    <div className={`case-auth${recovery ? ' case-auth-recovery' : ''}`}>
      <div className="govstrip" role="region" aria-label="Official government website banner">
        <div className="l">
          <ShieldCheck size={13} style={{ stroke: '#94A3B8' }} />
          <span>Scholarship support for tribal students</span>
          <span style={{ color: '#64748B' }}>·</span>
          <b>Ministry of Tribal Affairs</b>
        </div>
        <div className="r">
          <span className="tag">
            <LockKeyhole size={12} style={{ stroke: '#94A3B8' }} />
            TLS 1.3
          </span>
          <span className="hide-sm" style={{ color: '#64748B' }}>Design preview</span>
        </div>
      </div>

      <div className="authwrap">
        <aside className="authaside">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="aside-mark">TS</div>
            <div className="eyebrow" style={{ color: '#94A3B8' }}>Tribe Saarthi · Scholar portal</div>
            <h1 className="display" style={{ marginTop: '14px' }}>A clearer path to your scholarship.</h1>
            <p className="sub">Apply, keep your documents together, and follow each decision from your college to your bank.</p>
            <ul className="authpoints">
              <li>
                <BookOpen size={18} />
                <div>
                  <b>Find the right scheme</b>
                  Understand the requirements before you apply.
                </div>
              </li>
              <li>
                <FileText size={18} />
                <div>
                  <b>Use your documents again</b>
                  Keep them ready for your next application.
                </div>
              </li>
              <li>
                <ShieldCheck size={18} />
                <div>
                  <b>Know what happens next</b>
                  See who is reviewing your application, and when payment begins.
                </div>
              </li>
            </ul>
          </div>
          <div className="aside-foot" style={{ position: 'relative', zIndex: 1 }}>
            <LockKeyhole size={12} style={{ stroke: '#94A3B8' }} />
            <span>Invite-only pilot · Sample account shown · Privacy and support</span>
          </div>
        </aside>

        <main className="authmain">
          <div className="authcard" data-od-id="auth-card">
            <div className="auth-brand">
              <span className="brand-mark">TS</span>
              <span>
                <span className="bn">Tribe Saarthi</span>
                <span className="bs">Scholarship support · MoTA</span>
              </span>
            </div>
            {children}
            <p className="authfoot" style={{ borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
              Sample account · This pilot preview connects to your active workspace.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function applicationPresentation(status?: string) {
  switch (status) {
    case 'draft': return { step: 0, title: 'Your application is ready to continue', detail: 'Check your profile and documents before you submit.' };
    case 'deficiency': return { step: 1, title: 'A document needs your attention', detail: 'Read the correction request and upload an updated document.' };
    case 'manual_review': return { step: 1, title: 'Your documents are being reviewed', detail: 'An officer will review the details that need a closer look.' };
    case 'department_stage': return { step: 2, title: 'Your application is awaiting approval', detail: 'College review is complete. Your application is with the welfare department.' };
    case 'sanctioned': return { step: 3, title: 'Your scholarship has been approved', detail: 'Approval is recorded. Payment has not been confirmed yet.' };
    case 'disbursed': return { step: 4, title: 'Your scholarship payment is complete', detail: 'View your application for the payment reference and receipt.' };
    case 'rejected': return { step: 1, title: 'A decision has been recorded', detail: 'Open your application to read the reason and available next steps.' };
    case 'appealed': return { step: 1, title: 'Your appeal is awaiting review', detail: 'An authorized officer will review the recorded appeal.' };
    case 'withdrawn': return { step: 0, title: 'Your application was withdrawn', detail: 'Open the application to review its history.' };
    case undefined: return { step: 0, title: 'Start your scholarship application', detail: 'Find a scheme, review the requirements, and keep your documents ready.' };
    default: return { step: 1, title: 'College review is in progress', detail: 'Your college will check your enrolment and application documents.' };
  }
}

export function Journey({ step }: { step: number }) {
  return <ol className="case-journey" aria-label="Application progress">{['Submitted', 'College review', 'Approval', 'Payment'].map((label, i) => <li key={label} className={i < step ? 'done' : i === step ? 'active' : ''} aria-current={i === step ? 'step' : undefined}><span>{i < step ? <Check size={16} /> : i === step ? <Clock3 size={16} /> : i + 1}</span><small><span className="desktop-only">{label}</span><span className="mobile-only">{['Applied', 'Review', 'Approval', 'Payment'][i]}</span></small></li>)}</ol>;
}

export interface ChecklistItem { title: string; detail: string; status: 'checked' | 'review' | 'missing' }
export interface CaseUpdate { title: string; detail?: string; time: string }
export function ScholarOverview({ name, scheme, academicYear, application, amount, documents, updates, navigate }: {
  name: string; scheme: string; academicYear: string; application?: { id: string; status: ApplicationStatus | 'withdrawn' | 'appealed' };
  amount: string; documents: ChecklistItem[]; updates: CaseUpdate[]; navigate: (page: 'applications' | 'documents' | 'assistant' | 'history' | 'schemes') => void;
}) {
  const state = applicationPresentation(application?.status);
  const checked = documents.filter(d => d.status === 'checked').length;
  const correction = application?.status === 'deficiency';
  return <div className="case-dashboard" data-demo="student-profile"><div className="case-mobile-greeting"><h2>Hello, {name.split(' ')[0]}.</h2><p>Here's where your scholarship stands.</p></div><section className="case-dashboard-hero"><div className="case-hero-main"><p>{name.split(' ')[0]}'s application · {scheme}, {academicYear}</p><h1><span className="desktop-only">{state.title}</span><span className="mobile-only">{application?.status === "department_stage" ? "Awaiting approval" : application?.status === "deficiency" ? "A document needs attention" : application?.status === "sanctioned" ? "Your scholarship is approved" : application?.status === "disbursed" ? "Scholarship payment complete" : state.title}</span></h1><p className="case-hero-detail"><span className="desktop-only">{state.detail}</span><span className="mobile-only">{correction?'Read your correction request below.':application?'Your next step stays here.':'Choose a scholarship to get started.'}</span></p><Journey step={state.step} /></div><aside className="case-next-action"><h2>{correction ? 'A correction is needed' : application ? 'Follow your next step here' : 'Find support for your studies'}</h2><p>{correction ? 'Your officer has explained what needs to change. Check the due date.' : 'We’ll tell you if the college needs a correction or another document.'}</p><button onClick={() => navigate(application ? 'applications' : 'schemes')}>{application ? 'View application' : 'Find a scholarship'}</button></aside><button className="case-mobile-application" onClick={() => navigate(application ? 'applications' : 'schemes')}>{application ? 'View application' : 'Find a scholarship'}</button></section><section className="case-fact-strip"><div><small>Scholarship support</small><strong>{amount}</strong><span>{application?.status === 'disbursed' ? 'Payment recorded' : 'Subject to approval'}</span></div><div><small>Documents ready</small><strong>{checked} of {documents.length} checked</strong></div><div><small>Application reference</small><strong>{application?.id ?? 'Not submitted yet'}</strong></div></section><div className="case-dashboard-bottom"><section className="case-checklist"><h2><span className="desktop-only">Your document checklist</span><span className="mobile-only">Your documents</span><small className="case-mobile-document-count mobile-only">{checked} of {documents.length} checked</small></h2><p><span className="desktop-only">One set of documents, kept with your application.</span><span className="mobile-only">{documents.find(d=>d.status!=='checked')?.title ?? 'Your documents'} {documents.some(d=>d.status!=='checked')?'needs review.':'are ready.'}</span></p><div className="case-document-rows">{documents.map(d => <div key={d.title}><span className={`case-status-icon ${d.status}`}>{d.status === 'checked' ? <Check size={16} /> : <Clock3 size={16} />}</span><section><h3>{d.title}</h3><p>{d.detail}</p></section><span className={`case-check-state ${d.status}`}>{d.status === 'checked' ? 'Checked' : d.status === 'missing' ? 'Needed' : 'In review'}</span></div>)}</div><p className="case-checklist-note">If a service is unavailable, your application waits for a person to review it.</p><button className="case-mobile-documents" onClick={() => navigate('documents')}>Open my documents</button></section><div className="case-dashboard-aside"><section className="case-recent"><h2>Recent updates</h2>{updates.length ? updates.slice(0, 2).map(update => <article key={update.title + update.time}><h3>{update.title}</h3>{update.detail && <p>{update.detail}</p>}<time>{update.time}</time></article>) : <p>Your application updates will appear here.</p>}<button onClick={() => navigate('history')}>View decision history</button></section><section className="case-assistant-card"><h2><span className="desktop-only">A little help from Saarthi</span><span className="mobile-only">Need a hand?</span></h2><p>Ask about documents, your application,<br className="desktop-only" /> or what happens next.</p><button onClick={() => navigate('assistant')}>Ask Saarthi</button></section></div></div></div>;
}
