import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PilotSnapshot } from './types';

const mocks = vi.hoisted(() => ({ user: { id: 'student-a' } as { id: string } | null, invoke: vi.fn(), upload: vi.fn(), readDraft:vi.fn(),findDraft:vi.fn(), pilot:false }));
vi.mock('./api', () => ({
  ApiError: class ApiError extends Error { constructor(message: string, public code = 'REQUEST_FAILED', public status = 0, public retryAfter = 0) { super(message); } },
  getSession: async () => mocks.user, invoke: mocks.invoke, uploadDocument: mocks.upload, get isPilotMode() { return mocks.pilot; },
  validateDocument: vi.fn(), readQueuedDraft:mocks.readDraft,readMatchingDraft:mocks.findDraft,
}));
import { ApiError } from './api';
import { cacheSnapshot, clearOfflineData, conflictRecord, discardOperation, enqueueOperation, listOperations, readCachedSnapshot, registerOfflineSupport, retryConflict, syncOperations } from './offline';
const snapshot = { account: { id: 'student-a', role: 'student', active: true } } as PilotSnapshot;
beforeEach(async () => { mocks.user = { id: 'student-a' }; mocks.invoke.mockReset().mockResolvedValue({ id: 'draft', version: 1 }); await clearOfflineData(); Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true }); await cacheSnapshot(snapshot); });
afterEach(() => { mocks.pilot=false; vi.unstubAllEnvs(); });
describe('pilot offline installation', () => {
  it('keeps local development usable when browser policy blocks service workers', async () => {
    mocks.pilot=true; vi.stubEnv('PROD',false);
    const register=vi.fn().mockRejectedValue(new DOMException('Browser policy denied registration','NotSupportedError'));
    Object.assign(navigator,{serviceWorker:{register}});
    await expect(registerOfflineSupport()).resolves.toBeUndefined();
    expect(register).not.toHaveBeenCalled();
  });
  it('registers and warms the production pilot shell', async () => {
    mocks.pilot=true; vi.stubEnv('PROD',true);
    const register=vi.fn().mockResolvedValue({}),postMessage=vi.fn();
    Object.assign(navigator,{serviceWorker:{register,ready:Promise.resolve({active:{postMessage}})}});
    await registerOfflineSupport();
    expect(register).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}pilot-sw.js`,{scope:import.meta.env.BASE_URL});
    expect(postMessage).toHaveBeenCalledWith({type:'warm-shell',urls:expect.any(Array)});
  });
  it('reports denied production installation so the UI can explain online access', async () => {
    mocks.pilot=true; vi.stubEnv('PROD',true);
    const denied=new DOMException('Browser policy denied registration','NotSupportedError');
    Object.assign(navigator,{serviceWorker:{register:vi.fn().mockRejectedValue(denied)}});
    await expect(registerOfflineSupport()).rejects.toBe(denied);
  });
});
describe('durable account scoped offline operations', () => {
  it('preserves an officer note target through durable replay and rejects student note enqueue',async()=>{
    await expect(enqueueOperation('add_note',{body:'Student cannot add officer notes'},{id:'application-1',version:7})).rejects.toMatchObject({status:403});
    await cacheSnapshot({account:{id:'student-a',role:'institution',active:true}} as PilotSnapshot);
    const target={id:'application-1',version:7};const record={...target,data:{privateProfile:'must not be copied into the target'}};
    await enqueueOperation('add_note',{body:'Offline officer review'},record);
    const queued=(await listOperations())[0];expect(queued.target).toEqual(target);
    await syncOperations();expect(mocks.invoke).toHaveBeenCalledWith('add_note',{body:'Offline officer review'},target,queued.id);expect(await listOperations()).toEqual([]);
  });
  it('looks up a conflicting new draft on the server independently of the visible page',async()=>{
    await enqueueOperation('save_draft',{schemeId:'older-page-scheme',academicYear:'2026-27'});mocks.invoke.mockRejectedValueOnce(new ApiError('Changed','CONFLICT',409));await syncOperations();
    mocks.findDraft.mockResolvedValue({id:'matching-off-page',version:4,data:{status:'draft'}});
    expect((await conflictRecord((await listOperations())[0].id)).id).toBe('matching-off-page');expect(mocks.findDraft).toHaveBeenCalledWith('older-page-scheme','2026-27');
  });
  it('persists enqueue order when concurrent operations have identical timestamps',async()=>{
    vi.useFakeTimers({toFake:['Date']});vi.setSystemTime(new Date('2026-10-18T00:00:00Z'));
    try{
      await Promise.all(['first','second','third'].map(title=>enqueueOperation('save_draft',{title},{id:'same-application',version:1})));
      const operations=await listOperations();expect(new Set(operations.map(o=>o.createdAt)).size).toBe(1);expect(operations.map(o=>o.sequence)).toEqual([1,2,3]);expect(operations.map(o=>o.payload.title)).toEqual(['first','second','third']);
    }finally{vi.useRealTimers();}
  });
  it('requires an explicitly reviewed current version and a new replay ID without removing unrelated work',async()=>{
    await enqueueOperation('save_draft',{schemeId:'s'},{id:'a',version:1});
    await enqueueOperation('save_draft',{schemeId:'s2'},{id:'b',version:1});
    mocks.invoke.mockRejectedValueOnce(new ApiError('Changed','CONFLICT',409)).mockRejectedValueOnce(new ApiError('Changed','CONFLICT',409));
    await syncOperations();const operations=await listOperations();
    mocks.readDraft.mockResolvedValue({id:'a',version:3,data:{status:'draft'}});
    await expect(retryConflict(operations[0].id,{id:'a',version:2})).rejects.toThrow('changed again');
    await retryConflict(operations[0].id,{id:'a',version:3});
    const retried=(await listOperations())[0];expect(retried.attemptId).not.toBe(operations[0].id);expect(retried.target?.version).toBe(3);
    expect((await listOperations())[1]).toEqual(operations[1]);
    await syncOperations();expect(mocks.invoke.mock.calls[mocks.invoke.mock.calls.length-1]?.[3]).toBe(retried.attemptId);
  });
  it('isolates snapshots and queues from another account and excludes family', async () => {
    await enqueueOperation('save_draft', { schemeId: 's' }); mocks.user = { id: 'student-b' };
    expect(await listOperations()).toEqual([]); expect(await readCachedSnapshot('student-a')).toBeNull();
    await cacheSnapshot({ account: { id: 'student-b', role: 'family' } } as PilotSnapshot);
    expect(await readCachedSnapshot('student-b')).toBeNull();
  });
  it('rejects online only final actions', async () => { await expect(enqueueOperation('submit_application', {})).rejects.toThrow('requires an online'); });
  it('keeps an unacknowledged operation with a stable id for retry', async () => {
    await enqueueOperation('save_draft', { schemeId: 's' }); const id = (await listOperations())[0].id;
    mocks.invoke.mockRejectedValueOnce(new ApiError('No acknowledgement', 'NETWORK', 0));
    expect(await syncOperations()).toEqual({ synced: 0, conflicts: 0 }); expect((await listOperations())[0].id).toBe(id);
    expect(mocks.invoke.mock.calls[0][3]).toBe(id);
  });
  it('keeps throttled operations queued and respects Retry-After', async () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValue(1000);
    try {
      await enqueueOperation('save_draft', { schemeId: 's' });
      mocks.invoke.mockRejectedValueOnce(new ApiError('Throttled', 'rate_limited', 429, 42));
      expect(await syncOperations()).toEqual({ synced: 0, conflicts: 0 });
      expect((await listOperations())[0].status).toBe('queued');
      clock.mockReturnValue(42000);
      await syncOperations(); expect(mocks.invoke).toHaveBeenCalledTimes(1);
      clock.mockReturnValue(43001);
      expect(await syncOperations()).toEqual({ synced: 1, conflicts: 0 });
    } finally { clock.mockRestore(); }
  });
  it('retains conflicts and blocks dependent changes while acknowledging independent records', async () => {
    await enqueueOperation('save_draft', {}, { id: 'a', version: 1 });
    await enqueueOperation('save_draft', {}, { id: 'a', version: 1 });
    await enqueueOperation('save_draft', {}, { id: 'b', version: 1 });
    mocks.invoke.mockRejectedValueOnce(new ApiError('Changed', 'CONFLICT', 409));
    expect(await syncOperations()).toEqual({ synced: 1, conflicts: 1 });
    const remaining = await listOperations(); expect(remaining.map(item => item.status)).toEqual(['conflict', 'queued']); expect(mocks.invoke).toHaveBeenCalledTimes(2);
    await discardOperation(remaining[0].id); expect(await syncOperations()).toEqual({ synced: 1, conflicts: 0 });
  });
  it('clears cached data and pending files on explicit logout cleanup', async () => {
    await enqueueOperation('save_draft', {}); await clearOfflineData(); expect(await listOperations()).toEqual([]); expect(await readCachedSnapshot('student-a')).toBeNull();
  });
});
