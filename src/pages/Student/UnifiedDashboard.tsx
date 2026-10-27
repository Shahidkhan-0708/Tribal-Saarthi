import React, { useState } from 'react';
import { 
  Fingerprint, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle, 
  HelpCircle,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  Lock,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { inrPretty } from '@/lib/format';

export const UnifiedStudentDashboard: React.FC = () => {
  const [apaarOpen, setApaarOpen] = useState(false);
  const navigate = useNavigate();
  const data = useData();
  const user = useSession(s => s.user);

  const student = data.students.find(s => s.id === user?.studentId);
  const applications = student ? data.applications.filter(a => a.studentId === student.id) : [];
  const primaryApp = applications.find(a => !['disbursed', 'rejected'].includes(a.status)) ?? applications[0];
  const primaryScheme = primaryApp ? data.schemes.find(s => s.id === primaryApp.schemeId) : null;
  const docs = student ? data.documents.filter(d => d.studentId === student.id) : [];

  // Real or high-fidelity simulated deficiency state for prototype validation
  const isDeficiency = primaryApp?.status === 'deficiency' || !primaryApp;
  const currentApplication = {
    schemeName: primaryScheme?.name ?? "National Top-Class ST Scholarship",
    ministry: primaryScheme?.ministry ?? "Ministry of Tribal Affairs",
    status: isDeficiency ? "deficiency_stage" : (primaryApp?.status ?? 'deficiency_stage'),
    actionDeadline: primaryApp?.deficiency?.deadline ?? "30 Nov 2026",
    requiredFix: primaryApp?.deficiency?.reason ?? "Family Income Certificate value (₹1,80,000) does not align with your recorded e-District revenue registry entry."
  };

  const studentName = student?.name ?? (user?.name || "Asha Kiran Ekka");
  const tribeName = student?.tribe ?? "Oraon Tribe";
  const stateName = student?.domicileState ?? "Jharkhand";
  const academicYear = primaryApp?.academicYear ?? "AY 2026-27";
  const apaarId = student?.apaarId ?? (student?.aadhaarLast4 ? `4920-1102-${student.aadhaarLast4}` : '4920-1102-3951');
  const abcCredits = student?.abcCredits ?? 42;

  const verifiedDocsCount = docs.filter(d => d.status === 'verified').length || 2;

  return (
    // Main Container Canvas: Controlled spacing, soft background, premium typography
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen text-slate-800 font-sans">
      
      {/* 1. HERO HEADER: Aggressive Typographic Scale with Clean Structural Breathing Room */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-soft">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Johar, {studentName}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span>{tribeName}</span>
            <span className="text-slate-300">·</span>
            <span>{stateName}</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-amber-700 bg-amber-50/80 px-2.5 py-0.5 rounded text-xs border border-amber-200/50 font-bold">
              {academicYear}
            </span>
            {student?.isPVTG && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/60">
                PVTG Priority
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={() => setApaarOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <Fingerprint size={18} className="text-amber-400 animate-pulse" />
          <span>View APAAR Identity Card</span>
        </button>
      </header>

      {/* 2. PREMIUM NOTIFICATION: Soft Rose Tint, Ultra-Thin Border, Deep Accent Bar */}
      {(currentApplication.status === "deficiency_stage" || currentApplication.status === "deficiency") && (
        <div className="border-l-4 border-l-rose-500 bg-rose-50/40 rounded-xl p-5 shadow-xs border border-rose-100 flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-rose-100/70 rounded-xl text-rose-600 shrink-0 mt-0.5">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Action Required: Verification Halted</h2>
              <p className="text-sm font-normal text-slate-600 mt-1 leading-relaxed">
                Your application for the <strong className="text-slate-900 font-semibold">{currentApplication.schemeName}</strong> has been suspended due to an internal registry discrepancy.
              </p>
            </div>
          </div>

          {/* Crisp Monospaced Discrepancy Box */}
          <div className="bg-white/90 border border-rose-200/60 rounded-xl p-3.5 font-mono text-xs text-rose-700 shadow-inner max-w-full overflow-x-auto leading-relaxed">
            <span className="text-rose-500 font-bold">Exception ID:</span> ERR_INCOME_MISMATCH <span className="text-slate-300 mx-1.5">//</span> <span className="text-rose-600 font-medium">{currentApplication.requiredFix}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <button 
              onClick={() => navigate('/student/wallet')}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Resolve via DigiLocker Vault</span>
              <ArrowRight size={16} />
            </button>
            <span className="text-xs font-semibold text-rose-600 tracking-wide uppercase bg-rose-100/50 px-3 py-1.5 rounded-full border border-rose-200/60 text-center sm:text-right">
              Resolution Window Closes: {currentApplication.actionDeadline}
            </span>
          </div>
        </div>
      )}

      {/* 3. OPERATIONAL GRID: Clear 2-Column Desktop Grid, Column-Reflow on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Tracking Block (2/3 Width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-6 space-y-6 flex flex-col justify-between shadow-soft">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Scheme Tracker</span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">{currentApplication.schemeName}</h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{currentApplication.ministry}</p>
            </div>
            <span className="shrink-0 px-3 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse">
              Deficiency Raised
            </span>
          </div>

          {/* Secure Stepper Matrix with Ultra-Thin Rail & Glowing Pulse Ring */}
          <div className="grid grid-cols-4 gap-2 pt-6 pb-2 relative">
            {/* Ultra-thin rail */}
            <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-slate-200/70 -z-10 rounded-full" />
            
            {[
              { label: "UIDAI Auth", status: "success" },
              { label: "e-District", status: "success" },
              { label: "NSP Audit", status: "active" },
              { label: "PFMS DBT", status: "pending" }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-mono text-sm font-bold transition-all relative ${
                  step.status === "success" 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                    : step.status === "active"
                    ? 'bg-white border-amber-500 text-amber-600 shadow-sm ring-4 ring-amber-100 scale-110'
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step.status === "success" ? (
                    <CheckCircle size={17} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                  
                  {/* Subtle active state visual indicator */}
                  {step.status === "active" && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>
                <span className={`text-xs tracking-tight block ${
                  step.status === "active" 
                    ? 'font-bold text-amber-700' 
                    : step.status === "success"
                    ? 'font-semibold text-slate-700'
                    : 'font-normal text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Granular Tracking Summary Strip */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Sanction Cap</span>
              <strong className="text-sm font-bold text-slate-800 mt-0.5 block">
                {primaryApp?.sanctionedAmount ? inrPretty(primaryApp.sanctionedAmount) : '₹2,00,000/yr'}
              </strong>
            </div>
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Direct DBT Mode</span>
              <strong className="text-sm font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
                <ShieldCheck size={14} /> Aadhaar Seeded
              </strong>
            </div>
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Application ID</span>
              <strong className="text-xs font-mono font-semibold text-slate-600 mt-1 block truncate">
                {primaryApp?.id ?? 'TS-2026-JH-8834'}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Info Box (1/3 Width) - High Utility Action Drawer */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between shadow-soft relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
          
          <div className="space-y-3">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <RefreshCw size={17} className="text-amber-400" /> 
              Zero-Friction Network
            </h3>
            <p className="text-xs font-normal text-slate-300 leading-relaxed">
              Your structural identity mappings are directly bound across central data infrastructure layers. Documents are verified cryptographically straight from source servers.
            </p>
          </div>

          <div className="pt-6 space-y-3">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" /> Verified Assets:
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {verifiedDocsCount} Secure
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => navigate('/student/wallet')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText size={14} className="text-amber-400" /> Wallet
              </button>
              <button 
                onClick={() => navigate('/student/discovery')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs py-2.5 px-3 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-400" /> Schemes
              </button>
            </div>

            <button 
              onClick={() => navigate('/student/grievance?assistant=1')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Saarthi Assistant</span>
              <HelpCircle size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* 4. HIGH-VALUE DOCUMENT COCKPIT: Clean Neutral Cards with Deep Tone Accents */}
      <section className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="text-amber-500" size={20} />
              Vault Verification Cockpit
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Source-anchored verification credentials linked via DigiLocker and State Revenue Registries
            </p>
          </div>
          <button 
            onClick={() => navigate('/student/wallet')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <span>Manage all documents</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl border border-emerald-200/70 bg-emerald-50/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Identity Ledger</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> VERIFIED
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 block">Aadhaar Vault Seeding</strong>
            <p className="text-xs text-slate-500 font-mono">UIDAI ending in ···· {student?.aadhaarLast4 ?? '3951'}</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200/70 bg-emerald-50/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Caste Certificate</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> VERIFIED
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 block">{tribeName} Scheduled Tribe</strong>
            <p className="text-xs text-slate-500 font-mono">JH-CST-2023-99410</p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/40 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-rose-700">Income Certificate</span>
              <span className="text-[11px] font-bold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle size={12} /> EXCEPTION
              </span>
            </div>
            <strong className="text-sm font-semibold text-slate-900 block">e-District Revenue Registry</strong>
            <p className="text-xs text-rose-600 font-normal">Income mismatch detected against State Vault</p>
          </div>
        </div>
      </section>

      {/* 5. HIGH-FIDELITY APAAR REGISTER INSPECTOR MODAL (NEP 2020 Compliant) */}
      {apaarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-300/80 shadow-2xl max-w-sm w-full overflow-hidden space-y-4">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-slate-950 p-5 text-white">
              <div>
                <h4 className="text-sm font-bold tracking-wide text-amber-400 uppercase">APAAR Identity Card</h4>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">Govt of India · Automated Permanent Academic Registry</p>
              </div>
              <button 
                onClick={() => setApaarOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-2 space-y-3">
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Legal Name</span>
                <span className="text-slate-900 font-bold">{studentName}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">12-Digit Identifier</span>
                <span className="text-slate-900 font-mono font-bold tracking-wider">{apaarId}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Academic Bank of Credits</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200/60">
                  Active ({abcCredits} Credits)
                </span>
              </div>
              <div className="flex justify-between items-center text-sm py-1.5">
                <span className="text-slate-400 font-medium">Community Status</span>
                <span className="text-slate-900 font-bold">{tribeName} (ST)</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/80">
              <button 
                onClick={() => setApaarOpen(false)} 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close Safe Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export const StudentDashboard = UnifiedStudentDashboard;
export const RefactoredDashboard = UnifiedStudentDashboard;
