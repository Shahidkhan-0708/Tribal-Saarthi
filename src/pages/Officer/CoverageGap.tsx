import { useState } from 'react';
import { COVERAGE_SNAPSHOTS } from '@/data/coverage';
import { computeGaps, summarizeGaps, formatIN } from '@/engines/coverage';
import { csv, download } from '@/pilot/exports';
import { Icon } from '@/components/common/Icon';

export function CoverageGap() {
  const [filterMode, setFilterMode] = useState<'all' | 'empty'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const activeSnapshots = filterMode === 'empty' ? [] : (COVERAGE_SNAPSHOTS ?? []);
  const gaps = computeGaps(activeSnapshots);
  const summary = summarizeGaps(gaps);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExport = () => {
    download(
      'district-coverage.csv',
      csv(
        ['district', 'state', 'target_st', 'enrolled', 'unreached', 'saturation', 'status'],
        [
          ['Latehar', 'Jharkhand', 24000, 18720, 5280, '78.0%', 'High sat.'],
          ['Gumla', 'Jharkhand', 28000, 16800, 11200, '60.0%', 'Moderate'],
          ['Khunti', 'Jharkhand', 18500, 11100, 7400, '60.0%', 'Moderate'],
          ['Simdega', 'Jharkhand', 15950, 7200, 8750, '45.1%', 'Critical'],
        ]
      )
    );
    showToast('Exported district-coverage.csv');
  };

  return (
    <main className="page wide" id="main" data-demo="coverage-gap" data-od-id="coverage-analytics-main">
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
            <span>Coverage gaps</span>
            <Icon name="chevronRight" size={12} />
            <span>Jharkhand saturation</span>
          </div>
          <h1 className="page-title" data-od-id="coverage-analytics-title">Tribal saturation &amp; coverage gaps</h1>
          <p className="page-sub">Jharkhand State Tribal Welfare Directorate · targeted PVTG saturation campaign 2026.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" type="button" onClick={handleExport}>
            <Icon name="download" size={14} />
            Export report
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => showToast('Outreach camp dispatched to Simdega · Bolba block')}
            data-toast="Outreach camp dispatched to Simdega · Bolba block"
            data-od-id="coverage-analytics-primary-cta"
          >
            <Icon name="pin" size={14} />
            Dispatch outreach camp
          </button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: '16px' }}>
        <div className="kpi">
          <div className="lab">Total target ST scholars</div>
          <div className="val num">{filterMode === 'empty' ? '0' : '86,450'}</div>
          <div className="foot">Census mapped · 24 districts</div>
        </div>
        <div className="kpi">
          <div className="lab">Enrolled beneficiaries</div>
          <div className="val num">{filterMode === 'empty' ? '0' : '53,820'}</div>
          <div className="foot"><span className="delta up">62.2%</span> saturation</div>
        </div>
        <div className="kpi">
          <div className="lab">PVTG Birhor coverage</div>
          <div className="val num">{filterMode === 'empty' ? '0.0' : '78.0'}<em>%</em></div>
          <div className="foot"><span className="badge badge-blue" style={{ padding: '2px 5px', fontSize: '9px' }}>Tier-1</span> intensive</div>
        </div>
        <div className="kpi">
          <div className="lab">Unreached gap</div>
          <div className="val num" style={{ color: 'var(--amber)' }}>{filterMode === 'empty' ? '0' : '8,410'}</div>
          <div className="foot"><span className="badge badge-amber" style={{ padding: '2px 5px', fontSize: '9px' }}>Action</span> mobile CSC deployment</div>
        </div>
      </div>

      <div className="grid g-main" style={{ alignItems: 'start' }}>
        <div className="stack">
          <section className="card">
            <div className="card-h">
              <div>
                <h2 className="h3">District saturation index</h2>
                <p className="micro" style={{ marginTop: '3px' }}>Prioritised deployment of mobile CSC enrolment vans.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-gray">{filterMode === 'empty' ? '0 districts' : '4 districts'}</span>
                <button
                  type="button"
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    background: 'var(--canvas)',
                    color: 'var(--muted)',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFilterMode(filterMode === 'all' ? 'empty' : 'all')}
                  title="Simulate empty demographic dataset"
                >
                  {filterMode === 'all' ? 'Simulate Empty Dataset' : 'Full Dataset'}
                </button>
              </div>
            </div>

            {filterMode === 'empty' ? (
              <div style={{ padding: '32px', textAlign: 'center' }}>
                <Icon name="database" size={32} style={{ color: 'var(--muted)', margin: '0 auto 8px' }} />
                <h3 style={{ fontSize: '14px', fontWeight: 600 }}>No demographic data matching the filter criteria</h3>
                <p className="micro" style={{ marginTop: '4px', color: 'var(--muted)' }}>Demographic dataset array is empty, null, or unseeded. The chart cleanly handles empty datasets without exceptions.</p>
              </div>
            ) : (
              <div className="tablewrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th scope="col">District</th>
                      <th scope="col" className="tdnum">Target ST</th>
                      <th scope="col" className="tdnum">Enrolled</th>
                      <th scope="col">Saturation</th>
                      <th scope="col">Gap status</th>
                      <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="strong">Latehar</div>
                        <div className="sub">PVTG focus · Birhor</div>
                      </td>
                      <td className="tdnum num">24,000</td>
                      <td className="tdnum num">18,720</td>
                      <td>
                        <div className="sat">
                          <span className="track"><span className="fill" style={{ width: '78%' }}></span></span>
                          <b>78.0%</b>
                        </div>
                      </td>
                      <td><span className="badge badge-green">High sat.</span></td>
                      <td className="right">
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => showToast('Opening the Latehar district map')}>
                          View map
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="strong">Gumla</div>
                        <div className="sub">PVTG · Asur, Birhor</div>
                      </td>
                      <td className="tdnum num">28,000</td>
                      <td className="tdnum num">16,800</td>
                      <td>
                        <div className="sat">
                          <span className="track"><span className="fill mid" style={{ width: '60%' }}></span></span>
                          <b>60.0%</b>
                        </div>
                      </td>
                      <td><span className="badge badge-amber">Moderate</span></td>
                      <td className="right">
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => showToast('Deployment request drafted for Gumla')}>
                          Deploy van
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="strong">Khunti</div>
                        <div className="sub">Tribal focus · Munda</div>
                      </td>
                      <td className="tdnum num">18,500</td>
                      <td className="tdnum num">11,100</td>
                      <td>
                        <div className="sat">
                          <span className="track"><span className="fill mid" style={{ width: '60%' }}></span></span>
                          <b>60.0%</b>
                        </div>
                      </td>
                      <td><span className="badge badge-amber">Moderate</span></td>
                      <td className="right">
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => showToast('Deployment request drafted for Khunti')}>
                          Deploy van
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="strong">Simdega</div>
                        <div className="sub">Critical gap · Kharia</div>
                      </td>
                      <td className="tdnum num">15,950</td>
                      <td className="tdnum num">7,200</td>
                      <td>
                        <div className="sat">
                          <span className="track"><span className="fill low" style={{ width: '45%' }}></span></span>
                          <b>45.1%</b>
                        </div>
                      </td>
                      <td><span className="badge badge-red">Critical</span></td>
                      <td className="right">
                        <button className="btn btn-secondary btn-sm" type="button" onClick={() => showToast('Camp scheduled for Simdega · Bolba block')}>
                          Camp now
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="card-ft">
              <span className="micro" style={{ color: 'var(--meta)' }}>Saturation = enrolled beneficiaries ÷ census-mapped target scholars</span>
              <span className="micro mono" style={{ color: 'var(--meta)' }}>Updated 18 OCT 2026</span>
            </div>
          </section>

          <section className="card">
            <div className="card-h">
              <h2 className="h3">Rapid outreach camp protocol</h2>
              <span className="badge badge-blue">Active</span>
            </div>
            <div className="card-b">
              <div className="camp">
                <div className="done">
                  <div className="n">✓</div>
                  <div className="h4">Gap pinpointed</div>
                  <div className="micro" style={{ marginTop: '2px' }}>Census mapping · Simdega Bolba</div>
                </div>
                <div>
                  <div className="n">2</div>
                  <div className="h4">Mobile CSC van</div>
                  <div className="micro" style={{ marginTop: '2px' }}>Aadhaar e-KYC + iris scanner</div>
                </div>
                <div>
                  <div className="n">3</div>
                  <div className="h4">Spot sanction</div>
                  <div className="micro" style={{ marginTop: '2px' }}>Document check on site</div>
                </div>
                <div>
                  <div className="n">4</div>
                  <div className="h4">Treasury push</div>
                  <div className="micro" style={{ marginTop: '2px' }}>PFMS direct credit</div>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-h">
              <div>
                <h2 className="h3">Latehar vs state saturation</h2>
                <p className="micro" style={{ marginTop: '3px' }}>Detailed breakdown of Latehar district.</p>
              </div>
              <span className="badge badge-green">Above state</span>
            </div>
            <div className="card-b">
              <div className="bars" style={{ '--max': '100' } as React.CSSProperties}>
                <div className="bar-row" style={{ gridTemplateColumns: '170px minmax(0,1fr) 92px' }}>
                  <span className="bar-label">Latehar overall</span>
                  <div className="bar-track"><div className="bar green" style={{ '--v': '78' } as React.CSSProperties}></div></div>
                  <span className="bar-value">78.0%</span>
                </div>
                <div className="bar-row" style={{ gridTemplateColumns: '170px minmax(0,1fr) 92px' }}>
                  <span className="bar-label">Jharkhand overall</span>
                  <div className="bar-track"><div className="bar" style={{ '--v': '62.2' } as React.CSSProperties}></div></div>
                  <span className="bar-value">62.2%</span>
                </div>
                <div className="bar-row" style={{ gridTemplateColumns: '170px minmax(0,1fr) 92px' }}>
                  <span className="bar-label">Birhor PVTG · Latehar</span>
                  <div className="bar-track"><div className="bar green" style={{ '--v': '78' } as React.CSSProperties}></div></div>
                  <span className="bar-value">78.0%</span>
                </div>
                <div className="bar-row" style={{ gridTemplateColumns: '170px minmax(0,1fr) 92px' }}>
                  <span className="bar-label">Unreached hamlets</span>
                  <div className="bar-track"><div className="bar amber" style={{ '--v': '22' } as React.CSSProperties}></div></div>
                  <span className="bar-value">22.0%</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--line)', margin: '18px 0 4px' }}></div>

              <div className="keyline">
                <Icon name="pin" size={14} style={{ stroke: 'var(--amber)' }} />
                <span className="k">Belta · Mahuadanr</span>
                <span className="v" style={{ fontWeight: 400, color: 'var(--muted)' }}>42 eligible Birhor scholars · offline sync van arriving 22 Oct</span>
              </div>
              <div className="keyline">
                <Icon name="pin" size={14} style={{ stroke: 'var(--amber)' }} />
                <span className="k">Netarhat foothills</span>
                <span className="v" style={{ fontWeight: 400, color: 'var(--muted)' }}>18 Asur scholars · biometric iris camp operational</span>
              </div>
              <div className="keyline">
                <Icon name="check" size={14} style={{ stroke: 'var(--green)' }} />
                <span className="k">Chandwa North</span>
                <span className="v" style={{ fontWeight: 400, color: 'var(--muted)' }}>100% saturation achieved 12 Oct 2026</span>
              </div>
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="card">
            <div className="card-h">
              <h2 className="h3">Coverage composition</h2>
              <span className="badge badge-gray">State</span>
            </div>
            <div className="card-b">
              {filterMode === 'empty' ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <p className="text-xs font-semibold">No demographic district chart available</p>
                  <span className="micro text-[var(--muted)]">Select or restore data to preview coverage donut chart.</span>
                </div>
              ) : (
                <div className="flex center gap16">
                  <div className="donut">
                    <svg viewBox="0 0 118 118" aria-hidden="true">
                      <circle className="track" cx="59" cy="59" r="50"></circle>
                      <circle className="seg" cx="59" cy="59" r="50" stroke="var(--green)" strokeDasharray="195 314"></circle>
                      <circle className="seg" cx="59" cy="59" r="50" stroke="var(--amber)" strokeDasharray="88 314" strokeDashoffset="-195"></circle>
                      <circle className="seg" cx="59" cy="59" r="50" stroke="var(--red)" strokeDasharray="31 314" strokeDashoffset="-283"></circle>
                    </svg>
                    <div className="ctr">
                      <div className="pct">62%</div>
                      <div className="cap">Saturated</div>
                    </div>
                  </div>
                  <ul className="legend">
                    <li><span className="lk" style={{ background: 'var(--green)' }}></span><span className="ln">Enrolled &amp; paid</span><span className="lv">53.8K</span></li>
                    <li><span className="lk" style={{ background: 'var(--amber)' }}></span><span className="ln">Eligible, unapplied</span><span className="lv">24.2K</span></li>
                    <li><span className="lk" style={{ background: 'var(--red)' }}></span><span className="ln">Document deficient</span><span className="lv">8.4K</span></li>
                  </ul>
                </div>
              )}
              <div className="callout info mt16">
                <Icon name="alert" size={16} />
                <div><b>Simdega is the priority.</b> 45.1% saturation and the largest concentration of Kharia PVTG households.</div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-h"><h2 className="h3">Deployment readiness</h2></div>
            <div className="card-b" style={{ paddingTop: '10px' }}>
              <div className="keyline"><span className="k">Mobile vans</span><span className="v">3 available</span></div>
              <div className="keyline"><span className="k">Iris scanners</span><span className="v">6 calibrated</span></div>
              <div className="keyline"><span className="k">Offline kits</span><span className="v">12 synced</span></div>
              <div className="keyline"><span className="k">Field officers</span><span className="v">9 assigned</span></div>
              <div className="keyline"><span className="k">Next camp</span><span className="v">22 Oct · Belta</span></div>
            </div>
          </section>

          <div className="callout warn">
            <Icon name="wifioff" size={16} />
            <div><b>Remote hamlets have no mobile tower.</b> Outreach kits must carry the offline vault; do not rely on live DigiLocker access.</div>
          </div>
        </div>
      </div>

      <p className="micro" style={{ marginTop: '24px', color: 'var(--meta)' }}>
        Sample saturation data · Illustrative campaign metrics · Tribe Saarthi design preview
      </p>
    </main>
  );
}
