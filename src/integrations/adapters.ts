export type AdapterMode = 'simulated' | 'sandbox' | 'live';
export type AdapterHealth = 'up' | 'down' | 'degraded';
export interface AdapterRequest { reference: string; sourceDown?: boolean }
export interface AdapterResult {
  source: string;
  mode: AdapterMode | 'unconfigured';
  timestamp: string;
  requestId: string;
  reference: string | null;
  rawStatus: string;
  state: 'verified' | 'mismatch' | 'manual_review' | 'source_down';
}
export interface GovernmentAdapter<TRequest, TResponse extends AdapterResult> {
  id: string;
  mode: AdapterMode;
  verify(request: TRequest): Promise<TResponse>;
  health(): Promise<AdapterHealth>;
}
export const adapterModes: readonly AdapterMode[] = ['simulated','sandbox','live'];
export function adapterMode(value: unknown): AdapterMode | null { return adapterModes.includes(value as AdapterMode) ? value as AdapterMode : null; }
type Transport = (request: AdapterRequest, signal: AbortSignal) => Promise<Response>;

import { mockAadhaarOtp } from '../mocks/uidai';
import { mockScholarshipEligibility } from '../mocks/nsp';
import { mockPfmsPayment } from '../mocks/pfms';
import { mockEdistrictBeneficiary } from '../mocks/edistrict';
import { mockDigiLockerFetch } from '../mocks/digilocker';

type MockFn = (req: any) => Promise<any>;

const MOCK_TRANSPORTS: Record<string, MockFn> = {
  identity:   mockAadhaarOtp,
  scholarship: mockScholarshipEligibility,
  payment:    mockPfmsPayment,
  income:     mockEdistrictBeneficiary,
  document:   mockDigiLockerFetch,
};

function wrapMockTransport(mockFn: MockFn): Transport {
  return async (request, _signal) => {
    try {
      const result = await mockFn(request.reference);
      return new Response(JSON.stringify(result), {
        status: result.status === 'SUCCESS' || result.eligible !== false ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ errorCode: 'MOCK_ERROR', errorMessage: String(e) }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

export function governmentAdapter(id: string, mode: AdapterMode, transport?: Transport, timeoutMs = 8000): GovernmentAdapter<AdapterRequest,AdapterResult> {
  if (!/^[a-z_]{2,40}$/.test(id) || !adapterMode(mode) || !Number.isInteger(timeoutMs) || timeoutMs<1 || timeoutMs>30000) throw new Error('Invalid adapter configuration');
  
  const effectiveTransport = mode === 'simulated' && MOCK_TRANSPORTS[id] 
    ? wrapMockTransport(MOCK_TRANSPORTS[id]) 
    : transport;

  return {
    id,mode,
    health: async () => mode==='simulated' ? 'up' : effectiveTransport ? 'degraded' : 'down',
    async verify(request) {
      if (!/^[a-zA-Z0-9_-]{8,160}$/.test(request.reference) || /^\d{10,}$/.test(request.reference)) throw new Error('An opaque request reference is required');
      const result:AdapterResult={source:id,mode,timestamp:new Date().toISOString(),requestId:request.reference,reference:null,rawStatus:'unconfigured',state:'source_down'};
      if (mode==='simulated') return {...result,reference:`sim_${request.reference}`,state:request.sourceDown?'source_down':'manual_review',rawStatus:request.sourceDown?'simulated_unavailable':'simulated_human_review_required'};
      if (!effectiveTransport) return result;
      const controller=new AbortController();let timer:ReturnType<typeof setTimeout> | undefined;
      try {
        const read=async()=>{
          const response=await effectiveTransport({reference:request.reference},controller.signal);
          if(!response.ok)return {response,text:''};
          const reader=response.body?.getReader();let text='',bytes=0;
          if(reader){const decoder=new TextDecoder(),cancel=()=>{void reader.cancel().catch(()=>{});};controller.signal.addEventListener('abort',cancel,{once:true});try{while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.length;if(bytes>16000){void reader.cancel().catch(()=>{});throw new Error('oversized');}text+=decoder.decode(chunk.value,{stream:true});}text+=decoder.decode();}finally{controller.signal.removeEventListener('abort',cancel);reader.releaseLock();}}
          return {response,text};
        };
        const {response,text}=await Promise.race([read(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(new Error('timeout'));},timeoutMs);})]);
        if (!response.ok) return {...result,rawStatus:`http_${response.status}`,state:response.status>=500 || response.status===429 ? 'source_down':'manual_review'};
        let value;try{value=JSON.parse(text);}catch{return {...result,rawStatus:'malformed_response',state:'manual_review'};}
        if(!value || !['matched','mismatch','pending'].includes(value.status) || typeof value.reference!=='string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(value.reference) || /^\d{10,}$/.test(value.reference))return {...result,rawStatus:'malformed_response',state:'manual_review'};
        return {...result,reference:value.reference,rawStatus:`provider_${value.status}`,state:value.status==='matched'?'verified':value.status==='mismatch'?'mismatch':'manual_review'};
      }catch(error){return {...result,rawStatus:controller.signal.aborted?'timeout':error instanceof Error && error.message==='oversized'?'malformed_response':'transport_failure',state:error instanceof Error && error.message==='oversized'?'manual_review':'source_down'};}
      finally{if(timer)clearTimeout(timer);}
    },
  };
}

export function unconfiguredResult(source: string, requestId: string): AdapterResult {
  return {source,requestId,mode:'unconfigured',timestamp:new Date().toISOString(),reference:null,rawStatus:'configuration_missing',state:'source_down'};
}