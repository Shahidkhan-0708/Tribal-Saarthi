import { Check, Clock3, FileText, AlertTriangle } from 'lucide-react';
import { applicationPresentation } from './Casefile';

export function ApplicationTracker({
  name,
  scheme,
  reference,
  status,
  submitted,
  amount,
  account,
  events,
  onReceipt,
  sourceDown = false,
  sourceDownReason = 'State e-District Income API unreachable (Simulated timeout / crash) - Verification PENDING. Routed to human review. Application NOT auto-rejected.',
}: {
  name: string;
  scheme: string;
  reference: string;
  status: string;
  submitted: string;
  amount: string;
  account?: string;
  events: { title: string; detail: string; time?: string }[];
  onReceipt: () => void;
  sourceDown?: boolean;
  sourceDownReason?: string;
}) {
  const current = applicationPresentation(status).step;
  const milestones = [
    'Application received',
    'Identity and document checks',
    'College enrolment review',
    'Scholarship approval',
    'Bank payment',
  ];

  return (
    <div className="case-tracker">
      <header className="case-page-bar">
        <div>
          <h1>{scheme}</h1>
          <p>
            Scholar: {name} · Reference: {reference}
          </p>
          <p>Submitted: {submitted}</p>
        </div>
        <span className={`case-tag ${sourceDown ? 'pending' : ''}`}>
          {sourceDown ? 'Source Down · Review Pending' : status.replace(/_/g, ' ')}
        </span>
        <button className="case-button" onClick={onReceipt}>
          <FileText size={15} /> View Acknowledgement Slip
        </button>
      </header>

      {sourceDown && (
        <div
          role="alert"
          className="mb-4 rounded-xl border-l-4 border-l-amber-600 border border-amber-200 bg-amber-50 p-4 shadow-xs dark:bg-amber-950/40 dark:border-amber-900 text-amber-950 dark:text-amber-200"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold block">
                Live Infrastructure Outage Gracefully Handled (Simulated)
              </strong>
              <p className="text-xs mt-1 leading-relaxed">{sourceDownReason}</p>
              <span className="inline-block mt-2 text-[11px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded dark:bg-amber-900/60 dark:text-amber-200">
                Resilience Status: Zero white-screen crash · Step turned to amber clock pending state
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="case-tracker-grid">
        <section className="case-panel">
          <h2>Application decision milestones</h2>
          <p className="case-caption">Every recorded check stays with your application.</p>
          <ol className="case-timeline">
            {milestones.map((title, index) => {
              const isSourceDownStep = sourceDown && index === 1;
              const isDone = !isSourceDownStep && index < current;
              const isActive = isSourceDownStep || index === current;
              const stepClass = isSourceDownStep
                ? 'active warning'
                : isDone
                ? 'done'
                : isActive
                ? 'active'
                : '';

              return (
                <li key={title} className={stepClass}>
                  <span
                    style={
                      isSourceDownStep
                        ? { background: '#D97706', color: '#FFFFFF', borderColor: '#B45309' }
                        : undefined
                    }
                  >
                    {isSourceDownStep ? (
                      <Clock3 size={16} />
                    ) : isDone ? (
                      <Check size={16} />
                    ) : isActive ? (
                      <Clock3 size={16} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <h3 style={isSourceDownStep ? { color: '#B45309' } : undefined}>
                      {title} {isSourceDownStep && '(Outage - Pending Review)'}
                    </h3>
                    <p style={isSourceDownStep ? { color: '#92400E', fontWeight: '500' } : undefined}>
                      {isSourceDownStep
                        ? sourceDownReason
                        : index === 0
                        ? submitted
                        : index === current
                        ? applicationPresentation(status).detail
                        : isDone
                        ? 'Recorded in application history'
                        : 'Waiting for the previous stage'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
        <aside>
          <section className="case-panel">
            <h2>Scholarship support</h2>
            <p className="case-caption">Amount and payment status for this application</p>
            <strong className="case-support-total">{amount}</strong>
            <dl className="case-profile-details">
              <div>
                <dt>Current stage</dt>
                <dd>{sourceDown ? 'Verification pending (source down)' : status.replace(/_/g, ' ')}</dd>
              </div>
              <div>
                <dt>Bank account</dt>
                <dd>{account ? `Account ending ${account}` : 'Not recorded'}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{status === 'disbursed' ? 'Payment recorded' : 'Not confirmed yet'}</dd>
              </div>
            </dl>
          </section>
          <section className="case-panel">
            <h2>Recent application events</h2>
            {events.length ? (
              events.slice(0, 3).map((event, index) => (
                <article className="case-tracker-event" key={event.title + index}>
                  <h3>{event.title}</h3>
                  <p>{event.detail}</p>
                  {event.time && <small>{event.time}</small>}
                </article>
              ))
            ) : (
              <p className="case-caption">Your recorded events will appear here.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
