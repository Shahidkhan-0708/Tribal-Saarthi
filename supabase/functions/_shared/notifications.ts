export async function deliverEmail(job: { id:string; event:string; email:string }, config: {key?:string;sender?:string;url?:string}, transport: typeof fetch = fetch) {
  if (!config.key || !config.sender || !/^https:\/\//.test(config.url ?? '')) return {status:'blocked',code:'provider_not_configured'};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(job.email)) return {status:'blocked',code:'recipient_invalid'};
  try {
    const response=await transport('https://api.brevo.com/v3/smtp/email', {method:'POST',headers:{'api-key':config.key,'content-type':'application/json'},body:JSON.stringify({sender:{email:config.sender,name:'Tribe Saarthi'},to:[{email:job.email}],subject:`Tribe Saarthi: ${job.event}`,textContent:`Your scholarship application has an update (${job.event}). Sign in to your private workspace to see details: ${config.url}`,headers:{idempotencyKey:job.id}}),signal:AbortSignal.timeout(15000)});
    const body=await response.json().catch(()=>({}));
    if(response.ok && typeof body.messageId==='string' && body.messageId.trim()) return {status:'accepted',providerId:body.messageId,code:'provider_acknowledged'};
    if(!response.ok && response.status<500 && body.code!=='duplicate_parameter') return {status:response.status===401||response.status===403?'blocked':'failed',code:`provider_http_${response.status}`};
    // shortcut: uncertain sends need operator reconciliation; Brevo deduplication expires after 30 minutes.
    return {status:'unknown',code:body.code==='duplicate_parameter'?'duplicate_requires_reconciliation':'provider_acknowledgement_unknown'};
  } catch { return {status:'unknown',code:'provider_response_unknown'}; }
}
