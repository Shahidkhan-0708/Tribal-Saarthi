// ============================================================
// Mock DB — localStorage-backed persistence for the prototype.
// Swappable with a real API/Supabase later; the store layer
// makes persistence invisible to components.
// ============================================================

const PREFIX = 'adimool_v1_';
const memoryStore = new Map<string, string>();

export function dbRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    const raw = memoryStore.get(PREFIX + key);
    if (raw === undefined) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
}

export function dbWrite<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    try {
      memoryStore.set(PREFIX + key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — prototype keeps running in-memory
    }
  }
}

export function dbRemove(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    memoryStore.delete(PREFIX + key);
  }
}

/** Wipe every Adimool key — the "Reset demo" button. */
export function dbResetAll(): void {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
  memoryStore.clear();
}

import type { StudentProfile, ScholarshipScheme, ScholarshipApplication, VerificationNode } from '../types';
import { MOTA_SCHEMES } from '../data/schemes';

// Local Storage keys for state serialization
const KEYS = {
  PROFILE: 'adimool_student_profile',
  SCHEMES: 'adimool_seeded_schemes',
  APPLICATIONS: 'adimool_applications',
  VERIFICATIONS: 'adimool_verification_logs'
};

function dbReadRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

function dbWriteRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    memoryStore.set(key, value);
  }
}

function dbRemoveRaw(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    memoryStore.delete(key);
  }
}

export const MockDB = {
  // Initialize and seed the storage with default assets
  initialize: (initialStudent: StudentProfile): void => {
    if (!dbReadRaw(KEYS.PROFILE)) {
      dbWriteRaw(KEYS.PROFILE, JSON.stringify(initialStudent));
    }
    if (!dbReadRaw(KEYS.SCHEMES)) {
      dbWriteRaw(KEYS.SCHEMES, JSON.stringify(MOTA_SCHEMES));
    }
    if (!dbReadRaw(KEYS.APPLICATIONS)) {
      dbWriteRaw(KEYS.APPLICATIONS, JSON.stringify([]));
    }
    if (!dbReadRaw(KEYS.VERIFICATIONS)) {
      dbWriteRaw(KEYS.VERIFICATIONS, JSON.stringify([]));
    }
  },

  // Student Profile Getters & Setters
  getProfile: (): StudentProfile => {
    const raw = dbReadRaw(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : ({} as StudentProfile);
  },
  
  updateProfile: (profile: Partial<StudentProfile>): StudentProfile => {
    const current = MockDB.getProfile();
    const updated = { ...current, ...profile };
    dbWriteRaw(KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  // Scholarship Schemes Retrieval
  getSchemes: (): ScholarshipScheme[] => {
    const raw = dbReadRaw(KEYS.SCHEMES);
    return raw ? JSON.parse(raw) : [];
  },

  // Applications Lifecycle Engine
  getApplications: (): ScholarshipApplication[] => {
    const raw = dbReadRaw(KEYS.APPLICATIONS);
    return raw ? JSON.parse(raw) : [];
  },

  saveApplication: (app: ScholarshipApplication): void => {
    const apps = MockDB.getApplications();
    const index = apps.findIndex(a => a.id === app.id);
    if (index >= 0) {
      apps[index] = app;
    } else {
      apps.push(app);
    }
    dbWriteRaw(KEYS.APPLICATIONS, JSON.stringify(apps));
  },

  // Verification Pipeline Logging
  getVerificationLogs: (applicationId: string): VerificationNode[] => {
    const raw = dbReadRaw(KEYS.VERIFICATIONS);
    const logs: VerificationNode[] = raw ? JSON.parse(raw) : [];
    return logs.filter(log => log.applicationId === applicationId);
  },

  saveVerificationNode: (node: VerificationNode): void => {
    const raw = dbReadRaw(KEYS.VERIFICATIONS);
    const logs: VerificationNode[] = raw ? JSON.parse(raw) : [];
    const index = logs.findIndex(l => l.id === node.id);
    if (index >= 0) {
      logs[index] = node;
    } else {
      logs.push(node);
    }
    dbWriteRaw(KEYS.VERIFICATIONS, JSON.stringify(logs));
  },

  // Factory reset to clear storage states mid-demo
  resetDatabase: (): void => {
    dbResetAll();
    dbRemoveRaw(KEYS.PROFILE);
    dbRemoveRaw(KEYS.SCHEMES);
    dbRemoveRaw(KEYS.APPLICATIONS);
    dbRemoveRaw(KEYS.VERIFICATIONS);
  }
};
