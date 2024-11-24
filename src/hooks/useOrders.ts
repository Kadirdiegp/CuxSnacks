import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/useAuthStore';

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
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
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
  }, [user]);

  const createOrder = async (items: Order['items'], total: number) => {
    if (!user) {
      throw new Error('Benutzer muss angemeldet sein');
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
      throw new Error(err instanceof Error ? err.message : 'Fehler beim Erstellen der Bestellung');
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder
  };
}
