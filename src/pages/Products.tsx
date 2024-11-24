import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts } from '../hooks/useProducts';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(categoryParam);
  const [priceRange, setPriceRange] = React.useState({
    min: 0,
    max: 100
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: products, isLoading, error } = useProducts();

  const maxPrice = React.useMemo(() => {
    if (!products) return 0;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category_name === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && 
        product.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, selectedCategory, priceRange, searchQuery]);

  // Update URL when category changes
  React.useEffect(() => {
    if (selectedCategory) {
      searchParams.set('category', selectedCategory);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }, [selectedCategory, searchParams, setSearchParams]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-12 text-red-500">Error loading products</div>;

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <ProductFilters
              minPrice={priceRange.min}
              maxPrice={priceRange.max}
              setMinPrice={(price) => setPriceRange(prev => ({ ...prev, min: price }))}
              setMaxPrice={(price) => setPriceRange(prev => ({ ...prev, max: price }))}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                Keine Produkte gefunden
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}