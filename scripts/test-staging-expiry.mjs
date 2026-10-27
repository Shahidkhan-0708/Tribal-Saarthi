import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { staging, value, deniedResult, evidence } from './staging-helpers.mjs';

const { config, client, admin, transport, requests } = await staging();
const student = JSON.parse(await readFile('.staging/restore-student.json', 'utf8'));
const api = client();
const checks = [];
try {
  let session, claims;
  for (let attempt = 0; attempt < 7; attempt++) {
    session = value(await api.auth.signInWithPassword({ email: student.email, password: student.password }), 'Expiry probe login').session;
    claims = JSON.parse(Buffer.from(session.access_token.split('.')[1], 'base64url').toString());
    if (claims.exp - Math.floor(Date.now() / 1000) <= 120) break;
    if (attempt < 6) { console.log('Waiting for hosted Auth configuration propagation'); await new Promise(resolve => setTimeout(resolve, 10_000)); }
  }
  assert.ok(claims.exp - Math.floor(Date.now() / 1000) <= 120, 'Temporarily set staging JWT lifetime to 60 seconds before this test; restore 900 afterward');
  const headers = { apikey: config.publishableKey, authorization: `Bearer ${session.access_token}`, 'content-type': 'application/json' };
  const ownUrl = `${config.url}/rest/v1/pilot_students?select=id&id=eq.${student.id}`;
  const before = await transport(ownUrl, { headers });
  assert.equal(before.status, 200);
  assert.equal((await before.json()).length, 1);
  checks.push('Genuine unexpired token reads its own student record');
  value(await admin.from('pilot_accounts').update({ active: false }).eq('id', student.id), 'Deactivate synthetic student');
  try {
    const inactive = await transport(ownUrl, { headers });
    assert.equal(inactive.status, 200);
    assert.deepEqual(await inactive.json(), []);
    deniedResult(await api.storage.from('pilot-documents').createSignedUrl(student.document.data.objectPath, 60), 'Inactive owned preview');
    checks.push('Inactive student cannot read own records or create an owned private preview');
  } finally { value(await admin.from('pilot_accounts').update({ active: true }).eq('id', student.id), 'Reactivate synthetic student'); }
  const foreign = await transport(`${config.url}/functions/v1/pilot-workflow`, { method: 'POST', headers: { ...headers, origin: 'https://foreign.invalid' }, body: '{}' });
  assert.equal(foreign.status, 403);
  assert.equal(foreign.headers.get('access-control-allow-origin'), null);
  checks.push('Foreign browser origin denied without permissive CORS');
  const signup = await transport(`${config.url}/auth/v1/signup`, { method: 'POST', headers: { apikey: config.publishableKey, 'content-type': 'application/json' }, body: JSON.stringify({ email: `signup-${randomUUID()}@example.invalid`, password: `Staging!${randomUUID()}` }) });
  const deniedSignup = await signup.json();
  assert.ok([400,403,422].includes(signup.status) && (deniedSignup.error_code === 'signup_disabled' || /signup.*(?:not allowed|disabled)/i.test(deniedSignup.msg ?? deniedSignup.message ?? '')), 'Public registration must be explicitly disabled');
  checks.push('Hosted Auth explicitly refuses public signup');
  // Allow provider clock-skew tolerance as well as the token's actual expiration.
  const wait = Math.max(0, claims.exp * 1000 + 65000 - Date.now());
  console.log(`Waiting ${Math.ceil(wait / 1000)}s for a genuinely issued access token to expire`);
  await new Promise(resolve => setTimeout(resolve, wait));
  const expired = await transport(ownUrl, { headers });
  assert.equal(expired.status, 401, 'Expired JWT must be rejected by PostgREST');
  const edge = await transport(`${config.url}/functions/v1/pilot-workflow`, { method: 'POST', headers, body: JSON.stringify({ action: 'save_profile', payload: {}, operationId: randomUUID() }) });
  assert.equal(edge.status, 401, 'Expired JWT must be rejected by Edge Auth verification');
  checks.push('The same genuine expired JWT is denied by direct API and Edge requests');
  await evidence('hosted-expiry', { at: new Date().toISOString(), projectRef: config.projectRef, passed: true, issuedAt: claims.iat, expiredAt: claims.exp, checks, requests });
  console.log(`PASS ${checks.length} hosted expiry/signup/CORS/inactive-access checks`);
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : 'Expiry probe failed; inspect private provider logs');
  process.exitCode = 1;
}
