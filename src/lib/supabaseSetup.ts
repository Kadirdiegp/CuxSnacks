import { supabase } from './supabase';

const products = [
  {
    name: "Takis Fuego",
    description: "Intense hot chili pepper & lime rolled tortilla chips",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=800",
    category: "Snacks",
    stock: 50,
    rating: 4.8
  },
  {
    name: "Haribo Goldbären",
    description: "Classic gummy bears in various fruit flavors",
    price: 1.99,
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800",
    category: "Süßigkeiten",
    stock: 100,
    rating: 4.7
  },
  {
    name: "Monster Energy Original",
    description: "Energy drink with a powerful blend of energy-enhancing ingredients",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800",
    category: "Getränke",
    stock: 75,
    rating: 4.5
  },
  {
    name: "Marlboro Red",
    description: "Classic cigarettes with rich tobacco flavor",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1567861911437-538298e4232c?w=800",
    category: "Tabak",
    stock: 200,
    rating: 4.2
  },
  {
    name: "Absolut Vodka",
    description: "Premium Swedish vodka, perfect for cocktails",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800",
    category: "Alkohol",
    stock: 30,
    rating: 4.6
  },
  {
    name: "Elf Bar BC5000",
    description: "Disposable vape device with various flavors",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1571705042748-55feda1cfadc?w=800",
    category: "Vapes",
    stock: 40,
    rating: 4.4
  },
  {
    name: "Ritter Sport",
    description: "Premium German chocolate in various flavors",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800",
    category: "Süßigkeiten",
    stock: 80,
    rating: 4.7
  },
  {
    name: "Red Bull",
    description: "Energy drink that gives you wings",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800",
    category: "Getränke",
    stock: 100,
    rating: 4.6
  }
];

export const setupDatabase = async () => {
  try {
    // Create products table
    const { error: createError } = await supabase.rpc('create_products_table');
    if (createError) throw createError;

    // Insert products
    const { error: insertError } = await supabase
      .from('products')
      .insert(products);
    
    if (insertError) throw insertError;

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

// Run setup
setupDatabase();