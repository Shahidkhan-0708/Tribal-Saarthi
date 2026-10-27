import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ invoke: vi.fn(), from: vi.fn(), rpc: vi.fn(), signOut: vi.fn(), stopRefresh: vi.fn(), startRefresh: vi.fn(), files: { upload: vi.fn(), remove: vi.fn() }, storage: undefined as undefined | { setItem(key: string, value: string): void } }));
vi.mock('@supabase/supabase-js', () => ({ createClient: (_url: string, _key: string, options: { auth: { storage: typeof mocks.storage } }) => {
  mocks.storage = options.auth.storage;
  return { functions: { invoke: mocks.invoke }, from: mocks.from, rpc: mocks.rpc, storage: { from: () => mocks.files }, auth: { signOut: mocks.signOut, stopAutoRefresh: mocks.stopRefresh, startAutoRefresh: mocks.startRefresh, onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }), getSession: async () => ({ data: { session: { user: { id: 'family-id' } } }, error: null }) } };
} }));
import { ApiError, getSession, validateDocument } from './api';
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
async function configuredApi() {
  vi.stubEnv('VITE_APP_MODE', 'pilot'); vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co'); vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_example'); vi.resetModules(); return import('./api');
}

describe('pilot client boundaries', () => {
  it('sends only target ID/version across workflow, account, privacy and bulk boundaries',async()=>{
    const api=await configuredApi(),target={id:'record-1',version:4,data:{privateProfile:'do not duplicate'}};
    const minimal={id:target.id,version:target.version};mocks.invoke.mockResolvedValue({data:minimal,error:null});mocks.rpc.mockResolvedValue({data:minimal,error:null});
    await api.invoke('add_note',{body:'Review'},target);
    expect(mocks.invoke).toHaveBeenLastCalledWith('pilot-workflow',{body:expect.objectContaining({target:minimal})});
    await api.manageAccount('manage_account',{},target);
    expect(mocks.invoke).toHaveBeenLastCalledWith('pilot-accounts',{body:expect.objectContaining({target:minimal})});
    await api.privacyCommand('revoke_consent',{},target);
    expect(mocks.rpc).toHaveBeenLastCalledWith('pilot_privacy',expect.objectContaining({target:minimal}));
    await api.bulkSanction([target],'signature.png');
    expect(mocks.invoke).toHaveBeenLastCalledWith('pilot-workflow',{body:expect.objectContaining({payload:{targets:[minimal],signaturePath:'signature.png'}})});
  });
  it('filters a matching draft by the current owner, scheme and year on the server',async()=>{
    const api=await configuredApi(),eq=vi.fn();const query={eq,single:async()=>({data:{id:'matching',version:2,data:{status:'draft'}},error:null})};eq.mockReturnValue(query);mocks.from.mockReturnValue({select:()=>query});
    expect((await api.readMatchingDraft('scheme','2026-27')).id).toBe('matching');expect(eq.mock.calls).toEqual([['data->>studentId','family-id'],['data->>schemeId','scheme'],['data->>academicYear','2026-27']]);
    await expect(api.readMatchingDraft('scheme','bad-year')).rejects.toThrow('academic year');
  });
  it('loads bounded pages, preserves referenced evidence and invalidates catalogue cache',async()=>{
    const api=await configuredApi();
    mocks.from.mockImplementation(()=>({select:()=>({eq:()=>({single:async()=>({data:{id:'family-id',name:'Operator',role:'admin',active:true},error:null})})})}));
    const metrics={students:750,applications:600,beneficiaries:20,disbursedAmount:0,funnel:[],districts:[],pvtg:[]};
    mocks.rpc.mockImplementation(async(_name,args)=>({error:null,data:{pages:Object.fromEntries(Object.entries(args.requests as Record<string,{page:number;search:string}>).map(([table,v])=>[table,{items:[],hasMore:false,page:v.page,search:v.search}])),context:{documents:[{id:'referenced',version:1,data:{title:'Evidence'}}]},metrics}}));
    mocks.rpc.mockClear();const first=await api.getSnapshot();expect(first.metrics?.students).toBe(750);expect(first.documents[0].id).toBe('referenced');
    const catalogCalls=()=>mocks.rpc.mock.calls.filter(([name,args])=>name==='pilot_snapshot' && !!args.requests.schemes).length;
    expect(catalogCalls()).toBe(1);await api.getSnapshot();expect(catalogCalls()).toBe(1);
    api.selectPage('notifications',1,'needle');await api.getSnapshot();expect(mocks.rpc).toHaveBeenCalledWith('pilot_snapshot',{requests:expect.objectContaining({notifications:{page:1,search:'needle'}})});
    api.invalidateCatalog();await api.getSnapshot();expect(catalogCalls()).toBe(2);
    const future=Date.now()+61000;vi.spyOn(Date,'now').mockReturnValue(future);await api.getSnapshot();expect(catalogCalls()).toBe(3);
    expect(()=>api.selectPage('notifications',-1,'')).toThrow('Invalid page');
  });
  it('does not create a session for the unconfigured demo', async () => { expect(await getSession()).toBeNull(); });
  it('accepts allowed documents and rejects empty, oversized and unsupported files', () => {
    expect(() => validateDocument(new Blob(['pdf'], { type: 'application/pdf' }))).not.toThrow();
    expect(() => validateDocument(new Blob([], { type: 'image/png' }))).toThrow(ApiError);
    expect(() => validateDocument(new Blob(['script'], { type: 'text/html' }))).toThrow(ApiError);
    expect(() => validateDocument(new Blob([new Uint8Array(10 * 1024 * 1024 + 1)], { type: 'image/jpeg' }))).toThrow(ApiError);
  });
  it('preserves controlled validation errors without leaking arbitrary server errors', async () => {
    const api = await configuredApi();
    mocks.invoke.mockResolvedValueOnce({ data: null, error: { context: new Response(JSON.stringify({ code: 'validation', error: 'validation: Attach the required certificate.' }), { status: 400 }) } });
    await expect(api.invoke('submit_application', {})).rejects.toThrow('Attach the required certificate.');
    mocks.invoke.mockResolvedValueOnce({ data: null, error: { context: new Response(JSON.stringify({ error: 'database password details' }), { status: 500 }) } });
    await expect(api.invoke('submit_application', {})).rejects.toThrow('No acknowledgement');
  });
  it('reports request throttling with its retry interval', async () => {
    const api = await configuredApi();
    mocks.invoke.mockResolvedValueOnce({ data: null, error: { context: new Response(JSON.stringify({ code: 'rate_limited' }), { status: 429, headers: { 'Retry-After': '42' } }) } });
    await expect(api.invoke('save_draft', {})).rejects.toMatchObject({ status: 429, retryAfter: 42, message: 'Too many requests. Retry after 42 seconds.' });
  });
  it('preserves uploaded bytes when registration is throttled', async () => {
    const api = await configuredApi();
    mocks.files.upload.mockResolvedValue({ error: null }); mocks.files.remove.mockClear();
    mocks.invoke.mockResolvedValueOnce({ data: null, error: { context: new Response(JSON.stringify({ code: 'rate_limited' }), { status: 429, headers: { 'Retry-After': '42' } }) } });
    await expect(api.uploadDocument(new File(['%PDF-1.7'], 'proof.pdf', { type: 'application/pdf' }), 'income_certificate', 'Income')).rejects.toMatchObject({ status: 429 });
    expect(mocks.files.remove).not.toHaveBeenCalled();
  });
  it('uses only authorized summary RPC for family accounts', async () => {
    const api = await configuredApi();
    mocks.from.mockReset().mockImplementation(() => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { id: 'family-id', email: 'family@example.com', name: 'Family', role: 'family', active: true }, error: null }) }) }) }));
    mocks.rpc.mockResolvedValue({ data: { applications: [{ id: 'summary' }], payments: [] }, error: null });
    const snapshot = await api.getSnapshot(); expect(snapshot.documents).toEqual([]); expect(snapshot.students).toEqual([]); expect(mocks.from).toHaveBeenCalledTimes(1); expect(mocks.from).toHaveBeenCalledWith('pilot_accounts'); expect(mocks.rpc).toHaveBeenCalledWith('pilot_family_page',{page_number:0});
  });
  it('removes offline auth credentials, notifies logout and blocks late refresh writes', async () => {
    const stored = new Map<string, string>();
    vi.stubGlobal('localStorage', { get length() { return stored.size; }, key: (index: number) => [...stored.keys()][index], getItem: (key: string) => stored.get(key) ?? null, setItem: (key: string, value: string) => stored.set(key, value), removeItem: (key: string) => stored.delete(key) });
    const api = await configuredApi(); const callback = vi.fn(); const unsubscribe = api.onAuthChange(callback);
    stored.set(api.authStorageKey, 'secret-tokens'); stored.set(`${api.authStorageKey}-code-verifier`, 'secret-pkce'); stored.set('unrelated-setting', 'preserved');
    mocks.signOut.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ error: null });
    const result = await api.signOut();
    expect(result.warning).toContain('Server session revocation'); expect(callback).toHaveBeenCalledWith(null, 'SIGNED_OUT'); expect(mocks.stopRefresh).toHaveBeenCalled();
    expect(mocks.signOut).toHaveBeenLastCalledWith({ scope: 'local' });
    expect(stored.has(api.authStorageKey)).toBe(false); expect(stored.has(`${api.authStorageKey}-code-verifier`)).toBe(false); expect(stored.get('unrelated-setting')).toBe('preserved');
    mocks.storage!.setItem(api.authStorageKey, 'late-refresh-tokens'); expect(stored.has(api.authStorageKey)).toBe(false); expect(await api.getSession()).toBeNull(); unsubscribe();
  });
});
