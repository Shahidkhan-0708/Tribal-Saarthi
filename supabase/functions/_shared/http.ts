import { createClient } from 'npm:@supabase/supabase-js@2.117.3';
export const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });
export function headers(req: Request) {
  const origin = req.headers.get('origin');
  const allowed = (Deno.env.get('PILOT_ALLOWED_ORIGINS') ?? 'http://localhost:5173').split(',').map(x => x.trim());
  if (origin && !allowed.includes(origin)) throw new Error('forbidden: origin');
  return { 'Access-Control-Allow-Origin': origin ?? allowed[0], 'Vary': 'Origin', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Expose-Headers': 'X-Request-ID, Retry-After', 'Content-Type': 'application/json' };
}
class RateLimitError extends Error {
  constructor(readonly retryAfter: number) { super('rate_limited: request quota exceeded; retry later'); }
}
export async function limit(bucket: 'workflow' | 'invite' | 'receipt', subject: string) {
  const { data, error } = await admin.rpc('pilot_rate_limit', { p_bucket: bucket, p_subject: subject });
  if (error || typeof data?.allowed !== 'boolean' || !Number.isInteger(data.retryAfter) || data.retryAfter < 1) throw new Error('unavailable: request quota service unavailable');
  if (!data.allowed) throw new RateLimitError(data.retryAfter);
}
export async function actor(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer /i, '');
  if (!token) throw new Error('unauthorized: sign in required');
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) throw new Error('unauthorized: session expired');
  const account = await admin.from('pilot_accounts').select('*').eq('id', data.user.id).eq('active', true).single();
  if (account.error) throw new Error('forbidden: inactive account');
  const revoked=Number(account.data.lifecycle?.sessionsRevokedAfter ?? 0);
  if (revoked) {
    const claims=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
    if (!Number.isInteger(claims.iat) || claims.iat<=revoked) throw new Error('unauthorized: account sessions revoked; sign in again');
  }
  return account.data;
}
export async function body(req: Request) {
  if (req.method !== 'POST') throw new Error('validation: POST required');
  const raw = await req.text();
  if (raw.length > 1_000_000) throw new Error('validation: command too large');
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error('validation: invalid JSON'); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('validation: object required');
  return value;
}
export function serve(handler: (req: Request) => Promise<unknown>) {
  Deno.serve(async req => {
    const requestId = crypto.randomUUID();
    let cors: Record<string, string> = {};
    try {
      cors = headers(req);
      cors['X-Request-ID'] = requestId;
      if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
      return new Response(JSON.stringify(await handler(req)), { headers: cors });
    } catch (e) {
      const message = e instanceof Error ? e.message : '';
      const kind = /^(conflict|forbidden|unauthorized|validation):/.exec(message)?.[1];
      const unavailable = message.startsWith('unavailable:');
      const status = e instanceof RateLimitError ? 429 : unavailable ? 503 : kind === 'conflict' ? 409 : kind === 'forbidden' ? 403 : kind === 'unauthorized' ? 401 : kind === 'validation' ? 400 : 500;
      const code = status === 429 ? 'rate_limited' : unavailable ? 'unavailable' : kind ?? 'internal';
      cors['X-Request-ID'] = requestId;
      if (e instanceof RateLimitError) cors['Retry-After'] = String(e.retryAfter);
      console.warn(JSON.stringify({ requestId, status, code }));
      return new Response(JSON.stringify({ error: kind || unavailable || status === 429 ? message : 'internal: request could not be completed', code, requestId }), { status, headers: cors });
    }
  });
}
export async function checkedObject(bucket: string, path: unknown, userId: string) {
  if (typeof path !== 'string' || !path.startsWith(`${userId}/`) || path.includes('..')) throw new Error('validation: owned object path required');
  const { data, error } = await admin.storage.from(bucket).download(path);
  if (error || !data || data.size < 1 || data.size > 10_485_760) throw new Error('validation: uploaded object missing or exceeds 10 MB');
  const bytes = new Uint8Array(await data.arrayBuffer());
  const mimeType = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d ? 'application/pdf' : bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff ? 'image/jpeg' : bytes.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10' ? 'image/png' : '';
  if (!mimeType || data.type !== mimeType) throw new Error('validation: file must contain the declared PDF, JPEG or PNG bytes');
  const checksum = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  return { mimeType, checksum, size: bytes.length };
}
