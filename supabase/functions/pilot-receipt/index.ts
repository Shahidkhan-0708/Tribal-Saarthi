import { admin, body, limit, serve } from '../_shared/http.ts';
serve(async req => {
  // shortcut: one shared public lookup cap; use gateway/IP throttling before a larger rollout.
  await limit('receipt', 'public');
  const token = req.method === 'GET' ? new URL(req.url).searchParams.get('token') : (await body(req)).token;
  if (typeof token !== 'string' || !/^[a-f0-9]{48}$/.test(token)) throw new Error('validation: invalid receipt token');
  const { data, error } = await admin.rpc('pilot_receipt', {token});
  if (error) throw new Error('unavailable: receipt lookup failed');
  if (!data) throw new Error('validation: receipt not found');
  return data;
});
