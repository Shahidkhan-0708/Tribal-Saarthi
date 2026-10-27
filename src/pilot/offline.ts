import { ApiError, getSession, invoke, isPilotMode, readQueuedDraft, readMatchingDraft, uploadDocument, validateDocument } from './api';
import type { DocKey } from '@/types';
import type { OfflineOperation, PilotAction, PilotSnapshot, PilotTarget } from './types';

const databaseName = 'tribe-saarthi-pilot';
const allowed = new Set<PilotAction>(['save_draft', 'create_grievance', 'add_note', 'register_document']);
let generation = 0;
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('snapshots', { keyPath: 'account.id' }); request.result.createObjectStore('operations', { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
}
async function transaction<T>(store: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode); const request = action(tx.objectStore(store));
    tx.oncomplete = () => { db.close(); resolve(request.result); };
    tx.onabort = tx.onerror = () => { db.close(); reject(tx.error ?? request.error); };
  });
}
export async function cacheSnapshot(snapshot: PilotSnapshot) {
  const user = await getSession();
  if (snapshot.account.role === 'family' || !user || snapshot.account.id !== user.id) return;
  await transaction('snapshots', 'readwrite', store => store.put({ ...snapshot, cachedAt: new Date().toISOString() }));
}
export async function readCachedSnapshot(userId: string): Promise<(PilotSnapshot & { cachedAt?: string }) | null> {
  const user = await getSession(); if (!user || user.id !== userId) return null;
  const value = await transaction<(PilotSnapshot & { cachedAt?: string }) | undefined>('snapshots', 'readonly', store => store.get(userId));
  return value?.account.role === 'family' ? null : value ?? null;
}
export async function enqueueOperation(action: PilotAction, payload: Record<string, unknown>, target?: PilotTarget, file?: File): Promise<void> {
  if (!allowed.has(action)) throw new ApiError('This action requires an online connection.', 'OFFLINE_DISALLOWED', 400);
  const user = await getSession(); if (!user) throw new ApiError('Please sign in before saving offline.', 'AUTH', 401);
  const snapshot = await readCachedSnapshot(user.id);
  if (!snapshot || snapshot.account.role === 'family' || !snapshot.account.active) throw new ApiError('Load your account online before saving offline.', 'AUTH', 403);
  const studentActions = ['save_draft', 'create_grievance', 'register_document'];
  if ((studentActions.includes(action) && snapshot.account.role !== 'student') || (action === 'add_note' && !['institution', 'nodal', 'admin'].includes(snapshot.account.role))) throw new ApiError('Your account cannot queue this action.', 'AUTH', 403);
  if (action === 'register_document' && !file) throw new ApiError('Choose a document to queue.', 'VALIDATION', 400);
  if (file) validateDocument(file);
  const baseSnapshot = action === 'save_draft' ? snapshot.applications?.find(a => a.id === target?.id)?.data as unknown as Record<string, unknown> : undefined;
  const operation: OfflineOperation = { id: crypto.randomUUID(), userId: user.id, action, payload, target:target && {id:target.id,version:target.version}, createdAt: new Date().toISOString(), status: 'queued', file, fileName: file?.name, baseSnapshot };
  // Timestamp ties must not reorder dependent changes; IndexedDB serializes these write transactions across tabs.
  await transaction('operations', 'readwrite', store => {
    const existing=store.getAll();
    existing.onsuccess=()=>{operation.sequence=(existing.result as OfflineOperation[]).reduce((last,item)=>Math.max(last,item.sequence ?? 0),0)+1;store.put(operation);};
    return existing;
  });
}
export async function listOperations(): Promise<OfflineOperation[]> {
  const user = await getSession(); if (!user) return [];
  const all = await transaction<OfflineOperation[]>('operations', 'readonly', store => store.getAll());
  return all.filter(item => item.userId === user.id).sort((a, b) => (a.sequence ?? 0)-(b.sequence ?? 0) || a.createdAt.localeCompare(b.createdAt));
}
export async function discardOperation(id: string) {
  if ((await listOperations()).some(item => item.id === id)) await transaction('operations', 'readwrite', store => store.delete(id));
}
export async function conflictRecord(id: string) {
  const operation = (await listOperations()).find(o => o.id === id && o.status === 'conflict');
  if (!operation || operation.action !== 'save_draft') throw new ApiError('Only an editable draft can be retried after review.', 'VALIDATION',400);
  if (operation.target) return readQueuedDraft(operation.target.id);
  return readMatchingDraft(operation.payload.schemeId,operation.payload.academicYear);
}
export async function retryConflict(id: string, reviewed: PilotTarget) {
  const operation = (await listOperations()).find(o => o.id === id && o.status === 'conflict');
  if (!operation) throw new ApiError('This conflict is no longer queued.', 'CONFLICT',409);
  const current = await conflictRecord(id);
  if (current.id !== reviewed.id || current.version !== reviewed.version) throw new ApiError('The server changed again. Review the latest record.', 'CONFLICT',409);
  await transaction('operations','readwrite',store => store.put({...operation,target:{id:current.id,version:current.version},status:'queued',error:undefined,attemptId:crypto.randomUUID(),baseSnapshot:current.data}));
  nextAttempt=0;
}
let running: Promise<{ synced: number; conflicts: number }> | undefined;
let nextAttempt = 0;
let retryDelay = 1000;
export function syncOperations(): Promise<{ synced: number; conflicts: number }> {
  if (running) return running;
  running = replay().finally(() => { running = undefined; }); return running;
}
async function replay() {
  const startedGeneration = generation;
  let synced = 0; let conflicts = 0;
  if (!navigator.onLine || Date.now() < nextAttempt) return { synced, conflicts };
  const user = await getSession(); if (!user) return { synced, conflicts };
  const blocked = new Set<string>();
  for (const operation of await listOperations()) {
    if ((await getSession())?.id !== user.id || generation !== startedGeneration) break;
    // Draft keys keep dependent changes ordered even before the server allocates their record ID.
    const entity = operation.target?.id ?? `${operation.action}:${operation.payload.applicationId ?? operation.payload.schemeId ?? operation.payload.type ?? 'new'}`;
    if (operation.status !== 'queued' || blocked.has(entity)) { blocked.add(entity); if (operation.status === 'conflict') conflicts++; continue; }
    try {
      if (operation.action === 'register_document' && operation.file) {
        await uploadDocument(new File([operation.file], operation.fileName ?? 'document', { type: operation.file.type }), operation.payload.type as DocKey, String(operation.payload.title ?? ''), operation.payload.previousVersionId as string | undefined, operation.id);
      } else await invoke(operation.action, operation.payload, operation.target, operation.attemptId ?? operation.id);
      if (generation !== startedGeneration) break;
      await transaction('operations', 'readwrite', store => store.delete(operation.id)); synced++; retryDelay = 1000;
    } catch (error) {
      if (generation !== startedGeneration) break;
      if (error instanceof ApiError && (error.status === 401 || error.code === 'AUTH')) break;
      if (!(error instanceof ApiError) || !error.status || error.status >= 500 || error.status === 429) { nextAttempt = Date.now() + Math.max(retryDelay, error instanceof ApiError ? error.retryAfter * 1000 : 0); retryDelay = Math.min(retryDelay * 2, 60000); break; }
      operation.status = error.status === 409 || error.code === 'CONFLICT' ? 'conflict' : 'failed'; operation.error = error.message;
      await transaction('operations', 'readwrite', store => store.put(operation)); blocked.add(entity);
      if (operation.status === 'conflict') conflicts++;
    }
  }
  return { synced, conflicts };
}
export async function clearOfflineData() {
  if (typeof indexedDB === 'undefined') return;
  generation++;
  await transaction('snapshots', 'readwrite', store => store.clear());
  await transaction('operations', 'readwrite', store => store.clear());
  nextAttempt = 0; retryDelay = 1000;
}
export async function registerOfflineSupport() {
  const base = import.meta.env.BASE_URL;
  if (import.meta.env.PROD && isPilotMode && 'serviceWorker' in navigator) {
    await navigator.serviceWorker.register(`${base}pilot-sw.js`, { scope: base });
    const registration = await navigator.serviceWorker.ready;
    registration.active?.postMessage({ type: 'warm-shell', urls: performance.getEntriesByType('resource').map(entry => entry.name) });
  }
}
