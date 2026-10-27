import { create } from 'zustand';
import { dbRead, dbWrite } from '@/lib/db';
import type { LangCode, User } from '@/types';
import { USERS } from '@/data/coverage';
import { signIn, signOut, getSession, getAccount, isConfigured } from '@/pilot/api';

export interface SessionState {
  user: User | null;
  lang: LangCode;
  theme: 'light' | 'dark';
  isBackendConnected: boolean;
  isBackendSyncing: boolean;
  backendError: string | null;
  lastSyncTime: string | null;
  login: (userId: string) => void;
  loginWithBackend: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setLang: (lang: LangCode) => void;
  toggleTheme: () => void;
  initSession: () => Promise<void>;
}

const initialTheme = dbRead<'light' | 'dark'>('pref_theme', 'light');
if (typeof document !== 'undefined') {
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

const defaultUser = USERS.find((u) => u.id === 'usr_asha') ?? USERS[0];
const savedUser = dbRead<User | null>('session_user', null);
const initialUser = USERS.find((u) => u.id === savedUser?.id) ?? savedUser ?? defaultUser;

export const useSession = create<SessionState>((set, get) => ({
  user: initialUser,
  lang: dbRead<LangCode>('pref_lang', 'en'),
  theme: initialTheme,
  isBackendConnected: false,
  isBackendSyncing: false,
  backendError: null,
  lastSyncTime: null,

  login: (userId) => {
    const user = USERS.find((u) => u.id === userId) || (userId === 'usr_inst_1' ? USERS.find((u) => u.id === 'usr_admin') : undefined);
    if (!user) return;
    dbWrite('session_user', user);
    set({ user, backendError: null });
  },

  loginWithBackend: async (email, password) => {
    set({ isBackendSyncing: true, backendError: null });
    try {
      await signIn(email, password);
      const sessionUser = await getSession();
      if (!sessionUser) {
        throw new Error('Supabase session could not be established.');
      }

      const acc = await getAccount(sessionUser.id);
      const role = acc?.role || 'admin';
      const frontendRole: User['role'] = role === 'family' ? 'student' : (role as User['role']);

      const authUser: User = {
        id: sessionUser.id,
        name: acc?.name || sessionUser.email?.split('@')[0] || 'Official User',
        role: frontendRole,
        designation:
          role === 'admin'
            ? 'Ministry Administrator'
            : role === 'nodal'
            ? 'State Nodal Officer'
            : role === 'institution'
            ? 'Institution Nodal Officer'
            : undefined,
        studentId: frontendRole === 'student' ? sessionUser.id : undefined,
      };

      dbWrite('session_user', authUser);
      set({
        user: authUser,
        isBackendConnected: true,
        isBackendSyncing: false,
        lastSyncTime: new Date().toLocaleTimeString(),
        backendError: null,
      });

      // Synchronize data from backend
      try {
        const { useData } = await import('./data');
        await useData.getState().syncWithBackend();
      } catch (syncErr) {
        console.warn('Backend data sync note:', syncErr);
      }

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please verify your credentials.';
      set({
        isBackendSyncing: false,
        backendError: msg,
      });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    try {
      await signOut();
    } catch (e) {
      console.warn('Backend sign out note:', e);
    }
    dbWrite('session_user', null);
    set({
      user: null,
      isBackendConnected: false,
      backendError: null,
      lastSyncTime: null,
    });
  },

  setLang: (lang) => {
    dbWrite('pref_lang', lang);
    set({ lang });
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    dbWrite('pref_theme', next);
    if (typeof document !== 'undefined') {
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: next });
  },

  initSession: async () => {
    if (!isConfigured) return;
    try {
      const sessionUser = await getSession();
      if (sessionUser) {
        const acc = await getAccount(sessionUser.id);
        const role = acc?.role || 'admin';
        const frontendRole: User['role'] = role === 'family' ? 'student' : (role as User['role']);
        const authUser: User = {
          id: sessionUser.id,
          name: acc?.name || sessionUser.email?.split('@')[0] || 'Official User',
          role: frontendRole,
          designation:
            role === 'admin'
              ? 'Ministry Administrator'
              : role === 'nodal'
              ? 'State Nodal Officer'
              : role === 'institution'
              ? 'Institution Nodal Officer'
              : undefined,
          studentId: frontendRole === 'student' ? sessionUser.id : undefined,
        };
        dbWrite('session_user', authUser);
        set({
          user: authUser,
          isBackendConnected: true,
          lastSyncTime: new Date().toLocaleTimeString(),
        });

        // Trigger sync
        const { useData } = await import('./data');
        await useData.getState().syncWithBackend();
      }
    } catch (err) {
      console.warn('Session init note:', err);
    }
  },
}));
