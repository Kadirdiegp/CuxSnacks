import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { User, AuthError } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      loading: true,
      setUser: (user) => set({ user }),
      setIsAdmin: (isAdmin) => {
        set({ isAdmin });
        // Speichere den Admin-Status auch im localStorage
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
      },
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      },
      signUp: async (email, password) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { error };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAdmin: false });
        localStorage.removeItem('isAdmin');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAdmin: state.isAdmin }),
    }
  )
);
