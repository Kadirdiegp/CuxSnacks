import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const signIn = useAuthStore((state) => state.signIn);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      // Prüfen Sie, ob der Benutzer ein Admin ist
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      if (!profiles?.is_admin) {
        throw new Error('Unauthorized access');
      }

      setIsAdmin(true);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message);
      setIsAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-zinc-800 p-8 rounded-xl"
      >
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border
                         border-zinc-700 bg-zinc-900 text-white rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E-Mail-Adresse"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border
                         border-zinc-700 bg-zinc-900 text-white rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Passwort"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border
                       border-transparent text-sm font-medium rounded-lg text-white
                       bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500"
            >
              Anmelden
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
