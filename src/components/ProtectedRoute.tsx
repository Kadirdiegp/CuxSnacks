import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const setIsAdmin = useAuthStore((state) => state.setIsAdmin);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        // Prüfe zuerst den localStorage
        const savedIsAdmin = localStorage.getItem('isAdmin');
        if (savedIsAdmin) {
          setIsAdmin(JSON.parse(savedIsAdmin));
          return;
        }

        // Wenn nicht im localStorage, dann von der Datenbank abrufen
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (!error && profiles) {
          setIsAdmin(profiles.is_admin || false);
        }
      }
    };

    checkAdminStatus();
  }, [user, setIsAdmin]);

  // Wenn der Benutzer nicht eingeloggt ist
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // Wenn es eine Admin-Route ist und der Benutzer kein Admin ist
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Wenn alles in Ordnung ist, zeige die geschützte Route an
  return <>{children}</>;
}
