import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFile, readFile } from 'node:fs/promises';
import { staging, value } from './staging-helpers.mjs';

const { config, admin, client } = await staging();
assert.equal(config.name, 'tribe-saarthi-staging');
assert.match(config.adminEmail ?? '', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
let credentials;
try {
  credentials = JSON.parse(await readFile('.staging/admin-access.json', 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  const password = `Staging!${randomUUID()}`;
  const created = value(await admin.auth.admin.createUser({ email: config.adminEmail, password, email_confirm: true }), 'Bootstrap administrator').user;
  credentials = { email: config.adminEmail, password, id: created.id, frontendUrl: config.frontendUrl };
  await writeFile('.staging/admin-access.json', JSON.stringify(credentials, null, 2), { mode: 0o600 });
}
assert.equal(credentials.email, config.adminEmail, 'Owner email mismatch');
const api = client();
const loggedIn = value(await api.auth.signInWithPassword({ email: credentials.email, password: credentials.password }), 'Verify administrator login');
assert.equal(loggedIn.user.id, credentials.id, 'Owner Auth UUID mismatch');
let account = value(await admin.from('pilot_accounts').select('role,active').eq('id', credentials.id).maybeSingle(), 'Read administrator scope');
if (!account) account = value(await admin.from('pilot_accounts').insert({ id: credentials.id, email: config.adminEmail, name: 'Staging administrator', role: 'admin', active: true }).select('role,active').single(), 'Provision administrator scope');
assert.ok(account.active && account.role === 'admin', 'Existing owner role/activity requires operator review; no role or password was changed');
console.log('PASS owner administrator login and scope verified. Credentials are only in .staging/admin-access.json; no email delivery claimed.');
