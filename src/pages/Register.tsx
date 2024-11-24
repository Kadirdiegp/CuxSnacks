import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
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
          <h2 className="text-3xl font-bold text-white text-center">
            Registrieren
          </h2>
          <p className="mt-2 text-center text-zinc-400">
            Erstellen Sie ein neues Konto
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
            <div>
              <label htmlFor="confirm-password" className="text-white">
                Passwort bestätigen
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Wird registriert...' : 'Registrieren'}
          </motion.button>

          <p className="text-center text-zinc-400">
            Bereits ein Konto?{' '}
            <Link to="/login" className="text-white hover:underline">
              Anmelden
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
