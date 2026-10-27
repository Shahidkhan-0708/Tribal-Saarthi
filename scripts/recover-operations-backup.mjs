import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import ts from 'typescript';
import {staging,value} from './staging-helpers.mjs';
const source=await readFile('supabase/functions/_shared/backup.ts','utf8');
const crypto=await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64')}`);
const {admin,config}=await staging(),privateKeys=JSON.parse(await readFile('.staging/operations.json','utf8'));
assert.equal(privateKeys.projectRef,config.projectRef,'Backup keys must match the verified staging project');
const prefix=process.argv[2];assert.match(prefix ?? '',/^\d{4}-\d{2}-\d{2}\/[0-9a-f-]{36}$/,'Supply the successful backup recovery reference');
const local=process.argv.includes('--local');
const root=resolve('.staging/backups'),directory=resolve(root,`automatic-${local?'local-':''}${prefix.replace('/','-')}`);assert.ok(directory.startsWith(root+sep));
await mkdir(directory,{recursive:false});
const key=await crypto.backupKey(privateKeys.backupKey);
async function load(path){assert.ok(path.startsWith(prefix+'/') && !path.includes('..'));const bytes=local?new Uint8Array(await readFile(resolve('.staging/protected-backups',path))):new Uint8Array(await value(await admin.storage.from('pilot-backups').download(path),'Encrypted recovery download').arrayBuffer());return crypto.openBackup(bytes,key,`${config.projectRef}/${path}`);}
const manifest=JSON.parse(new TextDecoder().decode(await load(`${prefix}/manifest.bin`)));assert.equal(manifest.projectRef,config.projectRef);
const database=await load(manifest.database.path);assert.equal(await crypto.backupHash(database),manifest.database.checksum);
await writeFile(resolve(directory,'database.json'),database,{flag:'wx'});await writeFile(resolve(directory,'database.sha256'),await crypto.backupHash(database),{flag:'wx'});
const db=JSON.parse(new TextDecoder().decode(database));assert.ok(db.data['auth.users'] && db.columns.length,'Database/Auth and column metadata required');
for(const object of manifest.objects){
 assert.ok(['pilot-documents','pilot-signatures'].includes(object.bucket));assert.match(object.file,/^[a-f0-9]{64}\.bin$/);
 assert.equal(object.file,await crypto.backupHash(new TextEncoder().encode(`${object.bucket}/${object.objectPath}`))+'.bin');
 const bytes=await load(object.path);assert.equal(bytes.length,object.size);assert.equal(await crypto.backupHash(bytes),object.checksum);
 await writeFile(resolve(directory,object.file),bytes,{flag:'wx'});
}
const restored={...manifest,objects:manifest.objects.map(o=>({...o,path:o.objectPath}))};
await writeFile(resolve(directory,'manifest.json'),JSON.stringify(restored,null,2),{flag:'wx'});
console.log(`PASS encrypted recovery: ${Object.keys(db.data).length} tables, ${manifest.objects.length} private objects; Auth and object SHA-256 verified. Files remain private; no hosted database was overwritten.`);
