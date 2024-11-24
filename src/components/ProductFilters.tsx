import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sliders } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface ProductFiltersProps {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductFilters({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    }

    fetchCategories();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-zinc-900 p-6 rounded-xl shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Filter</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <Sliders className="w-5 h-5" />
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 overflow-hidden"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Produkte suchen..."
            className="w-full bg-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-medium">Preisbereich</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Min. Preis</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                value={minPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value <= maxPrice) {
                    setMinPrice(value);
                  }
                }}
                min={0}
                className="w-full bg-zinc-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Max. Preis</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= minPrice) {
                    setMaxPrice(value);
                  }
                }}
                min={minPrice}
                className="w-full bg-zinc-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="h-1 bg-zinc-800 rounded-full">
              <motion.div
                initial={false}
                animate={{
                  left: `${(minPrice / 1000) * 100}%`,
                  right: `${100 - (maxPrice / 1000) * 100}%`
                }}
                className="absolute h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-medium">Kategorien</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedCategory === null
                  ? 'bg-white/20 text-white'
                  : 'text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Alle Kategorien
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  selectedCategory === category.name
                    ? 'bg-white/20 text-white'
                    : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}