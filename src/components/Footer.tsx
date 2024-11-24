import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <img
              src="/Cuxsnacklogo.png"
              alt="Cuxsnack Logo"
              className="h-12 w-auto"
            />
            <p className="text-zinc-400">
              Dein Online-Shop für Snacks und Getränke in Cuxhaven.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-zinc-400 hover:text-white text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-white text-sm">
                  Über uns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-400 hover:text-white text-sm">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-zinc-400 hover:text-white text-sm">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-zinc-400 hover:text-white text-sm">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/imprint" className="text-zinc-400 hover:text-white text-sm">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Kontakt & Social Media</h3>
            <p className="text-zinc-400 text-sm">
              Email: info@snackshop.de<br />
              Tel: +49 123 456789
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-center text-zinc-400 text-sm">
            {new Date().getFullYear()} SnackShop. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
