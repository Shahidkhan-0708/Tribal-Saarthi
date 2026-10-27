import assert from 'node:assert/strict';
import { test } from 'node:test';
import { frontendEnv, localSettings, provisionAdmin } from './setup-backend.mjs';

test('local setup refuses hosted URLs and private keys in frontend settings', () => {
  const status = { API_URL: 'http://127.0.0.1:54321', ANON_KEY: 'sb_publishable_fixture', SERVICE_ROLE_KEY: 'server-only-secret' };
  const settings = localSettings(status);
  assert.match(frontendEnv(settings), /VITE_APP_MODE=pilot/);
  assert.match(frontendEnv(settings), /VITE_SUPABASE_URL=http:\/\/127.0.0.1:54321/);
  assert.ok(!frontendEnv(settings).includes(status.SERVICE_ROLE_KEY));
  const jwt = role => `header.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.signature`;
  assert.equal(localSettings({ ...status, ANON_KEY: jwt('anon') }).publishableKey, jwt('anon'));
  for (const change of [{ API_URL: 'https://project.supabase.co' }, { API_URL: 'http://127.0.0.1.evil.test' },
    { API_URL: 'http://user:password@localhost:54321' }, { API_URL: 'http://localhost:54321/path' },
    { ANON_KEY: 'sb_secret_private' }, { ANON_KEY: jwt('service_role') }, { ANON_KEY: 'sb_publishable_x\nVITE_SECRET=leak' },
    { SERVICE_ROLE_KEY: '' }]) assert.throws(() => localSettings({ ...status, ...change }));
});

test('local administrator bootstrap creates once, retries missing scope and preserves existing access', async () => {
  const credentials = { email: 'admin@tribe-saarthi.example.invalid', password: 'Local!test-password' };
  let exists = false, account = null, created = 0, inserted = 0, lookupError = null, loginError = null;
  const user = { id: '00000000-0000-4000-8000-000000000001' };
  const admin = {
    auth: { admin: { createUser: async () => { created++; exists = true; return { error: null }; } } },
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: account, error: lookupError }) }) }),
      insert: async value => { inserted++; account = value; return { error: null }; },
    }),
  };
  const auth = { signInWithPassword: async () => loginError ? { error: loginError } : exists ? { data: { user }, error: null } : { error: { code: 'invalid_credentials' } } };
  await provisionAdmin(admin, auth, credentials);
  await provisionAdmin(admin, auth, credentials);
  assert.equal(created, 1); assert.equal(inserted, 1); assert.equal(account.id, user.id);
  account = null;
  await provisionAdmin(admin, auth, credentials);
  assert.equal(created, 1); assert.equal(inserted, 2);
  account = { role: 'student', active: true };
  await assert.rejects(provisionAdmin(admin, auth, credentials), /manual review/);
  lookupError = { message: 'private database detail' };
  await assert.rejects(provisionAdmin(admin, auth, credentials), /lookup failed/);
  loginError = { code: 'fetch_error' };
  await assert.rejects(provisionAdmin(admin, auth, credentials), /login failed/);
  assert.equal(created, 1); assert.equal(inserted, 2);
});
