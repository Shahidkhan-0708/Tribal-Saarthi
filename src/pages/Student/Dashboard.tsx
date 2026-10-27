import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData, demoSanctionAmount } from '@/store/data';
import { useSession } from '@/store/session';
import { INSTITUTIONS } from '@/data/students';
import { inrPretty } from '@/lib/format';
import { Icon } from '@/components/common/Icon';

export function StudentDashboard() {
  const data = useData();
  const user = useSession((s) => s.user);
  const navigate = useNavigate();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);

  const student = data.students.find((s) => s.id === user?.studentId) ?? data.students[0];
  const applications = student ? data.applications.filter((a) => a.studentId === student.id) : [];
  const primary = applications.find((a) => !['disbursed', 'rejected'].includes(a.status)) ?? applications[0];
  const scheme = data.schemes.find((s) => s.id === primary?.schemeId) ?? data.schemes[0];
  const institution = INSTITUTIONS.find((i) => i.id === student?.institutionId) ?? INSTITUTIONS[0];
  const docs = student ? data.documents.filter((d) => d.studentId === student.id) : [];

  const amountStr = primary
    ? inrPretty(primary.sanctionedAmount ?? demoSanctionAmount(primary.schemeId))
    : '₹1,32,000';

  const studentFirstName = student ? student.name.split(' ')[0] : 'Mohan';
  const appId = primary?.id ?? 'JH-ST-2026-89412';

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const narration = `नमस्ते ${studentFirstName}! आपका पोस्ट-मैट्रिक छात्रवृत्ति फॉर्म अभी ${institution.name} कॉलेज के पास जांच में है। आपके सभी चार कागजात पूरी तरह सत्यापित हैं। आपको आज कोई नया दस्तावेज़ जमा नहीं करना है। कॉलेज से पुष्टि होते ही राशि सीधे आपके बैंक खाते में भेजी जाएगी।`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.92;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div data-demo="student-profile" data-od-id="dashboard-main" className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Page Header with Welcoming Government Identity & Audio Companion */}
      <div className="page-head flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="crumb flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <span className="font-semibold text-emerald-800">MoTA Tribal Scholar Desk</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>Overview · जोहार / नमस्ते</span>
          </div>
          <h1 className="page-title text-2xl md:text-3xl font-extrabold text-slate-900 mt-1" data-od-id="dashboard-title">
            Good afternoon, {studentFirstName}.
          </h1>
          <p className="page-sub text-sm text-slate-600 mt-0.5">
            Your scholarship file is safe with {institution.name}. Nothing is required from you today.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSpeak}
          className={`btn btn-sm self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${
            isSpeaking
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm animate-pulse'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 shadow-2xs'
          }`}
          title="Listen to status aloud in Hindi"
        >
          <Icon name="spark" className={`i-sm ${isSpeaking ? 'text-amber-700' : 'text-emerald-700'}`} />
          <span>{isSpeaking ? 'बोल रहे हैं… (रोकें)' : '🔊 सुनिए (Audio Status)'}</span>
        </button>
      </div>

      {/* 2. Hero "Scholarship Lifeline Card": Single Clear Focus for the Beneficiary */}
      <section className="card rounded-2xl border border-emerald-900/15 shadow-sm bg-white overflow-hidden p-6 md:p-8 space-y-6" aria-labelledby="app-title" data-od-id="active-application">
        {/* Status Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Scholarship Lifeline · छात्रवृत्ति विवरण
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 mt-0.5" id="app-title">
              {scheme?.name ?? 'Post-Matric Scholarship for ST Students'}
            </h2>
          </div>
          <span className="badge badge-amber font-semibold text-xs px-3 py-1.5 flex items-center gap-1.5">
            <span className="bdot" />
            College Review in Progress · कॉलेज जांच जारी है
          </span>
        </div>

        {/* Financial Anchor & Reassurance Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">
          <div className="md:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Sanction Grant · कुल छात्रवृत्ति
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-emerald-950 tracking-tight mt-1">
              {amountStr}
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-1.5 leading-relaxed max-w-lg">
              Full tuition, hostel accommodation &amp; book allowance for <b>{institution.name}</b>. Disbursed directly via Aadhaar DBT to Bank of India (••••4821) upon approval.
            </p>

            {/* Statutory Grant Component Breakdown (GEMINI.md Rule 2) */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Tuition Reimbursement: ₹98,000
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Hostel Maintenance: ₹24,000/yr
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                PVTG Book &amp; Tool Grant: ₹10,000
              </span>
            </div>
          </div>

          <div className="md:col-span-5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4.5 space-y-1.5">
            <div className="flex items-start gap-2.5">
              <Icon name="check" className="i text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <b className="text-xs md:text-sm text-emerald-950 font-bold block">
                  Nothing to upload today · कोई कागज़ात नहीं चाहिए
                </b>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  All 4 statutory certificates are verified with DigiLocker. Your place in the sanction queue is safely locked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Visual Progress Stepper */}
        <div className="pt-2 pb-4">
          <ol className="steps" aria-label="Application progress">
            <li className="done">
              <span className="dot" />
              <span className="lbl">1. Submitted</span>
              <span className="sub">12 OCT · DONE ✓</span>
            </li>
            <li className="active">
              <span className="dot" />
              <span className="lbl">2. College review</span>
              <span className="sub">IN PROGRESS ⏳</span>
            </li>
            <li>
              <span className="dot" />
              <span className="lbl">3. Approval</span>
              <span className="sub">PENDING</span>
            </li>
            <li>
              <span className="dot" />
              <span className="lbl">4. Direct Payment</span>
              <span className="sub">BANK OF INDIA</span>
            </li>
          </ol>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Icon name="shield" className="i-sm text-emerald-700 shrink-0" />
            <span>Desk: {institution.name} · Ref: {appId}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSlipModal(true)}
              className="btn btn-secondary text-xs font-semibold py-2 px-4 shrink-0"
            >
              <Icon name="file" className="i-sm" />
              <span>Print Official Slip (Hostel / College)</span>
            </button>

            <Link
              className="btn btn-primary text-xs font-bold py-2 px-4 shrink-0 shadow-sm"
              to="/student/application"
              data-od-id="dashboard-primary-cta"
            >
              <span>View full application</span>
              <Icon name="arrowRight" className="i-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Two Essential Citizen Supporting Cards (No Clutter, Pure Clarity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Card 1: Document Passbook Summary */}
        <section className="card rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                  <Icon name="file" className="i-sm" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900" id="docs-title">
                    Document Passbook · दस्तावेज़ पासबुक
                  </h2>
                  <p className="text-xs text-slate-500">Verified once via DigiLocker · Reusable across all applications</p>
                </div>
              </div>
              <span className="badge badge-green text-xs font-semibold">4 / 4 Sealed ✓</span>
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">ST Caste Certificate</span>
                <span className="text-emerald-700 font-medium">Verified ✓ (SDO Latehar)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">Annual Family Income</span>
                <span className="text-emerald-700 font-medium">Verified ✓ ({inrPretty(student?.familyIncome ?? 100000)}/yr)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">College Enrolment</span>
                <span className="text-emerald-700 font-medium">Verified ✓ ({institution.name})</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">UIDAI Identity Details</span>
                <span className="text-emerald-700 font-medium">Verified ✓ (Aadhaar ••••{student?.aadhaarLast4 ?? '4821'})</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Zero physical running around</span>
            <Link to="/student/wallet" className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1">
              Open Document Wallet <Icon name="arrowRight" className="i-sm" />
            </Link>
          </div>
        </section>

        {/* Card 2: Saarthi AI Helper */}
        <section className="card rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-900">
                <Icon name="spark" className="i-sm text-emerald-700" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Saarthi AI Companion · आपका सहायक
                </h2>
                <p className="text-xs text-emerald-800 font-medium">Voice &amp; text assistance in Hindi, Santhali, or English</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Have questions about your college verification, hostel fee deferrals, or DBT payment dates? Saarthi guides you step-by-step in simple language.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                to="/student/grievance"
                className="text-xs bg-white border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-full font-medium hover:bg-emerald-50 transition-colors shadow-2xs"
              >
                पैसे कब आएंगे?
              </Link>
              <Link
                to="/student/grievance"
                className="text-xs bg-white border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-full font-medium hover:bg-emerald-50 transition-colors shadow-2xs"
              >
                हॉस्टल फीस कैसे मिलेगी?
              </Link>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-100/60 flex items-center justify-between">
            <span className="text-xs text-slate-500">Confidential · Nodal Officer backed</span>
            <Link to="/student/grievance" className="btn btn-primary btn-sm py-1.5 px-4 font-bold text-xs shadow-sm">
              Ask Saarthi
              <Icon name="arrowRight" className="i-sm" />
            </Link>
          </div>
        </section>
      </div>

      {/* Official Print-Ready Sanction Slip Modal (for Hostel Warden / College Desk / Cyber Cafe) */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center font-bold text-sm">
                  TS
                </span>
                <div>
                  <h3 className="font-bold text-sm">Official Scholarship Sanction Slip</h3>
                  <p className="text-[11px] text-emerald-200">Ministry of Tribal Affairs · Government of India</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="text-emerald-200 hover:text-white p-1 rounded-lg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Beneficiary Scholar</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{student.name}</div>
                  <div className="text-[11px] text-slate-500">{student.tribe} Community · PVTG Tier-1</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Application Number</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{appId}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">Active &amp; In Order</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Enrolled College</span>
                  <span className="font-semibold text-slate-800">{institution.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Course &amp; Roll</span>
                  <span className="font-semibold text-slate-800">{student.course || 'B.Tech CSE'} · 2024-CSE-104</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Sanctioned Grant</span>
                  <span className="font-bold text-emerald-900 text-sm">{amountStr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Disbursement Mode</span>
                  <span className="font-semibold text-slate-800">Aadhaar Seeded DBT</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Statutory Digital Seal</div>
                  <div className="text-[10px] text-slate-500">Certified by State Nodal Officer · Latehar DWO</div>
                </div>
                <span className="badge badge-green font-bold">VERIFIED ✓</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-primary text-xs font-bold py-2 px-4"
              >
                Print / Save PDF (प्रिंट करें)
              </button>
              <button
                type="button"
                onClick={() => setShowSlipModal(false)}
                className="btn btn-secondary text-xs font-bold py-2 px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="micro text-slate-400 text-center" style={{ marginTop: '28px' }}>
        Ministry of Tribal Affairs · Government of India · Official Scholar Assistance Desk
      </p>
    </div>
  );
}

export { StudentDashboard as UnifiedStudentDashboard };
