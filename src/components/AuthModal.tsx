import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, signIn, signUp } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    }
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-lg bg-zinc-900 shadow-xl"
          >
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h2 className="mb-2 text-center text-2xl font-bold text-white">
                {isLogin ? 'Anmelden' : 'Registrieren'}
              </h2>
              
              <p className="mb-6 text-center text-zinc-400">
                {isLogin
                  ? 'Melden Sie sich an, um Zugriff auf alle Preise zu erhalten und Produkte in den Warenkorb legen zu können.'
                  : 'Erstellen Sie ein Konto, um Zugriff auf alle Preise zu erhalten und Produkte in den Warenkorb legen zu können.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-400">
                    Passwort
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-zinc-700 bg-zinc-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLogin ? 'Anmelden' : 'Registrieren'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  {isLogin
                    ? 'Noch kein Konto? Jetzt registrieren'
                    : 'Bereits ein Konto? Jetzt anmelden'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
