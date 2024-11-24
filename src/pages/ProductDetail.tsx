import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const addItem = useCartStore((state) => state.addItem);

  React.useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // First fetch the product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (productError) throw productError;

      // Then fetch reviews for the product
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id);
      
      if (reviewsError) throw reviewsError;
      
      setProduct({
        ...productData,
        reviews: reviews || []
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl"
          />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <img
                key={i}
                src={product.image}
                alt={`${product.name} thumbnail ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500">
                ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-emerald-600">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-lg"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1 border rounded-lg"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => addItem(product, quantity)}
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-gray-600">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <span className="text-sm text-gray-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}