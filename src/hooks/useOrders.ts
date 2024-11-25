import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';

export interface Order {
  id: string;
  user_id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const createOrder = async (items: any[], total: number) => {
    if (!user || !isAuthenticated) {
      throw new Error('Sie müssen angemeldet sein, um eine Bestellung aufzugeben.');
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            items,
            total,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setOrders((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating order:', err);
      throw new Error('Fehler beim Erstellen der Bestellung. Bitte versuchen Sie es später erneut.');
    }
  };

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setOrders([]);
      setLoading(false);
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Bestellungen');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated]);

  return {
    orders,
    loading,
    error,
    createOrder
  };
}
