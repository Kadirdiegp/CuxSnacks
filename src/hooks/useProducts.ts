import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export function useProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            categories:category_id (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // Fetch reviews for each product
        const productsWithReviews = await Promise.all(
          (products || []).map(async (product) => {
            const { data: reviews, error: reviewsError } = await supabase
              .from('reviews')
              .select('*')
              .eq('product_id', product.id);

            if (reviewsError) throw reviewsError;

            return {
              ...product,
              category_name: product.categories?.name || product.category,
              reviews: reviews || []
            };
          })
        );

        setData(productsWithReviews);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { data, isLoading, error };
}
