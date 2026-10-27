import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import ts from 'typescript';
let checks=0;
const load=async source=>import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64')}#${randomUUID()}`);
const adapter=await load(await readFile('supabase/functions/_shared/notifications.ts','utf8'));
const job={id:randomUUID(),event:'raise deficiency',email:'synthetic@example.invalid'},config={key:'test-key',sender:'sender@example.invalid',url:'https://pilot.example.invalid'};
let requests=0;
assert.equal((await adapter.deliverEmail(job,{},async()=>{requests++;})).status,'blocked');assert.equal(requests,0);checks+=2;
for(const [status,body,outcome] of [[201,{messageId:'provider-ack'},'accepted'],[200,{},'unknown'],[401,{},'blocked'],[429,{},'failed'],[500,{},'unknown'],[400,{code:'duplicate_parameter'},'unknown']]){
 assert.equal((await adapter.deliverEmail(job,config,async(url,request)=>{assert.equal(url,'https://api.brevo.com/v3/smtp/email');const sent=JSON.parse(request.body);assert.equal(sent.headers.idempotencyKey,job.id);assert.equal(sent.to[0].email,job.email);return new Response(JSON.stringify(body),{status});})).status,outcome);checks++;
}
assert.equal((await adapter.deliverEmail(job,config,async()=>{throw new Error('network');})).status,'unknown');checks++;
let handler,role='admin',banFails=false,rpcCalls=[],authCalls=[];
const id='00000000-0000-4000-8000-000000000001',targetId='00000000-0000-4000-8000-000000000002';
globalThis.Deno={env:{get:key=>({SUPABASE_URL:'https://pilot.invalid',SUPABASE_SERVICE_ROLE_KEY:'test',PILOT_ALLOWED_ORIGINS:'http://localhost:5173'})[key]},serve:fn=>{handler=fn;}};
globalThis.__trackC={auth:{getUser:async()=>({data:{user:{id}},error:null}),admin:{updateUserById:async(...args)=>{authCalls.push(args);return {error:banFails?{}:null};},getUserById:async()=>({data:{user:{invited_at:'2026-01-01',last_sign_in_at:null}},error:null}),inviteUserByEmail:async()=>({data:{user:{id:targetId}},error:null})}},from:()=>{let queryId=id;const q={select:()=>q,eq:(key,value)=>{if(key==='id')queryId=value;return q;},single:async()=>({data:{id:queryId,role,active:true,version:1,email:'synthetic@example.invalid'},error:null}),order:()=>q,ilike:()=>q,range:async()=>({data:[{id:targetId,role:'student',active:true,version:1}],error:null})};return q;},storage:{from:()=>({download:async()=>({data:new Blob(['%PDF-1.7 test'],{type:'application/pdf'}),error:null})})},rpc:async(name,value)=>{
 if(name==='pilot_rate_limit')return {data:{allowed:true,retryAfter:42},error:null};
 if(name==='pilot_claim_email')return {data:null,error:null};
 rpcCalls.push(value);return {data:{id:targetId,active:value.payload.active},error:value.target?.id==='bad'?{message:'validation: human verification required'}:null};
}};
const shared=(await readFile('supabase/functions/_shared/http.ts','utf8')).replace(/^import .*createClient.*\r?\n/m,'const createClient=()=>globalThis.__trackC;\n');
const start=async(path,extra='')=>load(shared+'\n'+extra+'\n'+(path==='pilot-notifications'?(await readFile('supabase/functions/_shared/email-queue.ts','utf8')).replace(/^import .*\r?\n/gm,''):'')+'\n'+(await readFile(`supabase/functions/${path}/index.ts`,'utf8')).replace(/^import .*\r?\n/gm,''));
const request=body=>new Request('https://pilot.invalid/function',{method:'POST',headers:{authorization:'Bearer valid-token',origin:'http://localhost:5173'},body:JSON.stringify(body)});
await start('pilot-accounts');
role='student';assert.equal((await handler(request({action:'list'}))).status,403);checks++;
assert.equal((await handler(request({action:'request_erasure',payload:{reason:'Please erase after retention review'},operationId:randomUUID()}))).status,200);checks++;
role='admin';const command={action:'manage_account',payload:{role:'student',active:false},target:{id:targetId,version:1},operationId:randomUUID()};
assert.equal((await handler(request({...command,target:{id:'bad',version:1}}))).status,400);checks++;
assert.equal((await handler(request({...command,payload:{active:false}}))).status,400);checks++;
assert.equal((await handler(request(command))).status,200);assert.equal(rpcCalls[rpcCalls.length-1].action,'manage_account');assert.equal(authCalls[0][1].ban_duration,'876000h');checks+=3;
banFails=true;assert.equal((await handler(request(command))).status,503);checks++;banFails=false;
const list=await (await handler(request({action:'list'}))).json();assert.equal(list.items[0].pendingInvite,true);checks++;
await start('pilot-workflow');
assert.equal((await handler(request({...command,action:'save_scheme'}))).status,403);checks++;
const bulk={action:'bulk_sanction',operationId:randomUUID(),payload:{signaturePath:`${id}/test.pdf`,targets:[{id:'good',version:1},{id:'bad',version:1}]}};
for (const targets of [[null], [false], ['application'], [{id:'good',version:1},null]]) {
 const before=rpcCalls.length;
 assert.equal((await handler(request({...bulk,payload:{...bulk.payload,targets}}))).status,400);
 assert.equal(rpcCalls.length,before);checks+=2;
}
role='student';assert.equal((await handler(request(bulk))).status,403);checks++;role='admin';
const response=await handler(request(bulk));assert.equal(response.status,200);const results=await response.json();assert.deepEqual(results.map(r=>r.ok),[true,false]);checks+=2;
assert.equal(rpcCalls[rpcCalls.length-1].action,'sanction');checks++;
assert.equal((await handler(request({...bulk,payload:{...bulk.payload,targets:[]}}))).status,400);checks++;
await start('pilot-notifications',await readFile('supabase/functions/_shared/notifications.ts','utf8'));
role='student';assert.equal((await handler(request({}))).status,403);checks++;
role='admin';assert.deepEqual(await (await handler(request({}))).json(),{processed:0});checks++;
console.log(`PASS ${checks} Track C Edge/provider assertions (synthetic transport; no email delivery claim)`);
