import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Play, Pause, Target, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSession } from '@/store/session';

export interface DemoBeat {
  id: number;
  title: string;
  description: string;
  route: string;
  role: 'student' | 'officer';
  highlightSelector?: string;
}

const DEMO_BEATS: DemoBeat[] = [
  {
    id: 1,
    title: 'Student Asha: Pre-filled Profile',
    description: 'Asha logs in → profile pre-loaded (ST, PVTG?, family income, Aadhaar…)',
    route: '/student',
    role: 'student',
    highlightSelector: '[data-demo="student-profile"]',
  },
  {
    id: 2,
    title: 'Explainable Rules Audit Trail',
    description: 'Scholarship Discovery → REAL engine evaluates 4 MoTA schemes → rule-by-rule "Why?" audit trail',
    route: '/student/discovery',
    role: 'student',
    highlightSelector: '[data-demo="eligibility-audit"]',
  },
  {
    id: 3,
    title: 'Document Wallet: Cross-Scheme Reuse',
    description: 'Docs already uploaded & verified last cycle → reused across NSP/SFMP/NOS; OCR simulation flags mismatch → MANUAL REVIEW',
    route: '/student/wallet',
    role: 'student',
    highlightSelector: '[data-demo="document-wallet"]',
  },
  {
    id: 4,
    title: 'Kill-a-Source Sabotage Switchboard',
    description: 'Verification Pipeline runs Identity→ST→Income→Institute→Dept → DEMO: judge kills income source → system honesty: PENDING, NOT rejected, routed to Nodal Officer',
    route: '/officer/testing',
    role: 'officer',
    highlightSelector: '[data-demo="sabotage-switchboard"]',
  },
  {
    id: 5,
    title: 'Coverage Gap Analytics',
    description: 'Government Coverage Dashboard → District-level gap analytics → "Enrolled ST students vs. availing" using a pattern-fit demo baseline; not official district statistics',
    route: '/officer/coverage',
    role: 'officer',
    highlightSelector: '[data-demo="coverage-gap"]',
  },
];

interface DemoTourProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DemoTour({ isOpen = true, onClose }: DemoTourProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const currentBeat = DEMO_BEATS[currentIndex];
  const isOnCorrectRoute = location.pathname === currentBeat.route;

  // Auto-navigate to the correct route when beat changes
  useEffect(() => {
    if (!isOpen) return;
    useSession.getState().login(currentBeat.role === 'student' ? 'usr_asha' : 'usr_verma');
    if (!isOnCorrectRoute) {
      navigate(currentBeat.route);
    }
  }, [isOpen, currentIndex, navigate, isOnCorrectRoute, currentBeat.route, currentBeat.role]);

  useEffect(() => {
    if (!isOpen || !isOnCorrectRoute || !currentBeat.highlightSelector) return;
    const target = document.querySelector<HTMLElement>(currentBeat.highlightSelector);
    if (!target) return;
    target.classList.add('demo-tour-target');
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    return () => target.classList.remove('demo-tour-target');
  }, [isOpen, currentBeat, location.pathname, isOnCorrectRoute]);

  // Auto-play functionality
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentIndex < DEMO_BEATS.length - 1) {
        goNext();
      } else {
        setIsAutoPlaying(false);
      }
    }, 15000); // 15 seconds per beat

    return () => clearTimeout(timer);
  }, [isOpen, isAutoPlaying, currentIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, DEMO_BEATS.length - 1));
  }, []);

  const goPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToBeat = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsAutoPlaying(false);
    onClose?.();
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case ' ':
          e.preventDefault();
          toggleAutoPlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrevious();
          break;
        case 'Enter':
          e.preventDefault();
          toggleAutoPlay();
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
        default:
          // Number keys 1-5 for direct beat access
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= DEMO_BEATS.length) {
            e.preventDefault();
            goToBeat(num - 1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goNext, goPrevious, toggleAutoPlay, handleClose, goToBeat]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-5xl pointer-events-auto">
        {/* Progress indicator bar */}
        <div className="mb-2 flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5">
            {DEMO_BEATS.map((beat, index) => (
              <button
                key={beat.id}
                onClick={() => goToBeat(index)}
                className={`relative h-2 w-20 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-earth-600'
                    : index < currentIndex
                    ? 'bg-earth-400'
                    : 'bg-stone-200 dark:bg-stone-700'
                } hover:scale-y-150`}
                aria-label={`Go to step ${beat.id}: ${beat.title}`}
                title={beat.title}
              >
                {index === currentIndex && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-earth-700 dark:text-earth-300 whitespace-nowrap">
                    {beat.id}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <span>Step {currentIndex + 1} of {DEMO_BEATS.length}</span>
            <span className="w-px h-4 bg-stone-300 dark:bg-stone-600" />
            <span className="flex items-center gap-1">
              {currentBeat.role === 'student' ? <GraduationCap className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              {currentBeat.role === 'student' ? 'Student Portal' : 'Officer Command'}
            </span>
          </div>
        </div>

        {/* Main banner */}
        <div
          className="relative rounded-t-xl border border-stone-200 bg-white px-4 py-3 shadow-2xl dark:border-stone-700 dark:bg-stone-800"
          role="dialog"
          aria-label="Hackathon Judge Demo Tour"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 rounded p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700"
            aria-label="Close demo tour"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3">
            {/* Step number badge */}
            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-earth-600 text-white font-bold text-sm">
              {currentBeat.id}
            </div>

            {/* Beat info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {currentBeat.title}
              </h3>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {currentBeat.description}
              </p>

              {/* Route indicator */}
              <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-500">
                <span className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700">
                  {currentBeat.route}
                </span>
                {isOnCorrectRoute ? (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Target className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    Navigating…
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  aria-label="Previous demo beat"
                  className="px-2 py-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={goNext}
                  disabled={currentIndex === DEMO_BEATS.length - 1}
                  aria-label="Next demo beat"
                  className="px-2 py-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant={isAutoPlaying ? 'secondary' : 'ghost'}
                onClick={toggleAutoPlay}
                className="gap-1 px-2 py-1"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    Pause Auto
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Auto-play
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="mt-2 flex items-center justify-end gap-4 text-[10px] text-stone-400 dark:text-stone-500">
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700">←</kbd>
            <span>Previous</span>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700">→</kbd>
            <span>Next</span>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700">Space</kbd>
            <span>Auto-play</span>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700">Esc</kbd>
            <span>Close</span>
            <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700">1-5</kbd>
            <span>Jump to beat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
