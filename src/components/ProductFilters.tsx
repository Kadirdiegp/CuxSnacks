import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ProductFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
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
      className="bg-zinc-900 p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Kategorien</h2>
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
        className="space-y-4 overflow-hidden"
      >
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? 'bg-white text-black'
                : 'text-white hover:bg-zinc-800'
            }`}
          >
            Alle Produkte
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category.name
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-zinc-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}