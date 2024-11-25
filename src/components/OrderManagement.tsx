import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Check, Truck, Clock, AlertCircle } from 'lucide-react';
import { sendOrderConfirmationEmail, formatOrderDetailsForEmail } from '../lib/emailConfig';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipping' | 'completed';
  created_at: string;
  updated_at: string;
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchOrders();
    // Echtzeit-Updates für neue Bestellungen
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders' 
        }, 
        payload => {
          handleNewOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(profile?.is_admin || false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      if (!ordersData) {
        setOrders([]);
        return;
      }

      // Fetch user emails
      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (userError) {
        console.error('Error fetching user emails:', userError);
      } else if (userData) {
        const emailMap: Record<string, string> = {};
        userData.forEach(user => {
          emailMap[user.id] = user.email;
        });
        setUserEmails(emailMap);
      }

      setOrders(ordersData);
    } catch (error: any) {
      console.error('Error in fetchOrders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = async (order: Order) => {
    // Aktualisiere die lokale Liste
    setOrders(prev => [order, ...prev]);
    
    // Sende Email-Benachrichtigung
    await sendEmailNotification(order);
    
    // Sende WhatsApp-Benachrichtigung
    await sendWhatsAppNotification(order);
  };

  const sendEmailNotification = async (order: Order) => {
    const emailParams = {
      to_email: import.meta.env.VITE_NOTIFICATION_EMAIL,
      order_number: order.id,
      order_details: formatOrderDetailsForEmail(order.items),
      total: order.total.toFixed(2),
      customer_name: userEmails[order.user_id] || 'Unbekannt',
      delivery_address: ''
    };

    const result = await sendOrderConfirmationEmail(emailParams);
    if (!result.success) {
      console.error('Failed to send order confirmation email:', result.error);
    }
  };

  const sendWhatsAppNotification = async (order: Order) => {
    if (!WHATSAPP_NUMBER) return;

    const message = `🆕 Neue Bestellung #${order.id}\n\n` +
                    `📋 Bestellung:\n${order.items.map(item => `${item.quantity}x ${item.name} - ${item.price.toFixed(2)}€`).join('\n')}\n\n` +
                    `💶 Gesamt: ${order.total.toFixed(2)}€\n` +
                    `👤 Kunde: ${userEmails[order.user_id] || 'Unbekannt'}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    
    // Öffne WhatsApp im Browser
    window.open(whatsappUrl, '_blank');
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!isAdmin) {
      alert('Sie haben keine Berechtigung, Bestellungen zu aktualisieren.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST301') {
          alert('Sie haben keine Berechtigung, diese Aktion durchzuführen.');
        } else {
          console.error('Error updating order status:', error);
          alert('Fehler beim Aktualisieren des Bestellstatus. Bitte versuchen Sie es erneut.');
        }
        throw error;
      }

      // Update the local state without fetching all orders again
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
            : order
        )
      );
    } catch (error: any) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center justify-center h-64 flex-col space-y-2">
        <AlertCircle className="w-8 h-8" />
        <p>{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-zinc-400 flex items-center justify-center h-64 flex-col space-y-2">
        <p>Keine Bestellungen vorhanden</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Aktualisieren
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Bestellungen</h2>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Aktualisieren
        </button>
      </div>
      
      <div className="grid gap-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800 p-6 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Bestellung #{order.id.slice(0, 8)}
                </h3>
                <p className="text-zinc-400">
                  Kunde: {userEmails[order.user_id] || 'Unbekannt'}
                </p>
                <p className="text-zinc-400">
                  Datum: {new Date(order.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-zinc-400">
                  Status: {
                    order.status === 'pending' ? 'Ausstehend' :
                    order.status === 'shipping' ? 'In Versand' :
                    'Abgeschlossen'
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateOrderStatus(order.id, 'pending')}
                  className={`p-2 rounded ${
                    order.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                  }`}
                  title="Ausstehend"
                >
                  <Clock size={20} />
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'shipping')}
                  className={`p-2 rounded ${
                    order.status === 'shipping'
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                  }`}
                  title="In Versand"
                >
                  <Truck size={20} />
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className={`p-2 rounded ${
                    order.status === 'completed'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                  }`}
                  title="Abgeschlossen"
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
            
            <div className="border-t border-zinc-700 pt-4">
              <h4 className="font-semibold text-white mb-2">Bestellte Produkte:</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-zinc-400">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between font-semibold">
                <span className="text-white">Gesamtbetrag:</span>
                <span className="text-white">{Number(order.total).toFixed(2)} €</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
