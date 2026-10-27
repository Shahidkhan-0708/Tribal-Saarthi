import { useEffect, useRef, useState } from 'react';
import type { PilotSnapshot } from './types';

const stages: Record<string, [string, string]> = {
  draft: ['Draft; not submitted', 'मसौदा; अभी जमा नहीं हुआ'],
  submitted: ['Submitted; awaiting verification', 'जमा हुआ; सत्यापन बाकी है'],
  institute_stage: ['Institution review', 'संस्थान की समीक्षा'],
  department_stage: ['Department review', 'विभाग की समीक्षा'],
  sanctioned: ['Sanction recorded; payment is a separate step', 'स्वीकृति दर्ज है; भुगतान अलग चरण है'],
  disbursed: ['Simulated payment succeeded', 'पायलट का नकली भुगतान सफल हुआ'],
  deficiency: ['Document correction required', 'दस्तावेज़ में सुधार ज़रूरी है'],
  rejected: ['Rejected by an officer; see recorded reason', 'अधिकारी ने अस्वीकार किया; दर्ज कारण देखें'],
  withdrawn: ['Withdrawn by the student; see recorded reason', 'छात्र ने आवेदन वापस लिया; दर्ज कारण देखें'],
  appealed: ['Rejection appealed; awaiting an authorized review', 'अस्वीकृति पर अपील दर्ज है; अधिकृत समीक्षा की प्रतीक्षा है'],
};

export function answerPilotQuestion(snapshot: PilotSnapshot, question: string, language: 'en' | 'hi') {
  const hi = language === 'hi';
  const tr = (en: string, hindi: string) => hi ? hindi : en;
  const q = question.toLocaleLowerCase();
  const apps = snapshot.applications.filter(a => a.data.studentId === snapshot.account.id);
  const docs = snapshot.documents.filter(d => d.data.studentId === snapshot.account.id);
  const references: string[] = [];
  const lines: string[] = [];
  if (/payment|money|dbt|पैस|भुगतान/.test(q)) {
    const payments = snapshot.payments.filter(p => apps.some(a => a.id === p.data.applicationId));
    if (!payments.length) lines.push(tr('No payment attempts are recorded. Sanction and payment happen separately.', 'कोई भुगतान प्रयास दर्ज नहीं है। स्वीकृति और भुगतान अलग चरण हैं।'));
    for (const p of payments) { references.push(p.id); lines.push(`${tr('SIMULATED payment', 'पायलट का नकली भुगतान')}: ₹${p.data.amount.toLocaleString('en-IN')} · ${p.data.status}${p.data.reason ? ` · ${p.data.reason}` : ''}`); }
  } else if (/document|wallet|certificate|दस्तावेज|प्रमाण/.test(q) && !/correct|fix|deficien|सुधार/.test(q)) {
    lines.push(tr(`${docs.length} document versions are stored. Uploading a file does not verify it; officers review its contents.`, `${docs.length} दस्तावेज़ संस्करण जमा हैं। अपलोड करने से सत्यापन नहीं होता; अधिकारी जाँच करते हैं।`));
    for (const d of docs) { references.push(d.id); lines.push(`${d.data.title}: ${d.data.status}${d.data.reviewReason ? ` · ${d.data.reviewReason}` : ''}`); }
  } else {
    if (!apps.length) lines.push(tr('Complete your profile, browse schemes, and save an application draft. Submit online after attaching required documents.', 'प्रोफ़ाइल पूरी करें, योजनाएँ देखें और आवेदन का मसौदा बनाएँ। आवश्यक दस्तावेज़ लगाकर ऑनलाइन जमा करें।'));
    for (const app of apps) {
      references.push(app.id);
      const name = snapshot.schemes.find(s => s.id === app.data.schemeId)?.data.shortName ?? app.data.schemeId;
      lines.push(`${name}: ${(stages[app.data.status] ?? [app.data.status, app.data.status])[hi ? 1 : 0]}`);
      if (app.data.rejectionReason) lines.push(`${tr('Officer reason', 'अधिकारी का कारण')}: ${app.data.rejectionReason}`);
      const deficiencies = snapshot.deficiencies.filter(d => d.data.applicationId === app.id && d.data.status !== 'resolved');
      for (const d of deficiencies) {
        references.push(d.id);
        lines.push(`${d.data.documentType.replace(/_/g, ' ')}: ${d.data.reason} · ${tr('deadline', 'अंतिम तारीख')} ${d.data.deadline}. ${d.data.status === 'corrected' ? tr('Correction sent; officer review is still required.', 'सुधार भेजा गया है; अधिकारी की जाँच बाकी है।') : tr('Upload a new corrected version in Documents, then send it against this deficiency in Applications.', 'दस्तावेज़ में नया सुधरा संस्करण अपलोड करें, फिर आवेदन में इस कमी के लिए भेजें।')}`);
      }
      const latest = new Map<string, PilotSnapshot['verifications'][number]>();
      for (const v of [...snapshot.verifications].filter(v => v.data.applicationId === app.id).sort((a,b) => a.data.createdAt.localeCompare(b.data.createdAt) || a.id.localeCompare(b.id))) latest.set(v.data.source, v);
      for (const v of latest.values()) if (['pending','source_down','manual_review','mismatch'].includes(v.data.state)) {
        references.push(v.id); lines.push(`${v.data.source}: ${v.data.reason}. ${tr('Awaiting an authorized human review; this is not an automatic rejection.', 'अधिकृत अधिकारी की समीक्षा बाकी है; यह स्वतः अस्वीकृति नहीं है।')}`);
      }
    }
  }
  return { text: lines.join('\n'), references };
}

interface Recognition {
  lang: string;
  onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export default function PilotAssistant({ snapshot, language, cachedAt, onHelp }: { onHelp:()=>void; snapshot: PilotSnapshot; language: 'en' | 'hi'; cachedAt: string }) {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('status');
  const [voiceNotice, setVoiceNotice] = useState('');
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);
  const hi = language === 'hi';
  const answer = answerPilotQuestion(snapshot, asked, language);
  const speechWindow = window as typeof window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
  useEffect(() => () => { recognition.current?.stop(); window.speechSynthesis?.cancel(); }, []);
  const listen = () => {
    if (!Ctor) { setVoiceNotice(hi ? 'इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है। प्रश्न लिखें।' : 'Voice input is unavailable in this browser. Type your question.'); return; }
    recognition.current?.stop();
    const next = new Ctor(); recognition.current = next; next.lang = hi ? 'hi-IN' : 'en-IN';
    next.onresult = event => { const text = event.results[0][0].transcript; setQuestion(text); setAsked(text); };
    next.onerror = () => { setListening(false); setVoiceNotice(hi ? 'माइक्रोफ़ोन या भाषा उपलब्ध नहीं है। प्रश्न लिखें।' : 'Microphone or language recognition is unavailable. Type your question.'); };
    next.onend = () => setListening(false);
    try { next.start(); setListening(true); } catch { next.onerror(); }
  };
  const speak = () => {
    if (!window.speechSynthesis) { setVoiceNotice('Audio is unavailable. Read the answer below.'); return; }
    const locale = hi ? 'hi' : 'en';
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(locale));
    if (!voice) { setVoiceNotice(hi ? 'हिन्दी आवाज़ उपलब्ध नहीं है। उत्तर पढ़ें।' : 'An English voice is unavailable. Read the answer below.'); return; }
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(answer.text); utterance.voice = voice; utterance.lang = hi ? 'hi-IN' : 'en-IN'; window.speechSynthesis.speak(utterance);
  };
  return <div lang={language}><header className="case-page-bar"><div><h1>{hi?'सहायता और सारथी':'Help and Saarthi'}</h1><p>{hi?'अपने आवेदन के बारे में पूछें।':'Ask a question or get help from your scholarship officer.'}</p></div><span className="case-tag verified">English / हिन्दी</span></header><div className="case-help-grid"><section className="case-panel case-help-chat"><h2>Saarthi</h2><p className="case-caption">{hi?'उत्तर आपके अधिकृत पायलट रिकॉर्ड से आते हैं।':'Answers use your authorized pilot records. Government checks and payments are simulated.'}</p>{cachedAt&&<p>Last synchronized: {new Date(cachedAt).toLocaleString()}</p>}<div className="case-pilot-conversation" aria-live="polite"><div className="case-question-bubble">{asked==='status'?(hi?'मेरे आवेदन की स्थिति क्या है?':'What is my application status?'):asked}</div><div className="case-answer-bubble">{answer.text}</div></div><div className="case-assistant-controls"><button type="button" onClick={listening?()=>recognition.current?.stop():listen}>{listening?'Stop microphone':hi?'आवाज़ से पूछें':'Ask by voice'}</button><button type="button" onClick={speak}>{hi?'उत्तर सुनें':'Read aloud'}</button><button type="button" onClick={()=>window.speechSynthesis?.cancel()}>Stop audio</button></div>{voiceNotice&&<p role="status">{voiceNotice}</p>}<form className="case-assistant-input" onSubmit={event=>{event.preventDefault();if(question.trim())setAsked(question.trim());}}><label>{hi?'आपका प्रश्न':'Your question'}<input value={question} onChange={e=>setQuestion(e.target.value)} required/></label><button>{hi?'पूछें':'Ask'}</button></form></section><aside><section className="case-panel"><h2>Need a person to help?</h2><p className="case-outreach-copy">For a correction, a delay, or something that needs a closer look, send a help request to your scholarship officer.</p><button className="case-button" onClick={onHelp}>Create a help request</button></section><section className="case-panel"><h2>Records used in this answer</h2><p className="case-caption">Answers describe your loaded applications and available evidence.</p><p className="pilot-code">{answer.references.join(', ') || 'No application records'}</p>{snapshot.pages&&<p className="case-caption">Browse or search Applications to load other records.</p>}</section><div className="case-notice"><h3>Your details stay with your account</h3><p>Saarthi can explain recorded decisions. An authorized officer makes the scholarship decision.</p></div></aside></div></div>;
}
