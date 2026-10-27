import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@/store/session';
import { useData } from '@/store/data';
import { dbRead, dbWrite } from '@/lib/db';
import { INSTITUTIONS } from '@/data/students';
import { inrPretty } from '@/lib/format';
import { Icon } from '@/components/common/Icon';

/* ─────────────────────────────────────────────────────────────────────────────
   1. SCHOLAR PROFILE (frontend/scholar-profile.html)
───────────────────────────────────────────────────────────────────────────── */
export function StudentProfile() {
  const navigate = useNavigate();
  const user = useSession((s) => s.user);
  const student = useData((s) => s.students.find((p) => p.id === user?.studentId)) ?? useData((s) => s.students[0]);
  const institution = INSTITUTIONS.find((i) => i.id === student?.institutionId) ?? INSTITUTIONS[0];
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const initials = student ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'MB';

  return (
    <div data-od-id="scholar-profile-main" className="space-y-6 relative">
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
            <span>Scholar workspace</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>My profile</span>
          </div>
          <h1 className="page-title" data-od-id="scholar-profile-title">
            My profile
          </h1>
          <p className="page-sub">
            Your verified identity, tribal classification and disbursement details. Used across every scholarship you apply to.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => showToast('A data-update request has been drafted for the nodal desk')}
          >
            <Icon name="edit" className="i" />
            Request data update
          </button>
        </div>
      </div>

      {/* Top Banner Card */}
      <section className="card" style={{ marginBottom: '16px' }}>
        <div className="card-b" style={{ padding: '22px 24px' }}>
          <div className="flex between center wrap gap20">
            <div className="flex center gap16">
              <span className="avatar avatar-lg dark">{initials}</span>
              <div>
                <div className="flex center gap10 wrap">
                  <h2 className="h2" style={{ fontSize: '20px' }}>
                    {student.name}
                  </h2>
                  <span className="badge badge-green">
                    <Icon name="check" className="i-sm" style={{ width: '10px', height: '10px' }} />
                    Verified
                  </span>
                </div>
                <p className="small mut" style={{ marginTop: '4px' }}>
                  {institution.name} · {student.course}, 2nd year
                </p>
                <p className="micro mono" style={{ marginTop: '3px' }}>
                  Enrolled roll #2024-CSE-104 · Domicile {student.domicileDistrict}, {student.domicileState}
                </p>
              </div>
            </div>
            <div className="flex gap20 wrap">
              <div>
                <div className="eyebrow">Profile completeness</div>
                <div className="flex center gap8" style={{ marginTop: '4px' }}>
                  <div style={{ width: '76px', height: '5px', background: '#EEF2F6', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--green)' }} />
                  </div>
                  <span className="micro" style={{ fontWeight: 560 }}>
                    100%
                  </span>
                </div>
              </div>
              <div>
                <div className="eyebrow">Last verified</div>
                <div className="h4" style={{ marginTop: '4px' }}>
                  14 Oct 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid g-2-1" style={{ alignItems: 'start' }}>
        <div className="stack">
          {/* Verified Tribal Demographics */}
          <section className="card">
            <div className="card-h">
              <div>
                <h2 className="h3">Verified tribal demographics</h2>
                <p className="micro" style={{ marginTop: '3px' }}>
                  Certified by the Government of Jharkhand and SDO Latehar.
                </p>
              </div>
              <span className="badge badge-gray">
                <Icon name="lock" className="i-sm" style={{ width: '10px', height: '10px' }} />
                Immutable
              </span>
            </div>
            <div className="card-b" style={{ paddingTop: '8px' }}>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Tribal community
                </span>
                <div className="grow">
                  <div className="v">{student.tribe} Scheduled Tribe</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    {student.isPVTG ? 'PVTG Tier-1 priority group · Certificate JH/ST/2023/88194' : 'Recognized ST Category'}
                  </div>
                </div>
                <span className="badge badge-blue">PVTG</span>
              </div>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Domicile residence
                </span>
                <div className="grow">
                  <div className="v">Village Belta, Block Mahuadanr</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    {student.domicileDistrict} District, {student.domicileState} · Rural scheduled area
                  </div>
                </div>
                <span className="badge badge-green">Verified</span>
              </div>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Family &amp; guardian
                </span>
                <div className="grow">
                  <div className="v">{student.fatherName} (Father)</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    Registered mobile +91 94311 ••••14
                  </div>
                </div>
                <span className="badge badge-green">Verified</span>
              </div>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Annual family income
                </span>
                <div className="grow">
                  <div className="v num">{inrPretty(student.familyIncome)}</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    Revenue certificate REV/2026/84920 · Valid till March 2027
                  </div>
                </div>
                <span className="badge badge-green">Within limit</span>
              </div>
            </div>
          </section>

          {/* National Identity & Banking */}
          <section className="card">
            <div className="card-h">
              <div>
                <h2 className="h3">National identity &amp; banking</h2>
                <p className="micro" style={{ marginTop: '3px' }}>
                  UIDAI token vault and Aadhaar-seeded PFMS disbursement.
                </p>
              </div>
              <span className="badge badge-gray">Tokenised</span>
            </div>
            <div className="card-b" style={{ paddingTop: '8px' }}>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Aadhaar identification
                </span>
                <div className="grow">
                  <div className="v mono">•••• •••• {student.aadhaarLast4}</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    Raw UID is not stored · UIDAI demographic vault
                  </div>
                </div>
                <span className="badge badge-green">
                  <span className="bdot" />
                  Verified
                </span>
              </div>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Academic APAAR ID
                </span>
                <div className="grow">
                  <div className="v mono">9482-1049-5821</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    ABC vault sync · CGPA 8.84 · Clean standing
                  </div>
                </div>
                <span className="badge badge-green">
                  <span className="bdot" />
                  Synced
                </span>
              </div>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  Primary DBT account
                </span>
                <div className="grow">
                  <div className="v">Bank of India · Mesra Branch, Ranchi</div>
                  <div className="micro mono" style={{ marginTop: '2px' }}>
                    A/C ••••9012 · IFSC BKID0004910
                  </div>
                </div>
                <span className="badge badge-green">NPCI seeded</span>
              </div>
              <div className="keyline" style={{ padding: '14px 0' }}>
                <span className="k" style={{ width: '168px' }}>
                  DigiLocker consent
                </span>
                <div className="grow">
                  <div className="v">Full auto-pull consent</div>
                  <div className="micro" style={{ marginTop: '2px' }}>
                    Valid until 2028 academic cycle conclusion
                  </div>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Family Access & Quick Nav */}
        <aside className="stack">
          <section className="card">
            <div className="card-b p-5">
              <div className="eyebrow">Family Access</div>
              <h3 className="h3 mt-2">Authorised Nominees</h3>
              <p className="micro text-[var(--muted)] mt-1">
                {student.fatherName} has active read-only access to your application timeline and payment alerts.
              </p>
              <Link className="btn btn-secondary btn-block mt-4" to="/student/family">
                Manage family access
              </Link>
            </div>
          </section>

          <section className="card">
            <div className="card-b p-5">
              <div className="eyebrow">Need a correction?</div>
              <h3 className="h3 mt-2">Discrepancy resolution</h3>
              <p className="micro text-[var(--muted)] mt-1">
                If an official certificate reflects incorrect name spelling or village demarcation, request an attestation.
              </p>
              <Link className="btn btn-primary btn-block mt-4" to="/student/grievance">
                Ask Saarthi assistant
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. FAMILY ACCESS (frontend/family-access.html)
───────────────────────────────────────────────────────────────────────────── */
interface DemoGrant {
  name: string;
  email: string;
  relationship: string;
  createdAt: string;
}

export function FamilyAccess() {
  const user = useSession((s) => s.user);
  const student = useData((s) => s.students.find((p) => p.id === user?.studentId)) ?? useData((s) => s.students[0]);
  const key = `family_grants_${student?.id}`;

  const [grants, setGrants] = useState<DemoGrant[]>(() => {
    const saved = dbRead<DemoGrant[]>(key, []);
    if (saved.length) return saved;
    return [
      {
        name: student?.fatherName ?? 'Somra Birhor',
        email: 'somra.birhor@example.test',
        relationship: 'Father',
        createdAt: '2026-09-01T10:00:00.000Z',
      },
    ];
  });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const save = (next: DemoGrant[]) => {
    dbWrite(key, next);
    setGrants(next);
  };

  const revoke = (email: string) => {
    const next = grants.filter((g) => g.email !== email);
    save(next);
    showToast('Consent revoked. Status alerts discontinued.');
  };

  const addNominee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email')).trim().toLowerCase();
    const name = String(form.get('name')).trim();
    const relationship = String(form.get('relationship') ?? 'Parent');

    if (grants.length >= 2 || grants.some((g) => g.email === email)) {
      showToast('This nominee is already added, or all 2 slots are occupied.');
      return;
    }

    save([...grants, { name, email, relationship, createdAt: new Date().toISOString() }]);
    e.currentTarget.reset();
    showToast('Family consent granted successfully.');
  };

  return (
    <div data-od-id="family-access-main" className="space-y-6 relative">
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
            <span>Scholar workspace</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>Family access</span>
          </div>
          <h1 className="page-title" data-od-id="family-access-title">
            Family access &amp; nominee consent
          </h1>
          <p className="page-sub">
            Give a family member permission to view your application status. They never gain edit rights.
          </p>
        </div>
        <div className="page-actions">
          <span className="badge badge-green">
            <span className="bdot" />
            Consent active
          </span>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="metric-strip" style={{ marginBottom: '16px' }}>
        <div>
          <div className="m-lab">Active nominees</div>
          <div className="m-val">{grants.length} of 2 slots</div>
        </div>
        <div>
          <div className="m-lab">Free slot</div>
          <div className="m-val">{Math.max(0, 2 - grants.length)} remaining</div>
        </div>
        <div>
          <div className="m-lab">Consent expiry</div>
          <div className="m-val">01 Sep 2027</div>
        </div>
        <div>
          <div className="m-lab">Access type</div>
          <div className="m-val">Read-only status</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid g-main" style={{ alignItems: 'start' }}>
        <div className="stack">
          <section className="card">
            <div className="card-h">
              <div>
                <h2 className="h3">Active authorised guardians</h2>
                <p className="micro" style={{ marginTop: '3px' }}>
                  Authorised to receive disbursal status alerts and application progress.
                </p>
              </div>
              <span className="badge badge-green">{grants.length} active</span>
            </div>
            <div className="card-b">
              {grants.map((grant) => (
                <div key={grant.email} className="flex between center wrap gap14 pb-4 mb-4 border-b border-[var(--line)]">
                  <div className="flex center gap14">
                    <span className="avatar avatar-lg">
                      {grant.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <div className="flex center gap8">
                        <h3 className="h3">{grant.name}</h3>
                        <span className="badge badge-green">
                          <span className="bdot" />
                          Active
                        </span>
                      </div>
                      <div className="micro" style={{ marginTop: '3px' }}>
                        Relationship: {grant.relationship} · Mobile +91 94311 ••••14
                      </div>
                      <div className="micro mono" style={{ marginTop: '2px', color: 'var(--meta)' }}>
                        Consent granted {new Date(grant.createdAt).toLocaleDateString('en-IN')} · Aadhaar OTP
                      </div>
                    </div>
                  </div>
                  <div className="flex gap8">
                    <button
                      className="btn btn-secondary btn-sm"
                      type="button"
                      onClick={() => showToast('Test SMS dispatched to the registered mobile')}
                    >
                      Resend SMS test
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      type="button"
                      onClick={() => revoke(grant.email)}
                    >
                      Revoke consent
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex between center" style={{ marginBottom: '4px', marginTop: '12px' }}>
                <div className="h4">Guardian permissions</div>
                <span className="micro" style={{ color: 'var(--meta)' }}>
                  Read-only by policy
                </span>
              </div>

              <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center text-xs py-2 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <Icon name="eye" className="i-sm" />
                    <span>View application SLA and stage</span>
                  </div>
                  <span className="badge badge-green">Allowed</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2 border-b border-[var(--line)]">
                  <div className="flex items-center gap-2">
                    <Icon name="bell" className="i-sm" />
                    <span>PFMS bank credit SMS alerts</span>
                  </div>
                  <span className="badge badge-green">Allowed</span>
                </div>
                <div className="flex justify-between items-center text-xs py-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Icon name="edit" className="i-sm" />
                    <span>Edit bank details or scholarship terms</span>
                  </div>
                  <span className="badge badge-gray">Blocked</span>
                </div>
              </div>

              <div className="callout mt16">
                <Icon name="mail" className="i" />
                <div>
                  <b>Last SMS dispatched:</b> “Application forwarded to the Latehar DWO on 14 Oct 2026.” Delivery confirmed to the registered number.
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-h">
              <h2 className="h3">What your family can see</h2>
              <span className="badge badge-gray">Policy</span>
            </div>
            <div className="card-b" style={{ paddingTop: '8px' }}>
              <div className="keyline">
                <Icon name="check" className="i" />
                <span className="k">Status only</span>
                <span className="v" style={{ fontWeight: 400, color: 'var(--muted)' }}>
                  Nominees have strictly read-only access to application stage.
                </span>
              </div>
              <div className="keyline">
                <Icon name="check" className="i" />
                <span className="k">Fully logged</span>
                <span className="v" style={{ fontWeight: 400, color: 'var(--muted)' }}>
                  Every access is recorded in the immutable MoTA audit ledger.
                </span>
              </div>
              <div className="keyline">
                <Icon name="check" className="i" />
                <span className="k">Revocable</span>
                <span className="v" style={{ fontWeight: 400, color: 'var(--muted)' }}>
                  You may revoke authorisation at any time, with instant effect.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Aside: Add Nominee Form */}
        <aside className="stack">
          <section className="card">
            <div className="card-h">
              <h2 className="h3">Add a family member</h2>
              <span className="badge badge-gray">{grants.length}/2</span>
            </div>
            <div className="card-b p-4">
              <form onSubmit={addNominee} className="space-y-3">
                <div className="field">
                  <label htmlFor="nominee-name">Full name</label>
                  <input
                    id="nominee-name"
                    name="name"
                    required
                    defaultValue={student.fatherName}
                    className="input"
                    placeholder="Guardian's name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="nominee-email">Email or phone</label>
                  <input
                    id="nominee-email"
                    name="email"
                    type="email"
                    required
                    className="input"
                    placeholder="guardian@example.com"
                  />
                </div>
                <div className="field">
                  <label htmlFor="nominee-rel">Relationship</label>
                  <select id="nominee-rel" name="relationship" className="select">
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Legal Guardian</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={grants.length >= 2}
                  className="btn btn-primary btn-block mt-4"
                >
                  Grant read-only access
                </button>
              </form>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. SAVED CHANGES / OFFLINE SYNC (frontend/offline-sync.html)
───────────────────────────────────────────────────────────────────────────── */
export function SavedChanges() {
  const [toastMsg, setToastMsg] = useState('');
  const [synced, setSynced] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleForceSync = () => {
    setSynced(true);
    showToast('Queue flushed. All 2 local operations acknowledged by server.');
  };

  return (
    <div data-od-id="offline-sync-main" className="space-y-6 relative">
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
            <span>Scholar workspace</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>Saved changes</span>
          </div>
          <h1 className="page-title" data-od-id="offline-sync-title">
            Saved changes
          </h1>
          <p className="page-sub">
            Changes stay on this device until they reach the server. Nothing is lost while you are offline.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => showToast('Encrypted backup exported to this device')}
          >
            <Icon name="download" className="i" />
            Export encrypted backup
          </button>
          <button
            className="btn btn-primary"
            type="button"
            id="forceSync"
            data-od-id="offline-sync-primary-cta"
            onClick={handleForceSync}
          >
            <Icon name="refresh" className="i" />
            Force sync queue
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className={`notice ${synced ? 'ok' : 'warn'}`} style={{ marginBottom: '16px' }}>
        <Icon name={synced ? 'check' : 'wifioff'} className="i" />
        <div>
          <b style={{ fontWeight: 560, color: 'var(--ink)' }}>
            {synced ? 'All changes synchronized.' : 'You are working offline.'}
          </b>{' '}
          {synced
            ? 'Server has acknowledged all operations.'
            : '2 changes are waiting to send. They will sync automatically when the connection returns.'}
        </div>
        <span
          className="micro mono"
          style={{ marginLeft: 'auto', color: synced ? 'var(--green)' : 'var(--amber)', whiteSpace: 'nowrap' }}
        >
          {synced ? 'SYNCED JUST NOW' : 'LAST TRY 14:15'}
        </span>
      </div>

      {/* Operations Table */}
      <section className="card">
        <div className="card-h">
          <div>
            <h2 className="h3">Changes waiting to send</h2>
            <p className="micro" style={{ marginTop: '3px' }}>
              Ordered by local capture time. Each operation carries an integrity hash.
            </p>
          </div>
          <span className="badge badge-amber">
            {synced ? '0 queued · 3 synced' : '2 queued · 1 synced'}
          </span>
        </div>
        <div className="card-b flush">
          <div className="tablewrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th className="nowrap">Op ID</th>
                  <th>Action type</th>
                  <th>Payload summary</th>
                  <th className="nowrap">Local time</th>
                  <th>Status</th>
                  <th className="nowrap">Integrity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono" style={{ color: 'var(--meta)' }}>
                    OP-104
                  </td>
                  <td className="strong" style={{ whiteSpace: 'nowrap' }}>
                    Address update
                  </td>
                  <td>Domicile hamlet: Belta, Mahuadanr, Latehar</td>
                  <td className="mono nowrap" style={{ color: 'var(--meta)' }}>
                    14:12:05 IST
                  </td>
                  <td>
                    <span className={`badge ${synced ? 'badge-green' : 'badge-amber'}`}>
                      <span className="bdot" />
                      {synced ? 'Synced & acked' : 'Queued'}
                    </span>
                  </td>
                  <td className="mono nowrap" style={{ color: 'var(--meta)' }}>
                    SHA a89f3b…
                  </td>
                </tr>
                <tr>
                  <td className="mono" style={{ color: 'var(--meta)' }}>
                    OP-105
                  </td>
                  <td className="strong" style={{ whiteSpace: 'nowrap' }}>
                    Upload document
                  </td>
                  <td>bit_mesra_fee_receipt.pdf · 1.2 MB</td>
                  <td className="mono nowrap" style={{ color: 'var(--meta)' }}>
                    14:15:30 IST
                  </td>
                  <td>
                    <span className={`badge ${synced ? 'badge-green' : 'badge-amber'}`}>
                      <span className="bdot" />
                      {synced ? 'Synced & acked' : 'Queued'}
                    </span>
                  </td>
                  <td className="mono nowrap" style={{ color: 'var(--meta)' }}>
                    SHA c7219e…
                  </td>
                </tr>
                <tr>
                  <td className="mono" style={{ color: 'var(--meta)' }}>
                    OP-103
                  </td>
                  <td className="strong" style={{ whiteSpace: 'nowrap' }}>
                    Draft step 2
                  </td>
                  <td>Document slot confirmations and seals</td>
                  <td className="mono nowrap" style={{ color: 'var(--meta)' }}>
                    10:02:11 IST
                  </td>
                  <td>
                    <span className="badge badge-green">
                      <span className="bdot" />
                      Synced &amp; acked
                    </span>
                  </td>
                  <td className="mono nowrap" style={{ color: 'var(--meta)' }}>
                    ACK #9921
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-ft">
          <span className="micro" style={{ color: 'var(--meta)' }}>
            Deterministic last-write-wins pipeline · no overwrites between device and officer decisions
          </span>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={() => showToast('All three operations were checked for conflicts')}
          >
            Check for conflicts
          </button>
        </div>
      </section>
    </div>
  );
}
