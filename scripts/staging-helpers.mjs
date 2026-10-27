import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';

export const pilotTables = ['accounts','students','schemes','institutions','documents','applications','deficiencies','verifications','grievances','notifications','family_grants','payments','baselines','audit','notes','grievance_categories','deliveries','scheme_drafts','configuration_history','consents','consent_events','privacy_policies'];

export function stagingConfig(value) {
  assert.ok(['tribe-saarthi-staging', 'tribe-saarthi-restore'].includes(value.name), 'Dedicated staging project required');
  assert.match(value.projectRef ?? '', /^[a-z]{20}$/, 'Staging projectRef is missing');
  const url = `https://${value.projectRef}.supabase.co`;
  assert.ok(!value.url || value.url === url, 'Project URL/ref mismatch');
  assert.ok(value.publishableKey && value.serviceRoleKey, 'Private staging API keys are missing');
  return { ...value, url };
}

export function safeRoute(input) {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  // Signed Storage URLs contain credentials in both the path and query.
  return url.pathname.startsWith('/storage/') ? '/storage/v1/[redacted]' : url.pathname;
}

export async function staging(file = '.staging/config.json') {
  const config = stagingConfig(JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, '')));
  const requests = [];
  const transport = async (input, init) => {
    const started = Date.now();
    const response = await fetch(input, { ...init, signal: AbortSignal.timeout(30_000) });
    requests.push({ method: init?.method ?? (input instanceof Request ? input.method : 'GET'), path: safeRoute(input), status: response.status,
      requestId: response.headers.get('x-request-id') ?? response.headers.get('sb-request-id'), ms: Date.now() - started });
    return response;
  };
  const client = key => createClient(config.url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: transport },
  });
  return { config, requests, client: () => client(config.publishableKey), admin: client(config.serviceRoleKey), transport };
}

export function value(result, label) {
  assert.ok(!result.error, `${label} failed (${result.status ?? result.error?.status ?? 'API error'})`);
  return result.data;
}

export function deniedResult(result, label) {
  const status = Number(result.status ?? result.error?.context?.status ?? result.error?.status ?? result.error?.statusCode);
  assert.ok(result.error && (result.error.code === '42501' || [400,401,403,409].includes(status)), `${label}: expected an authorization/validation denial, not an outage or missing endpoint`);
}

export async function evidence(name, data) {
  await mkdir('artifacts/track-b', { recursive: true });
  await writeFile(`artifacts/track-b/${name}.json`, JSON.stringify(data, null, 2) + '\n');
}
