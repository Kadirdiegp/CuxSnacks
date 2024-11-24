import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import OrderManagement from '../components/OrderManagement';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category_id: number;
  image_url: string;
  featured: boolean;
  discount: number;
  image: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

const defaultCategories = [
  'Getränke',
  'Alkohol',
  'Snacks',
  'Süßigkeiten',
  'Vapes',
  'Pods'
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newCategory, setNewCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data || []);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategory.trim() }]);

    if (error) {
      console.error('Error adding category:', error);
    } else {
      setNewCategory('');
      fetchCategories();
    }
    setLoading(false);
  };

  const deleteCategory = async (id: number) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
    } else {
      fetchCategories();
    }
  };

  const updateCategory = async (id: number, newName: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error);
    } else {
      setEditingCategory(null);
      fetchCategories();
    }
  };

  const addDefaultCategories = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert(defaultCategories.map(name => ({ name })));

    if (error) {
      console.error('Error adding default categories:', error);
    } else {
      fetchCategories();
    }
    setLoading(false);
  };

  const handleProductDelete = async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting product:', error);
    else fetchProducts();
  };

  const handleProductSave = async (product: Partial<Product>) => {
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', editingProduct.id);
      if (error) console.error('Error updating product:', error);
      else {
        fetchProducts();
        setEditingProduct(null);
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([product]);
      if (error) console.error('Error creating product:', error);
      else {
        fetchProducts();
        setNewProduct({});
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        <div className="mb-8">
          <div className="border-b border-zinc-800">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 relative ${
                  activeTab === 'orders'
                    ? 'text-blue-500'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                Bestellungen
                {activeTab === 'orders' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 relative ${
                  activeTab === 'products'
                    ? 'text-blue-500'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                Produkte
                {activeTab === 'products' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-1 relative ${
                  activeTab === 'categories'
                    ? 'text-blue-500'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                Kategorien
                {activeTab === 'categories' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  />
                )}
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'orders' && <OrderManagement />}
        
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-6">Kategorien verwalten</h2>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Neue Kategorie"
                  className="flex-1 bg-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addCategory}
                  disabled={loading || !newCategory.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Hinzufügen
                </button>
              </div>

              {categories.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-zinc-400 mb-4">Keine Kategorien vorhanden</p>
                  <button
                    onClick={addDefaultCategories}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Standard-Kategorien hinzufügen
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-zinc-700 rounded-lg"
                  >
                    {editingCategory?.id === category.id ? (
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        className="flex-1 bg-zinc-600 text-white px-4 py-2 rounded-lg mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-white">{category.name}</span>
                    )}
                    <div className="flex space-x-2">
                      {editingCategory?.id === category.id ? (
                        <button
                          onClick={() => updateCategory(category.id, editingCategory.name)}
                          className="p-2 text-green-500 hover:text-green-400"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 text-blue-500 hover:text-blue-400"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-6">
                Neues Produkt hinzufügen
              </h2>
              <div className="space-y-6">
                {/* Basis-Informationen */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400">Name</label>
                    <input
                      type="text"
                      placeholder="Produktname"
                      value={newProduct.name || ''}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      className="w-full bg-zinc-900 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400">Preis (€)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price || ''}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full bg-zinc-900 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Beschreibung */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-400">Beschreibung</label>
                  <textarea
                    placeholder="Produktbeschreibung"
                    value={newProduct.description || ''}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-zinc-900 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Kategorie */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-400">Kategorie</label>
                  <select
                    value={newProduct.category_id || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category_id: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-zinc-900 text-white p-3 rounded-lg border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Kategorie wählen</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured und Rabatt */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400">Spezielle Eigenschaften</label>
                    <div className="flex items-center space-x-2 bg-zinc-900 p-3 rounded-lg border border-zinc-700">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={newProduct.featured || false}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, featured: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-500 rounded border-zinc-600 focus:ring-blue-500"
                      />
                      <label htmlFor="featured" className="text-white">Featured Produkt</label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-400">Rabatt</label>
                    <div className="flex items-center space-x-2 bg-zinc-900 p-3 rounded-lg border border-zinc-700">
                      <input
                        type="number"
                        placeholder="0"
                        value={newProduct.discount || ''}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            discount: parseInt(e.target.value),
                          })
                        }
                        min="0"
                        max="100"
                        className="w-20 bg-transparent text-white focus:outline-none"
                      />
                      <span className="text-zinc-400">%</span>
                    </div>
                  </div>
                </div>

                {/* Bildupload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-400">Produktbild</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Math.random()}.${fileExt}`;
                            const filePath = `product-images/${fileName}`;

                            const { error: uploadError, data } = await supabase.storage
                              .from('products')
                              .upload(filePath, file);

                            if (uploadError) {
                              console.error('Error uploading image:', uploadError);
                              return;
                            }

                            const { data: { publicUrl } } = supabase.storage
                              .from('products')
                              .getPublicUrl(filePath);

                            setNewProduct({
                              ...newProduct,
                              image: publicUrl
                            });
                          }
                        }}
                        className="block w-full text-sm text-zinc-400
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-500 file:text-white
                          hover:file:bg-blue-600
                          file:cursor-pointer file:transition-colors"
                      />
                    </div>
                    {newProduct.image && (
                      <div className="h-20 w-20 rounded-lg overflow-hidden">
                        <img
                          src={newProduct.image}
                          alt="Vorschau"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={() => handleProductSave(newProduct)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Produkt hinzufügen</span>
                </button>
              </div>
            </div>

            <div className="bg-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4">
                Produkte verwalten
              </h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between"
                  >
                    {editingProduct?.id === product.id ? (
                      <div className="flex-1 grid grid-cols-5 gap-4">
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                            })
                          }
                          className="bg-zinc-800 text-white p-2 rounded"
                        />
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="bg-zinc-800 text-white p-2 rounded"
                        />
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              description: e.target.value,
                            })
                          }
                          className="bg-zinc-800 text-white p-2 rounded col-span-2"
                          rows={3}
                        />
                        <select
                          value={editingProduct.category_id}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category_id: parseInt(e.target.value),
                            })
                          }
                          className="bg-zinc-800 text-white p-2 rounded"
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="featured"
                              checked={editingProduct.featured || false}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, featured: e.target.checked })
                              }
                              className="bg-zinc-900 text-blue-600 rounded"
                            />
                            <label htmlFor="featured" className="text-white">Featured Produkt</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              placeholder="Rabatt %"
                              value={editingProduct.discount || ''}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  discount: parseInt(e.target.value),
                                })
                              }
                              className="bg-zinc-900 text-white p-2 rounded w-24"
                              min="0"
                              max="100"
                            />
                            <span className="text-white">% Rabatt</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleProductSave(editingProduct)}
                          className="bg-green-600 text-white p-2 rounded flex items-center justify-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Speichern
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{product.name}</h3>
                          <p className="text-zinc-400">
                            {product.price.toFixed(2)} €
                          </p>
                          <p className="text-zinc-400">
                            Erstellt am: {product.created_at}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-blue-400 hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleProductDelete(product.id)}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
