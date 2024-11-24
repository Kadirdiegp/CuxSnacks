import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import CartNotification from './CartNotification';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  discount?: number;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price,
      image: product.image,
    });

    // Animation und Benachrichtigung
    setTimeout(() => {
      setIsAdding(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 500);
  };

  const formattedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(product.price);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const formattedDiscountedPrice = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(discountedPrice);

  return (
    <>
      <CartNotification
        show={showNotification}
        productName={product.name}
        onClose={() => setShowNotification(false)}
      />
      
      <motion.div
        layout
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden group"
      >
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-lg"
            >
              -{product.discount}%
            </motion.div>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 bg-yellow-500 text-black text-sm font-medium px-2 py-1 rounded-lg"
            >
              <Star className="w-4 h-4" />
              <span>Featured</span>
            </motion.div>
          </div>
        )}

        {/* Product Image */}
        <div className="aspect-square relative">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Add to Cart Button - Desktop */}
          <div className="hidden md:block">
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isAdding}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                <motion.div
                  animate={isAdding ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                </motion.div>
                <span>{isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Add to Cart Button - Mobile */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 p-2 bg-black/60">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-white text-black py-2 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <motion.div
                animate={isAdding ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.div>
              <span>{isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}</span>
            </motion.button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-lg mb-2">{product.name}</h3>
          <div className="flex items-center space-x-2">
            {product.discount ? (
              <>
                <span className="text-zinc-400 line-through">{formattedPrice}</span>
                <span className="font-medium">{formattedDiscountedPrice}</span>
              </>
            ) : (
              <span className="font-medium">{formattedPrice}</span>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}