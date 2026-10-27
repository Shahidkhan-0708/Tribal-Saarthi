import {actor,body,limit,serve} from '../_shared/http.ts';
import {processEmailQueue} from '../_shared/email-queue.ts';
serve(async req=>{
 const account=await actor(req);if(account.role!=='admin')throw new Error('forbidden: delivery operator required');
 await body(req);await limit('workflow',account.id);
 const {processed}=await processEmailQueue();return {processed};
});
