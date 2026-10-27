import { useState } from 'react';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { Icon } from '@/components/common/Icon';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'me';
  senderName: string;
  text: string;
  source?: string;
  time?: string;
}

export function GrievancePage() {
  const data = useData();
  const user = useSession((s) => s.user);
  const student = data.students.find((p) => p.id === user?.studentId) ?? data.students[0];
  const isOfficer = user?.role !== 'student';

  const [language, setLanguage] = useState<'en' | 'hi' | 'sant'>('en');
  const [inputVal, setInputVal] = useState('');
  const [grievanceSubject, setGrievanceSubject] = useState('');
  const [grievanceBody, setGrievanceBody] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      senderName: 'Saarthi · Verified',
      text: `Johar ${student.name.split(' ')[0]}. I can see your Post-Matric application JH-ST-2026-89412 is in college review. Ask me about documents, timelines, or your PVTG entitlements.`,
      source: 'Checked against MoTA National Scholarship Regulations 2026',
    },
    {
      id: '2',
      sender: 'me',
      senderName: student.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
      text: 'What is the exact disbursement timeline for my BIT Mesra PVTG maintenance allowance?',
    },
    {
      id: '3',
      sender: 'ai',
      senderName: 'Saarthi · Verified',
      text: 'Here is your personalised timeline:\n\n1. Verification: BIT Mesra nodal desk opened your application on 14 Oct 2026. Target: 48 hours.\n2. Current step: District Welfare Office Latehar processes statutory concurrence next, also a 48-hour target.\n3. Sanction: ₹1,32,000 total: tuition ₹98,000, maintenance ₹24,000, book grant ₹10,000.',
      source: 'Verified directly with Latehar District Welfare Office SLA schedule',
    },
  ]);

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSendPrompt = (promptText: string) => {
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'me',
      senderName: student.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
      text: promptText,
    };

    let replyText = `Regarding "${promptText}": Your application is in good standing. All 4 DigiLocker documents are sealed.`;
    if (promptText === 'मेरी स्कॉलरशिप कहां रुकी है?') {
      replyText = `नमस्ते ${student.name.split(' ')[0]}! आपका पोस्ट-मैट्रिक छात्रवृत्ति आवेदन (BIT Mesra) कॉलेज समीक्षा चरण पर है। कॉलेज सत्यापन के बाद लातेहार जिला कल्याण अधिकारी के पास अनुमोदन हेतु जाएगा।`;
    }

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: String(Date.now() + 1),
        sender: 'ai',
        senderName: 'Saarthi · Verified',
        text: replyText,
        source: 'MoTA Automated Eligibility Engine · Regulation 2026',
      },
    ]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleSendPrompt(inputVal);
    setInputVal('');
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceSubject.trim() || !grievanceBody.trim()) return;

    data.createGrievance(student.id, 'Scholarship', grievanceSubject, grievanceBody);
    showToast('Grievance registered with CPGRAMS reference ID');
    setGrievanceSubject('');
    setGrievanceBody('');
  };

  const displayedGrievances = isOfficer
    ? data.grievances
    : data.grievances.filter((g) => g.studentId === student.id);

  return (
    <div data-od-id="help-saarthi-main" className="space-y-6 relative">
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
            <span>Help and Saarthi</span>
          </div>
          <h1 className="page-title" data-od-id="help-saarthi-title">
            Saarthi assistance &amp; grievance desk
          </h1>
          <p className="page-sub">
            A 24/7 multilingual guide for tribal scholars, plus a formal route to the national grievance system.
          </p>
        </div>
        <div className="page-actions">
          <span className="badge badge-green">
            <span className="bdot" />
            Assistant online
          </span>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => showToast('Voice mode needs microphone permission')}
          >
            <Icon name="mic" className="i" />
            Voice mode
          </button>
        </div>
      </div>

      {/* Main Grid: Chat on Left, Formal Ticket Status on Right */}
      <div className="grid g-main" style={{ alignItems: 'start' }}>
        <section className="card" aria-labelledby="chat-title">
          <div className="card-h">
            <div className="flex center gap12">
              <span
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'var(--ink)',
                  display: 'grid',
                  placeItems: 'center',
                  flex: 'none',
                }}
              >
                <Icon name="spark" className="i" style={{ stroke: '#E2E8F0' }} />
              </span>
              <div>
                <h2 className="h3" id="chat-title">
                  Conversation with Saarthi
                </h2>
                <p className="micro" style={{ marginTop: '2px' }}>
                  Secure government assistant · Session #SA-2026-8819
                </p>
              </div>
            </div>
            <div className="seg" aria-label="Language">
              <button
                className={language === 'en' ? 'on' : ''}
                type="button"
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button
                className={language === 'hi' ? 'on' : ''}
                type="button"
                onClick={() => {
                  setLanguage('hi');
                  showToast('हिन्दी में उत्तर उपलब्ध है');
                }}
              >
                हिंदी (Hindi)
              </button>
              <button
                className={language === 'sant' ? 'on' : ''}
                type="button"
                onClick={() => {
                  setLanguage('sant');
                  showToast('संताली में उत्तर उपलब्ध है');
                }}
              >
                संताली
              </button>
            </div>
          </div>

          <div className="card-b flush">
            <div className="flex flex-col h-[520px]">
              {/* Chat Messages Scroll */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {m.sender === 'ai' && (
                      <span className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        TS
                      </span>
                    )}
                    <div className={`max-w-[75%] rounded-lg p-3 text-xs leading-relaxed ${m.sender === 'me' ? 'bg-emerald-900 text-white font-medium shadow-xs' : 'bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)]'}`}>
                      <div className="flex justify-between items-center mb-1 text-[10px] opacity-75 font-semibold">
                        <span>{m.senderName}</span>
                      </div>
                      <div className="whitespace-pre-line">{m.text}</div>
                      {m.source && (
                        <div className="mt-2 pt-2 border-t border-[var(--line)] text-[9.5px] opacity-75 flex items-center gap-1">
                          <Icon name="shield" className="i-sm" style={{ width: '10px', height: '10px' }} />
                          <span>{m.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Composer */}
              <div className="border-t border-[var(--line)] p-3 bg-[var(--surface)]">
                <form onSubmit={handleSend} className="flex items-end gap-2 border border-[var(--line-strong)] rounded-lg p-2 bg-[var(--surface)]">
                  <textarea
                    rows={1}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={language === 'hi' ? 'छात्रवृत्ति, दस्तावेज या भुगतान के बारे में पूछें…' : 'Ask about scheme eligibility, documents or payment schedules…'}
                    className="flex-1 border-0 outline-none text-xs leading-relaxed resize-none bg-transparent px-2"
                  />
                  <button className="btn btn-primary btn-sm" type="submit" aria-label="Send message">
                    <Icon name="send" className="i-sm" />
                  </button>
                </form>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {language === 'hi' ? (
                    <>
                      <button
                        type="button"
                        className="text-[10px] bg-[var(--surface-2)] border border-[var(--line)] px-2.5 py-1 rounded text-[var(--ink-2)] hover:bg-slate-200"
                        onClick={() => handleSendPrompt('मेरी स्कॉलरशिप कहां रुकी है?')}
                      >
                        मेरी स्कॉलरशिप कहां रुकी है?
                      </button>
                      <button
                        type="button"
                        className="text-[10px] bg-[var(--surface-2)] border border-[var(--line)] px-2.5 py-1 rounded text-[var(--ink-2)] hover:bg-slate-200"
                        onClick={() => handleSendPrompt('दस्तावेज कैसे सुधारें?')}
                      >
                        दस्तावेज कैसे सुधारें?
                      </button>
                    </>
                  ) : (
                    ['Timeline for BIT Mesra', 'When does payment start?', 'Document correction help'].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="text-[10px] bg-[var(--surface-2)] border border-[var(--line)] px-2.5 py-1 rounded text-[var(--ink-2)] hover:bg-slate-200"
                        onClick={() => handleSendPrompt(prompt)}
                      >
                        {prompt}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Aside: Grievance Ticket & Regulations */}
        <aside className="stack">
          <section className="card">
            <div className="card-h">
              <h2 className="h3">Formal grievance desk</h2>
              <span className="badge badge-green">CPGRAMS</span>
            </div>
            <div className="card-b p-5 space-y-4">
              {!isOfficer && (
                <form onSubmit={handleGrievanceSubmit} className="space-y-3">
                  <div className="field">
                    <label htmlFor="grievanceSubject">Subject</label>
                    <input
                      id="grievanceSubject"
                      aria-label="Subject"
                      className="input"
                      value={grievanceSubject}
                      onChange={(e) => setGrievanceSubject(e.target.value)}
                      placeholder="Brief summary of your grievance..."
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="grievanceBody">How can we help?</label>
                    <textarea
                      id="grievanceBody"
                      aria-label="How can we help?"
                      className="textarea"
                      rows={2}
                      value={grievanceBody}
                      onChange={(e) => setGrievanceBody(e.target.value)}
                      placeholder="Provide full details of the issue..."
                      required
                    />
                  </div>
                  <button
                    className="btn btn-primary btn-block text-xs"
                    type="submit"
                  >
                    Submit grievance &amp; get reference ID
                  </button>
                </form>
              )}

              {/* Grievance list with .case-help-ticket */}
              <div className="space-y-2 pt-3 border-t border-[var(--line)]">
                <div className="text-xs font-bold text-[var(--ink)]">Recorded Grievance Tickets</div>
                {displayedGrievances.length === 0 ? (
                  <p className="micro text-[var(--muted)]">No active grievances filed yet.</p>
                ) : (
                  displayedGrievances.map((g) => (
                    <div key={g.id} className="case-help-ticket p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-[var(--ink)]">#{g.id.slice(0, 8)}</span>
                        <span className={`badge ${g.status === 'resolved' ? 'badge-green' : 'badge-amber'}`}>
                          {g.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-1">{g.subject}</div>
                      <div className="text-[10px] text-[var(--meta)] mt-1">{g.body}</div>
                      {isOfficer && g.status !== 'resolved' && (
                        <div className="mt-2 pt-2 border-t border-[var(--line)]">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              data.resolveGrievance(g.id);
                              showToast('Grievance marked as resolved');
                            }}
                          >
                            Mark resolved
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="card border-l-4 border-l-emerald-600">
            <div className="card-b p-5">
              <div className="flex items-center justify-between">
                <div className="eyebrow text-emerald-800">Statutory guidelines</div>
                <span className="badge badge-green text-[10px]">Active mandate</span>
              </div>
              <h3 className="h3 mt-2">MoTA Circular 2026</h3>
              <p className="micro text-[var(--muted)] mt-1 leading-relaxed">
                Tribal scholars are entitled to 100% tuition reimbursement and maintenance under Central Sector Scheme Guidelines.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
