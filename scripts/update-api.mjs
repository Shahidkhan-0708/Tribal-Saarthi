import fs from 'node:fs';

let code = fs.readFileSync('src/pilot/api.ts', 'utf8');

if (!code.includes('export function getSupabase()')) {
  code = code.replace(
    /return client \?\?=\s*createClient\([^)]+\);\r?\n}/,
    (match) => `${match}\nexport function getSupabase() { return sdk(); }`
  );
}

if (!code.includes('export async function getAccount(')) {
  const injection = `export async function getAccount(userId: string): Promise<PilotAccount | null> {
  try {
    const { data, error } = await sdk().from('pilot_accounts').select('*').eq('id', userId).single();
    if (error || !data) return null;
    return account(data);
  } catch { return null; }
}
export async function fetchBackendSnapshot() {
  const sb = sdk();
  const [appsRes, studentsRes, docsRes, schemesRes, grievancesRes, notifsRes, auditRes] = await Promise.all([
    sb.from('pilot_applications').select('id, version, data'),
    sb.from('pilot_students').select('id, version, data'),
    sb.from('pilot_documents').select('id, version, data'),
    sb.from('pilot_schemes').select('id, version, data'),
    sb.from('pilot_grievances').select('id, version, data'),
    sb.from('pilot_notifications').select('id, version, data'),
    sb.from('pilot_audit').select('id, version, data').limit(50),
  ]);
  return {
    applications: appsRes.data ?? [],
    students: studentsRes.data ?? [],
    documents: docsRes.data ?? [],
    schemes: schemesRes.data ?? [],
    grievances: grievancesRes.data ?? [],
    notifications: notifsRes.data ?? [],
    audit: auditRes.data ?? [],
  };
}
function account(row: Record<string, unknown>): PilotAccount {`;

  code = code.replace('function account(row: Record<string, unknown>): PilotAccount {', injection);
}

fs.writeFileSync('src/pilot/api.ts', code, 'utf8');
console.log('src/pilot/api.ts updated successfully.');
