import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { MOCKUP_SCREENS, type MockupScreen } from '@/data/mockups';

interface ScreenItem {
  idx: string;
  title: string;
  tags: string[];
  tagClass?: string;
  desc: string;
  route: string;
  svgId: string;
}

interface ScreenGroup {
  group: string;
  items: ScreenItem[];
}

export function SvgGallery() {
  const [activeModalScreen, setActiveModalScreen] = useState<MockupScreen | null>(null);

  const screens: ScreenGroup[] = [
    {
      group: 'Scholar journey',
      items: [
        {
          idx: '01',
          title: 'Scholar dashboard',
          tags: ['Desktop', 'Mobile'],
          desc: 'Application status, progress rail, document checklist, recent updates.',
          route: '/student',
          svgId: '01-scholar-dashboard-desktop'
        },
        {
          idx: '03',
          title: 'Scholarship discovery',
          tags: [],
          desc: 'Three pre-matched schemes with support, coverage and next action.',
          route: '/student/discovery',
          svgId: '03-scholarship-discovery-empty-matched'
        },
        {
          idx: '04-06',
          title: 'Application flow',
          tags: ['3 steps'],
          desc: 'Profile, documents, and a final check with statutory declaration.',
          route: '/student/application/new',
          svgId: '04-application-flow-step-1'
        },
        {
          idx: '07',
          title: 'Application lifecycle',
          tags: [],
          desc: 'Five statutory milestones, sanction breakdown, DBT pipeline.',
          route: '/student/application',
          svgId: '07-application-tracker-multi-stage'
        },
        {
          idx: '08',
          title: 'DigiLocker wallet',
          tags: [],
          desc: 'Issuer, validity and seal status for four reusable documents.',
          route: '/student/wallet',
          svgId: '08-document-wallet-vault-verification'
        },
        {
          idx: '09',
          title: 'Saarthi help desk',
          tags: [],
          desc: 'Multilingual assistant, grievance history, national helplines.',
          route: '/student/grievance',
          svgId: '09-help-saarthi-multilingual-support'
        },
        {
          idx: '10',
          title: 'Profile & PVTG entitlements',
          tags: [],
          desc: 'Verified demographics, 100% coverage, identity and bank rails.',
          route: '/student/profile',
          svgId: '10-scholar-profile-entitlements'
        },
        {
          idx: '11',
          title: 'Family access & consent',
          tags: [],
          desc: 'Guardian permissions, read-only scope, Aadhaar OTP authorisation.',
          route: '/student/family',
          svgId: '11-family-access-delegation'
        },
        {
          idx: '12',
          title: 'Offline sync queue',
          tags: [],
          desc: 'Three local operations, integrity hashes, last-write-wins pipeline.',
          route: '/student/offline',
          svgId: '12-offline-sync-conflict-resolution'
        },
      ]
    },
    {
      group: 'Officer verification',
      items: [
        {
          idx: '13',
          title: 'Review queue',
          tags: ['Officer'],
          tagClass: 'o',
          desc: 'Caseload metrics, SLA risk filters, four ranked applications.',
          route: '/officer',
          svgId: '13-officer-review-queue'
        },
        {
          idx: '14-15',
          title: 'Case inspection + deficiency',
          tags: [],
          desc: 'Four evidence checks, concurrence pipeline, correction notice modal.',
          route: '/officer/inspection',
          svgId: '14-officer-case-inspection-review'
        },
        {
          idx: '16',
          title: 'Digital sanction signing',
          tags: [],
          desc: 'Expenditure manifest, DSC token, six-digit PIN, audit hash.',
          route: '/officer/sanction',
          svgId: '16-sanction-signing-modal-pipeline'
        },
        {
          idx: '17',
          title: 'Service testing console',
          tags: [],
          desc: 'Fault injection matrix, chaos intensity, self-healing topology.',
          route: '/officer/testing',
          svgId: '17-resilience-console-fallback-modes'
        },
        {
          idx: '18',
          title: 'Coverage gap analytics',
          tags: [],
          desc: 'State saturation, district index, outreach camp protocol.',
          route: '/officer/coverage',
          svgId: '18-coverage-gap-analytics-heatmap'
        },
        {
          idx: '19',
          title: 'Decision history',
          tags: [],
          desc: 'Cryptographic audit blocks, actors, credentials, verification.',
          route: '/officer/audit',
          svgId: '19-audit-trail-tamper-evident-log'
        },
      ]
    },
    {
      group: 'Access & public verification',
      items: [
        {
          idx: '20-21',
          title: 'Sign in & recovery',
          tags: [],
          desc: 'Invite-only pilot access, password reset as a second state.',
          route: '/login',
          svgId: '20-sign-in-screen'
        },
        {
          idx: '22',
          title: 'Public receipt verification',
          tags: [],
          desc: 'Sanction receipt lookup, trust pathway, signing authority.',
          route: '/receipt',
          svgId: '22-receipt-verification-portal'
        },
      ]
    }
  ];

  return (
    <div className="launch" id="launch" data-od-id="launch-main">
      <div className="masthead">
        <Link className="brand" to="/mockups">
          <span className="brand-mark">TS</span>
          <span>
            <span className="brand-name">Tribe Saarthi</span>
            <span className="brand-sub">Scholarship case system · MoTA</span>
          </span>
        </Link>
        <div className="right">
          <span className="badge badge-green"><span className="bdot"></span>22 screens</span>
          <Link className="btn btn-secondary btn-sm" to="/student">
            Open scholar app <Icon name="arrowRight" size={12} />
          </Link>
        </div>
      </div>

      <header className="hero" data-od-id="launch-hero">
        <div>
          <div className="eyebrow">Interface system · v2</div>
          <h1>The case file,<br /><span>quietly resolved.</span></h1>
          <p className="lede">
            Twenty-two wireframe flows rebuilt on one ink-and-slate system: an off-white canvas, white cards, 1px rules, a single typeface and one ink action per screen. Structure, steps and widgets are unchanged.
          </p>
          <div className="hero-meta">
            <div className="hm"><b>22</b><span>Screens · scholar, officer, public</span></div>
            <div className="hm"><b>Type</b><span>Plus Jakarta Sans · 400-800</span></div>
            <div className="hm"><b>6 / 8</b><span>Control &amp; card radius</span></div>
            <div className="hm"><b>#0F172A</b><span>Single ink action</span></div>
          </div>
        </div>

        <aside className="specimen" aria-label="Design system specimen">
          <div className="sh"><b>System specimen</b><span className="badge badge-gray">Hairline</span></div>
          <div className="swatches">
            <div className="sw" style={{ background: '#0F172A' }}><span>0F172A</span></div>
            <div className="sw" style={{ background: '#334155' }}><span>334155</span></div>
            <div className="sw" style={{ background: '#64748B' }}><span>64748B</span></div>
            <div className="sw light" style={{ background: '#E2E8F0' }}><span>E2E8F0</span></div>
            <div className="sw light" style={{ background: '#F9FAFB' }}><span>F9FAFB</span></div>
            <div className="sw light" style={{ background: '#FFFFFF' }}><span>FFFFFF</span></div>
          </div>
          <div className="row">
            <div>
              <div className="aa">Aa</div>
              <div className="micro" style={{ marginTop: '5px' }}>Plus Jakarta Sans · 400-800</div>
            </div>
            <div className="right">
              <div className="mono" style={{ fontSize: '18px', color: 'var(--ink)' }}>Aa</div>
              <div className="micro" style={{ marginTop: '5px' }}>JetBrains Mono · records</div>
            </div>
          </div>
          <div className="row">
            <span className="eyebrow">Controls</span>
            <div className="flex gap8">
              <span className="btn btn-primary btn-sm">Primary</span>
              <span className="btn btn-secondary btn-sm">Secondary</span>
            </div>
          </div>
          <div className="row">
            <span className="eyebrow">States</span>
            <div className="flex gap8 wrap">
              <span className="badge badge-green">Complete</span>
              <span className="badge badge-amber">Pending</span>
              <span className="badge badge-blue">Active</span>
            </div>
          </div>
        </aside>
      </header>

      <div className="section-head" data-od-id="screen-index-heading">
        <h2>Screen index</h2>
        <p>22 flows · delivery order</p>
      </div>

      <div className="screens" data-od-id="screen-index">
        {screens.map((group) => (
          <div key={group.group} style={{ gridColumn: '1/-1', display: 'contents' }}>
            <div className="sgroup">
              <span className="gt">{group.group}</span>
              <span className="gl"></span>
            </div>
            {group.items.map((item) => (
              <Link key={item.idx} className="srow" to={item.route}>
                <span className="idx">{item.idx}</span>
                <span>
                  <span className="st">
                    {item.title}
                    {item.tags.map((t) => (
                      <span key={t} className={`tag ${item.tagClass || ''}`}>{t}</span>
                    ))}
                  </span>
                  <span className="sd">{item.desc}</span>
                </span>
                <span className="arr"><Icon name="arrowRight" size={14} /></span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="notes">
        <div className="note">
          <h3>Structure preserved</h3>
          <p>Two-rail desktop shells, multi-column officer tables, three-step wizard and mobile bottom bar keep the exact widget architecture of the wireframes.</p>
        </div>
        <div className="note">
          <h3>Hairline discipline</h3>
          <p>No shadows, no gradients: 1px rules divide every region, radii stop at 8px, and status colour lives in soft pastel tags rather than fills.</p>
        </div>
        <div className="note">
          <h3>Honest sample data</h3>
          <p>All records are the labelled sample case from the wireframes. No invented metrics, no fabricated official claims, no imagery substitutes.</p>
        </div>
      </div>

      <footer className="lf">
        <span>Tribe Saarthi · Scholarship case system · Interface system v2</span>
        <span>Inter · JetBrains Mono · ink, slate and hairline</span>
      </footer>

      {/* Optional full modal preview */}
      {activeModalScreen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 1000
          }}
          onClick={() => setActiveModalScreen(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '8px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{activeModalScreen.title}</h3>
                <p className="micro" style={{ color: 'var(--muted)' }}>{activeModalScreen.description}</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveModalScreen(null)}
              >
                Close
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px', background: 'var(--canvas)', display: 'flex', justifyContent: 'center' }}>
              <img src={activeModalScreen.svgUrl} alt={activeModalScreen.title} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
