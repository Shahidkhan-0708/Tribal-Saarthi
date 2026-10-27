export { NavigationShell } from './NavigationShell';

import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSession } from '@/store/session';
import { useData } from '@/store/data';
import { USERS } from '@/data/coverage';
import { DemoTour } from '@/components/demo/DemoTour';
import { EdgeCaseTestSuiteModal } from '@/components/common/EdgeCaseTestSuiteModal';
import { Saarthi } from '@/components/saarthi';
import { Icon, type IconName } from '@/components/common/Icon';
import type { LangCode } from '@/types';

interface NavEntry {
  path: string;
  label: string;
  icon: IconName;
  count?: string;
  odId: string;
}

const primaryScholarNav: NavEntry[] = [
  { path: '/student', label: 'Dashboard', icon: 'home', odId: 'nav-dashboard' },
  { path: '/student/discovery', label: 'Scholarships', icon: 'bookOpen', odId: 'nav-scholarship-discovery' },
  { path: '/student/application', label: 'Applications', icon: 'layers', odId: 'nav-application-tracker' },
  { path: '/student/wallet', label: 'My documents', icon: 'file', odId: 'nav-document-wallet' },
];

const secondaryScholarNav: NavEntry[] = [
  { path: '/student/profile', label: 'My profile', icon: 'user', odId: 'nav-scholar-profile' },
  { path: '/student/family', label: 'Family access', icon: 'users', odId: 'nav-family-access' },
  { path: '/student/offline', label: 'Saved changes', icon: 'refresh', odId: 'nav-offline-sync' },
];

const scholarNav: NavEntry[] = [...primaryScholarNav, ...secondaryScholarNav];

const officerNav: NavEntry[] = [
  { path: '/officer', label: 'Review queue', icon: 'layers', count: '145', odId: 'nav-officer-review-queue' },
  { path: '/officer/inspection', label: 'Case inspection', icon: 'eye', odId: 'nav-officer-case-inspection' },
  { path: '/officer/sanction', label: 'Approve scholarship', icon: 'signature', odId: 'nav-sanction-signing' },
  { path: '/officer/testing', label: 'Service testing', icon: 'activity', odId: 'nav-resilience-console' },
  { path: '/officer/coverage', label: 'Coverage gaps', icon: 'chart', odId: 'nav-coverage-analytics' },
  { path: '/officer/audit', label: 'Decision history', icon: 'database', odId: 'nav-audit-log' },
];

export function Layout({ children }: { children?: ReactNode }) {
  const { user, lang, setLang, logout, login } = useSession();
  const resetDemo = useData((s) => s.resetDemo);
  const notifications = useData((s) => s.notifications);
  const markRead = useData((s) => s.markRead);
  const isBackendConnected = useSession((s) => s.isBackendConnected);
  const isBackendSyncing = useSession((s) => s.isBackendSyncing);
  const lastSyncTime = useSession((s) => s.lastSyncTime);
  const isDataSyncing = useData((s) => s.isSyncing);
  const syncWithBackend = useData((s) => s.syncWithBackend);
  const navigate = useNavigate();
  const location = useLocation();
  const [showTour, setShowTour] = useState(false);
  const [showTestSuite, setShowTestSuite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to dismiss notification dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
    };
    if (notifsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notifsOpen]);

  if (!user) return <>{children}</>;

  const isStudent = user.role === 'student';
  const navItems = isStudent ? scholarNav : officerNav;
  const isOfficer = !isStudent;

  const userNotifs = notifications.filter(
    (n) => !n.userId || (isStudent ? n.userId === user.studentId : true)
  );
  const unreadCount = userNotifs.filter((n) => !n.readAt).length;

  const current = (path: string) => {
    if (path === '/student') return location.pathname === '/student';
    if (path === '/officer') return location.pathname === '/officer';
    return location.pathname.startsWith(path);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (isStudent) {
      navigate(`/student/discovery?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/officer?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--canvas)] text-[var(--ink-2)]" style={{ fontFamily: 'var(--font)' }}>
      <a className="skip" href="#main-content">
        Skip to content
      </a>

      {/* 1. Official Government Strip */}
      <div className="govstrip" role="region" aria-label="Official government website banner">
        <div className="l">
          <Icon name="shield" className="i-sm" style={{ stroke: '#A7F3D0' }} />
          <span className="font-semibold text-white">भारत सरकार · Government of India</span>
          <span style={{ color: '#047857' }}>|</span>
          <b>जनजातीय कार्य मंत्रालय · Ministry of Tribal Affairs</b>
          <span className="hide-sm text-emerald-200">
            Direct Benefit Transfer (DBT) Portal
          </span>
        </div>
        <div className="r">
          <span className="tag">
            <Icon name="lock" className="i-sm" style={{ stroke: '#A7F3D0' }} />
            Secure Session · 256-Bit TLS 1.3
          </span>
          <span className="hide-sm" style={{ color: '#047857' }}>
            |
          </span>
          <span className="hide-sm text-emerald-200 font-medium">
            National Scholarship Platform Compliant
          </span>
        </div>
      </div>

      {/* 2. Standardized Appbar */}
      <header className="appbar" role="banner">
        <Link className="brand group" to={isStudent ? '/student' : '/officer'} aria-label="Tribe Saarthi home">
          <span className="brand-mark">TS</span>
          <span>
            <span className="brand-name flex items-center gap-1.5">
              <span>Tribe Saarthi</span>
              <span className="text-[11px] font-normal text-slate-500">/ ट्राइब सारथी</span>
            </span>
            <span className="brand-sub">
              {isStudent ? 'Scholar portal · MoTA' : 'Officer verification desk · MoTA'}
            </span>
          </span>
        </Link>

        <form className="searchbar" role="search" onSubmit={handleSearch}>
          <Icon name="search" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isStudent ? 'Search scholarships, schemes, records…' : 'Search cases, scholars, receipts…'
            }
            aria-label="Search"
          />
          <kbd>⌘K</kbd>
        </form>

        <span className="spacer" />

        <div className="langselect">
          <span>{lang === 'hi' ? 'हिंदी' : 'English'}</span>
          <span style={{ color: '#64748B' }}>/</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as LangCode)}
            aria-label="Change language"
            className="bg-transparent border-0 outline-none text-[11.5px] font-semibold cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="sant">संताली</option>
          </select>
          <Icon name="chevronDown" />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            className="iconbtn"
            type="button"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notifsOpen}
            onClick={() => setNotifsOpen(!notifsOpen)}
          >
            <Icon name="bell" />
            {unreadCount > 0 && <span className="dot" />}
          </button>

          {notifsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-xl z-50 overflow-hidden"
              role="region"
              aria-label="Notifications panel"
            >
              <div className="flex items-center justify-between p-3.5 border-b border-[var(--line)] bg-[var(--surface-2)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--ink)]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-amber text-[10px] py-0.5 px-1.5">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-[var(--green)] hover:underline"
                    onClick={() => {
                      userNotifs.forEach((n) => {
                        if (!n.readAt) markRead(n.id);
                      });
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[var(--line)]">
                {userNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--muted)]">
                    No notifications at this time.
                  </div>
                ) : (
                  userNotifs.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors hover:bg-[var(--surface-2)] cursor-pointer ${
                        !n.readAt ? 'bg-amber-500/5' : ''
                      }`}
                      onClick={() => {
                        if (!n.readAt) markRead(n.id);
                        setNotifsOpen(false);
                        if (n.category === 'deficiency') {
                          navigate('/student/wallet');
                        } else if (n.category === 'verification') {
                          navigate(isStudent ? '/student/application' : '/officer');
                        } else if (n.category === 'payment') {
                          navigate('/student/history');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {!n.readAt && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <span className="font-semibold text-[var(--ink)] leading-snug">
                            {n.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--meta)] shrink-0">
                          {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[var(--muted)] mt-1 leading-relaxed line-clamp-2">
                        {n.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-[var(--line)] bg-[var(--surface-2)] text-center">
                <Link
                  to={isStudent ? '/student/history' : '/officer/broadcasts'}
                  className="text-[11px] font-semibold text-[var(--ink)] hover:underline"
                  onClick={() => setNotifsOpen(false)}
                >
                  {isStudent ? 'View payment history' : 'Manage broadcasts'} →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="iconbtn md:hidden"
          aria-label="Navigation menu"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
        >
          <Icon name={mobileDrawerOpen ? 'x' : 'menu'} />
        </button>

        {/* User Pill with Persona Switcher for pair programming / demo validation */}
        <div className="userpill relative flex items-center gap-2">
          <span className={`avatar ${isOfficer ? 'dark' : ''}`}>{initials}</span>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="nm block text-[12px] font-semibold text-[var(--ink)]">{user.name}</span>
              <span className="sr-only">{user.role} Account</span>
            </div>
            <span className="rl block text-[10px] text-[var(--muted)]">
              {isStudent ? 'BIT Mesra · 2024-CSE-104' : user.designation ?? 'BIT Mesra Nodal Officer'}
            </span>
          </div>
          <select
            aria-label="Demo persona"
            value={user.id}
            onChange={(e) => {
              const next = USERS.find((p) => p.id === e.target.value);
              if (next) {
                login(next.id);
                navigate(next.role === 'student' ? '/student' : '/officer');
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Switch demo persona"
          >
            {USERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.role === 'student' ? 'Scholar' : 'Officer'}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* 3. Main Layout with Left Rail & Content */}
      <div className="layout">
        <aside className="rail" role="navigation" aria-label={isStudent ? 'Scholar navigation' : 'Officer navigation'}>
          <div className="rail-label">{isStudent ? 'Your workspace' : 'Verification desk'}</div>

          <nav className="rail-nav">
            {(isStudent ? primaryScholarNav : officerNav).map((item) => {
              const active = current(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`navitem${active ? ' active' : ''}`}
                  data-od-id={item.odId}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.count && <span className="count">{item.count}</span>}
                </Link>
              );
            })}

            {isStudent && (
              <details className="mt-1 group">
                <summary className="navitem text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer list-none flex items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <Icon name="chevronDown" className="i-sm transition-transform group-open:rotate-180" />
                    <span>More options</span>
                  </span>
                </summary>
                <div className="pl-2 pt-1 border-l border-slate-200 ml-3 space-y-0.5">
                  {secondaryScholarNav.map((item) => {
                    const active = current(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`navitem text-xs${active ? ' active' : ''}`}
                        data-od-id={item.odId}
                        aria-current={active ? 'page' : undefined}
                      >
                        <Icon name={item.icon} className="i-sm" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </details>
            )}
          </nav>

          <div className="rail-divider" />

          <Link
            to={isStudent ? '/student/grievance' : '/officer/grievances'}
            className={`navitem${location.pathname.includes('grievance') ? ' active' : ''}`}
            data-od-id="nav-help-saarthi"
            aria-label="Help and Saarthi"
          >
            <Icon name="help" />
            <span>Help &amp; Saarthi</span>
          </Link>

          <div className="rail-foot">
            {/* Sovereign Trust & Security Indicator */}
            <div className="mb-3 p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-200/90 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11.5px]">
                <Icon name="shield" className="i-sm text-emerald-700 shrink-0" />
                <span>Direct Benefit Transfer</span>
              </div>
              <p className="text-[10.5px] text-emerald-900 mt-1 leading-tight">
                Sealed with UIDAI Aadhaar Vault &amp; PFMS.
              </p>
            </div>

            <div className="syncbox" data-od-id="sync-status-box">
              <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`pulse ${isBackendConnected ? 'bg-emerald-500' : ''}`} />
                  <span style={{ fontWeight: 600 }}>{isBackendConnected ? 'Supabase live' : (isOfficer ? 'Desk synced' : 'Work saved')}</span>
                </div>
                {isBackendConnected && (
                  <button
                    type="button"
                    onClick={() => syncWithBackend()}
                    disabled={isBackendSyncing || isDataSyncing}
                    style={{ background: 'none', border: 'none', color: '#047857', fontSize: '10px', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                    title="Refresh data from Supabase"
                  >
                    {isBackendSyncing || isDataSyncing ? 'Syncing…' : 'Sync'}
                  </button>
                )}
              </div>
              <p>
                {isBackendConnected ? (
                  <>
                    <span>axegexiaofxdmmizilri</span>
                    <br />
                    <span>Last sync: {lastSyncTime || 'Just now'}</span>
                  </>
                ) : (
                  <>
                    <span>Local offline store</span>
                    <br />
                    <span>Local demo - no offline sync</span>
                  </>
                )}
              </p>
            </div>

            <div className="eval-sandbox-box mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                <span>Evaluator Mode</span>
                <Link to="/mockups" className="text-[10px] text-slate-400 hover:text-slate-600">
                  Screens
                </Link>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  className="btn btn-secondary btn-xs py-1 px-2.5 text-[11px] font-medium"
                  type="button"
                  onClick={() => setShowTour(true)}
                >
                  Tour
                </button>
                <button
                  className="btn btn-secondary btn-xs py-1 px-2.5 text-[11px] font-medium text-emerald-800"
                  type="button"
                  onClick={() => setShowTestSuite(true)}
                >
                  Edge Case Suite
                </button>
                <button
                  className="btn btn-ghost btn-xs text-[10px] text-slate-400 hover:text-red-700 py-0.5 ml-auto"
                  type="button"
                  onClick={() => {
                    resetDemo();
                    navigate('/login');
                  }}
                >
                  Reset demo
                </button>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[var(--line)]">
              <button
                className="btn btn-ghost btn-sm w-full text-rose-600 hover:bg-rose-50"
                type="button"
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Primary Page Canvas */}
        <main className="page" id="main-content" tabIndex={-1}>
          {children ?? <Outlet />}
        </main>
      </div>

      {/* 4. Mobile Bottom Bar */}
      <nav className="mobilebar" aria-label="Mobile bottom navigation">
        {isStudent ? (
          <>
            <Link to="/student" className={current('/student') ? 'active' : ''}>
              <Icon name="home" />
              <span>Home</span>
            </Link>
            <Link to="/student/application" className={current('/student/application') ? 'active' : ''}>
              <Icon name="layers" />
              <span>Status</span>
            </Link>
            <Link to="/student/wallet" className={current('/student/wallet') ? 'active' : ''}>
              <Icon name="file" />
              <span>Documents</span>
            </Link>
            <Link to="/student/grievance" className={location.pathname.includes('grievance') ? 'active' : ''}>
              <Icon name="help" />
              <span>Saarthi AI</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/officer" className={current('/officer') ? 'active' : ''}>
              <Icon name="layers" />
              <span>Queue</span>
            </Link>
            <Link to="/officer/inspection" className={current('/officer/inspection') ? 'active' : ''}>
              <Icon name="eye" />
              <span>Cases</span>
            </Link>
            <Link to="/officer/coverage" className={current('/officer/coverage') ? 'active' : ''}>
              <Icon name="chart" />
              <span>Gaps</span>
            </Link>
            <Link to="/officer/audit" className={current('/officer/audit') ? 'active' : ''}>
              <Icon name="database" />
              <span>History</span>
            </Link>
          </>
        )}
      </nav>

      {/* Demo Tour and Edge Case Suite Modals */}
      {showTour && <DemoTour onClose={() => setShowTour(false)} />}
      {showTestSuite && <EdgeCaseTestSuiteModal open onClose={() => setShowTestSuite(false)} />}

      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex flex-col justify-end md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="bg-[var(--surface)] p-4 rounded-t-xl border-t border-[var(--line)] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-[var(--line)]">
              <span className="font-bold text-sm">Navigation</span>
              <button
                type="button"
                className="iconbtn"
                aria-label="Close navigation menu"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <Icon name="x" />
              </button>
            </div>
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="navitem"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to={isStudent ? '/student/grievance' : '/officer/grievances'}
                className="navitem"
                aria-label="Help and Saarthi"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <Icon name="help" />
                <span>Help and Saarthi</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
      {/* Floating Saarthi Voice Assistant */}
      <Saarthi />
    </div>
  );
}
