import { useState } from 'react';
import { useData } from '@/store/data';
import { csv, download } from '@/pilot/exports';
import { Icon } from '@/components/common/Icon';

export function AuditLog() {
  const audit = useData((s) => s.audit);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExport = () => {
    download(
      'decision-history.csv',
      csv(
        ['timestamp', 'actor', 'credential', 'event_type', 'target', 'hash'],
        [
          ['14 Oct 14:32:10 IST', 'Dr. K. Soren (DWO Latehar)', 'DSC 0x7F82A091', 'DSC sanction endorsed', 'Case #TS-2026-88194', '0x7c49a420'],
          ['14 Oct 11:15:44 IST', 'SDO Mahuadanr, Latehar', 'e-Sign 0x1049AB12', 'DigiLocker caste seal', 'Cert #JH/ST/2023/88194', '0x3f1199bc'],
          ['12 Oct 09:12:08 IST', 'Mohan Birhor (Scholar)', 'Aadhaar vault 4921', 'Application submitted', 'BIT Mesra scholarship', '0x8a9211ef'],
          ...audit.map((a) => [a.ts, a.actor, 'Simulated', a.action, a.entity, '0x' + a.id.slice(0, 8)]),
        ]
      )
    );
    showToast('Exported decision-history.csv');
  };

  const staticEvents = [
    {
      id: 'evt_static_1',
      ts: '14 Oct · 14:32:10',
      sub: 'IST (+05:30)',
      typeClass: 'evt sign',
      icon: 'signature' as const,
      typeLabel: 'DSC sanction endorsed',
      actor: 'Dr. K. Soren (DWO Latehar)',
      actorSub: 'DSC 0x7F82A091',
      target: 'Case #TS-2026-88194',
      targetSub: 'Mohan Birhor · ₹1,32,000',
      hash: '0x7c49…a420',
      verifyToast: 'DAG verified · block 1842 is intact',
    },
    {
      id: 'evt_static_2',
      ts: '14 Oct · 11:15:44',
      sub: 'IST (+05:30)',
      typeClass: 'evt seal',
      icon: 'shield' as const,
      typeLabel: 'DigiLocker caste seal',
      actor: 'SDO Mahuadanr, Latehar',
      actorSub: 'e-Sign 0x1049AB12',
      target: 'Cert #JH/ST/2023/88194',
      targetSub: 'Birhor Scheduled Tribe',
      hash: '0x3f11…99bc',
      verifyToast: 'DAG verified · sealing event is intact',
    },
    {
      id: 'evt_static_3',
      ts: '12 Oct · 09:12:08',
      sub: 'IST (+05:30)',
      typeClass: 'evt submit',
      icon: 'upload' as const,
      typeLabel: 'Application submitted',
      actor: 'Mohan Birhor (Scholar)',
      actorSub: 'Aadhaar vault ••••4921',
      target: 'BIT Mesra scholarship',
      targetSub: 'B.Tech CSE · year 2',
      hash: '0x8a92…11ef',
      verifyToast: 'DAG verified · submission event is intact',
    },
  ];

  const dynamicEvents = audit.map((entry) => ({
    id: entry.id,
    ts: entry.ts.slice(0, 16),
    sub: 'Store Event',
    typeClass: 'evt sign',
    icon: 'check' as const,
    typeLabel: entry.action.replace(/_/g, ' '),
    actor: entry.actor,
    actorSub: `ID ${entry.id.slice(0, 8)}`,
    target: entry.entity,
    targetSub: entry.detail,
    hash: `0x${entry.id.slice(0, 6)}…`,
    verifyToast: `DAG verified · ${entry.action} is intact`,
  }));

  const allEvents = [...staticEvents, ...dynamicEvents];
  const q = filterQuery.toLowerCase().trim();
  const visibleEvents = allEvents.filter((ev) => {
    if (!q) return true;
    return `${ev.ts} ${ev.typeLabel} ${ev.actor} ${ev.actorSub} ${ev.target} ${ev.targetSub} ${ev.hash}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <main className="page wide" id="main" data-od-id="audit-log-main">
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--ink)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 500,
            boxShadow: 'var(--shadow-2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icon name="check" size={14} style={{ stroke: 'var(--green-border)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-head">
        <div>
          <div className="crumb">
            <span>Verification desk</span>
            <Icon name="chevronRight" size={12} />
            <span>Decision history</span>
          </div>
          <h1 className="page-title" data-od-id="audit-log-title">Decision history</h1>
          <p className="page-sub">Review decisions, document checks and the officer responsible. Cryptographically authenticated and append-only.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" type="button" onClick={handleExport}>
            <Icon name="download" size={14} />
            Export audit pack
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => showToast('All 1,842 blocks verified · no gaps found')}
            data-toast="All 1,842 blocks verified · no gaps found"
            data-od-id="audit-log-primary-cta"
          >
            <Icon name="shield" size={14} />
            Verify all blocks
          </button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: '16px' }}>
        <div className="kpi">
          <div className="lab">Total audited blocks</div>
          <div className="val num">1,842</div>
          <div className="foot"><span className="delta up"><Icon name="check" size={11} style={{ display: 'inline', marginRight: '3px' }} />Validated</span> all blocks</div>
        </div>
        <div className="kpi">
          <div className="lab">Cryptographic events</div>
          <div className="val num">{14920 + audit.length}</div>
          <div className="foot">Tamper-proof SHA-256</div>
        </div>
        <div className="kpi">
          <div className="lab">Active validator nodes</div>
          <div className="val num">4<em>/ 4</em></div>
          <div className="foot">NIC · MoTA · PFMS · UIDAI</div>
        </div>
        <div className="kpi">
          <div className="lab">Record integrity</div>
          <div className="val">100<em>%</em></div>
          <div className="foot"><span className="badge badge-green" style={{ padding: '2px 5px', fontSize: '9px' }}>Clean</span> no breaks detected</div>
        </div>
      </div>

      <div className="grid g-main" style={{ alignItems: 'start' }}>
        <div className="stack">
          <section className="card">
            <div className="card-h">
              <div>
                <h2 className="h3">Review and approval events</h2>
                <p className="micro" style={{ marginTop: '3px' }}>Records linked to DSC public keys. Sample events shown.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gray">Live ledger</span>
                <input
                  type="text"
                  placeholder="Filter records…"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  style={{
                    height: '26px',
                    fontSize: '11px',
                    padding: '0 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    background: 'var(--canvas)',
                    color: 'var(--ink)'
                  }}
                />
              </div>
            </div>

            <div className="tablewrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th scope="col" className="nowrap">Timestamp</th>
                    <th scope="col">Event type</th>
                    <th scope="col">Actor &amp; credential</th>
                    <th scope="col">Target entity</th>
                    <th scope="col">Block hash</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Verify</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEvents.map((item) => (
                    <tr key={item.id}>
                      <td className="nowrap">
                        <div className="strong mono" style={{ fontSize: '10.5px' }}>{item.ts}</div>
                        <div className="sub">{item.sub}</div>
                      </td>
                      <td>
                        <span className={item.typeClass}>
                          <Icon name={item.icon} size={12} />
                          {item.typeLabel}
                        </span>
                      </td>
                      <td>
                        <div className="strong" style={{ fontSize: '11.5px' }}>{item.actor}</div>
                        <div className="sub mono">{item.actorSub}</div>
                      </td>
                      <td>
                        <div className="strong" style={{ fontSize: '11.5px' }}>{item.target}</div>
                        <div className="sub">{item.targetSub}</div>
                      </td>
                      <td>
                        <span className="hashpill">
                          <Icon name="lock" size={9} />
                          {item.hash}
                        </span>
                      </td>
                      <td className="right">
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => showToast(item.verifyToast)}>
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}

                  {visibleEvents.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--muted)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <Icon name="search" size={24} style={{ color: 'var(--meta)' }} />
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                            No decision records found matching "{filterQuery}"
                          </div>
                          <button
                            className="btn btn-secondary btn-sm"
                            type="button"
                            style={{ marginTop: '8px' }}
                            onClick={() => setFilterQuery('')}
                          >
                            Clear filter
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card-ft">
              <span className="micro" style={{ color: 'var(--meta)' }}>Showing {visibleEvents.length} of 1,842 blocks · newest first</span>
              <div className="flex gap8">
                <button className="btn btn-secondary btn-sm" type="button" disabled>Previous</button>
                <button className="btn btn-secondary btn-sm" type="button" onClick={() => showToast('Loading older audit blocks')}>Next</button>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-h">
              <h2 className="h3">Linked review chain</h2>
              <span className="badge badge-green">Unbroken</span>
            </div>
            <div className="card-b">
              <div className="chain">
                <span className="node link">#1840 submit</span>
                <Icon name="arrowRight" size={12} style={{ stroke: 'var(--meta)' }} />
                <span className="node link">#1841 docs</span>
                <Icon name="arrowRight" size={12} style={{ stroke: 'var(--meta)' }} />
                <span className="node link">#1842 approval</span>
                <Icon name="arrowRight" size={12} style={{ stroke: 'var(--meta)' }} />
                <span className="node">#1843 PFMS</span>
              </div>
              <p className="micro" style={{ marginTop: '12px' }}>
                Each block stores the hash of the previous block. Any alteration breaks the chain and fails verification at all four validator nodes.
              </p>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="card-h">
              <h2 className="h3">Record types</h2>
              <span className="badge badge-gray">14.9K</span>
            </div>
            <div className="card-b">
              <div className="bars" style={{ '--max': '100' } as React.CSSProperties}>
                <div className="bar-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 68px', rowGap: '5px' }}>
                  <span className="bar-label">Sanction endorsements</span>
                  <span className="bar-value">52%</span>
                  <div className="bar-track" style={{ gridColumn: '1/-1' }}>
                    <div className="bar" style={{ '--v': '52' } as React.CSSProperties}></div>
                  </div>
                </div>
                <div className="bar-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 68px', rowGap: '5px' }}>
                  <span className="bar-label">DigiLocker seals</span>
                  <span className="bar-value">28%</span>
                  <div className="bar-track" style={{ gridColumn: '1/-1' }}>
                    <div className="bar green" style={{ '--v': '28' } as React.CSSProperties}></div>
                  </div>
                </div>
                <div className="bar-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 68px', rowGap: '5px' }}>
                  <span className="bar-label">PFMS disbursals</span>
                  <span className="bar-value">14%</span>
                  <div className="bar-track" style={{ gridColumn: '1/-1' }}>
                    <div className="bar" style={{ '--v': '14', background: '#94A3B8' } as React.CSSProperties}></div>
                  </div>
                </div>
                <div className="bar-row" style={{ gridTemplateColumns: 'minmax(0,1fr) 68px', rowGap: '5px' }}>
                  <span className="bar-label">Discrepancy notices</span>
                  <span className="bar-value">6%</span>
                  <div className="bar-track" style={{ gridColumn: '1/-1' }}>
                    <div className="bar amber" style={{ '--v': '6' } as React.CSSProperties}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-h">
              <h2 className="h3">Audit health</h2>
              <span className="badge badge-green"><span className="bdot"></span>Operational</span>
            </div>
            <div className="card-b" style={{ paddingTop: '10px' }}>
              <div className="keyline"><span className="k">Chain integrity</span><span className="v">100%</span></div>
              <div className="keyline"><span className="k">Validator quorum</span><span className="v">4 of 4</span></div>
              <div className="keyline"><span className="k">Last block</span><span className="v mono">#1842</span></div>
              <div className="keyline"><span className="k">Median finality</span><span className="v num">2.4s</span></div>
              <div className="keyline"><span className="k">Retention</span><span className="v">Permanent</span></div>
            </div>
          </section>

          <div className="callout info">
            <Icon name="shield" size={16} />
            <div><b>Evidence, not a score.</b> This history supports review decisions; it does not replace the statutory authority of the signing officer.</div>
          </div>
        </div>
      </div>

      <p className="micro" style={{ marginTop: '24px', color: 'var(--meta)' }}>
        Sample audit history · Illustrative cryptographic records · Tribe Saarthi design preview
      </p>
    </main>
  );
}
