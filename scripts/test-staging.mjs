import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { staging, value, evidence, deniedResult } from './staging-helpers.mjs';

// Dedicated, disposable staging only. Synthetic Auth users do not test invitation delivery.
const context = await staging();
const { admin, client, config, requests } = context;
const run = randomUUID();
const actors = {};
const checks = [];
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function ok(condition, label) { assert.ok(condition, label); checks.push(label); }
async function command(who, action, payload = {}, target) {
  return value(await actors[who].client.functions.invoke('pilot-workflow', {
    body: { action, payload, operationId: randomUUID(), ...(target ? { target: { id: target.id, version: target.version } } : {}) },
  }), `Command ${action}`);
}
async function denied(work, label) { deniedResult(await work(), label); checks.push(label); }
async function record(table, id, who = 'admin') {
  return value(await actors[who].client.from(`pilot_${table}`).select('*').eq('id', id).single(), `Read ${table}`);
}
async function empty(who, table, id, label) {
  const rows = value(await actors[who].client.from(`pilot_${table}`).select('id').eq('id', id), label);
  ok(rows.length === 0, label);
}
async function saveActors() {
  await writeFile('.staging/actors.json', JSON.stringify(Object.fromEntries(Object.entries(actors).map(([key, a]) =>
    [key, { id: a.id, email: a.email, password: a.password }])), null, 2));
}
function pdf() {
  const parts = ['%PDF-1.4\n'];
  const offsets = [0];
  for (const [i, body] of ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 100 100] /Contents 4 0 R >>', '<< /Length 0 >>\nstream\n\nendstream'].entries()) {
    offsets.push(Buffer.byteLength(parts.join(''))); parts.push(`${i + 1} 0 obj\n${body}\nendobj\n`);
  }
  const xref = Buffer.byteLength(parts.join(''));
  return Buffer.from(parts.join('') + `xref\n0 5\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
}

try {
  for (const [who, role] of [['admin','admin'], ['student','student'], ['other','student'], ['institute','institution'], ['otherInstitute','institution'], ['nodal','nodal'], ['family','family']]) {
    const password = `Staging!${randomUUID()}`;
    const email = `${who.toLowerCase()}-${run}@example.invalid`;
    const user = value(await admin.auth.admin.createUser({ email, password, email_confirm: true }), 'Create synthetic Auth account').user;
    actors[who] = { id: user.id, email, password, client: client() };
    await saveActors();
    if (role === 'admin') value(await admin.from('pilot_accounts').insert({ id: user.id, email, name: 'Staging admin', role }), 'Bootstrap test admin');
    else value(await admin.rpc('pilot_provision', { actor: actors.admin.id, account_id: user.id, account_email: email, account_name: `Staging ${who}`, account_role: role,
      institution: ['other','otherInstitute'].includes(who) ? `college-b-${run}` : `college-a-${run}`, domicile: ['other','otherInstitute'].includes(who) ? 'Odisha' : 'Jharkhand' }), 'Provision synthetic account');
    value(await actors[who].client.auth.signInWithPassword({ email, password }), 'Sign in synthetic account');
    if (who === 'admin') {
      for (const [id, state, district] of [[`college-a-${run}`, 'Jharkhand', 'Ranchi'], [`college-b-${run}`, 'Odisha', 'Khordha']]) {
        await command('admin', 'save_institution', { id, name: 'Synthetic staging college', state, district, inSchemeBasket: true });
      }
    }
  }
  checks.push('Seven real hosted Auth sessions created; no invitation delivery claimed');
  const deadline = new Date(Date.now() + 2 * 86400000).toISOString().slice(0,10);
  const profile = { name: 'Synthetic student', gender: 'F', dob: '2004-01-01', aadhaarLast4: '1234', tribe: 'Oraon', isPVTG: false, category: 'ST', familyIncome: 100000,
    fatherName: 'Synthetic guardian', domicileState: 'Jharkhand', domicileDistrict: 'Ranchi', homeVillage: 'Test village', language: 'en', courseLevel: 'undergrad', course: 'BA', institutionId: `college-a-${run}`, year: '1' };
  await command('student', 'save_profile', profile);
  await command('other', 'save_profile', { ...profile, institutionId: `college-b-${run}`, domicileState: 'Odisha', domicileDistrict: 'Khordha' });
  const requiredDocs = ['st_certificate','income_certificate','marksheet','admission_proof'];
  const schemeId = `release-${run}`;
  const schemeDraft = await command('admin', 'draft_scheme', { schemeId, config: { id: schemeId, name: 'Synthetic staging scholarship', shortName: 'Staging', portal: 'NSP', ministry: 'Test', courseLevels: ['undergrad'], amount: '1000', benefits: ['Test'], deadline,
    requiredDocs, rules: [{ id: 'income', label: 'Income', field: 'familyIncome', param: '250000', op: 'max', threshold: 250000 }], notes: 'Staging test only', academicYear: '2026-27', active: true, sanctionAmount: 1000 }});
  await command('admin','publish_scheme',{},schemeDraft);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  const samples = [{ bytes: pdf(), mime: 'application/pdf', ext: 'pdf' }, { bytes: await readFile('public/images/emblem.jpg'), mime: 'image/jpeg', ext: 'jpg' }, { bytes: png, mime: 'image/png', ext: 'png' }];
  const documents = [];
  async function upload(type, sample, previousVersionId) {
    const path = `${actors.student.id}/${randomUUID()}.${sample.ext}`;
    value(await actors.student.client.storage.from('pilot-documents').upload(path, sample.bytes, { contentType: sample.mime, upsert: false }), 'Upload private bytes');
    const doc = await command('student', 'register_document', { type, title: `Synthetic ${type}`, objectPath: path, ...(previousVersionId ? { previousVersionId } : {}) });
    ok(doc.data.checksum === sha(sample.bytes), `Server checksum matches ${sample.mime}`);
    const preview = value(await actors.student.client.storage.from('pilot-documents').createSignedUrl(path, 60), 'Create owned preview');
    const response = await context.transport(preview.signedUrl);
    ok(response.ok && sha(Buffer.from(await response.arrayBuffer())) === doc.data.checksum, `Real signed preview matches ${sample.mime}`);
    return doc;
  }
  for (const [i, type] of requiredDocs.entries()) documents.push(await upload(type, samples[i % samples.length]));
  let app = await command('student', 'save_draft', { schemeId, academicYear: '2026-27', documentIds: documents.map(d => d.id), evidence: { attendance: 90, marks: 80, admission: 'yes', noOtherFellowship: 'yes' } });
  app = await command('student', 'submit_application', {}, app);
  await empty('other', 'applications', app.id, 'Cross-student application read is empty');
  await empty('institute', 'students', actors.other.id, 'Cross-institution student read is empty');
  await empty('otherInstitute', 'applications', app.id, 'Cross-institution application read is empty');
  await empty('nodal', 'students', actors.other.id, 'Cross-state student read is empty');
  const familyBefore = value(await actors.family.client.rpc('family_summary'), 'Family before grant');
  ok(familyBefore.applications.length === 0, 'Family without grant sees no application');
  for (const table of ['accounts','students','schemes','institutions','documents','applications','deficiencies','verifications','grievances','notifications','family_grants','payments','baselines','audit','notes']) {
    const tableName = `pilot_${table}`;
    await denied(() => actors.student.client.from(tableName).insert(table === 'accounts' ? { id: randomUUID(), email: 'test@example.invalid', name: 'Test', role: 'admin' } : { id: randomUUID(), data: {} }), `${table} direct insert denied`);
    await denied(() => actors.student.client.from(tableName).update(table === 'accounts' ? { name: 'Tampered' } : { data: {} }).eq('id', table === 'accounts' ? actors.student.id : app.id), `${table} direct update denied`);
    await denied(() => actors.student.client.from(tableName).delete().eq('id', table === 'accounts' ? actors.student.id : app.id), `${table} direct delete denied`);
  }
  await denied(() => actors.other.client.storage.from('pilot-documents').createSignedUrl(documents[0].data.objectPath, 60), 'Cross-account preview denied');
  await denied(() => actors.other.client.storage.from('pilot-documents').upload(`${actors.student.id}/${randomUUID()}.png`, png, { contentType: 'image/png' }), 'Forged Storage prefix denied');
  await denied(() => actors.student.client.storage.from('pilot-documents').upload(documents[0].data.objectPath, samples[0].bytes, { contentType: samples[0].mime, upsert: true }), 'Immutable Storage replacement denied');
  await denied(() => actors.other.client.functions.invoke('pilot-workflow', { body: { action: 'register_document', payload: { type: 'st_certificate', title: 'Forged', objectPath: documents[0].data.objectPath }, operationId: randomUUID() } }), 'Foreign registration denied');
  await denied(() => actors.student.client.rpc('pilot_command', { actor: actors.admin.id, action: 'save_scheme', payload: {}, target: null, operation_id: randomUUID() }), 'Forged direct command RPC denied');
  for (const [i, doc] of documents.entries()) await command(i < 2 ? 'nodal' : 'institute', 'review_document', { status: 'verified', reason: 'Synthetic evidence reviewed', fields: i === 2 ? { marks: 80, attendance: 90 } : {} }, doc);
  async function verify(who, source) {
    const attempt = await command(who, 'run_verification', { source }, app);
    await command(who, 'review_verification', { state: 'verified', reason: 'Synthetic human review' }, attempt);
  }
  for (const source of ['academic','institution']) await verify('institute', source);
  app = await command('institute', 'approve_institute', {}, app);
  for (const source of ['identity','st_certificate','income']) await verify('nodal', source);
  const deficiency = await command('nodal', 'raise_deficiency', { documentType: 'income_certificate', reason: 'Synthetic correction exercise', deadline }, app);
  app = await record('applications', app.id);
  await denied(() => actors.nodal.client.functions.invoke('pilot-workflow', { body: { action: 'approve_department', payload: {}, target: { id: app.id, version: app.version }, operationId: randomUUID() } }), 'Open deficiency blocks approval');
  const replacement = await upload('income_certificate', samples[2], documents[1].id);
  await command('student', 'correct_deficiency', { documentId: replacement.id }, deficiency);
  await command('nodal', 'review_document', { status: 'verified', reason: 'Corrected evidence reviewed', fields: { income: 100000 } }, replacement);
  await verify('nodal', 'income');
  app = await command('nodal', 'approve_department', {}, app);
  const signaturePath = `${actors.nodal.id}/${randomUUID()}.png`;
  value(await actors.nodal.client.storage.from('pilot-signatures').upload(signaturePath, png, { contentType: 'image/png' }), 'Signature upload');
  app = await command('nodal', 'sanction', { signaturePath }, app);
  let payment = await command('nodal', 'request_payment', {}, app);
  await command('nodal', 'payment_result', { status: 'failed', reason: 'SIMULATED failure exercise' }, payment);
  app = await record('applications', app.id);
  ok(app.data.status === 'sanctioned' && app.data.dbtStatus === 'failed', 'Failed simulated payment remains visible');
  payment = await command('nodal', 'request_payment', {}, app);
  await command('nodal', 'payment_result', { status: 'successful' }, payment);
  app = await record('applications', app.id);
  ok(app.data.status === 'disbursed', 'Corrected application completes simulated payment');
  const receipt = value(await client().functions.invoke('pilot-receipt', { body: { token: app.data.receiptToken } }), 'Public receipt');
  ok(JSON.stringify(Object.keys(receipt).sort()) === JSON.stringify(['hash','issuedAt','reference','valid']), 'Public receipt exposes only four safe fields');
  ok(receipt.valid && /^[a-f0-9]{64}$/.test(receipt.hash) && receipt.reference === app.id, 'Public receipt matches current decision chain');
  const grant = await command('student', 'grant_family', { familyUserId: actors.family.id });
  const summary = value(await actors.family.client.rpc('family_summary'), 'Granted family summary');
  const allowed = ['studentId','schemeId','academicYear','status','submittedAt','sanctionedAmount','disbursedAmount','dbtStatus'];
  ok(summary.applications.length === 1 && Object.keys(summary.applications[0].data).every(key => allowed.includes(key)), 'Family grant exposes only safe application fields');
  await empty('family', 'documents', documents[0].id, 'Family cannot read private document metadata');
  await command('student', 'revoke_family', {}, grant);
  ok(value(await actors.family.client.rpc('family_summary'), 'Revoked family summary').applications.length === 0, 'Family revoke takes effect immediately');
  value(await admin.from('pilot_accounts').update({ active: false }).eq('id', actors.other.id), 'Deactivate synthetic account');
  try {
    await empty('other', 'students', actors.other.id, 'Inactive account table read empty');
    await denied(() => actors.other.client.functions.invoke('pilot-workflow', { body: { action: 'save_profile', payload: profile, operationId: randomUUID() } }), 'Inactive account Edge command denied');
  } finally { value(await admin.from('pilot_accounts').update({ active: true }).eq('id', actors.other.id), 'Reactivate synthetic account'); }
  await writeFile('.staging/restore-student.json', JSON.stringify({ projectRef: config.projectRef, ...Object.fromEntries(['id','email','password'].map(k => [k, actors.student[k]])), applicationId: app.id, document: replacement }, null, 2));
  console.log(`PASS ${checks.length} hosted assertions; invitation delivery and expired-session checks remain open`);
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : 'Hosted test failed; inspect private provider logs using saved request IDs');
  process.exitCode = 1;
} finally {
  await evidence('hosted-matrix', { at: new Date().toISOString(), projectRef: config.projectRef, passed: !process.exitCode, checks,
    pending: ['Invitation delivery/acceptance', 'Expired access-token denial', 'Separate-project database/Auth/Storage restore', 'Browser QR navigation'], requests });
}
