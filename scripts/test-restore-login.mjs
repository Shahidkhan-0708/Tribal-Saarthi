import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { staging, value, evidence } from './staging-helpers.mjs';

const { client, config, transport, requests } = await staging('.staging/restore.json');
const student = JSON.parse(await readFile('.staging/restore-student.json', 'utf8'));
assert.equal(config.name, 'tribe-saarthi-restore');
assert.notEqual(config.projectRef, student.projectRef, 'Separate restore target required');
try {
  const api = client();
  const signedIn = value(await api.auth.signInWithPassword({ email: student.email, password: student.password }), 'Restored student login');
  assert.equal(signedIn.user.id, student.id, 'Restored login changed Auth UUID');
  const doc = value(await api.from('pilot_documents').select('*').eq('id', student.document.id).single(), 'Restored document metadata');
  assert.equal(doc.data.checksum, student.document.data.checksum);
  const preview = value(await api.storage.from('pilot-documents').createSignedUrl(doc.data.objectPath, 60), 'Restored private preview');
  const response = await transport(preview.signedUrl);
  assert.ok(response.ok, 'Restored preview download failed');
  assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'), doc.data.checksum, 'Restored preview checksum differs');
  await evidence('restore-login', { at: new Date().toISOString(), projectRef: config.projectRef, passed: true, sameAuthUuid: true, previewChecksumMatches: true, requests });
  console.log('PASS restored student login, same Auth UUID and real private preview SHA-256');
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : 'Restore login test failed; inspect private operator logs');
  process.exitCode = 1;
}
