import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabaseClient';
import { Package, User, MapPin, LogOut } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
  }[];
}

export default function Profile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-zinc-800 p-3 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mein Profil</h1>
                <p className="text-zinc-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Abmelden</span>
            </button>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Meine Bestellungen</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Noch keine Bestellungen vorhanden</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-zinc-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">
                        Bestellung vom {new Date(order.created_at).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-sm font-medium text-white">
                        Bestellnummer: {order.id}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${order.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' : 
                          'bg-yellow-500/20 text-yellow-500'}
                      `}>
                        {order.status === 'completed' ? 'Abgeschlossen' :
                         order.status === 'processing' ? 'In Bearbeitung' : 
                         'Ausstehend'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-zinc-400">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-white">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between items-center">
                    <span className="text-zinc-400">Gesamtbetrag</span>
                    <span className="text-lg font-medium text-white">
                      {order.total.toFixed(2)}€
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
