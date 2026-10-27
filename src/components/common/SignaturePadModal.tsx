import { useState, useRef, useEffect } from 'react';
import { PenLine, Stamp, Lock, CheckCircle2, FileSignature } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';

// ============================================================
// Officer Digital e-Signature ("e-Sign") Pad
//
// Local demo acknowledgement only; no certified e-Sign or PKI.
// ============================================================

interface SignaturePadModalProps {
  open: boolean;
  onClose: () => void;
  onSign: (signatureUrl: string) => void;
  officerName: string;
  designation?: string;
  applicationId: string;
  sanctionAmount?: number;
}

export function SignaturePadModal({
  open,
  onClose,
  onSign,
  officerName,
  designation = 'State Nodal Officer',
  applicationId,
  sanctionAmount,
}: SignaturePadModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [useDrawn, setUseDrawn] = useState(true);

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e3a8a'; // classic blue ink
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasDrawn(false);
    }
  }, [open, useDrawn]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left) * canvas.width / rect.width;
    const y = (('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top) * canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left) * canvas.width / rect.width;
    const y = (('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top) * canvas.height / rect.height;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    let sigUrl = '';
    if (canvas && hasDrawn && useDrawn) {
      sigUrl = canvas.toDataURL('image/png');
    } else {
      const stamp = document.createElement('canvas');
      stamp.width = 440;
      stamp.height = 100;
      const ctx = stamp.getContext('2d');
      if (!ctx) return;
      ctx.font = '20px sans-serif';
      ctx.fillText(officerName, 10, 40);
      ctx.fillText('Demo acknowledgement', 10, 75);
      sigUrl = stamp.toDataURL('image/png');
    }
    onSign(sigUrl);
    onClose();
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Officer Demo Acknowledgement">
      <div className="space-y-4">
        {/* Sanction Header Notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/30">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-200">
              Sanction Order Authorization
            </span>
            <Badge tone="amber">DEMO · NOT CERTIFIED e-SIGN</Badge>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-blue-900 dark:text-blue-200">
            <div>
              <span className="text-stone-400">Application:</span> <span className="font-mono font-bold">{applicationId}</span>
            </div>
            {sanctionAmount && (
              <div>
                <span className="text-stone-400">Sanction Amount:</span>{' '}
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  ₹{sanctionAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div>
              <span className="text-stone-400">Signatory Officer:</span> <span className="font-medium">{officerName}</span>
            </div>
            <div>
              <span className="text-stone-400">Designation:</span> <span className="font-medium">{designation}</span>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setUseDrawn(true)}
            className={`flex-1 rounded-lg border py-1.5 font-medium transition-colors ${
              useDrawn
                ? 'border-earth-600 bg-earth-50 text-earth-800 dark:bg-earth-950/40 dark:text-earth-300'
                : 'border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-300'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <PenLine className="h-3.5 w-3.5" />
              Draw Live Signature
            </span>
          </button>
          <button
            type="button"
            onClick={() => setUseDrawn(false)}
            className={`flex-1 rounded-lg border py-1.5 font-medium transition-colors ${
              !useDrawn
                ? 'border-earth-600 bg-earth-50 text-earth-800 dark:bg-earth-950/40 dark:text-earth-300'
                : 'border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-300'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Stamp className="h-3.5 w-3.5" />
              Typed acknowledgement
            </span>
          </button>
        </div>

        {/* Drawing Canvas or Digital Stamp Preview */}
        {useDrawn ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Sign inside the box using mouse, stylus, or touch:</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
              >
                Clear Canvas
              </button>
            </div>
            <div className="relative rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-1 dark:border-stone-600 dark:bg-stone-900/60 shadow-inner">
              <canvas
                ref={canvasRef}
                width={440}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                aria-label="Draw demo signature"
                className="w-full touch-none cursor-crosshair rounded-lg bg-white dark:bg-stone-800"
              />
              {!hasDrawn && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-stone-400">
                  Draw official signature here
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-stone-300 bg-white p-6 text-center dark:border-stone-700 dark:bg-stone-800">
            <div className="inline-block rounded-xl border-2 border-emerald-600 p-4 text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="text-xs uppercase tracking-wider font-bold">DEMO ACKNOWLEDGEMENT</div>
              <div className="mt-1 font-serif text-lg font-bold">{officerName}</div>
              <div className="text-[11px] text-stone-600 dark:text-stone-400">{designation}</div>
              <div className="mt-1 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                TIMESTAMP: {new Date().toISOString()} · LOCAL DEMO
              </div>
            </div>
          </div>
        )}

        {/* Compliance Footer */}
        <div className="flex items-start gap-1.5 rounded-lg bg-stone-100 p-2.5 text-[11px] text-stone-500 dark:bg-stone-800 dark:text-stone-400">
          <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5 text-stone-500" />
          <span>Stored locally with the officer name and time. Payment simulation is a separate action. This is not a certified electronic signature.</span>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={useDrawn && !hasDrawn} onClick={handleApply}>
            <span className="flex items-center gap-1.5">
              <FileSignature className="h-4 w-4" />
              Save acknowledgement & sanction
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
