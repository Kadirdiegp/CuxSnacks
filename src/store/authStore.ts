import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      showAuthModal: false,
      isAuthenticated: false,

      setShowAuthModal: (show) => set({ showAuthModal: show }),

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            set({ 
              user: session.user,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);
            
            if (session?.user) {
              set({ 
                user: session.user,
                isAuthenticated: true,
                isLoading: false
              });
            } else {
              set({ 
                user: null,
                isAuthenticated: false,
                isLoading: false
              });
            }
          });

          return () => subscription.unsubscribe();
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ isLoading: true });
          const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ 
            user: data.user, 
            showAuthModal: false,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Sign in error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signUp: async (email, password) => {
        try {
          set({ isLoading: true });
          const { error, data } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          set({ 
            user: data.user, 
            showAuthModal: false,
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Sign up error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ 
            user: null,
            isAuthenticated: false
          });
        } catch (error) {
          console.error('Sign out error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
