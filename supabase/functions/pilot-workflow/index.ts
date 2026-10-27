import { admin, actor, body, checkedObject, limit, serve } from '../_shared/http.ts';
import {adapterMode,governmentAdapter,unconfiguredResult} from '../../../src/integrations/adapters.ts';
serve(async req => {
  const account = await actor(req);
  await limit('workflow', account.id);
  const command = await body(req);
  if (typeof command.action !== 'string' || typeof command.operationId !== 'string' || command.operationId.length < 8 || command.operationId.length > 160 || !command.payload || Array.isArray(command.payload) || typeof command.payload !== 'object') throw new Error('validation: action, payload and operationId (8-160 characters) required');
  if (command.target && (typeof command.target.id !== 'string' || !Number.isInteger(command.target.version) || command.target.version < 1)) throw new Error('validation: target id and version required');
  if (['manage_account','record_invite_resend','request_erasure','save_scheme'].includes(command.action)) throw new Error('forbidden: use the account lifecycle endpoint');
  if (command.action==='run_verification') {
    if(!['identity','st_certificate','income','institution','academic'].includes(command.payload.source))throw new Error('validation: verification source required');
    const mode=adapterMode(Deno.env.get('PILOT_ADAPTER_MODE'));
    const result=mode ? await governmentAdapter(command.payload.source,mode).verify({reference:command.operationId,sourceDown:mode==='simulated' && command.payload.sourceDown===true}) : unconfiguredResult(command.payload.source,command.operationId);
    const saved=await admin.rpc('pilot_verify',{actor:account.id,payload:{source:command.payload.source,sourceDown:mode==='simulated' && command.payload.sourceDown===true},target:command.target ?? null,operation_id:command.operationId,adapter_result:result});
    if(saved.error)throw new Error(saved.error.message);return saved.data;
  }
  if(command.action==='review_verification'){
    const saved=await admin.rpc('pilot_review',{actor:account.id,payload:command.payload,target:command.target ?? null,operation_id:command.operationId});
    if(saved.error)throw new Error(saved.error.message);return saved.data;
  }
  if (command.action === 'bulk_sanction') {
    if (!['nodal','admin'].includes(account.role)) throw new Error('forbidden: sanction officer required');
    const targets = command.payload.targets;
    if (!Array.isArray(targets) || targets.length < 1 || targets.length > 25 || targets.some(t => !t || typeof t.id !== 'string' || !Number.isInteger(t.version) || t.version < 1) || new Set(targets.map(t=>t.id)).size !== targets.length) throw new Error('validation: select 1-25 distinct versioned applications');
    await checkedObject('pilot-signatures', command.payload.signaturePath, account.id);
    const results = [];
    for (const target of targets) {
      const result = await admin.rpc('pilot_command', {actor:account.id,action:'sanction',payload:{signaturePath:command.payload.signaturePath},target,operation_id:`${command.operationId}:${target.id}`});
      results.push({id:target.id,ok:!result.error,error:result.error ? (/^(validation|forbidden|conflict):/.test(result.error.message) ? result.error.message : 'unavailable: sanction failed; retry with current versions') : undefined});
    }
    return results;
  }
  if (command.action === 'register_document') {
    if (account.role !== 'student') throw new Error('forbidden: student upload required');
    Object.assign(command.payload, await checkedObject('pilot-documents', command.payload.objectPath, account.id));
  }
  if (command.action === 'sanction') await checkedObject('pilot-signatures', command.payload.signaturePath, account.id);
  const { data, error } = await admin.rpc('pilot_command', { actor: account.id, action: command.action, payload: command.payload, target: command.target ?? null, operation_id: command.operationId });
  if (error) throw new Error(error.message);
  return data;
});
