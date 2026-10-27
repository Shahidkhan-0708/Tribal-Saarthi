import type {
  Application,
  Notification,
  Scheme,
  Student,
  StudentDocument,
} from '@/types';

// ============================================================
// Saarthi — Contextual Assistant Engine
//
// Differentiator vs. JAGO (which already exists as an
// information-only chatbot): Saarthi answers FROM THE
// STUDENT'S LIVE APPLICATION STATE — not generic FAQs.
// Responses are template-generated over real app-state data,
// so every answer is explainable and grounded. No external
// LLM needed for the demo.
// ============================================================

export interface SaarthiContext {
  student: Student;
  applications: Application[];
  documents: StudentDocument[];
  schemes: Scheme[];
  notifications: Notification[];
}

export interface SaarthiReply {
  text: string;
  /** Rule IDs / data objects that grounded this answer (shown in UI) */
  groundedOn: string[];
  suggestions: string[];
}

type Intent =
  | 'status_inquiry'
  | 'deficiency_help'
  | 'eligibility'
  | 'documents'
  | 'payment'
  | 'greeting'
  | 'unknown';

const KEYWORDS: Record<Intent, string[]> = {
  status_inquiry: ['status', 'pending', 'stuck', 'why', 'delay', 'stalled', 'kaha', 'kahan', 'क्यों', 'रुकी', 'रुका', 'स्थिति', 'kyu'],
  deficiency_help: ['deficiency', 'fix', 'correct', 'resubmit', 'upload', 'problem', 'error', 'galti', 'thik', 'कमी', 'सुधार'],
  eligibility: ['eligible', 'eligibility', 'qualify', 'scheme', 'apply', 'kaise', 'योजना', 'पात्र'],
  documents: ['document', 'certificate', 'wallet', 'doc', 'kagaz', 'copy', 'दस्तावेज़', 'वॉलेट'],
  payment: ['payment', 'money', 'dbt', 'received', 'amount', 'pais', 'rupee', 'पैसा', 'भुगतान', 'डीबीटी'],
  greeting: ['hi', 'hello', 'namaste', 'hey', 'नमस्ते', 'नमस्कार'],
  unknown: [],
};

function detectIntent(q: string): Intent {
  const lower = q.toLowerCase();
  let best: Intent = 'unknown';
  let bestScore = 0;
  (Object.keys(KEYWORDS) as Intent[]).forEach((intent) => {
    const score = KEYWORDS[intent].filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  });
  return best;
}

const STAGE_LABEL: Record<Application['status'], string> = {
  draft: 'Draft (not yet submitted)',
  submitted: 'Submitted — institute verification queued',
  pending_verification: 'Pending verification — a simulated source is unavailable',
  manual_review: 'Verification needs officer review',
  institute_stage: 'Institute verification in progress',
  department_stage: 'Departmental (state) verification in progress',
  sanctioned: 'Sanctioned — awaiting DBT transfer',
  disbursed: 'Disbursed to your bank account',
  deficiency: 'Action required — a document has a problem',
  deficiency_stage: 'Action required — verification halted due to discrepancy',
  rejected: 'Rejected',
};

function fmtINR(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function answerQuestion(ctx: SaarthiContext, question: string, language: 'en' | 'hi' = 'en'): SaarthiReply {
  const { student, schemes } = ctx;
  const applications = ctx.applications.filter((a) => a.studentId === student.id);
  const documents = ctx.documents.filter((d) => d.studentId === student.id);
  const notifications = ctx.notifications.filter((n) => n.userId === student.id);
  const intent = detectIntent(question);
  const groundedOn: string[] = [];
  const suggestions: string[] = [];

  const actionable = applications.filter(
    (a) => a.status !== 'disbursed' && a.status !== 'rejected',
  );
  const primary = actionable[0];

  if (language === 'hi') {
    const stages: Record<Application['status'], string> = {
      draft: 'मसौदा', submitted: 'सत्यापन बाकी है', pending_verification: 'सिम्युलेटेड स्रोत उपलब्ध नहीं है; सत्यापन लंबित है', manual_review: 'अधिकारी की समीक्षा बाकी है', institute_stage: 'संस्थान की समीक्षा जारी है', department_stage: 'विभाग की समीक्षा जारी है', sanctioned: 'स्वीकृति दर्ज है; भुगतान अलग चरण है', disbursed: 'सिम्युलेटेड भुगतान सफल हुआ', deficiency: 'दस्तावेज़ में सुधार ज़रूरी है', deficiency_stage: 'सत्यापन रुका हुआ है; सुधार आवश्यक है', rejected: 'अधिकारी ने अस्वीकार किया',
    };
    const deficiency = applications.find((a) => a.deficiency);
    let text: string;
    if (intent === 'payment') {
      const paid = applications.filter((a) => a.status === 'disbursed');
      text = paid.length ? paid.map((a) => `${a.academicYear}: ${fmtINR(a.disbursedAmount ?? 0)} · ${formatDate(a.dbtDate)} (सिम्युलेटेड भुगतान)`).join('\n') : 'कोई भुगतान दर्ज नहीं है। स्वीकृति के बाद अलग से सिम्युलेटेड भुगतान किया जाता है।';
      groundedOn.push(...paid.map((a) => `application:${a.id}`));
    } else if ((intent === 'deficiency_help' || intent === 'status_inquiry') && deficiency?.deficiency) {
      text = `आवेदन ${deficiency.id} में दस्तावेज़ सुधार ज़रूरी है।\nअधिकारी का कारण: ${deficiency.deficiency.reason}\nअंतिम तारीख: ${formatDate(deficiency.deficiency.deadline)}\nवॉलेट में सही दस्तावेज़ अपलोड करें और आवेदन में उसका संस्करण चुनें। आवेदन अस्वीकार नहीं हुआ है; सुधार की अधिकारी समीक्षा करेंगे।`;
      groundedOn.push(`application:${deficiency.id}`);
    } else if (intent === 'documents') {
      text = `आपके वॉलेट में ${documents.length} दस्तावेज़ हैं। ${documents.filter((d) => d.status === 'verified').length} की डेमो समीक्षा पूरी है।\n${documents.map((d) => `${d.title}: ${d.status === 'verified' ? 'समीक्षित' : 'समीक्षा बाकी'}`).join('\n')}`;
      groundedOn.push(...documents.map((d) => `document:${d.id}`));
    } else if (intent === 'eligibility') {
      text = `${schemes.length} योजनाओं के नियम आपके डेमो प्रोफ़ाइल पर जाँचे जाते हैं। पात्रता और हर नियम का कारण देखने के लिए Scholarship Discovery खोलें।`;
      groundedOn.push(`student:${student.id}`, 'schemes:all');
    } else {
      text = `नमस्ते ${student.name}!\n${primary ? `आपके आवेदन की स्थिति: ${stages[primary.status]}।` : 'कोई सक्रिय आवेदन नहीं है।'}\nमैं आवेदन, दस्तावेज़ सुधार और सिम्युलेटेड भुगतान की जानकारी दे सकता हूँ।`;
      if (primary) groundedOn.push(`application:${primary.id}`);
    }
    return { text, groundedOn, suggestions: ['मेरे आवेदन की स्थिति', 'दस्तावेज़ में कमी', 'भुगतान कब आएगा?'] };
  }

  // ---------- status ----------
  if (intent === 'status_inquiry') {
    if (!primary) {
      return {
        text: 'You have no in-flight applications right now. Would you like me to check which schemes you are eligible for?',
        groundedOn: ['applications:empty'],
        suggestions: ['Which schemes am I eligible for?', 'Show my documents'],
      };
    }
    const scheme = schemes.find((s) => s.id === primary.schemeId);
    groundedOn.push(`application:${primary.id}`);
    groundedOn.push(`scheme:${primary.schemeId}`);

    if (primary.status === 'deficiency' && primary.deficiency) {
      const doc = documents.find((d) => d.type === primary.deficiency!.docKey);
      groundedOn.push(`document:${doc?.id ?? primary.deficiency.docKey}`);
      return {
        text: [
          `Your ${scheme?.shortName ?? 'scholarship'} application needs action.`,
          `Problem: ${primary.deficiency.reason}`,
          doc?.discrepancy ? `Detail: ${doc.discrepancy}` : '',
          `Required: upload a corrected ${doc?.title ?? primary.deficiency.docKey.replace(/_/g, ' ')} before ${formatDate(primary.deficiency.deadline)}.`,
          'Your application has NOT been rejected — an officer will review the correction.',
        ].filter(Boolean).join('\n'),
        groundedOn,
        suggestions: ['How do I correct the document?', 'Show verification trail', 'When is the deadline?'],
      };
    }

    const pendingBits = actionable
      .map((a) => `${schemes.find((s) => s.id === a.schemeId)?.shortName ?? a.schemeId}: ${STAGE_LABEL[a.status]}`)
      .join('\n• ');

    return {
      text: `Here is where each application stands:\n• ${pendingBits}\n\nNo action is required from you right now${
        primary.status === 'department_stage'
          ? ' — department verification is done by the state nodal officer, typically within 2–4 weeks'
          : ''
      }.`,
      groundedOn,
      suggestions: ['Show verification trail', 'When will I get the money?', 'Am I eligible for more schemes?'],
    };
  }

  // ---------- deficiency ----------
  if (intent === 'deficiency_help') {
    const deficiencyApp = applications.find((a) => a.status === 'deficiency');
    if (deficiencyApp?.deficiency) {
      const doc = documents.find((d) => d.type === deficiencyApp.deficiency!.docKey);
      groundedOn.push(`application:${deficiencyApp.id}`, `document:${doc?.id ?? '—'}`);
      return {
        text: [
          `Open the Document Wallet and tap on "${doc?.title ?? deficiencyApp.deficiency.docKey}".`,
          `Issue: ${doc?.discrepancy ?? deficiencyApp.deficiency.reason}`,
          'Upload or correct the document in your wallet, then select the corrected version in Application Tracker for review.',
          'Nothing is auto-rejected in this system; an officer reviews the corrected doc within the deadline.',
        ].join('\n'),
        groundedOn,
        suggestions: ['Take me to the wallet', 'Why was it flagged?', 'Who reviews it?'],
      };
    }
    return {
      text: 'None of your applications has an open deficiency. Everything is moving on its own — check "Application Tracker" any time.',
      groundedOn: ['deficiencies:none'],
      suggestions: ['Show my application status', 'Show my documents'],
    };
  }

  // ---------- eligibility ----------
  if (intent === 'eligibility') {
    groundedOn.push(`student:${student.id}`, 'schemes:all');
    const eligibleCount = actionable.length;
    return {
      text: [
        `Based on your profile — ${student.tribe}${student.isPVTG ? ' (a Particularly Vulnerable Tribal Group)' : ''}, ${student.course}, income ${fmtINR(student.familyIncome)} — the engine checked all ${schemes.length} seeded MoTA schemes.`,
        `You currently have ${eligibleCount} active application${eligibleCount === 1 ? '' : 's'}.`,
        'Open "Scholarship Discovery" to see the full scheme-by-scheme eligibility audit — the engine explains every rule it checks.',
      ].join('\n'),
      groundedOn,
      suggestions: ['Explain eligibility for Top-Class', 'Why am I not eligible for NOS?', 'Show deadlines'],
    };
  }

  // ---------- documents ----------
  if (intent === 'documents') {
    groundedOn.push(`wallet:${student.id}`);
    const mismatches = documents.filter((d) => d.status === 'mismatch');
    const unverified = documents.filter((d) => d.status === 'unverified');
    const lines: string[] = [`Your wallet has ${documents.length} documents (${documents.reduce((a, d) => a + d.reuseCount, 0)} cross-scheme reuses so far).`];
    if (mismatches.length > 0) {
      lines.push(`Notice: ${mismatches[0].title} — ${mismatches[0].discrepancy ?? 'needs correction'}`);
    }
    if (unverified.length > 0) {
      lines.push(`Pending: ${unverified.length} document(s) awaiting source verification.`);
    }
    if (mismatches.length === 0 && unverified.length === 0) {
      lines.push('All documents are reviewed in the demo and can be attached to demo scheme applications. No government submission is made.');
    }
    return {
      text: lines.join('\n'),
      groundedOn,
      suggestions: ['How do I re-upload?', 'Which schemes reuse my documents?'],
    };
  }

  // ---------- payment ----------
  if (intent === 'payment') {
    const disbursed = applications.filter((a) => a.status === 'disbursed');
    groundedOn.push('payments:history');
    if (disbursed.length === 0) {
      return {
        text: 'No payments have been disbursed yet. Once your application clears department verification and is sanctioned, the PFMS (simulated) payment gateway transfers the amount directly to your bank via DBT.',
        groundedOn,
        suggestions: ['Why is my application pending?', 'Show application status'],
      };
    }
    const last = disbursed[disbursed.length - 1];
    return {
      text: [
        `Payment history (${disbursed.length} recorded):`,
        ...disbursed.map(
          (a) =>
            `• AY ${a.academicYear} — ${fmtINR(a.disbursedAmount ?? a.sanctionedAmount ?? 0)} — DBT ${
              a.dbtStatus === 'successful' ? `received on ${formatDate(a.dbtDate)}` : a.dbtStatus
            } (A/c …${a.bankAccountLast4 ?? '—'})`,
        ),
        `Most recent: ${formatDate(last.dbtDate)}.`,
      ].join('\n'),
      groundedOn,
      suggestions: ['Why is this year pending?', 'What if DBT fails?'],
    };
  }

  // ---------- greeting / unknown fallback ----------
  const unread = notifications.filter((n) => !n.readAt);
  if (intent === 'greeting' || intent === 'unknown') {
    groundedOn.push('notifications:unread', `student:${student.id}`);
    const intro = `Namaste ${student.name.split(' ')[0]}! I'm Saarthi, your scholarship assistant.`;
    const statusLine = primary
      ? `Your ${schemes.find((s) => s.id === primary.schemeId)?.shortName ?? 'application'} is currently: ${STAGE_LABEL[primary.status]}.`
      : 'You have no in-flight applications right now.';
    const actionLine =
      unread.length > 0
        ? `You have ${unread.length} unread notification${unread.length === 1 ? '' : 's'} — one may need your action.`
        : '';
    return {
      text: [intro, statusLine, actionLine, 'Ask me about your application status, documents, eligibility, or payment.'].filter(Boolean).join('\n'),
      groundedOn,
      suggestions: ['Why is my scholarship pending?', 'Show my document wallet', 'Which schemes am I eligible for?'],
    };
  }

  return {
    text: 'I did not fully understand that. I can help with application status, document corrections, eligibility, deadlines, or payment (DBT) questions.',
    groundedOn: [],
    suggestions: ['Why is my scholarship pending?', 'Show my documents', 'Am I eligible for more schemes?'],
  };
}
