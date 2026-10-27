import type { AuditEntry } from '@/types';

// ============================================================
// Append-only audit log — every meaningful action in the
// prototype flows through here. Judged-visible in the Officer
// portal (who did what, when, on which entity).
// ============================================================

let counter = 0;

export function logAudit(
  entries: AuditEntry[],
  actor: string,
  action: string,
  entity: string,
  detail?: string,
): AuditEntry[] {
  counter += 1;
  const entry: AuditEntry = {
    id: `aud_${Date.now().toString(36)}_${counter}`,
    ts: new Date().toISOString(),
    actor,
    action,
    entity,
    detail,
  };
  return [...entries, entry];
}
