export function inrPretty(n?: number): string {
  if (n === undefined || n === null) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

export function fmtDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtDateTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray';

export function statusTone(
  status: string,
): Tone {
  switch (status) {
    case 'verified':
    case 'all_verified':
    case 'sanctioned':
    case 'disbursed':
    case 'successful':
    case 'resolved':
      return 'green';
    case 'pending':
    case 'pending_verification':
    case 'submitted':
    case 'institute_stage':
    case 'department_stage':
    case 'source_down':
    case 'unverified':
    case 'in_review':
    case 'open':
      return 'amber';
    case 'mismatch':
    case 'manual_review':
    case 'deficiency':
    case 'failed':
    case 'rejected':
      return 'red';
    case 'draft':
      return 'gray';
    default:
      return 'blue';
  }
}

export function statusLabel(status: string): string {
  return status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
