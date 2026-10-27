import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stagingConfig, safeRoute, value, deniedResult } from './staging-helpers.mjs';

test('release tools refuse an unapproved target, missing credentials and mismatched URL', () => {
  const config = { name: 'tribe-saarthi-staging', projectRef: 'a'.repeat(20), publishableKey: 'public', serviceRoleKey: 'private' };
  assert.equal(stagingConfig(config).url, `https://${'a'.repeat(20)}.supabase.co`);
  for (const change of [{ name: 'production' }, { projectRef: '' }, { serviceRoleKey: '' }, { url: 'https://foreign.supabase.co' }]) {
    assert.throws(() => stagingConfig({ ...config, ...change }));
  }
});

test('request evidence removes signed URLs, query tokens and email filters', () => {
  assert.equal(safeRoute('https://example.org/storage/v1/object/sign/private/path?token=secret'), '/storage/v1/[redacted]');
  assert.equal(safeRoute(new Request('https://example.org/rest/v1/pilot_accounts?email=eq.private@example.org')), '/rest/v1/pilot_accounts');
  assert.equal(safeRoute('https://example.org/functions/v1/pilot-receipt?token=secret'), '/functions/v1/pilot-receipt');
});

test('API failures never include provider bodies or credentials in diagnostics', () => {
  assert.throws(() => value({ error: { message: 'private-secret', status: 403 } }, 'Upload'), error =>
    error.message.includes('403') && !error.message.includes('private-secret'));
  assert.equal(value({ data: 3 }, 'Count'), 3);
});

test('hosted denial evidence rejects outages and missing endpoints', () => {
  deniedResult({ error: { code: '42501' }, status: 403 }, 'Table write');
  deniedResult({ error: { context: { status: 401 } } }, 'Expired session');
  for (const result of [{ data: [] }, { error: { status: 0 } }, { error: { context: { status: 500 } } }, { error: { status: 404 } }]) {
    assert.throws(() => deniedResult(result, 'Denial'));
  }
});
