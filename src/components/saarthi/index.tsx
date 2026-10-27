import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, X, Square, Mic, MicOff, Send, MessageSquareQuote, Sparkles } from 'lucide-react';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { answerQuestion, type SaarthiReply } from '@/engines/saarthi';
import { SimulatedBadge } from '@/components/ui';

// ============================================================
// Saarthi - floating contextual assistant.
// Voice input + audio synthesis via Web Speech API;
// answers grounded in the student's live application state.
// English/Hindi templates; browser voice preview.
// ============================================================

interface ChatMessage {
  role: 'user' | 'saarthi';
  text: string;
  groundedOn?: string[];
  suggestions?: string[];
}

interface SpeechRecognitionLike {
  lang: string;
  onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror?: ((e?: unknown) => void) | null;
  start: () => void;
  stop: () => void;
}

type SaarthiLang = 'en' | 'hi';

interface LangOption {
  code: SaarthiLang;
  label: string;
  speechCode: string;
  samplePrompts: string[];
}

const LANGUAGES: LangOption[] = [
  {
    code: 'en',
    label: 'English',
    speechCode: 'en-IN',
    samplePrompts: [
      'Why is my scholarship pending?',
      'How to resolve deficiency?',
      'Show my document wallet',
      'When will DBT arrive?',
    ],
  },
  {
    code: 'hi',
    label: 'हिंदी (Hindi)',
    speechCode: 'hi-IN',
    samplePrompts: [
      'मेरी स्कॉलरशिप कहां रुकी है?',
      'दस्तावेज़ में क्या कमी है?',
      'डीबीटी पैसा कब आएगा?',
      'कौन सी योजनाएं उपलब्ध हैं?',
    ],
  },
];

export function Saarthi({ embedded = false }: { embedded?: boolean }) {
  const data = useData();
  const { user } = useSession();
  const [open, setOpen] = useState(embedded);
  const [selectedLang, setSelectedLang] = useState<SaarthiLang>('en');
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const student = data.students.find((s) => s.id === user?.studentId) ?? data.students[0];
  if (!student) return null;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const reply = answerQuestion(buildCtx(), 'hello', selectedLang);
      const firstMsg: ChatMessage = {
        role: 'saarthi',
        text: reply.text,
        groundedOn: reply.groundedOn,
        suggestions: reply.suggestions,
      };
      setMessages([firstMsg]);
      if (autoSpeak) {
        speakText(reply.text, selectedLang, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const buildCtx = () => ({
    student,
    applications: data.applications.filter((a) => a.studentId === student.id),
    documents: data.documents.filter((d) => d.studentId === student.id),
    schemes: data.schemes,
    notifications: data.notifications.filter((n) => n.userId === student.id),
  });

  const speakText = (text: string, langCode: SaarthiLang, msgIdx?: number) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (speakingIndex === msgIdx && msgIdx !== undefined) {
      setSpeakingIndex(null);
      return;
    }

    const cleanText = text.replace(/•|[*#]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langObj = LANGUAGES.find((l) => l.code === langCode);
    utterance.lang = langObj?.speechCode ?? 'en-IN';
    utterance.rate = 0.95; // Clearer pace for tribal students

    utterance.onstart = () => {
      if (msgIdx !== undefined) setSpeakingIndex(msgIdx);
    };
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  const ask = (q: string) => {
    const reply: SaarthiReply = answerQuestion(buildCtx(), q, selectedLang);
    const nextIdx = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'saarthi', text: reply.text, groundedOn: reply.groundedOn, suggestions: reply.suggestions },
    ]);
    if (autoSpeak) {
      speakText(reply.text, selectedLang, nextIdx);
    }
  };

  const handleMicDeniedFallback = () => {
    setListening(false);
    setMicNotice('Microphone access denied. Switched to keyboard input automatically.');
    setTimeout(() => inputRef.current?.focus(), 80);
    setTimeout(() => setMicNotice(null), 5000);
  };

  const startVoice = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      handleMicDeniedFallback();
      return;
    }
    try {
      const recog = new Ctor();
      const langObj = LANGUAGES.find((l) => l.code === selectedLang);
      recog.lang = langObj?.speechCode ?? 'en-IN';
      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput('');
        ask(transcript);
      };
      recog.onerror = () => {
        handleMicDeniedFallback();
      };
      recog.onend = () => setListening(false);
      setListening(true);
      recog.start();
    } catch {
      handleMicDeniedFallback();
    }
  };

  const activeLangConfig = LANGUAGES.find((l) => l.code === selectedLang) ?? LANGUAGES[0];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 min-h-[48px] flex items-center gap-2.5 rounded-full bg-emerald-900 px-3.5 py-2 text-xs font-bold text-white shadow-xl ring-2 ring-emerald-500/40 transition-all hover:scale-105 hover:bg-emerald-950 focus-visible:ring-2 focus-visible:ring-emerald-400"
        aria-label="Open Saarthi AI voice assistant"
      >
        <div className="relative">
          <img
            src="/images/avatar.jpg"
            alt="Saarthi Mentor"
            className="h-9 w-9 rounded-full border border-emerald-300 object-cover"
          />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900 animate-pulse" />
        </div>
        <div className="text-left">
          <div className="leading-tight font-extrabold flex items-center gap-1.5">
            <span>Saarthi AI</span>
            <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded font-black">आवाज़</span>
          </div>
          <div className="text-[10px] text-emerald-100 font-normal">English/Hindi: Live Assistant</div>
        </div>
      </button>
    );
  }

  return (
    <div className={embedded ? "case-embedded-saarthi" : "fixed bottom-5 right-5 z-40 flex h-[34rem] w-[min(26rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-800"}>
      {/* Header with Title and Language Selector */}
      <div className="border-b border-emerald-800/80 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/avatar.jpg"
              alt="Saarthi Mentor"
              className="h-8 w-8 rounded-full border border-emerald-300 object-cover shadow-sm"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                Saarthi AI
                <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                  Online
                </span>
              </div>
              <div className="text-[10px] text-emerald-200">English/Hindi: Live Assistant</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (speakingIndex !== null) {
                  window.speechSynthesis?.cancel();
                  setSpeakingIndex(null);
                }
                setAutoSpeak(!autoSpeak);
              }}
              className={`rounded p-1 text-xs text-white/90 hover:bg-white/10 ${autoSpeak ? 'bg-white/20' : ''}`}
              title={autoSpeak ? 'Voice output: ON' : 'Voice output: OFF'}
            >
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                if (!embedded) setOpen(false);
              }}
              className="rounded p-1 text-white/80 hover:bg-white/10"
              aria-label={embedded ? "Stop speech" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Multi-language prompt bar */}
        <div className="mt-2 flex items-center justify-between gap-1 border-t border-emerald-800/60 pt-2 text-xs">
          <span className="text-[11px] font-medium text-emerald-200">Answer language:</span>
          <div className="flex gap-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setSelectedLang(l.code)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  selectedLang === l.code
                    ? 'bg-white text-emerald-950 font-bold shadow-xs'
                    : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message History */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex items-start gap-2'}>
            {m.role === 'saarthi' && (
              <img
                src="/images/avatar.jpg"
                alt="Saarthi"
                className="mt-1 h-6 w-6 shrink-0 rounded-full border border-emerald-300 object-cover"
              />
            )}
            <div
              className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                m.role === 'user'
                  ? 'rounded-br-md bg-emerald-700 text-white font-medium shadow-xs'
                  : 'rounded-bl-md bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex-1">{m.text}</span>
                {m.role === 'saarthi' && (
                  <button
                    onClick={() => speakText(m.text, selectedLang, i)}
                    className={`shrink-0 rounded p-1 text-xs hover:bg-stone-200 dark:hover:bg-stone-600 ${
                      speakingIndex === i ? 'text-emerald-700 animate-pulse font-bold' : 'text-stone-500'
                    }`}
                    title={speakingIndex === i ? 'Stop speaking' : 'Speak answer aloud'}
                  >
                    {speakingIndex === i ? <Square className="h-3.5 w-3.5 fill-current" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>

              {m.groundedOn && m.groundedOn.length > 0 && m.role === 'saarthi' && (
                <div className="mt-2 flex flex-wrap gap-1 border-t border-stone-200 pt-1.5 dark:border-stone-600">
                  {m.groundedOn.map((g) => (
                    <span
                      key={g}
                      className="rounded bg-stone-200 px-1.5 py-0.5 text-[9px] font-medium text-stone-600 dark:bg-stone-600 dark:text-stone-200"
                    >
                      data: {g}
                    </span>
                  ))}
                </div>
              )}
              {m.suggestions && m.role === 'saarthi' && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-full border border-stone-300 px-2 py-0.5 text-[11px] text-stone-600 hover:bg-white dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-600"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Voice Prompts Pill Bar */}
      <div className="border-t border-stone-100 bg-stone-50 px-3 py-1.5 dark:border-stone-700 dark:bg-stone-800/80">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          Suggested Prompts ({activeLangConfig.label}):
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {activeLangConfig.samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => ask(prompt)}
              className="rounded-full bg-white px-2.5 py-1 text-[11px] text-stone-700 shadow-xs border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 dark:bg-stone-700 dark:border-stone-600 dark:text-stone-200"
            >
              <span className="flex items-center gap-1">
                <MessageSquareQuote className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                <span>{prompt}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-stone-200 p-2 dark:border-stone-700">
        {micNotice && (
          <div role="alert" className="mb-2 flex items-center justify-between rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
            <span>⚠ {micNotice}</span>
            <button type="button" onClick={() => setMicNotice(null)} className="text-amber-700 hover:underline text-[11px] ml-2 font-bold">Dismiss</button>
          </div>
        )}
        <div className="mb-1 flex items-center justify-between px-1">
          <SimulatedBadge label="Template answers · browser voice preview" />
          <button
            type="button"
            onClick={handleMicDeniedFallback}
            className="text-[10px] text-stone-400 hover:text-amber-700 underline font-medium"
            title="Matrix test: Denying microphone runtime access in the browser"
          >
            Simulate mic denied
          </button>
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                ask(input.trim());
                setInput('');
              }
            }}
            placeholder={`Ask in ${activeLangConfig.label} or tap mic`}
            className="flex-1 rounded-full border border-stone-300 px-3 py-1.5 text-sm dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100"
          />
          <button
            onClick={startVoice}
            className={`rounded-full px-3 py-1.5 text-sm ${
              listening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-stone-200 text-stone-700 dark:bg-stone-600 dark:text-stone-100'
            }`}
            aria-label="Voice input"
            title="Voice input (Web Speech API)"
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button
            onClick={() => {
              if (input.trim()) {
                ask(input.trim());
                setInput('');
              }
            }}
            className="rounded-full bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800 active:scale-95 transition-all shadow-xs"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
