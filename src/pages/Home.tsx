import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Clock, ArrowRight, Tag } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import CategorySlider from '../components/CategorySlider';
import '../styles/scrollbar.css';

const features = [
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: 'Große Auswahl',
    description: 'Entdecken Sie unsere vielfältige Kollektion an hochwertigen Produkten.'
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: 'Schneller Versand',
    description: 'Kostenloser Express-Versand für alle Bestellungen über 50€.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Sicher Einkaufen',
    description: '100% sichere Bezahlung und verschlüsselte Datenübertragung.'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '24/7 Support',
    description: 'Unser Kundenservice ist rund um die Uhr für Sie da.'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { data: products } = useProducts();
  
  const saleProducts = products
    ?.filter(p => p.discount !== null && p.discount > 0)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4) || [];
    
  const featuredProducts = products
    ?.filter(p => p.featured === true)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[90vh] w-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
            <img
              src="/hero-image.jpg"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-[90%] mx-auto"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 max-w-4xl">
              Dein Online Snack Shop
            </h1>
            <p className="text-2xl text-zinc-300 mb-12 max-w-2xl">
              Entdecke unsere große Auswahl an Snacks, Süßigkeiten und Getränken.
            </p>
            <Link
              to="/products"
              className="group inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-zinc-100 transition-colors text-lg"
            >
              <span>Jetzt einkaufen</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Slider */}
      <section className="py-4 bg-gradient-to-b from-zinc-900/80 via-zinc-900/90 to-zinc-900 backdrop-blur-lg">
        <CategorySlider />
      </section>

      {/* Sale Products Section */}
      <section className="pt-8 pb-16 bg-zinc-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl font-semibold text-white">Sale Produkte</h2>
            <Link
              to="/products?sale=true"
              className="flex items-center text-zinc-400 hover:text-white transition-colors"
            >
              <span>Alle ansehen</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {saleProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Warum Sie bei uns einkaufen sollten
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-zinc-800 p-6 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col space-y-4 mb-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ShoppingBag className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Featured Produkte</h2>
              </div>
              <Link
                to="/products?featured=true"
                className="text-white hover:text-zinc-300 transition-colors flex items-center space-x-2"
              >
                <span>Alle ansehen</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Bleiben Sie auf dem Laufenden
            </h2>
            <p className="text-zinc-400 mb-8">
              Abonnieren Sie unseren Newsletter und erhalten Sie exklusive Angebote.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 w-full"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors whitespace-nowrap w-full sm:w-auto"
              >
                Abonnieren
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}