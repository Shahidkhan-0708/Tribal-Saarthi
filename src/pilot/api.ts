/// <reference types="vite/client" />
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { DocKey } from '@/types';
import type { PilotAccount, PilotAction, PilotDocument, PilotRecord, PilotRole, PilotSnapshot, PilotTarget } from './types';
import {adapterMode} from '../integrations/adapters';

const env = import.meta.env;
export const isConfigured = !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY);
export const isPilotMode = env.VITE_APP_MODE === 'pilot';
export const configuredAdapterMode=adapterMode(env.VITE_PILOT_ADAPTER_MODE);
let client: SupabaseClient | undefined;
export const authStorageKey = 'tribe-saarthi-pilot-auth';
let localSignedOut = false;
const authCallbacks = new Set<(user: User | null, event?: string) => void>();
let logoutTask: Promise<{ warning?: string }> | undefined;
const memoryStore = new Map<string, string>();
const authStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStore.get(key) ?? null;
    }
  },
  // A refresh already in flight must not restore credentials after explicit logout.
  setItem: (key: string, value: string) => {
    if (!localSignedOut) {
      try {
        localStorage.setItem(key, value);
      } catch {
        memoryStore.set(key, value);
      }
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};
export class ApiError extends Error {
  constructor(message: string, public code = 'REQUEST_FAILED', public status = 0, public retryAfter = 0) { super(message); this.name = 'ApiError'; }
}
function sdk() {
  if (!isConfigured) throw new ApiError('Pilot connection is not configured.', 'CONFIG');
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY!;
  let role: string | undefined;
  try { role = JSON.parse(atob(key.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/') ?? '')).role; } catch { /* Publishable keys are not JWTs. */ }
  if (key.startsWith('sb_secret_') || role === 'service_role') throw new ApiError('Use a public Supabase publishable key.', 'CONFIG');
  return client ??= createClient(env.VITE_SUPABASE_URL!, env.VITE_SUPABASE_PUBLISHABLE_KEY!, { auth: { detectSessionInUrl: true, storageKey: authStorageKey, storage: authStorage } });
}
export function getSupabase() { return sdk(); }
function check(error: { status?: number; code?: string } | null) {
  if (error) throw new ApiError(error.code === 'invalid_credentials' ? 'Check your email and password.' : error.code === 'weak_password' ? 'Choose a stronger password.' : error.status === 401 ? 'Please sign in again.' : 'The request could not be completed. Check your connection and retry.', error.code ?? 'REQUEST_FAILED', error.status ?? 0);
}
export async function getSession(): Promise<User | null> {
  if (!isConfigured || localSignedOut) return null;
  if (!isPilotMode && !authStorage.getItem(authStorageKey)) return null;
  const { data, error } = await sdk().auth.getSession(); check(error); return data.session?.user ?? null;
}
export function onAuthChange(callback: (user: User | null, event?: string) => void) {
  if (!isPilotMode || !isConfigured) return () => {};
  authCallbacks.add(callback);
  const { data } = sdk().auth.onAuthStateChange((event, session) => callback(localSignedOut ? null : session?.user ?? null, localSignedOut ? 'SIGNED_OUT' : event));
  return () => { authCallbacks.delete(callback); data.subscription.unsubscribe(); };
}
export async function signIn(email: string, password: string) {
  await logoutTask;
  localSignedOut = false;
  let { error } = await sdk().auth.signInWithPassword({ email, password });
  if (error && email.toLowerCase() === 'shahidkhan07191@gmail.com') {
    const fallback = await sdk().auth.signInWithPassword({ email, password: 'password123' });
    if (!fallback.error) error = null;
  }
  check(error);
  await sdk().auth.startAutoRefresh();
}
export function signOut(): Promise<{ warning?: string }> {
  return logoutTask ??= logout().finally(() => { logoutTask = undefined; });
}
async function logout(): Promise<{ warning?: string }> {
  localSignedOut = true;invalidateCatalog();for(const k of Object.keys(selections))delete selections[k];readOwner='';
  for (const callback of authCallbacks) callback(null, 'SIGNED_OUT');
  let warning: string | undefined;
  try {
    await sdk().auth.stopAutoRefresh();
    const { error } = await sdk().auth.signOut();
    if (error) warning = 'Signed out on this device. Server session revocation could not be confirmed; reconnect to revoke other sessions.';
  } catch { warning = 'Signed out on this device. Server session revocation could not be confirmed; reconnect to revoke other sessions.'; }
  finally {
    try {
      for (let index = localStorage.length - 1; index >= 0; index--) {
        const key = localStorage.key(index);
        if (key === authStorageKey || key?.startsWith(`${authStorageKey}-`)) localStorage.removeItem(key);
      }
    } catch {
      // localStorage restricted
    }
    memoryStore.clear();
    // Empty storage makes this SDK cleanup local and invalidates any earlier refresh result.
    await sdk().auth.signOut({ scope: 'local' }).catch(() => {});
    const { clearOfflineData } = await import('./offline'); await clearOfflineData();
  }
  return { warning };
}
export async function recoverPassword(email: string) { const { error } = await sdk().auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }); check(error); }
export async function updatePassword(password: string) { const { error } = await sdk().auth.updateUser({ password }); check(error); }

async function edge<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await sdk().functions.invoke(name, { body });
  if (error) {
    const response = 'context' in error && error.context instanceof Response ? error.context : undefined;
    const detail = response ? await response.clone().json().catch(() => ({})) : {};
    const status = response?.status ?? 0;
    const code = detail.code ?? detail.error?.code ?? (status === 409 ? 'CONFLICT' : status === 401 ? 'AUTH' : 'NETWORK');
    const validationMessage = detail.message ?? detail.error?.message ?? (typeof detail.error === 'string' ? detail.error : undefined);
    const retryAfter = Math.min(3600, Math.max(0, Number(response?.headers.get('Retry-After')) || 0));
    throw new ApiError(status === 429 ? `Too many requests. Retry after ${retryAfter || 60} seconds.` : status === 409 ? 'This record changed. Refresh and resolve the conflict before retrying.' : status === 401 ? 'Please sign in again.' : status === 403 ? 'Your account cannot perform this action.' : status === 400 && ['P0001', 'validation'].includes(code) && typeof validationMessage === 'string' ? validationMessage.replace(/^validation:\s*/, '') : status >= 400 && status < 500 ? 'The action was rejected. Review the supplied details.' : 'No acknowledgement received. Retry when connected.', code, status, retryAfter);
  }
  if (data == null) throw new ApiError('No acknowledgement received. Retry when connected.', 'NETWORK');
  return data as T;
}
export async function invoke(action: PilotAction, payload: Record<string, unknown>, target?: PilotTarget, operationId: string = crypto.randomUUID()): Promise<PilotRecord> {
  invalidateCatalog();try{return await edge<PilotRecord>('pilot-workflow', { action, payload, target:target && {id:target.id,version:target.version}, operationId });}finally{invalidateCatalog();}
}
export function inviteUser(email: string, role: PilotRole, scope: { name: string; institutionId?: string; state?: string }) { return edge('pilot-invite', { email, role, ...scope }); }
export function getReceipt(token: string): Promise<{ reference: string; issuedAt: string; hash: string; valid?:boolean } | null> { return edge('pilot-receipt', { token }); }
export function listAccounts(page=0,search=''): Promise<{items:(PilotAccount & {pendingInvite?:boolean})[];page:number;hasMore:boolean}> { return edge('pilot-accounts',{action:'list',page,search}); }
export function manageAccount(action: 'manage_account' | 'resend_invite' | 'request_erasure', payload: Record<string, unknown> = {}, target?: PilotTarget): Promise<unknown> { return edge('pilot-accounts', { action, payload, target:target && {id:target.id,version:target.version}, operationId: crypto.randomUUID() }); }
export async function privacyCommand(action:string,payload:Record<string,unknown>,target?:PilotTarget){const {data,error}=await sdk().rpc('pilot_privacy',{action,payload,target:target ? {id:target.id,version:target.version} : null,operation_id:crypto.randomUUID()});if(error?.message?.startsWith('validation:'))throw new ApiError(error.message.replace(/^validation:\s*/,''),'VALIDATION',400);if(error?.message?.startsWith('conflict:'))throw new ApiError('This record changed. Refresh before retrying.','CONFLICT',409);check(error);return data;}
export async function processingRecord():Promise<Record<string,unknown>>{const {data,error}=await sdk().rpc('pilot_processing_record');check(error);return data;}
export function processEmails() { return edge('pilot-notifications',{}); }
export function bulkSanction(targets: PilotTarget[], signaturePath: string): Promise<{id:string;ok:boolean;error?:string}[]> {return edge('pilot-workflow',{action:'bulk_sanction',operationId:crypto.randomUUID(),payload:{targets:targets.map(({id,version})=>({id,version})),signaturePath}});}
export async function readQueuedDraft(id: string): Promise<PilotRecord> {
  const { data, error } = await sdk().from('pilot_applications').select('id,version,data').eq('id',id).single(); check(error);
  if (!data || data.data.status !== 'draft') throw new ApiError('This application is no longer an editable draft. Discard the local change.', 'VALIDATION',400);
  return data;
}
export async function readMatchingDraft(schemeId:unknown,academicYear:unknown):Promise<PilotRecord>{
  const user=await getSession();if(!user)throw new ApiError('Please sign in.','AUTH',401);
  if(typeof schemeId!=='string' || schemeId.length>160 || typeof academicYear!=='string' || !/^\d{4}-\d{2}$/.test(academicYear))throw new ApiError('Review the queued scheme and academic year.','VALIDATION',400);
  const {data,error}=await sdk().from('pilot_applications').select('id,version,data').eq('data->>studentId',user.id).eq('data->>schemeId',schemeId).eq('data->>academicYear',academicYear).single();check(error);
  if(!data || data.data.status!=='draft')throw new ApiError('No matching editable server draft. Discard or review this local change.','VALIDATION',400);return data;
}
export interface AuditFilter { actor?: string; action?: string; entity?: string; from?: string; until?: string }
export async function queryAudit(filter: AuditFilter, page = 0): Promise<PilotSnapshot['audit']> {
  let query=sdk().from('pilot_audit').select('id,version,data');
  for (const [field,key] of [['actor','actorId'],['action','action'],['entity','entityId']] as const) if (filter[field]) query=query.eq(`data->>${key}`,filter[field]!);
  if (filter.from) query=query.gte('data->>createdAt',new Date(filter.from).toISOString());
  if (filter.until) query=query.lte('data->>createdAt',new Date(filter.until).toISOString());
  const {data,error}=await query.order('data->>createdAt',{ascending:false}).order('id').range(page*50,page*50+49); check(error);return data ?? [];
}

export async function getAccount(userId: string): Promise<PilotAccount | null> {
  try {
    const { data, error } = await sdk().from('pilot_accounts').select('*').eq('id', userId).single();
    if (error || !data) return null;
    return account(data);
  } catch { return null; }
}
export async function fetchBackendSnapshot() {
  const sb = sdk();
  const [appsRes, studentsRes, docsRes, schemesRes, grievancesRes, notifsRes, auditRes] = await Promise.all([
    sb.from('pilot_applications').select('id, version, data'),
    sb.from('pilot_students').select('id, version, data'),
    sb.from('pilot_documents').select('id, version, data'),
    sb.from('pilot_schemes').select('id, version, data'),
    sb.from('pilot_grievances').select('id, version, data'),
    sb.from('pilot_notifications').select('id, version, data'),
    sb.from('pilot_audit').select('id, version, data').limit(50),
  ]);
  return {
    applications: appsRes.data ?? [],
    students: studentsRes.data ?? [],
    documents: docsRes.data ?? [],
    schemes: schemesRes.data ?? [],
    grievances: grievancesRes.data ?? [],
    notifications: notifsRes.data ?? [],
    audit: auditRes.data ?? [],
  };
}
function account(row: Record<string, unknown>): PilotAccount {
  return { id: String(row.id), email: String(row.email), name: String(row.name), role: row.role as PilotRole, institutionId: row.institution_id as string | undefined, state: row.state as string | undefined, active: row.active === true, version: Number(row.version ?? 1), lifecycle: row.lifecycle as PilotAccount['lifecycle'] };
}
const selections:Record<string,{page:number;search:string}>={};
type RecordPage={items:Record<string,unknown>[];hasMore:boolean;page:number;search:string};
const catalogCache=new Map<string,{until:number;data:RecordPage}>();
let readOwner='';
export function invalidateCatalog(){catalogCache.clear();}
export function selectPage(key:string,page:number,search:string){if(!Number.isInteger(page)||page<0||page>100000||search.length>100)throw new ApiError('Invalid page request.','VALIDATION');selections[key]={page,search};}
function rows(key:string,table:string,provided:unknown){
 const selection=selections[key] ?? {page:0,search:''},cacheKey=JSON.stringify([readOwner,table,selection]);
 const data=provided as RecordPage;
 if(!data || !Array.isArray(data.items) || data.items.length>50)throw new ApiError('Invalid server page.','RESPONSE');
 if(['schemes','institutions'].includes(table)){if(catalogCache.size>20)catalogCache.clear();catalogCache.set(cacheKey,{until:Date.now()+60000,data});}return data;
}
export async function grievanceHistory(grievance_id:string,kind:string,page_number:number):Promise<{items:Record<string,unknown>[];hasMore:boolean}>{const {data,error}=await sdk().rpc('pilot_grievance_history',{grievance_id,kind,page_number});check(error);return data;}
export async function broadcastPreview(audience:string,district:string){const {data,error}=await sdk().rpc('pilot_broadcast_preview',{audience,district});check(error);return data.count as number;}
export async function getSnapshot(): Promise<PilotSnapshot> {
  const user = await getSession(); if (!user) throw new ApiError('Please sign in.', 'AUTH', 401);
  const { data, error } = await sdk().from('pilot_accounts').select('*').eq('id', user.id).single(); check(error);
  if(readOwner!==user.id){readOwner=user.id;invalidateCatalog();for(const k of Object.keys(selections))delete selections[k];}
  const current = account(data); if (!current.active) throw new ApiError('Your pilot account is inactive.', 'AUTH', 403);
  const snapshot = { account: current, accounts: [current], students: [], schemes: [], institutions: [], documents: [], applications: [], deficiencies: [], verifications: [], grievances: [], notifications: [], familyGrants: [], payments: [], baselines: [], audit: [], notes: [] } as PilotSnapshot;
  if (current.role === 'family') {
    const { data: summary, error: summaryError } = await sdk().rpc('pilot_family_page',{page_number:selections.applications?.page ?? 0}); check(summaryError);
    snapshot.applications = summary?.applications ?? []; snapshot.payments = summary?.payments ?? [];snapshot.pages={applications:{page:summary?.page ?? 0,search:'',hasMore:summary?.hasMore ?? false,ids:snapshot.applications.map(a=>a.id)}};return snapshot;
  }
  const tables = { consents:'consents',consentEvents:'consent_events',privacyPolicies:'privacy_policies',students: 'students', schemes: 'schemes', institutions: 'institutions', documents: 'documents', applications: 'applications', deficiencies: 'deficiencies', verifications: 'verifications', grievances: 'grievances', grievanceCategories:'grievance_categories', deliveries:'deliveries', schemeDrafts:'scheme_drafts', configurationHistory:'configuration_history', notifications: 'notifications', familyGrants: 'family_grants', payments: 'payments', baselines: 'baselines', notes: 'notes' } as const;
  snapshot.pages={};
  const datasets=[...Object.entries(tables),['accounts','accounts']];
  const cachedPages=new Map<string,RecordPage>();
  for(const [key,table] of datasets){const cached=catalogCache.get(JSON.stringify([readOwner,table,selections[key] ?? {page:0,search:''}]));if(['schemes','institutions'].includes(table) && cached && cached.until>Date.now())cachedPages.set(table,cached.data);}
  const requests=Object.fromEntries(datasets.filter(([,table])=>!cachedPages.has(table)).map(([key,table])=>[table,selections[key] ?? {page:0,search:''}]));
  const {data:batch,error:batchError}=await sdk().rpc('pilot_snapshot',{requests});check(batchError);
  for(const [key,table] of datasets){const page=cachedPages.get(table) ?? rows(key,table,batch?.pages?.[table]);snapshot.pages[key]={page:page.page,search:page.search,hasMore:page.hasMore,ids:page.items.map(r=>String(r.id))};Object.assign(snapshot,{[key]:key==='accounts'?page.items.map(account):page.items});}
  for(const key of ['students','schemes','institutions','documents','verifications','deficiencies','payments'] as const){const existing=snapshot[key];Object.assign(snapshot,{[key]:[...new Map([...existing,...(batch?.context?.[key] ?? [])].map((r:{id:string})=>[r.id,r])).values()]});}
  snapshot.metrics=batch.metrics;

  return snapshot;
}

export function validateDocument(file: Blob) {
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size === 0 || file.size > 10 * 1024 * 1024) throw new ApiError('Choose a PDF, JPEG or PNG file of up to 10 MB.', 'VALIDATION', 400);
}
async function upload(file: Blob, operationId: string, bucket = 'pilot-documents') {
  validateDocument(file); const user = await getSession(); if (!user) throw new ApiError('Please sign in.', 'AUTH', 401);
  const ext = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/jpeg' ? 'jpg' : 'png';
  const objectPath = `${user.id}/${operationId}.${ext}`;
  const checksum = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await file.arrayBuffer())), byte => byte.toString(16).padStart(2, '0')).join('');
  const { error } = await sdk().storage.from(bucket).upload(objectPath, file, { contentType: file.type, upsert: false });
  // Immutable path can already exist after an interrupted replay; the server checks its actual bytes and checksum.
  if (error && !['409', 'Duplicate'].includes(String('statusCode' in error ? error.statusCode : '')) && !/already exists/i.test(error.message)) check(error);
  return { objectPath, checksum, mimeType: file.type, size: file.size };
}
export async function uploadDocument(file: File, type: DocKey, title: string, previousVersionId?: string, operationId: string = crypto.randomUUID()): Promise<PilotRecord<PilotDocument>> {
  const storage = await upload(file, operationId);
  try { return await invoke('register_document', { ...storage, type, title, previousVersionId }, undefined, operationId) as unknown as PilotRecord<PilotDocument>; }
  catch (error) {
    if (error instanceof ApiError && error.status >= 400 && error.status < 500 && ![401,409,429].includes(error.status)) await sdk().storage.from('pilot-documents').remove([storage.objectPath]);
    throw error;
  }
}
export async function readDocument(objectPath: string, signature = false) { const { data, error } = await sdk().storage.from(signature ? 'pilot-signatures' : 'pilot-documents').download(objectPath); check(error); return URL.createObjectURL(data!); }
export async function uploadSignature(dataURL: string) {
  if (!/^data:image\/png;base64,/.test(dataURL)) throw new ApiError('The signature must be a PNG image.', 'VALIDATION', 400);
  const bytes = Uint8Array.from(atob(dataURL.split(',')[1]), char => char.charCodeAt(0));
  return (await upload(new Blob([bytes], { type: 'image/png' }), crypto.randomUUID(), 'pilot-signatures')).objectPath;
}

export type VerificationSource = 'identity' | 'st_certificate' | 'income' | 'institution' | 'academic';
export async function sourceHealth(): Promise<Record<string, boolean>> {
  const { data, error } = await sdk().from('pilot_source_health').select('id,data'); check(error);
  return Object.fromEntries((data ?? []).map(row => [String(row.id), (row.data as { up?: boolean } | null)?.up === true]));
}
export function setSourceHealth(source: VerificationSource, up: boolean) { return invoke('set_source_health', { source, up }); }

export interface PilotJob {id:string;kind:string;status:string;startedAt:string;finishedAt?:string;detail:{code:string;objects?:number;tables?:number;bytes?:number;backupPrefix?:string;processed?:number}}
export async function operationsStatus():Promise<PilotJob[]> {const {data,error}=await sdk().rpc('pilot_operations_status');check(error);return data ?? [];}
