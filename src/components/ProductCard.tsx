import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';
import { Product } from '../types/product';
import Modal from './Modal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addToCart = useCartStore(state => state.addToCart);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    addToCart(product);
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: '/products' } });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className="relative cursor-pointer group">
          {product.image && (
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {!user && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-center px-4">
                    Melden Sie sich an, um Preise zu sehen
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          {user ? (
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{formatPrice(product.price)}</span>
              <motion.button
                onClick={handleAddToCart}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors duration-300 flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isCartAnimating ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.div>
                In den Warenkorb
              </motion.button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors duration-300"
            >
              Jetzt anmelden
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showLoginModal && (
          <Modal
            title="Anmeldung erforderlich"
            onClose={() => setShowLoginModal(false)}
          >
            <p className="mb-4">
              Bitte melden Sie sich an, um Preise zu sehen und Produkte in den Warenkorb zu legen.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white transition-colors duration-300"
              >
                Abbrechen
              </button>
              <button
                onClick={handleLoginClick}
                className="bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors duration-300"
              >
                Zur Anmeldung
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}