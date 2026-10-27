import {describe,it,expect} from 'vitest';
import {adapterMode,governmentAdapter,unconfiguredResult} from './adapters';
const request={reference:'operation_12345678'};
describe('government adapter contract',()=>{
  it('requires an explicit mode and never falls back from live/sandbox to simulation',async()=>{
    expect(adapterMode(undefined)).toBeNull();expect(unconfiguredResult('income',request.reference).state).toBe('source_down');
    for(const mode of ['live','sandbox'] as const){const a=governmentAdapter('income',mode);expect(await a.health()).toBe('down');expect(await a.verify(request)).toMatchObject({mode,state:'source_down',rawStatus:'unconfigured',reference:null});}
    expect(await governmentAdapter('income','simulated').verify(request)).toMatchObject({state:'manual_review',mode:'simulated'});
  });
  it('validates results, maps failures to pending/review and discards raw sensitive fields',async()=>{
    for(const [status,body,state] of [[200,{status:'matched',reference:'issuer_ref_123',aadhaar:'123456789012'},'verified'],[200,{status:'mismatch',reference:'issuer_ref_123'},'mismatch'],[400,{},'manual_review'],[429,{},'source_down'],[503,{},'source_down'],[200,{status:'matched',reference:'123456789012'},'manual_review'],[200,'broken','manual_review']] as const){
      const a=governmentAdapter('income','sandbox',async()=>new Response(JSON.stringify(body),{status}));const r=await a.verify(request);expect(r.state).toBe(state);expect(JSON.stringify(r)).not.toContain('123456789012');expect(r.timestamp).toBeTruthy();expect(r.requestId).toBe(request.reference);
    }
  });
  it('bounds timeouts and rejects personal identifiers as operation references',async()=>{
    expect(await governmentAdapter('income','live',()=>new Promise(()=>{}),5).verify(request)).toMatchObject({state:'source_down',rawStatus:'timeout'});
    await expect(governmentAdapter('identity','live').verify({reference:'123456789012'})).rejects.toThrow('opaque');
    expect(await governmentAdapter('identity','simulated').verify({...request,sourceDown:true})).toMatchObject({state:'source_down',mode:'simulated'});
  });
  it('bounds response bodies as well as connection time',async()=>{
    const stalled=new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode('{'));}});
    expect(await governmentAdapter('income','live',async()=>new Response(stalled),5).verify(request)).toMatchObject({rawStatus:'timeout',state:'source_down'});
    expect(await governmentAdapter('income','sandbox',async()=>new Response('x'.repeat(16001))).verify(request)).toMatchObject({rawStatus:'malformed_response',state:'manual_review'});
  });
});
