import Dialog from '@mui/material/Dialog';
import { useId, useState, type ReactNode } from 'react';
import { CheckCircle2, Landmark, ShieldCheck, Cpu, Inbox, X, Sparkles, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { statusTone, statusLabel, type Tone } from '@/lib/format';

// ============================================================
// USWDS-Compliant Government Alert Box (GEMINI.md Rule 9)
// ============================================================

export interface GovAlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  children: React.ReactNode;
  className?: string;
  role?: string;
}

const alertConfig = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-600',
    text: 'text-emerald-900 dark:text-emerald-200',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-600',
    text: 'text-amber-900 dark:text-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-600',
    text: 'text-red-900 dark:text-red-200',
    icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-600',
    text: 'text-blue-900 dark:text-blue-200',
    icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
  },
};

export function GovAlert({ type, title, children, className = '', role }: GovAlertProps) {
  const cfg = alertConfig[type];
  const computedRole = role ?? (type === 'error' || type === 'warning' ? 'alert' : 'region');
  return (
    <div
      role={computedRole}
      aria-label={title}
      className={`${cfg.bg} border-l-4 ${cfg.border} p-4 rounded-r-xl shadow-xs flex gap-3.5 my-3 ${className}`}
    >
      {cfg.icon}
      <div>
        <h4 className={`text-sm font-bold ${cfg.text}`}>{title}</h4>
        <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// Shared UI primitives: Modern Tailwind components
// ============================================================

const TONE_STYLES: Record<Tone, { bg: string; text: string; border: string; dot: string }> = {
  green: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-500/30 dark:border-amber-500/40',
    dot: 'bg-amber-500',
  },
  red: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30 dark:border-rose-500/40',
    dot: 'bg-rose-500',
  },
  blue: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-500/30 dark:border-sky-500/40',
    dot: 'bg-sky-500',
  },
  gray: {
    bg: 'bg-stone-500/10 dark:bg-stone-500/20',
    text: 'text-stone-700 dark:text-stone-300',
    border: 'border-stone-400/25 dark:border-stone-600/30',
    dot: 'bg-stone-400',
  },
};

export function Badge({
  tone = 'gray',
  children,
  className = '',
  withDot = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  withDot?: boolean;
}) {
  const style = TONE_STYLES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm border shadow-xs transition-all ${style.bg} ${style.text} ${style.border} ${className}`}
    >
      {withDot && <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${style.dot}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={statusTone(status)} withDot>
      {statusLabel(status)}
    </Badge>
  );
}

export interface InspectorDetails {
  authority: string;
  systemName: string;
  signatureAlg: string;
  sha256Hash: string;
  issuedAt: string;
  verifiedAt: string;
  issuerOrg: string;
}

export function CertificateInspectorModal({
  open,
  onClose,
  details,
}: {
  open: boolean;
  onClose: () => void;
  details?: InspectorDetails;
}) {
  if (!open || !details) return null;
  return (
    <Modal open={open} onClose={onClose} title="Government Integration & Certificate Inspector">
      <div className="space-y-4 text-sm">
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Simulated credential details</span>
          </div>
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            This is a local demo record. No government lookup or cryptographic signature validation has been performed.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl border border-stone-200/90 bg-stone-50/70 p-4 text-xs dark:border-stone-800 dark:bg-stone-900/60 shadow-xs">
          <div>
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Issuing Authority:</span>
            <div className="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">{details.authority}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Underlying System:</span>
            <div className="font-semibold text-stone-800 dark:text-stone-100 mt-0.5">{details.systemName}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Organization:</span>
            <div className="font-medium text-stone-700 dark:text-stone-300 mt-0.5">{details.issuerOrg}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Signature Algorithm:</span>
            <div className="font-mono text-stone-700 dark:text-stone-300 mt-0.5 text-[11px]">{details.signatureAlg}</div>
          </div>
          <div className="col-span-2">
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Demo reference (not a checksum):</span>
            <div className="mt-1 break-all font-mono text-[11px] text-earth-800 dark:text-earth-300 bg-white/90 dark:bg-stone-950 p-2 rounded-lg border border-stone-200 dark:border-stone-800 shadow-inner">
              {details.sha256Hash}
            </div>
          </div>
          <div>
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Issued On:</span>
            <div className="text-stone-600 dark:text-stone-300 mt-0.5">{details.issuedAt}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase text-[10px] font-semibold tracking-wider">Adapter Verified:</span>
            <div className="text-stone-600 dark:text-stone-300 mt-0.5">{details.verifiedAt}</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg bg-stone-100/80 p-2.5 text-center text-[11px] text-stone-500 dark:bg-stone-800/60 dark:text-stone-400">
          <Landmark className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span>SIMULATED GOVERNMENT ADAPTER · Ready for live API plug-in via standardized REST/gRPC interfaces</span>
        </div>
      </div>
    </Modal>
  );
}

export function SimulatedBadge({
  label = 'SIMULATED',
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md border border-clay-400/40 bg-clay-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-clay-700 dark:text-clay-400 hover:bg-clay-500/20 active:scale-95 transition-all ${
        onClick ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      <Cpu className="h-2.5 w-2.5" />
      <span>{label}</span>
    </button>
  );
}

export function AuthenticityBadge({
  source = 'DigiLocker',
  system = 'DigiLocker API v2',
  hash = 'No checksum generated',
}: {
  source?: string;
  system?: string;
  hash?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 shadow-xs hover:bg-emerald-100 hover:border-emerald-500/60 hover:shadow-sm active:scale-95 transition-all dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
        title="Inspect simulated credential details"
      >
        <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        <span>{source} · SIMULATED</span>
      </button>

      <CertificateInspectorModal
        open={open}
        onClose={() => setOpen(false)}
        details={{
          authority: source,
          systemName: system,
          signatureAlg: 'Not performed (demo)',
          sha256Hash: hash,
          issuedAt: '2026-08-01 10:00:00 IST',
          verifiedAt: 'Simulated only',
          issuerOrg: 'Ministry of Electronics and Information Technology (MeitY)',
        }}
      />
    </>
  );
}

export function Card({
  children,
  className = '',
  hoverEffect = false,
}: {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-stone-200/80 bg-white/90 shadow-soft backdrop-blur-sm dark:border-stone-800/80 dark:bg-stone-900/90 ${
        hoverEffect ? 'hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  right,
  badge,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  badge?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{title}</h2>
          {badge && (
            <span className="rounded-full bg-earth-500/15 border border-earth-500/30 px-2 py-0.5 text-[10px] font-bold text-earth-800 dark:text-earth-300">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatTile({
  label,
  value,
  tone = 'gray',
  icon: Icon,
  subtext,
}: {
  label: string;
  value: string;
  tone?: Tone;
  icon?: React.ComponentType<{ className?: string }>;
  subtext?: string;
}) {
  const accentGradients: Record<Tone, string> = {
    green: 'from-emerald-500 to-teal-600 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    amber: 'from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    red: 'from-rose-500 to-red-600 text-rose-600 dark:text-rose-400 bg-rose-500/10',
    blue: 'from-sky-500 to-blue-600 text-sky-600 dark:text-sky-400 bg-sky-500/10',
    gray: 'from-stone-500 to-stone-700 text-stone-600 dark:text-stone-400 bg-stone-500/10',
  };

  const borderAccents: Record<Tone, string> = {
    green: 'border-b-emerald-500/60 dark:border-b-emerald-500',
    amber: 'border-b-amber-500/60 dark:border-b-amber-500',
    red: 'border-b-rose-500/60 dark:border-b-rose-500',
    blue: 'border-b-sky-500/60 dark:border-b-sky-500',
    gray: 'border-b-stone-400 dark:border-b-stone-600',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/95 p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated dark:border-stone-800/80 dark:bg-stone-900/90 border-b-2 ${borderAccents[tone]}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl p-1.5 ${accentGradients[tone]}`}>
            <Icon className="h-full w-full" />
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-display">
        {value}
      </div>
      {subtext && <div className="mt-1 text-[11px] text-stone-400 dark:text-stone-500 truncate">{subtext}</div>}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'brand';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary:
      'bg-gradient-to-r from-earth-700 via-earth-800 to-earth-900 hover:from-earth-600 hover:to-earth-800 text-white shadow-md shadow-earth-900/20 active:scale-[0.98]',
    brand:
      'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-700/20 active:scale-[0.98]',
    secondary:
      'border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-800 shadow-xs active:scale-[0.98] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-750',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-md shadow-rose-900/20 active:scale-[0.98]',
    ghost:
      'text-earth-700 hover:bg-earth-500/10 dark:text-earth-300 dark:hover:bg-stone-800 active:scale-[0.98]',
  };

  return (
    <button
      {...props}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({open,onClose,title,children,wide=false}:{open:boolean;onClose:()=>void;title:string;children:ReactNode;wide?:boolean}) {
 const titleId=useId();
 return <Dialog open={open} onClose={onClose} fullWidth maxWidth={wide?'lg':'sm'} aria-labelledby={titleId} slotProps={{paper:{className:'case-dialog'}}}><div className="case-dialog-header"><h2 id={titleId}>{title}</h2><button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}</Dialog>;
}

export function EmptyState({ icon, title, hint }: { icon?: ReactNode; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/80 py-12 px-6 text-center dark:border-stone-700/80 bg-stone-50/40 dark:bg-stone-900/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500 shadow-inner">
        {icon ?? <Inbox className="h-6 w-6 stroke-1" />}
      </div>
      <p className="mt-3 text-sm font-semibold text-stone-800 dark:text-stone-200">{title}</p>
      {hint && <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm">{hint}</p>}
    </div>
  );
}
