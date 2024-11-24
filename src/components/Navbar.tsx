import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Start', path: '/' },
  { name: 'Shop', path: '/products' },
  { name: 'Über uns', path: '/about' },
  { name: 'Kontakt', path: '/contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/Cuxsnacklogo.png"
                alt="Cuxsnack Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="text-zinc-400 hover:text-white transition-colors relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <User className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <User className="h-6 w-6" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-16 inset-x-0 bg-zinc-950 border-b border-zinc-800 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {/* User Info for Mobile */}
              {user && (
                <div className="pb-4 mb-4 border-b border-zinc-800">
                  <div className="flex items-center space-x-3 text-white">
                    <User className="h-6 w-6" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block text-base ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Links for Mobile */}
              {user ? (
                <div className="pt-4 mt-4 border-t border-zinc-800">
                  <Link
                    to="/profile"
                    className="block text-base text-zinc-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Mein Profil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="mt-4 w-full text-left text-base text-zinc-400 hover:text-white"
                  >
                    Abmelden
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-zinc-800">
                  <Link
                    to="/login"
                    className="block text-base text-zinc-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    to="/register"
                    className="mt-4 block text-base text-zinc-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrieren
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}