import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../utils/formatPrice';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuthStore();

  React.useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white">Produkt nicht gefunden</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount && product.discount > 0 && user && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-zinc-400 mb-6">{product.description}</p>

          {user ? (
            <>
              <div className="mb-6">
                {product.discount && product.discount > 0 ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-red-500">
                      {formatPrice(product.price * (1 - product.discount / 100))}
                    </span>
                    <span className="text-xl text-zinc-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-zinc-800 text-white px-3 py-2 rounded-md hover:bg-zinc-700"
                  >
                    -
                  </button>
                  <span className="text-white text-lg font-medium w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-zinc-800 text-white px-3 py-2 rounded-md hover:bg-zinc-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>In den Warenkorb</span>
                </button>
              </div>
            </>
          ) : (
            <div className="mb-6 text-center">
              <p className="text-zinc-400 mb-4">
                Bitte melden Sie sich an, um Preise zu sehen und Produkte in den Warenkorb zu legen.
              </p>
              <button
                onClick={() => useAuthStore.getState().setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Jetzt anmelden
              </button>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t border-zinc-800 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-zinc-400">
                <Truck size={20} />
                <span>Kostenloser Versand ab 50€</span>
              </div>
              <div className="flex items-center space-x-3 text-zinc-400">
                <Shield size={20} />
                <span>Sichere Bezahlung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}