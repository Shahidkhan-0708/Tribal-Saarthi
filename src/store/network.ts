import { create } from 'zustand';
import { dbRead, dbWrite } from '@/lib/db';
import type { SyncQueueItem } from '@/types';

// ============================================================
// Field Officer Offline Bulk Queue & Sync Engine
//
// Designed for remote tribal blocks (e.g. Mandla, Mayurbhanj,
// Khunti) where field officers collect verification packets
// and enrollments offline, then replay them with automatic
// conflict resolution upon returning to network connectivity.
// ============================================================

export interface SyncReplayResult {
  totalProcessed: number;
  synced: number;
  conflicts: number;
  replayedAt: string;
}

interface NetworkState {
  online: boolean;
  slow: boolean;
  queue: SyncQueueItem[];
  lastSyncAt?: string;
  lastReplayResult?: SyncReplayResult;

  // network switches
  toggleOnline: () => void;
  toggleSlow: () => void;

  // queue actions
  enqueue: (entity: string, action: string, payload: unknown) => string;
  replayQueue: () => SyncReplayResult;
  flushQueue: () => number;
  clearSynced: () => void;
  resolveConflict: (itemId: string, strategy: 'overwrite' | 'discard') => void;
}

export const useNetwork = create<NetworkState>((set, get) => ({
  online: dbRead<boolean>('net_online', true),
  slow: false,
  queue: dbRead<SyncQueueItem[]>('net_queue', []),
  lastSyncAt: dbRead<string | undefined>('net_last_sync', undefined),
  lastReplayResult: undefined,

  toggleOnline: () => {
    const next = !get().online;
    dbWrite('net_online', next);
    set({ online: next });
    // coming back online automatically triggers replay engine
    if (next && get().queue.some((i) => i.status === 'queued' || !i.status)) {
      get().replayQueue();
    }
  },

  toggleSlow: () => set({ slow: !get().slow }),

  enqueue: (entity, action, payload) => {
    const item: SyncQueueItem = {
      id: `sq_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e4)}`,
      entity,
      action,
      payload,
      ts: new Date().toISOString(),
      status: 'queued',
      retryCount: 0,
    };
    const queue = [...get().queue, item];
    dbWrite('net_queue', queue);
    set({ queue });

    // if already online, immediate replay
    if (get().online) {
      setTimeout(() => get().replayQueue(), 50);
    }
    return item.id;
  },

  replayQueue: () => {
    const rawQueue = get().queue;
    if (rawQueue.length === 0) {
      return { totalProcessed: 0, synced: 0, conflicts: 0, replayedAt: new Date().toISOString() };
    }

    let synced = 0;
    let conflicts = 0;
    const nowIso = new Date().toISOString();

    // deterministic chronological replay
    const sortedQueue = [...rawQueue].sort((a, b) => a.ts.localeCompare(b.ts));

    const processedQueue: SyncQueueItem[] = sortedQueue.map((item) => {
      if (item.status === 'synced') return item;

      // Conflict detection heuristic:
      // If action tries to rollback an immutable stage (e.g. sanctioned or rejected)
      const isDangerousCollision =
        item.action.includes('rollback') ||
        (typeof item.payload === 'object' &&
          item.payload !== null &&
          'forceStatus' in item.payload &&
          (item.payload as Record<string, unknown>).forceStatus === 'draft');

      if (isDangerousCollision) {
        conflicts += 1;
        return {
          ...item,
          status: 'conflict' as const,
          conflictResolution: 'State collision detected: server state has precedence. Manual review required.',
        };
      }

      // Successful replay execution
      synced += 1;
      return {
        ...item,
        status: 'synced' as const,
        conflictResolution: 'Packet replayed and state synchronized (LWW timestamp rule).',
      };
    });

    const result: SyncReplayResult = {
      totalProcessed: processedQueue.length,
      synced,
      conflicts,
      replayedAt: nowIso,
    };

    dbWrite('net_queue', processedQueue);
    dbWrite('net_last_sync', nowIso);
    set({
      queue: processedQueue,
      lastSyncAt: nowIso,
      lastReplayResult: result,
    });

    return result;
  },

  flushQueue: () => {
    const q = get().queue;
    if (q.length === 0) return 0;
    const ts = new Date().toISOString();
    dbWrite('net_queue', []);
    dbWrite('net_last_sync', ts);
    set({ queue: [], lastSyncAt: ts, lastReplayResult: undefined });
    return q.length;
  },

  clearSynced: () => {
    const remaining = get().queue.filter((item) => item.status !== 'synced');
    dbWrite('net_queue', remaining);
    set({ queue: remaining });
  },

  resolveConflict: (itemId, strategy) => {
    const queue = get().queue.map((item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        status: (strategy === 'overwrite' ? 'synced' : 'conflict') as 'synced' | 'conflict',
        conflictResolution:
          strategy === 'overwrite'
            ? 'Officer override applied: offline payload accepted.'
            : 'Officer discarded offline packet: server version retained.',
      };
    });
    dbWrite('net_queue', queue);
    set({ queue });
  },
}));
