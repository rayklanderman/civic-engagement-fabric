import { Toaster } from 'sonner';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { supabase } from '@/lib/supabase';
import { createContext, useEffect, useState } from 'react';

// Create auth context
export const AuthContext = createContext<any>(null);

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#BB0000]"></div>
  </div>
);

// Error component
const ErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 className="text-2xl font-bold text-[#BB0000] mb-4">Something went wrong</h1>
    <p className="text-gray-600 mb-4">Please try refreshing the page</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-[#BB0000] text-white rounded hover:bg-[#990000]"
    >
      Refresh Page
    </button>
  </div>
);

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ session, supabase }}>
      <RouterProvider 
        router={router} 
        fallbackElement={<Loading />}
        errorElement={<ErrorFallback />}
      />
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
}