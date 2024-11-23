import { Toaster } from 'sonner';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { supabase } from '@/lib/supabase';
import { createContext, useEffect, useState } from 'react';

// Create auth context
export const AuthContext = createContext<any>(null);

// Enable all React Router v7 future flags
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
  }
});

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, supabase }}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}