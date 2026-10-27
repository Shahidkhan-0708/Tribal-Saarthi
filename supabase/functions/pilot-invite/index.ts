import { admin, actor, body, limit, serve } from '../_shared/http.ts';
serve(async req => {
  const account = await actor(req);
  if (account.role !== 'admin') throw new Error('forbidden: admin invitation required');
  await limit('invite', account.id);
  const value = await body(req);
  if (typeof value.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) || typeof value.name !== 'string' || !value.name.trim() || !['student','institution','nodal','admin','family'].includes(value.role)) throw new Error('validation: email, name and role required');
  if (value.role === 'institution') {
    const institution = await admin.from('pilot_institutions').select('id').eq('id', value.institutionId ?? '').single();
    if (institution.error) throw new Error('validation: institution required');
  }
  if (value.role === 'nodal' && (typeof value.state !== 'string' || !value.state.trim())) throw new Error('validation: state required');
  const { data, error } = await admin.auth.admin.inviteUserByEmail(value.email, { redirectTo: Deno.env.get('PILOT_INVITE_REDIRECT_URL') });
  if (error || !data.user) throw new Error('validation: invitation failed; check whether email is already invited');
  const saved = await admin.rpc('pilot_provision', { actor: account.id, account_id: data.user.id, account_email: value.email, account_name: value.name, account_role: value.role, institution: value.institutionId ?? null, domicile: value.state ?? null });
  if (saved.error) {
    const removed = await admin.auth.admin.deleteUser(data.user.id);
    if (removed.error) throw new Error('validation: account provisioning failed; administrator must remove the orphan Auth invitation');
    throw new Error('validation: account provisioning failed; invitation revoked');
  }
  return saved.data;
});
