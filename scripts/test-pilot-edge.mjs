import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import ts from 'typescript';

// Execute the checked-in Edge handlers with native Request/Response and a synthetic Supabase transport.
// Hosted JWT verification and actual Storage HTTP transfer remain staging integration checks.
let handler, calls=0, latest, role='student', active=true;
let quotaAllowed=true, quotaError=false, commandError=null;
let object=new Blob(['%PDF-1.7\nPilot fixture'],{type:'application/pdf'});
const account={id:'00000000-0000-4000-8000-000000000002',email:'student@example.org',name:'Student'};
const environment={SUPABASE_URL:'https://pilot.test',SUPABASE_SERVICE_ROLE_KEY:'server-fixture',PILOT_ALLOWED_ORIGINS:'http://localhost:5173'};
globalThis.Deno={env:{get:key=>environment[key]},serve:fn=>{handler=fn;}};
globalThis.__pilotEdgeClient={
  auth:{getUser:async token=>token==='valid-token'?{data:{user:{id:account.id}},error:null}:{data:{user:null},error:{message:'invalid'}}},
  from:()=>{const query={select:()=>query,eq:()=>query,single:async()=>active?{data:{...account,role,active},error:null}:{data:null,error:{message:'inactive'}}};return query;},
  storage:{from:()=>({download:async()=>({data:object,error:null})})},
  rpc:async(name,payload)=>{if(name==='pilot_rate_limit')return {data:{allowed:quotaAllowed,retryAfter:42},error:quotaError?{message:'database offline'}:null};calls++;latest=payload;return {data:{id:'record',version:1,data:payload.payload},error:commandError};},
};
const shared=(await readFile('supabase/functions/_shared/http.ts','utf8')).replace(/^import .*createClient.*\r?\n/m,'const createClient=()=>globalThis.__pilotEdgeClient;\n');
const workflow=(await readFile('supabase/functions/pilot-workflow/index.ts','utf8')).replace(/^import .*\r?\n/gm,'');
const adapters=await readFile('src/integrations/adapters.ts','utf8');
const output=ts.transpileModule(adapters+'\n'+shared+'\n'+workflow,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;
await import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
const request=(body,options={})=>new Request('https://pilot.test/functions/v1/pilot-workflow',{method:options.method??'POST',headers:{Origin:options.origin??'http://localhost:5173',...(options.token!==null?{Authorization:`Bearer ${options.token??'valid-token'}`}:{})},...(options.method==='GET'?{}:{body:typeof body==='string'?body:JSON.stringify(body)})});
const command={action:'register_document',operationId:'operation-1234',payload:{type:'income_certificate',title:'Income',objectPath:`${account.id}/fixture.pdf`,checksum:'forged',size:1,mimeType:'image/jpeg'}};
let checks=0;
for(const [req,status] of [[request(command,{token:null}),401],[request(command,{token:'invalid'}),401],[request(command,{origin:'https://untrusted.test'}),403],[request(command,{method:'GET'}),400],[request('{broken'),400],[request({...command,target:{id:'app',version:0}}),400],[request('x'.repeat(1_000_001)),400]]){
  assert.equal((await handler(req)).status,status);checks++;
}
assert.equal(calls,0);checks++;
for (const operationId of ['', 'short', 'x'.repeat(161)]) {
  assert.equal((await handler(request({...command,operationId}))).status,400);checks++;
}
assert.equal(calls,0);checks++;
let response=await handler(request(command));assert.equal(response.status,200);checks++;
assert.equal(latest.actor,account.id);assert.equal(latest.payload.size,object.size);assert.equal(latest.payload.mimeType,'application/pdf');assert.equal(latest.payload.checksum,createHash('sha256').update(Buffer.from(await object.arrayBuffer())).digest('hex'));checks+=4;
response=await handler(request({...command,payload:{...command.payload,objectPath:'another-user/private.pdf'}}));assert.equal(response.status,400);checks++;
object=new Blob(['fake PDF'],{type:'application/pdf'});assert.equal((await handler(request(command))).status,400);checks++;
role='family';assert.equal((await handler(request(command))).status,403);checks++;
active=false;assert.equal((await handler(request(command))).status,403);checks++;
active=true;role='student';quotaAllowed=false;
response=await handler(request(command));assert.equal(response.status,429);assert.equal(response.headers.get('Retry-After'),'42');checks+=2;
let failure=await response.json();assert.equal(failure.requestId,response.headers.get('X-Request-ID'));checks++;
quotaAllowed=true;quotaError=true;assert.equal((await handler(request(command))).status,503);checks++;
quotaError=false;commandError={message:'private database detail must not be exposed'};
response=await handler(request({...command,action:'save_profile',payload:{}}));assert.equal(response.status,500);assert.ok(!(await response.text()).includes('private database detail'));checks+=2;
commandError=null;
const verify={action:'run_verification',operationId:'verification-operation-1234',payload:{source:'income',mode:'simulated',sourceDown:false},target:{id:'application',version:1}};
assert.equal((await handler(request(verify))).status,200);assert.equal(latest.adapter_result.mode,'unconfigured');assert.equal(latest.adapter_result.state,'source_down');checks+=3;
environment.PILOT_ADAPTER_MODE='simulated';assert.equal((await handler(request(verify))).status,200);assert.equal(latest.adapter_result.mode,'simulated');assert.equal(latest.adapter_result.state,'manual_review');checks+=3;
environment.PILOT_ADAPTER_MODE='live';assert.equal((await handler(request(verify))).status,200);assert.equal(latest.adapter_result.mode,'live');assert.equal(latest.adapter_result.state,'source_down');checks+=3;
console.log(`PASS ${checks} Edge Request/Response boundary assertions; synthetic Auth/Storage transport, real handler/hash execution`);
await import('./check-track-c-edge.mjs');
