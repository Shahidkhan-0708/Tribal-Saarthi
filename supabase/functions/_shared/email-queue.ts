import {admin} from './http.ts';
import {deliverEmail} from './notifications.ts';
export async function processEmailQueue(){
 if(!Deno.env.get('BREVO_API_KEY') || !Deno.env.get('PILOT_EMAIL_SENDER') || !/^https:\/\//.test(Deno.env.get('PILOT_INVITE_REDIRECT_URL') ?? ''))return {processed:0,configured:false};
 let processed=0;
 for(let i=0;i<10;i++){
  const claim=await admin.rpc('pilot_claim_email');if(claim.error)throw new Error('unavailable: delivery claim failed');if(!claim.data)break;
  const job=claim.data,recipient=await admin.from('pilot_accounts').select('email,active').eq('id',job.data.userId).single();
  const outcome=recipient.error||!recipient.data.active?{status:'blocked',code:'recipient_inactive'}:await deliverEmail({id:job.id,event:job.data.event,email:recipient.data.email},{key:Deno.env.get('BREVO_API_KEY'),sender:Deno.env.get('PILOT_EMAIL_SENDER'),url:Deno.env.get('PILOT_INVITE_REDIRECT_URL')});
  const saved=await admin.rpc('pilot_finish_email',{job:job.id,expected_version:job.version,outcome});if(saved.error)throw new Error('unavailable: delivery result could not be recorded; reconcile processing jobs before retry');processed++;
 }
 return {processed,configured:true};
}
