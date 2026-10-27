import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { Icon } from '@/components/common/Icon';

interface SchemeItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeType: 'green' | 'blue' | 'gray';
  category: string;
  amountLabel: string;
  amount: string;
  amountSub: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  ctaType: 'primary' | 'secondary';
  odId?: string;
  featured?: boolean;
  statusBadge?: string;
  statusNote?: string;
  footerSub?: string;
}

const SCHEMES: SchemeItem[] = [
  {
    id: 'post_matric',
    title: 'Post-Matric ST Scholarship',
    subtitle: 'MoTA Central Sector Scheme · 2026-2027',
    badge: 'Already applied',
    badgeType: 'green',
    category: 'Central sector',
    amountLabel: 'Maximum annual sanction',
    amount: '₹1,32,000',
    amountSub: '100% tuition reimbursement',
    features: [
      'Full tuition fee reimbursement',
      '₹24,000/yr student maintenance',
      'Special PVTG book & hardware grant',
    ],
    ctaText: 'View application status',
    ctaLink: '/student/application',
    ctaType: 'secondary',
    statusBadge: 'In review',
    statusNote: 'College review · 2 days',
  },
  {
    id: 'top_class',
    title: 'Top Class Education for ST',
    subtitle: 'Valid at BIT Mesra, IITs & NITs',
    badge: 'Recommended',
    badgeType: 'blue',
    category: 'Premier institute',
    amountLabel: 'Full coverage grant',
    amount: '₹2,50,000',
    amountSub: 'Per year, subject to fee schedule',
    features: [
      'Full institute hostel & mess fees',
      'One-time laptop grant of ₹45,000',
      'Annual book grant of ₹3,000/yr',
    ],
    ctaText: 'Apply with 1-click sync',
    ctaLink: '/student/application/new?scheme=top_class',
    ctaType: 'primary',
    odId: 'scholarship-discovery-primary-cta',
    featured: true,
    footerSub: '3 documents already in your wallet',
  },
  {
    id: 'overseas',
    title: 'National Overseas Scholarship',
    subtitle: "For higher studies abroad · Master's & PhD",
    badge: 'Eligibility check',
    badgeType: 'gray',
    category: 'Overseas fellowship',
    amountLabel: 'International stipend',
    amount: 'US$15,400',
    amountSub: 'Per year, plus tuition and airfare',
    features: [
      'Full international tuition fees',
      'Return economy airfare',
      'Reserved ST & PVTG quota',
    ],
    ctaText: "Check Master's eligibility",
    ctaLink: '/student/grievance',
    ctaType: 'secondary',
    footerSub: 'Requires an admission offer',
  },
];

export function Discovery() {
  const data = useData();
  const user = useSession((s) => s.user);
  const [params] = useSearchParams();
  const student = data.students.find((s) => s.id === user?.studentId) ?? data.students[0];
  const query = params.get('search')?.toLowerCase() ?? '';

  const filteredSchemes = SCHEMES.filter((s) => {
    if (!query) return true;
    const matchText = `${s.title} ${s.subtitle} ${s.category} ${s.features.join(' ')} ${s.amount}`.toLowerCase();
    return matchText.includes(query);
  });

  return (
    <div data-demo="eligibility-audit" data-od-id="scholarship-discovery-main" className="space-y-6">
      {/* Page Header */}
      <div className="page-head">
        <div>
          <div className="crumb">
            <span>Scholar workspace</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>Scholarships</span>
          </div>
          <h1 className="page-title" data-od-id="scholarship-discovery-title">
            Eligible Ministry of Tribal Affairs scholarships
          </h1>
          <p className="page-sub">
            Pre-matched against your verified {student?.tribe ?? 'Birhor'} (PVTG) status and {student?.domicileState ?? 'Jharkhand'} domicile. One application is already in review.
          </p>
        </div>
        <div className="page-actions">
          <span className="badge badge-green">
            <Icon name="check" className="i-sm" style={{ width: '11px', height: '11px' }} />
            Profile verified
          </span>
          <Link className="btn btn-secondary" to="/student/profile">
            Review my details
          </Link>
        </div>
      </div>

      {/* Search Filter Chip / Reset Banner */}
      {query && (
        <div className="flex items-center justify-between p-3.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <Icon name="search" className="i-sm text-slate-500" />
            <span>
              Showing results for <b className="text-[var(--ink)]">"{query}"</b> ({filteredSchemes.length} matching {filteredSchemes.length === 1 ? 'scheme' : 'schemes'})
            </span>
          </div>
          <Link to="/student/discovery" className="font-semibold text-[var(--green)] hover:underline">
            Clear search
          </Link>
        </div>
      )}

      {/* Pre-check Match Notice */}
      <div className="notice" style={{ marginBottom: '20px' }}>
        <Icon name="spark" className="i" />
        <span>
          <b style={{ fontWeight: 560, color: 'var(--ink)' }}>Three schemes match your profile.</b> Eligibility was checked against your DigiLocker community certificate and income record: no documents to re-upload.
        </span>
        <span className="micro mono" style={{ marginLeft: 'auto', color: 'var(--meta)', whiteSpace: 'nowrap' }}>
          CHECKED 18 OCT
        </span>
      </div>

      {/* Scheme Cards Grid or Empty State */}
      {filteredSchemes.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
            <Icon name="search" className="i text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-[var(--ink)]">No matching scholarship schemes found</h3>
          <p className="text-xs text-[var(--muted)] mt-1.5 max-w-md mx-auto">
            No schemes matched "{query}". Try searching for keywords like "post-matric", "laptop", "overseas", or clear the filter to see all schemes.
          </p>
          <Link to="/student/discovery" className="btn btn-secondary btn-sm mt-4 inline-flex items-center gap-2">
            Show all schemes
          </Link>
        </div>
      ) : (
        <div className="grid g3" style={{ gap: '20px', alignItems: 'stretch' }}>
          {filteredSchemes.map((item) => (
            <article
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                ...(item.featured
                  ? {
                      borderColor: 'var(--blue-border)',
                      boxShadow: '0 0 0 1px rgba(15,23,42,.08), var(--shadow-1)',
                    }
                  : {}),
              }}
            >
              <div className="card-b" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="flex between center">
                  <span className={`badge badge-${item.badgeType}`}>
                    {item.badgeType !== 'gray' && <span className="bdot" />}
                    {item.badge}
                  </span>
                  <span className="micro" style={{ color: 'var(--meta)' }}>
                    {item.category}
                  </span>
                </div>
                <h2 className="h2" style={{ marginTop: '16px', fontSize: '18px', letterSpacing: '-.02em' }}>
                  {item.title}
                </h2>
                <p className="micro" style={{ marginTop: '5px' }}>
                  {item.subtitle}
                </p>

                <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <div className="eyebrow">{item.amountLabel}</div>
                  <div className="amount" style={{ fontSize: '28px', marginTop: '5px' }}>
                    {item.amount}
                  </div>
                  <div className="micro" style={{ marginTop: '4px' }}>
                    {item.amountSub}
                  </div>
                </div>

                <ul
                  className="stack-sm"
                  style={{
                    listStyle: 'none',
                    marginTop: '16px',
                    fontSize: '11.5px',
                    color: 'var(--muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.features.map((feat) => (
                    <li key={feat} className="flex gap8">
                      <Icon name="check" className="i-sm" style={{ stroke: 'var(--green)', marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                  <Link
                    className={`btn btn-${item.ctaType} btn-block`}
                    to={item.ctaLink}
                    data-od-id={item.odId}
                  >
                    {item.ctaText}
                    {item.ctaType === 'primary' && <Icon name="arrowRight" className="i" />}
                  </Link>
                  {item.statusBadge && (
                    <div
                      className="flex center gap8 micro"
                      style={{ justifyContent: 'center', marginTop: '10px', color: 'var(--meta)' }}
                    >
                      <span className="badge badge-gray">{item.statusBadge}</span>
                      <span>{item.statusNote}</span>
                    </div>
                  )}
                  {item.footerSub && (
                    <div className="micro" style={{ textAlign: 'center', marginTop: '10px', color: 'var(--meta)' }}>
                      {item.footerSub}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Preparation Checklist & Scheme Comparison Section */}
      <div className="grid g2 mt24" style={{ alignItems: 'start' }}>
        <section className="card">
          <div className="card-h">
            <div>
              <h2 className="h3">Preparation checklist</h2>
              <p className="micro" style={{ marginTop: '3px' }}>
                What every scheme asks for before submission.
              </p>
            </div>
            <span className="badge badge-gray">Shared</span>
          </div>
          <div className="card-b" style={{ padding: '6px 20px' }}>
            <div className="keyline">
              <Icon name="check" className="i" />
              <span className="k">Community certificate</span>
              <span className="v">In wallet</span>
              <span className="micro mono" style={{ marginLeft: 'auto', color: 'var(--green)' }}>
                VERIFIED
              </span>
            </div>
            <div className="keyline">
              <Icon name="check" className="i" />
              <span className="k">Income certificate</span>
              <span className="v">In wallet</span>
              <span className="micro mono" style={{ marginLeft: 'auto', color: 'var(--green)' }}>
                VERIFIED
              </span>
            </div>
            <div className="keyline">
              <Icon name="check" className="i" />
              <span className="k">College bonafide</span>
              <span className="v">In wallet</span>
              <span className="micro mono" style={{ marginLeft: 'auto', color: 'var(--green)' }}>
                VERIFIED
              </span>
            </div>
            <div className="keyline">
              <Icon name="clock" className="i" style={{ stroke: 'var(--amber)' }} />
              <span className="k">Admission offer</span>
              <span className="v">Needed for overseas</span>
              <span className="micro mono" style={{ marginLeft: 'auto', color: 'var(--amber)' }}>
                NOT YET
              </span>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card-b" style={{ padding: '22px' }}>
            <div className="flex center gap8">
              <span className="iconchip">
                <Icon name="spark" className="i" />
              </span>
              <span className="eyebrow">Which scheme fits?</span>
            </div>
            <h2 className="h2" style={{ marginTop: '14px', fontSize: '18px', letterSpacing: '-.02em', maxWidth: '26ch' }}>
              Comparing central, premier-institute and overseas support.
            </h2>
            <p className="small" style={{ color: 'var(--muted)', marginTop: '8px', lineHeight: 1.65 }}>
              Saarthi can compare total yearly value against your current fee receipt, and flag overlapping benefits you cannot claim twice.
            </p>
            <Link className="btn btn-primary" to="/student/grievance" style={{ marginTop: '16px' }}>
              Compare schemes
              <Icon name="arrowRight" className="i" />
            </Link>
          </div>
        </section>
      </div>

      <p className="micro" style={{ marginTop: '24px', color: 'var(--meta)' }}>
        Sample schemes and amounts · Verified 18 Oct 2026 · Always confirm the current scheme circular before applying.
      </p>
    </div>
  );
}
