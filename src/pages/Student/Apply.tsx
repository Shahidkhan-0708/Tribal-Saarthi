import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { dbRead, dbWrite } from '@/lib/db';
import { INSTITUTIONS } from '@/data/students';
import { inrPretty } from '@/lib/format';
import { evaluateEligibility } from '@/engines/eligibility';
import { Icon } from '@/components/common/Icon';

export function Apply() {
  const data = useData();
  const user = useSession((s) => s.user);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const scheme = data.schemes.find((s) => s.id === params.get('scheme')) ?? data.schemes[0];
  const student = data.students.find((s) => s.id === user?.studentId) ?? data.students[0];
  const institution = INSTITUTIONS.find((i) => i.id === student?.institutionId) ?? INSTITUTIONS[0];

  const key = `application_drafts_${student?.id}`;
  const [selected, setSelected] = useState<Record<string, string>>(
    () => dbRead<Record<string, Record<string, string>>>(key, {})[scheme.id] ?? {}
  );
  const [notice, setNotice] = useState('');
  const [declaration, setDeclaration] = useState(false);

  useEffect(() => {
    setSelected(dbRead<Record<string, Record<string, string>>>(key, {})[scheme.id] ?? {});
    setDeclaration(false);
    setNotice('');
  }, [key, scheme.id]);

  const step = Math.max(1, Math.min(3, Number(params.get('step')) || 1));

  const docs = data.documents.filter((d) => d.studentId === student?.id);

  // Auto-populate required documents if entering step 2 and not yet selected
  useEffect(() => {
    if (step >= 2) {
      setSelected((prev) => {
        const next = { ...prev };
        let changed = false;
        scheme.requiredDocs.forEach((docType) => {
          if (!next[docType]) {
            const found = docs.find((d) => d.type === docType);
            if (found) {
              next[docType] = found.id;
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });
    }
  }, [step, scheme.id]);

  const setStep = (number: number) => {
    const next = new URLSearchParams(params);
    next.set('step', String(number));
    next.set('scheme', scheme.id);
    setParams(next);
  };

  const eligibility = evaluateEligibility(student, scheme, {
    marks: 85,
    attendance: 90,
    admission: 'yes',
    noOtherFellowship: 'yes',
  });

  const saveDraft = () => {
    dbWrite(key, { ...dbRead(key, {}), [scheme.id]: selected });
    setNotice('Draft saved on this device.');
  };

  const submit = () => {
    if (!declaration) return;

    // Validate documents
    const docIds = scheme.requiredDocs.map((type) => selected[type]);
    const attached = docIds.map((id) => data.documents.find((d) => d.id === id));
    if (
      docIds.some((id) => !id) ||
      attached.some((d) => !d || d.studentId !== student.id) ||
      new Set(attached.map((d) => d?.type)).size !== scheme.requiredDocs.length
    ) {
      setNotice('Choose a document for each requirement');
      return;
    }

    const id = data.submitApplication(student.id, scheme.id);
    if (!id) {
      setNotice('You already have an application for this scheme. Open Applications to continue it.');
      return;
    }
    data.attachDocsToApplication(id, docIds);
    navigate('/student/application');
  };

  return (
    <div data-od-id="application-flow-main" className="space-y-6">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <div className="crumb">
            <Link to="/student/discovery">Scholarships</Link>
            <Icon name="chevronRight" className="i-sm" />
            <span>New application</span>
          </div>
          <h1 className="page-title" data-od-id="application-flow-title">
            Step {step} of 3: {step === 1 ? 'Your profile' : step === 2 ? 'Your documents' : 'Check answers'}
          </h1>
          <p className="page-sub">
            {scheme.name} (2026-2027). Details are pulled from your verified DigiLocker records.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost" type="button" onClick={saveDraft}>
            Save draft
          </button>
        </div>
      </div>

      {notice && (
        <div role="status" className="callout info">
          <Icon name="shield" className="i" />
          <div>{notice}</div>
        </div>
      )}

      <div className="grid g-main" style={{ alignItems: 'start' }}>
        <div>
          <div className="card">
            {/* Step Line */}
            <div className="flex items-center gap-3 p-4 border-b border-[var(--line)] bg-slate-50/80 rounded-t-[var(--r-card)]">
              <span className={`flex items-center gap-2 text-xs font-semibold ${step === 1 ? 'text-emerald-950 font-bold' : step > 1 ? 'text-emerald-800' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? 'bg-emerald-800 text-white' : step > 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {step > 1 ? '✓' : '1'}
                </span>
                <span>Profile</span>
              </span>
              <span className={`flex-1 h-0.5 ${step > 1 ? 'bg-emerald-700' : 'bg-slate-200'}`} />
              <span className={`flex items-center gap-2 text-xs font-semibold ${step === 2 ? 'text-emerald-950 font-bold' : step > 2 ? 'text-emerald-800' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-emerald-800 text-white' : step > 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {step > 2 ? '✓' : '2'}
                </span>
                <span>Documents</span>
              </span>
              <span className={`flex-1 h-0.5 ${step > 2 ? 'bg-emerald-700' : 'bg-slate-200'}`} />
              <span className={`flex items-center gap-2 text-xs font-semibold ${step === 3 ? 'text-emerald-950 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  3
                </span>
                <span>Check answers</span>
              </span>
            </div>

            {/* STEP 1: Profile */}
            {step === 1 && (
              <div className="card-b" style={{ padding: '24px' }}>
                <div className="flex between center" style={{ marginBottom: '20px' }}>
                  <h2 className="h3">Identity and study details</h2>
                  <span className="badge badge-green">
                    <Icon name="lock" className="i-sm" style={{ width: '10px', height: '10px' }} />
                    DigiLocker verified
                  </span>
                </div>

                <div className="form-grid">
                  <div className="field full">
                    <label htmlFor="f-name">Your name, as shown on Aadhaar</label>
                    <input className="input readonly" id="f-name" value={student.name} readOnly />
                    <span className="hint">
                      Matched against Aadhaar ending {student.aadhaarLast4} · Cannot be edited here.
                    </span>
                  </div>

                  <div className="field">
                    <label htmlFor="f-community">ST community</label>
                    <input
                      className="input readonly"
                      id="f-community"
                      value={`${student.tribe} (${student.isPVTG ? 'PVTG Tier-1 Priority Group' : 'Scheduled Tribe'})`}
                      readOnly
                    />
                    <span className="hint">Certificate JH/ST/2023/88194 · 100% fee waiver</span>
                  </div>

                  <div className="field">
                    <label htmlFor="f-income">Yearly family income</label>
                    <input className="input readonly" id="f-income" value={`${inrPretty(student.familyIncome)} / year`} readOnly />
                    <span className="hint">Revenue Cert #REV/2026/84920 · Within ceiling</span>
                  </div>

                  <div className="field full">
                    <label htmlFor="f-college">Your college or institution</label>
                    <input
                      className="input readonly"
                      id="f-college"
                      value={`${institution.name} · Roll #2024-CSE-104`}
                      readOnly
                    />
                    <span className="hint">Bonafide letter BIT/ACAD/2026/104 is attached to this application.</span>
                  </div>

                  <div className="field">
                    <label htmlFor="f-phone">
                      Parent or guardian phone <span style={{ color: 'var(--meta)', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <div className="input-group">
                      <input className="input" id="f-phone" defaultValue="+91 94311 02914" />
                      <span className="addon">FATHER</span>
                    </div>
                    <span className="hint">Only used for delivery updates on this application.</span>
                  </div>

                  <div className="field">
                    <label htmlFor="f-bank">Disbursement account</label>
                    <input className="input readonly" id="f-bank" value="Bank of India · A/C ••••9012" readOnly />
                    <span className="hint">Aadhaar-seeded and NPCI validated.</span>
                  </div>
                </div>

                <div className="callout info mt20">
                  <Icon name="shield" className="i" />
                  <div>
                    <b>Editing a verified detail?</b> Request a data update from your profile. Changes to community, income or college must be re-attested by the issuing authority.
                  </div>
                </div>

                <div className="flex between center mt24 pt16" style={{ borderTop: '1px solid var(--line)' }}>
                  <Link className="btn btn-secondary" to="/student/discovery">
                    Back to schemes
                  </Link>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(2)}>
                    Continue to documents
                    <Icon name="arrowRight" className="i" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Documents */}
            {step === 2 && (
              <div className="card-b" style={{ padding: '24px' }}>
                <div className="flex between center" style={{ marginBottom: '20px' }}>
                  <h2 className="h3">Select verified certificates</h2>
                  <span className="badge badge-green">4 in wallet</span>
                </div>

                <div className="space-y-4">
                  {scheme.requiredDocs.map((docType) => {
                    const matchedDocs = docs.filter((d) => d.type === docType);
                    const selId = selected[docType];
                    return (
                      <div key={docType} className="p-4 border border-[var(--line)] rounded-lg bg-[var(--surface-2)]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                            {docType.replace(/_/g, ' ')}
                          </span>
                          <span className="badge badge-green">Ready</span>
                        </div>
                        <select
                          className="select"
                          value={selId || ''}
                          onChange={(e) => setSelected({ ...selected, [docType]: e.target.value })}
                        >
                          {matchedDocs.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.title} (Verified · DigiLocker)
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>

                <div className="flex between center mt24 pt16" style={{ borderTop: '1px solid var(--line)' }}>
                  <button className="btn btn-secondary" type="button" onClick={() => setStep(1)}>
                    Back to profile
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(3)}>
                    Check your answers
                    <Icon name="arrowRight" className="i" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Check Answers */}
            {step === 3 && (
              <div className="card-b" style={{ padding: '24px' }}>
                <div className="flex between center" style={{ marginBottom: '20px' }}>
                  <h2 className="h3">Confirm and sign submission</h2>
                  <span className="badge badge-amber">Declaration required</span>
                </div>

                <dl className="grid g2 p-4 border border-[var(--line)] rounded-lg bg-[var(--surface-2)] text-xs gap-3">
                  <div>
                    <dt className="text-[var(--meta)]">Candidate name</dt>
                    <dd className="font-semibold text-[var(--ink)]">{student.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--meta)]">Community classification</dt>
                    <dd className="font-semibold text-[var(--ink)]">
                      {student.tribe} {student.isPVTG && '(PVTG Priority)'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--meta)]">Certified annual income</dt>
                    <dd className="font-semibold text-[var(--ink)]">{inrPretty(student.familyIncome)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--meta)]">Course &amp; institution</dt>
                    <dd className="font-semibold text-[var(--ink)]">
                      {institution.name} · {student.course}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 p-4 border border-[var(--line)] rounded-lg bg-[var(--surface-2)]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={declaration}
                      onChange={(e) => setDeclaration(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span className="text-xs text-[var(--ink-2)] leading-relaxed">
                      I declare that all details and documents presented are authentic and belong to me. I authorize the Ministry of Tribal Affairs and my institution to verify these claims against state registries.
                    </span>
                  </label>
                </div>

                {(student.familyIncome ?? 0) > 250000 && (
                  <div role="alert" className="callout warn mt-4">
                    <Icon name="alert" size={16} />
                    <div>
                      <b>NSP Eligibility Discrepancy Gate: Ineligible.</b> Annual family income ₹{(student.familyIncome ?? 0).toLocaleString('en-IN')} exceeds statutory cap ≤ ₹2,50,000 / yr.
                    </div>
                  </div>
                )}

                <div className="flex between center mt24 pt16" style={{ borderTop: '1px solid var(--line)' }}>
                  <button className="btn btn-secondary" type="button" onClick={() => setStep(2)}>
                    Back to documents
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={!declaration || (student.familyIncome ?? 0) > 250000}
                    onClick={submit}
                  >
                    Submit application
                    <Icon name="arrowRight" className="i" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Flow Aside */}
        <aside className="stack">
          <section className="card">
            <div className="card-b p-5">
              <div className="eyebrow">Application target</div>
              <h3 className="h3 mt-2">{scheme.name}</h3>
              <p className="micro text-[var(--muted)] mt-1">{scheme.portal} · AY 2026-2027</p>

              <div className="my-4 border-t border-[var(--line)]" />

              <div className="eyebrow">Estimated annual grant</div>
              <div className="amount mt-2">{scheme.amount || inrPretty(132000)}</div>

              <div className="my-4 border-t border-[var(--line)]" />

              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--muted)]">Required certificates</span>
                <span className="font-bold text-[var(--green)]">{scheme.requiredDocs.length} matched</span>
              </div>
            </div>
          </section>

          <div className="callout ok">
            <Icon name="shield" className="i" />
            <div>
              <b>Auto-save active.</b> Your progress is kept securely on this device.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
