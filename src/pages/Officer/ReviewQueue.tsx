import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/store/session';
import { useData, demoSanctionAmount } from '@/store/data';
import { approvalBlock } from '@/engines/verification';
import { Modal } from '@/components/ui';
import { SignaturePadModal } from '@/components/common/SignaturePadModal';
import { inrPretty, statusLabel } from '@/lib/format';
import { INSTITUTIONS } from '@/data/students';
import { csv, download } from '@/pilot/exports';
import { Icon } from '@/components/common/Icon';
import type { VerificationSource, DocKey, Application } from '@/types';

const SOURCE_LABEL: Record<VerificationSource, string> = {
  identity: 'Identity details',
  st_certificate: 'ST community certificate',
  income: 'Income certificate',
  institution: 'College enrolment',
  academic: 'Academic record',
};

export function ReviewQueue() {
  const data = useData();
  const user = useSession((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [deficiencyOpen, setDeficiencyOpen] = useState(false);
  const [docKey, setDocKey] = useState<DocKey>('st_certificate');
  const [reason, setReason] = useState('');
  const [deadline, setDeadline] = useState(() =>
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );
  const [error, setError] = useState('');
  const [signing, setSigning] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Synchronize URL search params with local search filter state
  useEffect(() => {
    const q = params.get('search');
    if (q !== null) {
      setSearch(q);
    }
  }, [params]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const stateOfficer = user?.role === 'nodal' || user?.role === 'admin' || user?.role === 'institution';
  const applications = data.applications;
  const pending = applications.filter(
    (a) => !['sanctioned', 'disbursed', 'rejected', 'deficiency'].includes(a.status)
  );
  const verified = applications.filter((a) => ['sanctioned', 'disbursed'].includes(a.status));
  const flagged = applications.filter((a) =>
    ['rejected', 'deficiency', 'manual_review'].includes(a.status)
  );

  const inspection = location.pathname === '/officer/inspection';
  const sanctioning = location.pathname === '/officer/sanction';
  const testing = location.pathname === '/officer/testing';

  const selected =
    applications.find((a) => a.id === params.get('application')) ??
    (inspection || sanctioning ? pending[0] ?? applications[0] : undefined);
  const student = data.students.find((s) => s.id === selected?.studentId) ?? data.students[0];
  const scheme = data.schemes.find((s) => s.id === selected?.schemeId) ?? data.schemes[0];
  const logs = data.verificationLogs.filter((l) => l.applicationId === selected?.id);
  const attached = data.documents.filter((d) => selected?.documentIds?.includes(d.id));
  const blocked = selected
    ? approvalBlock(selected, scheme, data.documents, data.verificationLogs)
    : null;

  const openApp = (app: Application) => {
    navigate(`/officer/inspection?application=${encodeURIComponent(app.id)}`);
  };

  /* ───────────────────────────────────────────────────────────────────────────
     VIEW 4: SERVICE TESTING / RESILIENCE CONSOLE (resilience-console.html)
  ─────────────────────────────────────────────────────────────────────────── */
  if (testing) {
    return (
      <div data-demo="sabotage-switchboard" data-od-id="resilience-console-main" className="space-y-6 relative">
        {toastMsg && (
          <div className="toast show" role="status">
            <Icon name="check" className="i-sm" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="page-head">
          <div>
            <div className="crumb">
              <span>Service testing</span>
              <Icon name="chevronRight" className="i-sm" />
              <span>Fault injection</span>
            </div>
            <h1 className="page-title" data-od-id="resilience-console-title">
              Tribal belt resilience console
            </h1>
            <p className="page-sub">
              Non-production sandbox · validates graceful offline degradation during remote network blackouts.
            </p>
          </div>
          <div className="page-actions">
            <span className="badge badge-amber">
              <span className="bdot" />
              Sandbox · not production
            </span>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => {
                (Object.keys(SOURCE_LABEL) as VerificationSource[]).forEach((source) =>
                  data.setSourceHealth(source, true)
                );
                showToast('Emergency reset: All sources restored');
              }}
            >
              <Icon name="refresh" className="i" />
              Restore All Sources
            </button>
          </div>
        </div>

        <div className="grid g-main" style={{ alignItems: 'start' }}>
          <div className="stack">
            <section className="card">
              <div className="card-h">
                <div>
                  <h2 className="h3">Chaos fault injection matrix</h2>
                  <p className="micro" style={{ marginTop: '3px' }}>
                    Simulate upstream database latency, timeouts and satellite packet drops.
                  </p>
                </div>
                <span className="badge badge-red">
                  {Object.values(data.sourceHealth).filter((h) => !h).length} active faults
                </span>
              </div>

              {/* Fault 1: UIDAI Identity */}
              <div className={`fault ${!data.sourceHealth.identity ? 'on' : ''}`}>
                <span className="fn">1</span>
                <div className="grow">
                  <div className="flex between gap12 center">
                    <div className="ft">UIDAI Aadhaar vault timeout</div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!data.sourceHealth.identity}
                        onChange={() => data.setSourceHealth('identity', !data.sourceHealth.identity)}
                        aria-label="Toggle UIDAI timeout"
                      />
                      <span className="tr" />
                    </label>
                  </div>
                  <div className="fd">Inject HTTP 504 gateway timeout on biometric handshake.</div>
                  <div className="fb">
                    <b>Fallback:</b> activates cached UID token with deferred sync.
                  </div>
                </div>
              </div>

              {/* Fault 2: Income e-District */}
              <div className={`fault ${!data.sourceHealth.income ? 'on' : ''}`}>
                <span className="fn">2</span>
                <div className="grow">
                  <div className="flex between gap12 center">
                    <div className="ft">State Revenue Income API Outage</div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!data.sourceHealth.income}
                        onChange={() => data.setSourceHealth('income', !data.sourceHealth.income)}
                        aria-label="Toggle Income API"
                      />
                      <span className="tr" />
                    </label>
                  </div>
                  <div className="fd">Simulate State e-District income source unreachable.</div>
                  <div className="fb">
                    <b>Fallback:</b> holds application for authorized manual officer inspection.
                  </div>
                </div>
              </div>

              {/* Fault 3: ST Caste Certificate */}
              <div className={`fault ${!data.sourceHealth.st_certificate ? 'on' : ''}`}>
                <span className="fn">3</span>
                <div className="grow">
                  <div className="flex between gap12 center">
                    <div className="ft">State ST Registry Satellite Loss</div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!data.sourceHealth.st_certificate}
                        onChange={() => data.setSourceHealth('st_certificate', !data.sourceHealth.st_certificate)}
                        aria-label="Toggle ST Registry"
                      />
                      <span className="tr" />
                    </label>
                  </div>
                  <div className="fd">Simulate 40% connection drop in remote hilly terrain.</div>
                  <div className="fb">
                    <b>Fallback:</b> local IndexedDB certificate vault serves signed copies.
                  </div>
                </div>
              </div>

              {/* Fault 4: College Enrolment */}
              <div className={`fault ${!data.sourceHealth.institution ? 'on' : ''}`}>
                <span className="fn">4</span>
                <div className="grow">
                  <div className="flex between gap12 center">
                    <div className="ft">College ERP Academic Vault Latency</div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!data.sourceHealth.institution}
                        onChange={() => data.setSourceHealth('institution', !data.sourceHealth.institution)}
                        aria-label="Toggle College ERP"
                      />
                      <span className="tr" />
                    </label>
                  </div>
                  <div className="fd">Trip circuit breaker on campus university server latency.</div>
                  <div className="fb">
                    <b>Fallback:</b> queues bonafide verification in signed local journal.
                  </div>
                </div>
              </div>

              <div className="card-b flex gap-3 flex-wrap pt-4">
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={() => data.setSourceHealth('income', false)}
                >
                  Kill Income API
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={() => data.setSourceHealth('identity', false)}
                >
                  Kill Aadhaar e-KYC
                </button>
                <Link className="btn btn-primary btn-sm ml-auto" to="/officer">
                  Open review queue
                </Link>
              </div>
            </section>
          </div>

          <aside className="stack">
            <section className="card">
              <div className="card-b p-5">
                <div className="eyebrow">Outage Rule</div>
                <h3 className="h3 mt-2">Outages do not decide an application</h3>
                <p className="micro text-[var(--muted)] mt-1">
                  An unavailable source puts the check on hold. It never silently approves or rejects the application. Human officer concurrence is mandated.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  /* ───────────────────────────────────────────────────────────────────────────
     VIEW 3: APPROVE SCHOLARSHIP / SANCTION (sanction-signing.html)
  ─────────────────────────────────────────────────────────────────────────── */
  if (sanctioning && selected) {
    const amountVal = selected.sanctionedAmount ?? demoSanctionAmount(selected.schemeId);
    return (
      <div data-od-id="sanction-signing-main" className="space-y-6 relative">
        {toastMsg && (
          <div className="toast show" role="status">
            <Icon name="check" className="i-sm" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="page-head">
          <div>
            <div className="crumb">
              <Link to={`/officer/inspection?application=${selected.id}`}>Case #{selected.id}</Link>
              <Icon name="chevronRight" className="i-sm" />
              <span>Sanction signing</span>
            </div>
            <h1 className="page-title" data-od-id="sanction-signing-title">
              Statutory digital sanction desk
            </h1>
            <p className="page-sub">
              IT Act 2000, Section 3 · Digital Signature Certificate execution for {student.name}.
            </p>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => showToast('Draft sanction order downloaded')}
            >
              <Icon name="download" className="i" />
              Download draft PDF
            </button>
          </div>
        </div>

        <div className="grid g-main" style={{ alignItems: 'start' }}>
          <div className="stack">
            {/* Sanction Order Manifest */}
            <section className="card">
              <div className="card-h">
                <div>
                  <h2 className="h3">Sanction order manifest</h2>
                  <p className="micro" style={{ marginTop: '3px' }}>
                    Order ref MOTA/SANCT/2026/JH-{selected.id.slice(0, 6)} · Latehar District Treasury
                  </p>
                </div>
                <span className="badge badge-amber">
                  <span className="bdot" />
                  Awaiting signature
                </span>
              </div>
              <div className="card-b">
                <div className="flex between center wrap gap12 pb-4 border-b border-[var(--line)]">
                  <div>
                    <div className="eyebrow">Expenditure commitment · annual</div>
                    <div className="amount mt-1">{inrPretty(amountVal)}</div>
                  </div>
                  <div className="right">
                    <div className="eyebrow">Sanction year</div>
                    <div className="h3 mt-1">2026-2027</div>
                  </div>
                </div>

                <div className="bars mt20" style={{ ['--max' as any]: 100 }}>
                  <div className="bar-row">
                    <span className="bar-label">Institute tuition fee</span>
                    <div className="bar-track">
                      <div className="bar" style={{ ['--v' as any]: 74 }} />
                    </div>
                    <span className="bar-value">74% · ₹98,000</span>
                  </div>
                  <div className="bar-row">
                    <span className="bar-label">Monthly maintenance &amp; mess</span>
                    <div className="bar-track">
                      <div className="bar green" style={{ ['--v' as any]: 18 }} />
                    </div>
                    <span className="bar-value">18% · ₹24,000</span>
                  </div>
                  <div className="bar-row">
                    <span className="bar-label">PVTG equipment / book grant</span>
                    <div className="bar-track">
                      <div className="bar" style={{ ['--v' as any]: 8, background: '#94A3B8' }} />
                    </div>
                    <span className="bar-value">8% · ₹10,000</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Beneficiary Route */}
            <section className="card">
              <div className="card-h">
                <h2 className="h3">Beneficiary disbursement route</h2>
                <span className="badge badge-green">Verified</span>
              </div>
              <div className="card-b" style={{ paddingTop: '8px' }}>
                <div className="keyline" style={{ padding: '13px 0' }}>
                  <span className="k" style={{ width: '172px' }}>Beneficiary</span>
                  <div className="grow">
                    <div className="v">{student.name} · son of {student.fatherName}</div>
                    <div className="micro" style={{ marginTop: '2px' }}>
                      {student.domicileDistrict}, Jharkhand · {student.isPVTG ? 'PVTG Tier-1' : 'ST'}
                    </div>
                  </div>
                </div>
                <div className="keyline" style={{ padding: '13px 0' }}>
                  <span className="k" style={{ width: '172px' }}>Target DBT account</span>
                  <div className="grow">
                    <div className="v mono">Bank of India · ••••9012</div>
                    <div className="micro" style={{ marginTop: '2px' }}>IFSC BKID0004910 · Mesra branch, Ranchi</div>
                  </div>
                  <span className="badge badge-green">NPCI active</span>
                </div>
              </div>
            </section>

            {/* Treasury Pipeline */}
            <section className="card">
              <div className="card-h">
                <h2 className="h3">PFMS treasury pipeline</h2>
              </div>
              <div className="card-b">
                <div className="grid g4 text-xs p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg">
                  <div>
                    <div className="font-bold text-[var(--green)]">✓ DWO concurrence</div>
                    <div className="text-[10px] text-[var(--meta)]">{user?.name}</div>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--blue)]">2. DSC token sign</div>
                    <div className="text-[10px] text-[var(--meta)]">Hardware FIPS</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-400">3. Treasury concurrence</div>
                    <div className="text-[10px] text-[var(--meta)]">Statutory audit</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-400">4. PFMS DBT release</div>
                    <div className="text-[10px] text-[var(--meta)]">Direct account credit</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Aside Signing Action */}
          <aside className="stack">
            <section className="card">
              <div className="card-b p-5 space-y-4">
                <div className="eyebrow">Execution desk</div>
                <h3 className="h3">Record Sanction Order</h3>
                <p className="micro text-[var(--muted)] leading-relaxed">
                  Signing confirms you have checked the four DigiLocker evidence records and that this application meets statutory criteria.
                </p>

                {selected.status === 'department_stage' && !selected.departmentApprovedAt && stateOfficer && (
                  <button
                    className="btn btn-primary btn-block"
                    disabled={!!blocked}
                    onClick={() => {
                      data.completeDeptVerification(selected.id, user?.name ?? 'Officer');
                      showToast('Department approval recorded.');
                    }}
                  >
                    Approve Department Stage
                  </button>
                )}

                {selected.signatureUrl && (
                  <div className="p-3 border border-[var(--line)] rounded-lg bg-[var(--surface-2)] text-center my-3">
                    <div className="eyebrow mb-2">Recorded Officer Signature</div>
                    <img
                      role="img"
                      alt={`Demo signature of ${user?.name ?? 'Officer'}`}
                      src={selected.signatureUrl}
                      style={{ maxHeight: '60px', margin: '0 auto' }}
                    />
                  </div>
                )}

                {stateOfficer && (
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={() => setSigning(true)}
                  >
                    <Icon name="signature" className="i" />
                    Sign demo sanction
                  </button>
                )}

                {(selected.status === 'sanctioned' || selected.signatureUrl) && stateOfficer && (
                  <button
                    className="btn btn-success btn-block"
                    type="button"
                    onClick={() => {
                      data.pushDbt(selected.id);
                      showToast('PFMS simulated disbursement initiated');
                    }}
                  >
                    Simulate PFMS disbursement
                  </button>
                )}

                <Link className="btn btn-secondary btn-block" to="/officer">
                  Back to queue
                </Link>
              </div>
            </section>
          </aside>
        </div>

        {signing && (
          <SignaturePadModal
            open
            onClose={() => setSigning(false)}
            onSign={(signature) => {
              data.sanctionApplication(selected.id, user?.name ?? 'Officer', signature);
              setSigning(false);
              showToast('Sanction order signed and sealed with DSC.');
            }}
            officerName={user?.name ?? 'Dr. K. Soren'}
            designation={user?.designation ?? 'Nodal Officer'}
            applicationId={selected.id}
            sanctionAmount={amountVal}
          />
        )}
      </div>
    );
  }

  /* ───────────────────────────────────────────────────────────────────────────
     VIEW 2: CASE INSPECTION (officer-case-inspection.html)
  ─────────────────────────────────────────────────────────────────────────── */
  if (inspection && selected) {
    const institutionObj = INSTITUTIONS.find((i) => i.id === student.institutionId) ?? INSTITUTIONS[0];
    const amountVal = selected.sanctionedAmount ?? demoSanctionAmount(selected.schemeId);
    return (
      <div data-od-id="officer-case-inspection-main" className="space-y-6 relative">
        {toastMsg && (
          <div className="toast show" role="status">
            <Icon name="check" className="i-sm" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="page-head">
          <div>
            <div className="crumb">
              <Link to="/officer">Review queue</Link>
              <Icon name="chevronRight" className="i-sm" />
              <span>Case #{selected.id}</span>
            </div>
            <h1 className="page-title" data-od-id="officer-case-inspection-title">
              Review {student.name}'s application
            </h1>
            <p className="page-sub">
              Case #{selected.id} · {institutionObj.name} · {student.tribe} ({student.isPVTG ? 'PVTG Tier-1' : 'ST'}) · SLA clock 24h remaining.
            </p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary" type="button" onClick={() => setDeficiencyOpen(true)}>
              <Icon name="alert" className="i" />
              Issue notice
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                attached.forEach((d) => data.reviewDocument(d.id, user?.name ?? 'Officer'));
                showToast('All evidence approved');
              }}
            >
              Approve evidence
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setSigning(true)}
            >
              <Icon name="signature" className="i" />
              Sign demo sanction
            </button>
          </div>
        </div>

        {/* Applicant Overview Card */}
        <section className="card" style={{ marginBottom: '16px' }}>
          <div className="card-b" style={{ padding: '18px 22px' }}>
            <div className="flex between center wrap gap16">
              <div className="flex center gap14">
                <span className="avatar avatar-lg">
                  {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <div className="flex center gap8 wrap">
                    <h2 className="h3">{student.name}</h2>
                    {student.isPVTG && <span className="badge badge-blue">PVTG tier-1</span>}
                    <span className="badge badge-amber">
                      <span className="bdot" />
                      Under review
                    </span>
                  </div>
                  <div className="micro" style={{ marginTop: '3px' }}>
                    {institutionObj.name} · {student.course}, 2nd year · Roll #2024-CSE-104
                  </div>
                </div>
              </div>
              <div className="flex gap24 wrap">
                <div>
                  <div className="eyebrow">Claimed sanction</div>
                  <div className="h4 num" style={{ marginTop: '3px' }}>
                    {inrPretty(amountVal)}
                  </div>
                </div>
                <div>
                  <div className="eyebrow">Submitted</div>
                  <div className="h4" style={{ marginTop: '3px' }}>
                    12 Oct 2026
                  </div>
                </div>
                <div>
                  <div className="eyebrow">SLA remaining</div>
                  <div className="h4" style={{ marginTop: '3px', color: 'var(--red)' }}>
                    24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence Checks and Aside */}
        <div className="grid g-main" style={{ alignItems: 'start' }}>
          <div className="stack">
            <section className="card">
              <div className="card-h">
                <div>
                  <h2 className="h3">DigiLocker vs stated data cross-examination</h2>
                  <p className="micro" style={{ marginTop: '3px' }}>
                    Automated verification against Government of Jharkhand state repositories.
                  </p>
                </div>
                <span className="badge badge-green">
                  <Icon name="check" className="i-sm" style={{ width: '9px', height: '9px' }} />
                  4 of 4 match
                </span>
              </div>

              {/* Evidence 1: Caste */}
              <div className="ev">
                <div className="ev-head">
                  <span className="ev-num">1</span>
                  <div className="grow">
                    <div className="flex between gap8 wrap">
                      <div className="h4">Tribal community &amp; PVTG classification</div>
                      <span className="badge badge-green">Perfect match</span>
                    </div>
                    <div className="micro" style={{ marginTop: '2px' }}>
                      Verified against state ST register and SDO Mahuadanr certificate.
                    </div>
                  </div>
                </div>
                <div className="ev-body">
                  <div className="ev-item">
                    <div className="el">Candidate claim</div>
                    <div className="ev-v">{student.tribe} Scheduled Tribe (PVTG Tier-1)</div>
                  </div>
                  <div className="ev-item">
                    <div className="el">DigiLocker record</div>
                    <div className="ev-v">Birhor · Cert #JH/ST/2023/88194 · SDO Mahuadanr</div>
                  </div>
                </div>
                <div className="ev-hash">SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4…</div>
              </div>

              {/* Evidence 2: Income */}
              <div className="ev">
                <div className="ev-head">
                  <span className="ev-num">2</span>
                  <div className="grow">
                    <div className="flex between gap8 wrap">
                      <div className="h4">Annual family gross income</div>
                      <span className="badge badge-green">Statutory pass</span>
                    </div>
                    <div className="micro" style={{ marginTop: '2px' }}>
                      Within the ₹2.50 lakh ceiling for full grant coverage.
                    </div>
                  </div>
                </div>
                <div className="ev-body">
                  <div className="ev-item">
                    <div className="el">Candidate claim</div>
                    <div className="ev-v">{inrPretty(student.familyIncome)} / year</div>
                  </div>
                  <div className="ev-item">
                    <div className="el">DigiLocker record</div>
                    <div className="ev-v">
                      {inrPretty(student.familyIncome)} · Revenue Circle Latehar · valid till Mar 2027
                    </div>
                  </div>
                </div>
                <div className="ev-hash">SHA-256 f482a014948a901ba8472910c0194821a810f821ba…</div>
              </div>

              {/* Evidence Logs with Re-run Verification */}
              <div className="p-4 border-t border-[var(--line)] space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                    Adapter Verification Logs
                  </h3>
                  <button
                    className="btn btn-secondary btn-sm"
                    type="button"
                    onClick={() => {
                      data.runVerification(selected.id);
                      showToast('Re-run verification executed against active registries');
                    }}
                  >
                    <Icon name="refresh" className="i-sm" />
                    Re-run verification
                  </button>
                </div>

                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-[var(--surface-2)] rounded border border-[var(--line)] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-[var(--ink)]">{SOURCE_LABEL[log.source]}</span>
                      <span className={`badge ${log.state === 'verified' ? 'badge-green' : 'badge-amber'}`}>
                        {statusLabel(log.state)}
                      </span>
                    </div>
                    <p className="text-[var(--muted)] mt-1">{log.reason}</p>
                    <div className="text-[10px] text-[var(--meta)] mt-1">Connector: {log.connector}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Aside Actions */}
          <aside className="stack">
            <section className="card">
              <div className="card-b p-5 space-y-4">
                <div className="eyebrow">Statutory Actions</div>
                <h3 className="h3">Officer Concurrence</h3>
                <p className="micro text-[var(--muted)] leading-relaxed">
                  {blocked ?? 'All automated cross-checks pass. You may endorse approval or raise an inquiry.'}
                </p>

                {selected.status === 'department_stage' && !selected.departmentApprovedAt && stateOfficer && (
                  <button
                    className="btn btn-primary btn-block"
                    disabled={!!blocked}
                    onClick={() => {
                      data.completeDeptVerification(selected.id, user?.name ?? 'Officer');
                      showToast('Department approval recorded.');
                    }}
                  >
                    Approve Department Stage
                  </button>
                )}

                {selected.status === 'sanctioned' && (
                  <button
                    className="btn btn-success btn-block"
                    type="button"
                    onClick={() => {
                      data.pushDbt(selected.id);
                      showToast('Simulate PFMS disbursement initiated');
                    }}
                  >
                    Simulate PFMS disbursement
                  </button>
                )}

                <Link
                  className="btn btn-primary btn-block"
                  to={`/officer/sanction?application=${selected.id}`}
                >
                  <Icon name="signature" className="i" />
                  Proceed to Sanction Order
                </Link>

                <button
                  className="btn btn-danger btn-block"
                  type="button"
                  onClick={() => setDeficiencyOpen(true)}
                >
                  Flag Document Deficiency
                </button>
              </div>
            </section>
          </aside>
        </div>

        {/* Deficiency Notice Modal */}
        <Modal
          open={deficiencyOpen}
          onClose={() => setDeficiencyOpen(false)}
          title="Request a document correction"
          wide
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!data.raiseDeficiency(selected.id, user?.name ?? 'Officer', docKey, reason, deadline)) {
                setError('Choose a document, explain the correction, and use a future deadline.');
                return;
              }
              setError('');
              setReason('');
              setDeficiencyOpen(false);
              showToast('Correction notice dispatched to scholar');
            }}
          >
            <p className="text-xs text-[var(--muted)]">
              Application: {selected.id}. Explain exactly what the scholar needs to change.
            </p>
            <div className="field">
              <label htmlFor="deficiencyDocKey">Document needing correction</label>
              <select
                id="deficiencyDocKey"
                aria-label="Document needing correction"
                className="select"
                value={docKey}
                onChange={(e) => setDocKey(e.target.value as DocKey)}
              >
                {scheme.requiredDocs.map((type) => (
                  <option key={type} value={type}>
                    {statusLabel(type)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="deficiencyDeadline">Correction deadline</label>
              <input
                id="deficiencyDeadline"
                aria-label="Correction deadline"
                type="date"
                required
                className="input"
                min={new Date().toISOString().slice(0, 10)}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="deficiencyReason">Deficiency reason</label>
              <textarea
                id="deficiencyReason"
                aria-label="Deficiency reason"
                required
                rows={3}
                className="textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specific guidance for the scholar..."
              />
            </div>
            {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setDeficiencyOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Confirm Deficiency Notice
              </button>
            </div>
          </form>
        </Modal>

        {signing && (
          <SignaturePadModal
            open
            onClose={() => setSigning(false)}
            onSign={(signature) => {
              data.sanctionApplication(selected.id, user?.name ?? 'Officer', signature);
              setSigning(false);
              showToast('Sanction order signed and sealed with DSC.');
            }}
            officerName={user?.name ?? 'Dr. K. Soren'}
            designation={user?.designation ?? 'Nodal Officer'}
            applicationId={selected.id}
            sanctionAmount={amountVal}
          />
        )}
      </div>
    );
  }

  /* ───────────────────────────────────────────────────────────────────────────
     VIEW 1: OFFICER REVIEW QUEUE (officer-review-queue.html)
  ─────────────────────────────────────────────────────────────────────────── */
  const visible = applications.filter((a) => {
    const s = data.students.find((st) => st.id === a.studentId);
    return (
      (filter === 'all' ||
        (filter === 'pending' ? pending : filter === 'verified' ? verified : flagged).includes(a)) &&
      `${a.id} ${s?.name ?? ''}`.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div data-od-id="officer-review-queue-main" className="space-y-6 relative">
      {toastMsg && (
        <div className="toast show" role="status">
          <Icon name="check" className="i-sm" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-head">
        <div>
          <div className="crumb">
            <span>Officer verification desk</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>Review queue</span>
          </div>
          <h1 className="page-title" data-od-id="officer-review-queue-title">
            Applications to review · Latehar
          </h1>
          <p className="page-sub">
            Supervising officer Dr. K. Soren, DWO Latehar. Review target 48 hours. Most urgent work is ranked first.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() =>
              download(
                'review-queue.csv',
                csv(
                  ['reference', 'student', 'status', 'scheme'],
                  visible.map((a) => [
                    a.id,
                    data.students.find((s) => s.id === a.studentId)?.name,
                    a.status,
                    a.schemeId,
                  ])
                )
              )
            }
          >
            <Icon name="download" className="i" />
            Export CSV
          </button>
          <Link
            className="btn btn-primary"
            to="/officer/inspection"
            data-od-id="officer-review-queue-primary-cta"
          >
            Start next review
            <Icon name="arrowRight" className="i" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-row" style={{ marginBottom: '16px' }}>
        <div className="kpi">
          <div className="lab">Active caseload</div>
          <div className="val">145</div>
          <div className="foot">
            <span className="delta up">
              <Icon name="check" className="i-sm" />
              84
            </span>{' '}
            verified / approved
          </div>
        </div>
        <div className="kpi">
          <div className="lab">SLA at risk · under 24h</div>
          <div className="val" style={{ color: 'var(--amber)' }}>
            12
          </div>
          <div className="foot">
            <span className="badge badge-amber" style={{ padding: '2px 5px', fontSize: '9px' }}>
              Expedite
            </span>{' '}
            action needed today
          </div>
        </div>
        <div className="kpi">
          <div className="lab">Discrepancies</div>
          <div className="val">14</div>
          <div className="foot">
            <span className="mut">Notice dispatched · awaiting cure</span>
          </div>
        </div>
        <div className="kpi">
          <div className="lab">Sanction pipeline</div>
          <div className="val">
            ₹1.92<em>Cr</em>
          </div>
          <div className="foot">
            <span className="badge badge-green" style={{ padding: '2px 5px', fontSize: '9px' }}>
              PFMS
            </span>{' '}
            ready for release
          </div>
        </div>
      </div>

      {/* Caseload Composition Section */}
      <section className="card">
        <div className="card-h" style={{ paddingBottom: '14px' }}>
          <div>
            <h2 className="h3">Caseload composition</h2>
            <p className="micro" style={{ marginTop: '3px' }}>
              145 cases · 58% already approved this cycle.
            </p>
          </div>
          <div className="seg" aria-label="Queue view">
            <button
              className={filter === 'all' ? 'on' : ''}
              type="button"
              onClick={() => setFilter('all')}
            >
              All cases
            </button>
            <button
              className={filter === 'pending' ? 'on' : ''}
              type="button"
              onClick={() => {
                setFilter('pending');
                showToast('Showing cases due within 24 hours');
              }}
            >
              SLA risk
            </button>
            <button
              className={filter === 'flagged' ? 'on' : ''}
              type="button"
              onClick={() => {
                setFilter('flagged');
                showToast('Showing discrepancy cases');
              }}
            >
              Discrepancies
            </button>
          </div>
        </div>
        <div className="card-b" style={{ paddingTop: '14px', paddingBottom: '14px' }}>
          <div className="compbar" role="img" aria-label="Approved 84 cases, under review 35, discrepancy 14, escalated 12">
            <span style={{ width: '58%', background: 'var(--green)' }} />
            <span style={{ width: '24%', background: 'var(--blue)' }} />
            <span style={{ width: '10%', background: 'var(--amber)' }} />
            <span style={{ width: '8%', background: '#94A3B8' }} />
          </div>
          <div className="complegend">
            <span className="cl">
              <i style={{ background: 'var(--green)' }} />
              Approved <b>84</b>
            </span>
            <span className="cl">
              <i style={{ background: 'var(--blue)' }} />
              Under review <b>35</b>
            </span>
            <span className="cl">
              <i style={{ background: 'var(--amber)' }} />
              Discrepancy <b>14</b>
            </span>
            <span className="cl">
              <i style={{ background: '#94A3B8' }} />
              SLA escalated <b>12</b>
            </span>
          </div>
        </div>
      </section>

      {/* Caseload Table Card */}
      <section className="card mt16">
        <div className="toolbar">
          <div className="search-inline">
            <Icon name="search" className="i-sm" />
            <input
              type="search"
              placeholder="Search scholar name, roll # or application ID…"
              aria-label="Search applications"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="tablewrap">
          <table className="tbl">
            <thead>
              <tr>
                <th scope="col">Applicant scholar</th>
                <th scope="col">Community</th>
                <th scope="col">Institution</th>
                <th scope="col">Grant amount</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((app) => {
                const s = data.students.find((st) => st.id === app.studentId);
                const inst = INSTITUTIONS.find((i) => i.id === s?.institutionId);
                return (
                  <tr key={app.id}>
                    <td>
                      <div className="font-semibold text-[var(--ink)]">{s?.name ?? 'Scholar'}</div>
                      <div className="font-mono text-[10px] text-[var(--meta)]">{app.id}</div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-[var(--ink)]">
                        {s?.tribe} Scheduled Tribe
                      </div>
                      <div className="text-[10px] text-[var(--muted)]">
                        {s?.domicileDistrict}, {s?.domicileState}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-[var(--ink)]">{inst?.name ?? 'BIT Mesra'}</div>
                      <div className="text-[10px] text-[var(--muted)]">{s?.course}</div>
                    </td>
                    <td>
                      <div className="text-xs font-mono font-semibold text-[var(--ink)]">
                        {inrPretty(app.sanctionedAmount ?? demoSanctionAmount(app.schemeId))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${['sanctioned', 'disbursed'].includes(app.status) ? 'badge-green' : 'badge-amber'}`}>
                        <span className="bdot" />
                        {statusLabel(app.status)}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-secondary btn-sm"
                        type="button"
                        aria-label={`Inspect & Review ${s?.name}`}
                        onClick={() => openApp(app)}
                      >
                        Inspect &amp; Review
                      </button>
                    </td>
                  </tr>
                );
              })}

              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Icon name="search" size={24} style={{ color: 'var(--meta)' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                        No applications found matching your criteria
                      </div>
                      <p className="micro" style={{ maxWidth: '40ch' }}>
                        No records match "{search}". Try searching for another scholar name or clear your filters.
                      </p>
                      <button
                        className="btn btn-secondary btn-sm"
                        type="button"
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                          setSearch('');
                          setFilter('all');
                        }}
                      >
                        Reset search &amp; filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
