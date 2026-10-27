import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { staging, value, pilotTables, evidence } from './staging-helpers.mjs';

const mode = process.argv[2];
assert.ok(['backup','restore','verify'].includes(mode), 'Use backup, restore or verify');
const root = resolve('.staging/backups');
const directory = resolve(process.argv[3] ?? `${root}/${new Date().toISOString().replace(/[:.]/g, '-')}`);
assert.ok(directory.startsWith(root + sep), 'Backup must be inside .staging/backups');
const { admin, config } = await staging(mode === 'backup' ? '.staging/config.json' : '.staging/restore.json');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const buckets = ['pilot-documents', 'pilot-signatures'];
const fileName = (bucket, path) => `${hash(`${bucket}/${path}`)}.bin`;
async function download(bucket, path) {
  const blob = value(await admin.storage.from(bucket).download(path), 'Download private object');
  return { bytes: Buffer.from(await blob.arrayBuffer()), mimeType: blob.type };
}
async function count(table) {
  const result = await admin.from(`pilot_${table}`).select('id', { count: 'exact', head: true });
  value(result, 'Read exact record count');
  assert.ok(Number.isInteger(result.count), 'Record count unavailable');
  return result.count;
}

try {
  if (mode === 'backup') {
    assert.equal(config.name, 'tribe-saarthi-staging', 'Backup source must be the dedicated staging project');
    await mkdir(directory, { recursive: true });
    const manifest = { projectRef: config.projectRef, createdAt: new Date().toISOString(), objects: [], counts: {}, authIds: [] };
    async function walk(bucket, prefix = '') {
      for (let offset = 0; ; offset += 1000) {
        const entries = value(await admin.storage.from(bucket).list(prefix, { limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } }), 'List private bucket');
        for (const entry of entries) {
          const path = prefix ? `${prefix}/${entry.name}` : entry.name;
          if (!entry.id) { await walk(bucket, path); continue; }
          const { bytes, mimeType } = await download(bucket, path);
          const file = fileName(bucket, path);
          await writeFile(resolve(directory, file), bytes);
          manifest.objects.push({ bucket, path, file, mimeType, size: bytes.length, checksum: hash(bytes) });
        }
        if (entries.length < 1000) break;
      }
    }
    for (const bucket of buckets) await walk(bucket);
    for (const table of pilotTables) manifest.counts[table] = await count(table);
    for (let page = 1; ; page++) {
      const users = value(await admin.auth.admin.listUsers({ page, perPage: 1000 }), 'Read Auth UUIDs').users;
      manifest.authIds.push(...users.map(user => user.id));
      if (users.length < 1000) break;
    }
    for (let offset = 0; ; offset += 1000) {
      const docs = value(await admin.from('pilot_documents').select('id,data').order('id').range(offset, offset + 999), 'Read document checksums');
      for (const doc of docs) {
        const saved = manifest.objects.find(object => object.bucket === 'pilot-documents' && object.path === doc.data.objectPath);
        assert.equal(saved?.checksum, doc.data.checksum, 'Stored document checksum differs from real bytes');
      }
      if (docs.length < 1000) break;
    }
    await writeFile(resolve(directory, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`PASS private bucket export: ${manifest.objects.length} objects. Database/Auth dump still required; see docs/staging-release.md.`);
  } else {
    const manifest = JSON.parse(await readFile(resolve(directory, 'manifest.json'), 'utf8'));
    assert.equal(config.name, 'tribe-saarthi-restore', 'Restore target must be the separate restore project');
    assert.notEqual(config.projectRef, manifest.projectRef, 'Restore cannot target the source project');
    assert.ok(Object.keys(manifest.counts ?? {}).length && Object.entries(manifest.counts).every(([table,total]) => pilotTables.includes(table) && Number.isInteger(total) && total>=0), 'Invalid manifest table counts');
    // Validate every entry before writing any object; never trust paths from a manifest.
    for (const object of manifest.objects) {
      assert.ok(buckets.includes(object.bucket) && /^[0-9a-f-]{36}\//.test(object.path) && !object.path.includes('..'), 'Invalid manifest object path');
      assert.equal(object.file, fileName(object.bucket, object.path), 'Invalid manifest filename');
      assert.ok(['application/pdf','image/png','image/jpeg'].includes(object.mimeType), 'Invalid manifest MIME type');
      const bytes = await readFile(resolve(directory, object.file));
      assert.equal(bytes.length, object.size, 'Backup object size mismatch');
      assert.equal(hash(bytes), object.checksum, 'Backup object checksum mismatch');
    }
    for (const object of manifest.objects) {
      if (mode === 'restore') {
        const bytes = await readFile(resolve(directory, object.file));
        const result = await admin.storage.from(object.bucket).upload(object.path, bytes, { contentType: object.mimeType, upsert: false });
        if (result.error) assert.equal(hash((await download(object.bucket, object.path)).bytes), object.checksum, 'Existing restore object differs; refusing overwrite');
      }
      assert.equal(hash((await download(object.bucket, object.path)).bytes), object.checksum, 'Restored bytes differ');
    }
    for (const [table,total] of Object.entries(manifest.counts)) assert.equal(await count(table), total, `Restored ${table} count mismatch`);
    const ids = [];
    for (let page = 1; ; page++) {
      const users = value(await admin.auth.admin.listUsers({ page, perPage: 1000 }), 'Read restored Auth UUIDs').users;
      ids.push(...users.map(user => user.id));
      if (users.length < 1000) break;
    }
    assert.deepEqual(ids.sort(), manifest.authIds.sort(), 'Auth UUIDs were not preserved');
    await evidence('storage-restore', { at: new Date().toISOString(), sourceRef: manifest.projectRef, targetRef: config.projectRef, objects: manifest.objects.length, counts: manifest.counts, passed: true, studentLogin: 'pending test:restore-login' });
    console.log(`PASS separate-project ${mode}: ${manifest.objects.length} object checksums, record counts and Auth UUIDs`);
  }
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : 'Storage exercise failed; inspect private operator logs');
  process.exitCode = 1;
}
