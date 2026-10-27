import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import ts from 'typescript';
import {staging,value} from './staging-helpers.mjs';
const source=await readFile('supabase/functions/_shared/backup.ts','utf8');
const crypto=await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64')}`);
const {admin,config}=await staging(),secrets=JSON.parse(await readFile('.staging/operations.json','utf8'));assert.equal(secrets.projectRef,config.projectRef);
const key=await crypto.backupKey(secrets.backupKey),root=resolve('.staging/protected-backups');await mkdir(root,{recursive:true});
let copied=0,verified=0;
async function list(prefix){const all=[];for(let offset=0;;offset+=1000){const rows=value(await admin.storage.from('pilot-backups').list(prefix,{limit:1000,offset,sortBy:{column:'name',order:'asc'}}),'List encrypted backup');all.push(...rows);if(rows.length<1000)return all;}}
async function download(path){const blob=value(await admin.storage.from('pilot-backups').download(path),'Download encrypted backup');return new Uint8Array(await blob.arrayBuffer());}
async function keepFile(path,bytes){try{await writeFile(path,bytes,{flag:'wx'});}catch(error){if(error.code!=='EEXIST')throw error;assert.equal(await crypto.backupHash(await readFile(path)),await crypto.backupHash(bytes),'Existing encrypted copy differs; refusing overwrite');}}
for(const date of await list('')){
 assert.match(date.name,/^\d{4}-\d{2}-\d{2}$/);
 for(const run of await list(date.name)){
  assert.match(run.name,/^[a-f0-9-]{36}$/);const prefix=`${date.name}/${run.name}`,directory=resolve(root,prefix);assert.ok(directory.startsWith(root+sep));
  let completed=false;try{await readFile(resolve(directory,'verified.json'));completed=true;}catch(error){if(error.code!=='ENOENT')throw error;}
  if(completed){
   const manifest=JSON.parse(new TextDecoder().decode(await crypto.openBackup(new Uint8Array(await readFile(resolve(directory,'manifest.bin'))),key,`${config.projectRef}/${prefix}/manifest.bin`)));assert.equal(manifest.projectRef,config.projectRef);
   for(const object of [manifest.database,...manifest.objects]){
    assert.ok(object.path.startsWith(prefix+'/') && !object.path.includes('..'));const name=object.path.slice(prefix.length+1);assert.ok(name==='database.bin' || /^[a-f0-9]{64}\.bin$/.test(name));
    const plain=await crypto.openBackup(new Uint8Array(await readFile(resolve(directory,name))),key,`${config.projectRef}/${object.path}`);assert.equal(await crypto.backupHash(plain),object.checksum);assert.equal(plain.length,object.size);
   }
   verified++;continue;
  }
  const files=await list(prefix);if(!files.some(f=>f.name==='manifest.bin'))continue;
  const manifestBytes=await download(`${prefix}/manifest.bin`),manifest=JSON.parse(new TextDecoder().decode(await crypto.openBackup(manifestBytes,key,`${config.projectRef}/${prefix}/manifest.bin`)));assert.equal(manifest.projectRef,config.projectRef);
  await mkdir(directory,{recursive:true});
  for(const object of [manifest.database,...manifest.objects]){
   assert.ok(object.path.startsWith(prefix+'/') && !object.path.includes('..'));
   const name=object.path.slice(prefix.length+1);assert.ok(name==='database.bin' || /^[a-f0-9]{64}\.bin$/.test(name));
   const encrypted=await download(object.path),plain=await crypto.openBackup(encrypted,key,`${config.projectRef}/${object.path}`);assert.equal(await crypto.backupHash(plain),object.checksum);assert.equal(plain.length,object.size);
   await keepFile(resolve(directory,name),encrypted);
  }
  await keepFile(resolve(directory,'manifest.bin'),manifestBytes);
  await writeFile(resolve(directory,'verified.json'),JSON.stringify({at:new Date().toISOString(),projectRef:config.projectRef,prefix,objects:manifest.objects.length}),{flag:'wx'});copied++;
 }
}
console.log(`PASS encrypted off-provider copies: ${copied} new, ${verified} already verified. Database/Auth and private byte checksums verified; plaintext was not written.`);
