import { useState, useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';

// ============================================================
// Aadhaar OTP e-KYC Consent Modal
//
// Pattern inspired by IndiaStack / UIDAI authentication flow.
// Features 6-digit input boxes, auto-focus progression,
// timer countdown, consent declaration, and simulated verification.
// ============================================================

interface AadhaarOtpModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  aadhaarLast4?: string;
  purpose?: string;
}

export function AadhaarOtpModal({
  open,
  onClose,
  onSuccess,
  aadhaarLast4 = '4821',
  purpose = 'Digital Document Fetch & Unified Verification',
}: AadhaarOtpModalProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setDigits(['', '', '', '', '', '']);
      setTimer(30);
      setError(null);
      setLoading(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    if (!open || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [open, timer]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const char = val.slice(-1);
    const updated = [...digits];
    updated[index] = char;
    setDigits(updated);
    setError(null);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFillDemo = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
    inputRefs.current[5]?.focus();
    setError(null);
  };

  const handleVerify = () => {
    const otp = digits.join('');
    if (otp.length < 6) {
      setError('Please enter all 6 digits of the Aadhaar OTP.');
      return;
    }
    if (!consent) {
      setError('Please accept the UIDAI consent authorization.');
      return;
    }

    setLoading(true);
    setError(null);

    // Mock UIDAI specification verification check
    setTimeout(() => {
      setLoading(false);
      // Authorized mock demo OTP is '123456'
      // When entering incorrect pin (e.g. 999999), UIDAI spec returns FAILED
      if (otp !== '123456') {
        setError('Wrong OTP. Please retry');
        // Clear all 6 boxes and reset focus to the first box
        setDigits(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
        return;
      }

      onSuccess();
      onClose();
    }, 600);
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Aadhaar e-KYC · SIMULATED">
      <div className="space-y-4">
        {/* Header Notice */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-200">
              UIDAI e-KYC Portal
            </span>
            <Badge tone="amber">SIMULATED</Badge>
          </div>
          <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
            No OTP is sent. Enter demo digits <strong className="font-mono">123456</strong> (or test wrong pin e.g. <strong className="font-mono">999999</strong>) to simulate verification for Aadhaar ending in{' '}
            <strong className="font-mono">•••• •••• {aadhaarLast4}</strong>.
          </p>
          <div className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
            Purpose: <span className="font-medium">{purpose}</span>
          </div>
        </div>

        {/* 6-Digit Box Input */}
        <div>
          <label className="block text-center text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Enter 6-Digit OTP
          </label>
          <div className="flex justify-center gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-12 w-10 text-center font-mono text-xl font-bold rounded-lg border-2 bg-white text-stone-900 focus:outline-none dark:bg-stone-700 dark:text-stone-100 transition-colors shadow-sm ${
                  error ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-emerald-600 dark:border-stone-600'
                }`}
                aria-label={`OTP Digit ${i + 1}`}
              />
            ))}
          </div>
          {error && (
            <div role="alert" className="mt-2.5 rounded-md border border-red-200 bg-red-50 p-2 text-center text-xs text-rose-700 font-semibold dark:border-red-900/40 dark:bg-red-950/40 dark:text-rose-300">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Demo Fast-Fill & Resend Timer */}
        <div className="flex items-center justify-between text-xs px-1">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-emerald-700 hover:underline dark:text-emerald-400 font-medium"
          >
            ⚡ Autofill Demo OTP (123456)
          </button>
          <span className="text-stone-400">
            {timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              <button
                type="button"
                onClick={() => setTimer(30)}
                className="text-emerald-700 hover:underline dark:text-emerald-400 font-medium"
              >
                Resend OTP
              </button>
            )}
          </span>
        </div>

        {/* Consent Declaration */}
        <div className="rounded-lg bg-stone-50 p-2.5 text-xs text-stone-600 dark:bg-stone-800/80 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-stone-300 text-emerald-700 focus:ring-emerald-600"
            />
            <span>
              I grant consent to Ministry of Tribal Affairs (MoTA) and National Informatics Centre (NIC) to
              verify my demographic records via UIDAI e-KYC.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={loading}>
            {loading ? (
              'Verifying e-KYC...'
            ) : (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Verify & Proceed
              </span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
