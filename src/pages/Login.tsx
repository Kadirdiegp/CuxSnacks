import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated } = useAuthStore();

  // Überprüfe, ob der Benutzer bereits angemeldet ist
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // Die Weiterleitung erfolgt automatisch durch den useEffect Hook
    } catch (err) {
      setError('Ungültige E-Mail oder Passwort.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-xl"
      >
        <div>
          <h2 className="text-3xl font-bold text-white text-center">Anmelden</h2>
          <p className="mt-2 text-center text-zinc-400">
            Willkommen zurück! Bitte melden Sie sich an.
          </p>
        </div>
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-white">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-zinc-800 bg-zinc-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-white">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 mt-1 border border-zinc-800 bg-zinc-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                disabled={isLoading}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-zinc-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </motion.button>

          <p className="text-center text-zinc-400">
            Noch kein Konto?{' '}
            <Link to="/register" className="text-white hover:underline">
              Registrieren
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
