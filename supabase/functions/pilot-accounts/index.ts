import { admin, actor, body, limit, serve } from '../_shared/http.ts';
serve(async req => {
  const account = await actor(req), command = await body(req);
  await limit('workflow', account.id);
  if (command.action !== 'request_erasure' && account.role !== 'admin') throw new Error('forbidden: administrator required');
  if (command.action === 'list') {
    const page=command.page ?? 0,search=command.search ?? '';
    if(!Number.isInteger(page)||page<0||page>100000||typeof search!=='string'||search.length>100)throw new Error('validation: invalid account page');
    let query=admin.from('pilot_accounts').select('*').order('id');
    if(search)query=query.ilike('name',`%${search.replace(/[\\%_]/g,'\\$&')}%`);
    const { data, error } = await query.range(page*25,page*25+25);
    if (error) throw new Error('unavailable: account list failed');
    // Auth timestamps are read only for this bounded administrator list, never tokens or identities.
    const items=await Promise.all(data.slice(0,25).map(async row => {
      const auth = await admin.auth.admin.getUserById(row.id);
      if (auth.error) throw new Error('unavailable: invitation status unavailable');
      return { id:row.id,email:row.email,name:row.name,role:row.role,institutionId:row.institution_id,state:row.state,active:row.active,version:row.version,lifecycle:row.lifecycle,pendingInvite:!!auth.data.user.invited_at && !auth.data.user.last_sign_in_at };
    }));return {items,page,hasMore:data.length>25};
  }
  if (!['manage_account','resend_invite','request_erasure'].includes(command.action) || typeof command.operationId !== 'string' || !command.payload || typeof command.payload !== 'object') throw new Error('validation: invalid account command');
  if (Array.isArray(command.payload) || command.operationId.length<8 || command.operationId.length>160) throw new Error('validation: invalid account payload or operation ID');
  if (command.action!=='request_erasure' && (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(command.target?.id ?? '') || !Number.isInteger(command.target?.version) || command.target.version<1)) throw new Error('validation: versioned account target required');
  if (command.action==='manage_account' && (typeof command.payload.active!=='boolean' || !['student','institution','nodal','admin','family'].includes(command.payload.role))) throw new Error('validation: valid account role and active flag required');
  if (command.action === 'resend_invite') {
    await limit('invite', account.id);
    const target = await admin.from('pilot_accounts').select('*').eq('id', command.target?.id ?? '').single();
    if (target.error || !target.data.active || target.data.version !== command.target?.version) throw new Error('conflict: account changed');
    const sent = await admin.auth.admin.inviteUserByEmail(target.data.email, { redirectTo:Deno.env.get('PILOT_INVITE_REDIRECT_URL') });
    if (sent.error) throw new Error('validation: invitation not acknowledged; check SMTP and pending invitation status');
  }
  const saved = await admin.rpc('pilot_command', { actor:account.id,action:command.action === 'resend_invite' ? 'record_invite_resend' : command.action,payload:command.payload,target:command.target ?? null,operation_id:command.operationId });
  if (saved.error) throw new Error(saved.error.message);
  if (command.action === 'manage_account' && command.payload.active === true) {
    const unban = await admin.auth.admin.updateUserById(saved.data.id, { ban_duration:'none' });
    if (unban.error) throw new Error('unavailable: access saved; authentication activation needs retry');
  }
  if (command.action === 'manage_account' && command.payload.active === false) {
    const ban = await admin.auth.admin.updateUserById(saved.data.id, { ban_duration:'876000h' });
    // RLS/Edge access is already denied even if Auth is temporarily unavailable.
    if (ban.error) throw new Error('unavailable: access disabled; Auth ban needs retry');
  }
  return saved.data;
});
